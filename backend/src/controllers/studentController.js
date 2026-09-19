import Course from "../models/Courses.model.js";
import Enrollment from "../models/EnrollmentCourse.model.js";
import Lesson from "../models/Lesson.model.js";

import { ErrorHandler } from "../middleware/errorMiddleware.js";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import { deleteFromCloudinary, uploadToCloudinary } from "../utils/cloudinaryConfig.js";



export const getAllCourses = catchAsyncErrors(async (req, res, next) => {
  const courses = await Course.find()
    .populate(
      "trainer",
      "fullname username imageUrl bio"
    )
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: courses.length,
    courses,
  });
});



export const enrollCourse = catchAsyncErrors(async (req, res, next) => {
  const { courseId } = req.params;

  // 1. Find course
  const course = await Course.findById(courseId);

  if (!course) {
    return next(
      new ErrorHandler("Course not found", 404)
    );
  }

  // 2. Check if already enrolled
  const existingEnrollment = await Enrollment.findOne({
    student: req.user._id,
    course: courseId,
  });

  if (existingEnrollment) {
    return next(
      new ErrorHandler(
        "You are already enrolled in this course",
        400
      )
    );
  }

  // 3. Create enrollment
  const enrollment = await Enrollment.create({
    student: req.user._id,
    course: courseId,
    amountPaid: course.price,
    status: "active",
    progress: 0,
  });

  // 4. Populate course information
  await enrollment.populate({
    path: "course",
    populate: {
      path: "trainer",
      select: "fullname username imageUrl",
    },
  });

  res.status(201).json({
    success: true,
    message: "Successfully enrolled in course",
    enrollment,
  });
});



export const getEnrolledCourses = catchAsyncErrors(
  async (req, res, next) => {
    const enrollments = await Enrollment.find({
      student: req.user._id,
      status: "active",
    })
      .populate({
        path: "course",
        populate: {
          path: "trainer",
          select: "fullname username imageUrl bio",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: enrollments.length,
      enrollments,
    });
  }
);
