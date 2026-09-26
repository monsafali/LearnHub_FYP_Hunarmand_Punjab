import Course from "../models/Courses.model.js";
import EnrollmentCourse from "../models/EnrollmentCourse.model.js";
import Lesson from "../models/Lesson.model.js";
import Assignment from "../models/assignment.model.js";
import AssignmentSubmission from "../models/assignmentSubmission.model.js";
import { ErrorHandler } from "../middleware/errorMiddleware.js";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";

import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../utils/cloudinaryConfig.js";

// =====================================================
// GET ALL COURSES
// =====================================================

export const GetCourse = catchAsyncErrors(async (req, res, next) => {
  const courses = await Course.find()
    .populate("trainer", "fullname username email imageUrl bio")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: courses.length,
    courses,
  });
});

// =====================================================
// CREATE COURSE
// =====================================================

export const createCourse = catchAsyncErrors(async (req, res, next) => {
  const { name, category, description, price } = req.body;

  if (!name || !category || !description || price === undefined) {
    return next(new ErrorHandler("All course fields are required", 400));
  }

  if (!req.files || !req.files.image) {
    return next(new ErrorHandler("Course image is required", 400));
  }

  const image = req.files.image;

  const result = await uploadToCloudinary(image, "lms/courses");

  const course = await Course.create({
    name: name.trim(),
    category: category.trim(),
    description,
    price: Number(price),

    imageUrl: result.secure_url,
    imagePublicId: result.public_id,

    trainer: req.user._id,
  });

  await course.populate("trainer", "fullname username email imageUrl bio");

  res.status(201).json({
    success: true,
    message: "Course created successfully",
    course,
  });
});

// =====================================================
// UPDATE COURSE
// =====================================================

export const updateCourse = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const course = await Course.findById(id);

  if (!course) {
    return next(new ErrorHandler("Course not found", 404));
  }

  // Instructor ownership
  if (course.trainer.toString() !== req.user._id.toString()) {
    return next(
      new ErrorHandler("You are not authorized to update this course", 403),
    );
  }

  const { name, category, description, price } = req.body;

  if (name !== undefined) {
    course.name = name.trim();
  }

  if (category !== undefined) {
    course.category = category.trim();
  }

  if (description !== undefined) {
    course.description = description;
  }

  if (price !== undefined) {
    course.price = Number(price);
  }

  // Optional image update
  if (req.files?.image) {
    const image = req.files.image;

    const result = await uploadToCloudinary(image, "lms/courses");

    // Delete old Cloudinary image
    if (course.imagePublicId) {
      await deleteFromCloudinary(course.imagePublicId);
    }

    course.imageUrl = result.secure_url;
    course.imagePublicId = result.public_id;
  }

  await course.save();

  await course.populate("trainer", "fullname username email imageUrl bio");

  res.status(200).json({
    success: true,
    message: "Course updated successfully",
    course,
  });
});

// =====================================================
// DELETE COURSE
// =====================================================

export const deleteCourse = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const course = await Course.findById(id);

  if (!course) {
    return next(new ErrorHandler("Course not found", 404));
  }

  // Instructor ownership
  if (course.trainer.toString() !== req.user._id.toString()) {
    return next(
      new ErrorHandler("You are not authorized to delete this course", 403),
    );
  }

  // Check enrolled students
  const enrolledStudents = await EnrollmentCourse.countDocuments({
    course: id,
    status: "active",
  });

  // Find all lessons
  const lessons = await Lesson.find({
    course: id,
  });

  // Delete lesson videos from Cloudinary
  for (const lesson of lessons) {
    if (lesson.videoPublicId) {
      await deleteFromCloudinary(lesson.videoPublicId);
    }
  }

  // Delete lessons
  await Lesson.deleteMany({
    course: id,
  });

  // Delete course image from Cloudinary
  if (course.imagePublicId) {
    await deleteFromCloudinary(course.imagePublicId);
  }

  // Delete course
  await Course.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Course and all related lessons deleted successfully",
  });
});

export const createLesson = catchAsyncErrors(async (req, res, next) => {
  const { courseId } = req.params;

  const { title } = req.body;

  // Check title
  if (!title || !title.trim()) {
    return next(new ErrorHandler("Lesson title is required", 400));
  }

  // Find course
  const course = await Course.findById(courseId);

  if (!course) {
    return next(new ErrorHandler("Course not found", 404));
  }

  // Check ownership
  if (course.trainer.toString() !== req.user._id.toString()) {
    return next(
      new ErrorHandler(
        "You are not authorized to add lessons to this course",
        403,
      ),
    );
  }

  // Check video
  if (!req.files || !req.files.video) {
    return next(new ErrorHandler("Lesson video is required", 400));
  }

  const video = req.files.video;

  // Upload video
  const result = await uploadToCloudinary(video, "lms/lessons");

  // Create lesson
  const lesson = await Lesson.create({
    course: courseId,

    title: title.trim(),

    videoUrl: result.secure_url,

    videoPublicId: result.public_id,

    // Instructor can publish later
    isPublished: true,
  });

  res.status(201).json({
    success: true,
    message: "Lesson created successfully",
    lesson,
  });
});

export const getCourseLessons = catchAsyncErrors(async (req, res, next) => {
  const { courseId } = req.params;

  const course = await Course.findById(courseId);

  if (!course) {
    return next(new ErrorHandler("Course not found", 404));
  }

  const lessons = await Lesson.find({
    course: courseId,
  }).sort({
    order: 1,
    createdAt: 1,
  });

  res.status(200).json({
    success: true,
    count: lessons.length,
    lessons,
  });
});

