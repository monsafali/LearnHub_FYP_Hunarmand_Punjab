import mongoose from "mongoose";
import ChatMessage from "../models/ChatMessage.model.js";
import Course from "../models/Courses.model.js";
import EnrollmentCourse from "../models/EnrollmentCourse.model.js";
import UserAuth from "../models/UserAuth.model.js";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import { ErrorHandler } from "../middleware/errorMiddleware.js";

export const assertCourseChatAccess = async (studentId, courseId) => {
  if (!mongoose.isValidObjectId(courseId)) {
    throw new ErrorHandler("Invalid course id", 400);
  }

  const enrollment = await EnrollmentCourse.findOne({
    student: studentId,
    course: courseId,
    status: { $in: ["active", "completed"] },
  }).select("_id");

  if (!enrollment) {
    throw new ErrorHandler("You are not enrolled in this course", 403);
  }

  return enrollment;
};

export const getChatCourses = catchAsyncErrors(async (req, res) => {
  const enrollments = await EnrollmentCourse.find({
    student: req.user._id,
    status: { $in: ["active", "completed"] },
  })
    .select("course")
    .populate({ path: "course", select: "name category imageUrl" })
    .lean();

  const courses = await Promise.all(
    enrollments
      .filter((item) => item.course)
      .map(async ({ course }) => {
        const [studentCount, lastMessage] = await Promise.all([
          EnrollmentCourse.countDocuments({
            course: course._id,
            status: { $in: ["active", "completed"] },
          }),
          ChatMessage.findOne({ course: course._id })
            .sort({ createdAt: -1 })
            .populate("sender", "fullname username imageUrl")
            .lean(),
        ]);

        return { ...course, studentCount, lastMessage };
      }),
  );

  res.status(200).json({ success: true, courses });
});

export const getCourseMessages = catchAsyncErrors(async (req, res) => {
  const { courseId } = req.params;
  await assertCourseChatAccess(req.user._id, courseId);

  const course = await Course.findById(courseId).select(
    "name category imageUrl",
  );
  if (!course) throw new ErrorHandler("Course not found", 404);

  const limit = Math.min(
    Math.max(Number.parseInt(req.query.limit, 10) || 50, 1),
    100,
  );
  const messages = await ChatMessage.find({ course: courseId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("sender", "fullname username imageUrl")
    .lean();

  res.status(200).json({ success: true, course, messages: messages.reverse() });
});

export const getCourseMembers = catchAsyncErrors(async (req, res) => {
  const { courseId } = req.params;
  await assertCourseChatAccess(req.user._id, courseId);

  const enrollments = await EnrollmentCourse.find({
    course: courseId,
    status: { $in: ["active", "completed"] },
  })
    .select("student")
    .populate("student", "fullname username imageUrl")
    .lean();

  res.status(200).json({
    success: true,
    members: enrollments.map(({ student }) => student).filter(Boolean),
  });
});

export const createCourseMessage = async ({ studentId, courseId, content }) => {
  await assertCourseChatAccess(studentId, courseId);
  const normalizedContent = typeof content === "string" ? content.trim() : "";
  if (!normalizedContent)
    throw new ErrorHandler("Message cannot be empty", 400);
  if (normalizedContent.length > 2000) {
    throw new ErrorHandler("Message must be 2000 characters or fewer", 400);
  }

  const [message, sender] = await Promise.all([
    ChatMessage.create({
      course: courseId,
      sender: studentId,
      content: normalizedContent,
    }),
    UserAuth.findById(studentId).select("fullname username imageUrl"),
  ]);

  return {
    _id: message._id,
    course: message.course,
    content: message.content,
    createdAt: message.createdAt,
    updatedAt: message.updatedAt,
    sender,
  };
};