export const getCourseById = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const course = await Course.findById(id).populate(
    "trainer",
    "fullname username email imageUrl bio",
  );

  if (!course) {
    return next(new ErrorHandler("Course not found", 404));
  }

  res.status(200).json({
    success: true,
    course,
  });
});

export const EntrolledStudents = catchAsyncErrors(async (req, res, next) => {
  const { courseId } = req.query;

  if (!courseId) {
    return next(new ErrorHandler("courseId is required", 400));
  }

  const course = await Course.findById(courseId);

  if (!course) {
    return next(new ErrorHandler("Course not found", 404));
  }

  if (course.trainer.toString() !== req.user._id.toString()) {
    return next(
      new ErrorHandler("You are not authorized to view these students", 403),
    );
  }

  const enrollments = await EnrollmentCourse.find({
    course: courseId,
    status: "active",
  })
    .populate("student", "fullname username email imageUrl")
    .populate("course", "name category imageUrl")
    .sort({
      createdAt: -1,
    });

  res.status(200).json({
    success: true,
    count: enrollments.length,
    students: enrollments,
  });
});



export const createAssignment = catchAsyncErrors(async (req, res, next) => {
  const { courseId } = req.params;

  const { title, description, totalMarks, dueDate } = req.body;

  if (!title || !title.trim()) {
    return next(new ErrorHandler("Assignment title is required", 400));
  }

  if (
    totalMarks === undefined ||
    totalMarks === null ||
    Number(totalMarks) <= 0
  ) {
    return next(new ErrorHandler("Total marks must be greater than 0", 400));
  }

  const course = await Course.findById(courseId);

  if (!course) {
    return next(new ErrorHandler("Course not found", 404));
  }

  if (course.trainer.toString() !== req.user._id.toString()) {
    return next(
      new ErrorHandler(
        "You are not authorized to add assignments to this course",
        403,
      ),
    );
  }

  if (!req.files || !req.files.assignment) {
    return next(new ErrorHandler("Assignment PDF is required", 400));
  }

  const pdf = req.files.assignment;

  if (pdf.mimetype !== "application/pdf") {
    return next(new ErrorHandler("Only PDF files are allowed", 400));
  }

  const result = await uploadToCloudinary(pdf, "lms/assignments");

  const assignment = await Assignment.create({
    course: courseId,
    title: title.trim(),
    description: description?.trim() || "",
    pdfUrl: result.secure_url,
    pdfPublicId: result.public_id,
    totalMarks: Number(totalMarks),
    dueDate: dueDate || null,
    isPublished: true,
  });

  res.status(201).json({
    success: true,
    message: "Assignment created successfully",
    assignment,
  });
});

export const getAssignmentSubmissions = catchAsyncErrors(
  async (req, res, next) => {
    const { assignmentId } = req.params;

    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return next(
        new ErrorHandler("Assignment not found", 404)
      );
    }

    const course = await Course.findById(assignment.course);

    if (!course) {
      return next(
        new ErrorHandler("Course not found", 404)
      );
    }

    if (
      course.trainer.toString() !==
      req.user._id.toString()
    ) {
      return next(
        new ErrorHandler(
          "You are not authorized to view submissions",
          403
        )
      );
    }

    const submissions =
      await AssignmentSubmission.find({
        assignment: assignmentId,
      })
        .populate(
          "student",
          "fullname username email imageUrl"
        )
        .populate(
          "assignment",
          "title totalMarks"
        )
        .sort({
          submittedAt: -1,
        });

    res.status(200).json({
      success: true,
      assignment,
      totalSubmissions: submissions.length,
      submissions,
    });
  }
);

export const gradeAssignment = catchAsyncErrors(async (req, res, next) => {
  const { submissionId } = req.params;

  const { marks, feedback } = req.body;

  // -----------------------------
  // Validate marks
  // -----------------------------
  if (marks === undefined || marks === null || marks === "") {
    return next(new ErrorHandler("Marks are required", 400));
  }

  // -----------------------------
  // Find submission
  // -----------------------------
  const submission =
    await AssignmentSubmission.findById(submissionId).populate("assignment");

  if (!submission) {
    return next(new ErrorHandler("Submission not found", 404));
  }

  // -----------------------------
  // Find course
  // -----------------------------
  const course = await Course.findById(submission.assignment.course);

  if (!course) {
    return next(new ErrorHandler("Course not found", 404));
  }

  // -----------------------------
  // Check instructor
  // -----------------------------
  if (course.trainer.toString() !== req.user._id.toString()) {
    return next(
      new ErrorHandler("You are not authorized to grade this assignment", 403),
    );
  }

  const numericMarks = Number(marks);

  // -----------------------------
  // Validate marks range
  // -----------------------------
  if (numericMarks < 0) {
    return next(new ErrorHandler("Marks cannot be negative", 400));
  }

  if (numericMarks > submission.assignment.totalMarks) {
    return next(
      new ErrorHandler(
        `Marks cannot be greater than ${submission.assignment.totalMarks}`,
        400,
      ),
    );
  }

  // -----------------------------
  // Update submission
  // -----------------------------
  submission.marks = numericMarks;

  submission.feedback = feedback?.trim() || "";

  submission.status = "graded";

  submission.gradedAt = new Date();

  await submission.save();

  res.status(200).json({
    success: true,

    message: "Assignment graded successfully",

    submission,
  });
});

export const getInstructorAssignments = catchAsyncErrors(
  async (req, res, next) => {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      return next(new ErrorHandler("Course not found", 404));
    }

    if (course.trainer.toString() !== req.user._id.toString()) {
      return next(
        new ErrorHandler(
          "You are not authorized to view these assignments",
          403,
        ),
      );
    }

    const assignments = await Assignment.find({
      course: courseId,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,

      assignments,
    });
  },
);
