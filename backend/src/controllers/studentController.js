import Course from "../models/Courses.model.js";
import EntrollmentCourse from "../models/EnrollmentCourse.model.js";
import Lesson from "../models/Lesson.model.js";

import { ErrorHandler } from "../middleware/errorMiddleware.js";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";


// =====================================================
// GET ALL COURSES - PUBLIC
// =====================================================

export const getAllCourses = catchAsyncErrors(
  async (req, res, next) => {
    const courses = await Course.find({})
      .populate(
        "trainer",
        "fullname username imageUrl bio"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });
  }
);


// =====================================================
// ENROLL COURSE - STUDENT ONLY
// =====================================================


export const enrollCourse = catchAsyncErrors(async (req, res, next) => {
  const { courseId } = req.params;

  const course = await Course.findById(courseId);

  if (!course) {
    return next(new ErrorHandler("Course not found", 404));
  }

  const existingEnrollment = await EntrollmentCourse.findOne({
    student: req.user._id,
    course: courseId,
  });

  if (existingEnrollment) {
    return next(
      new ErrorHandler("You are already enrolled in this course", 400)
    );
  }

  const enrollment = await EntrollmentCourse.create({
    student: req.user._id,
    course: courseId,
    amountPaid: course.price,
    status: "active",
    progress: 0,
  });

  await enrollment.populate({
    path: "course",
    populate: {
      path: "trainer",
      select: "fullname username email imageUrl bio",
    },
  });

  res.status(201).json({
    success: true,
    message: "Successfully enrolled in course",
    enrollment,
  });
});


// =====================================================
// GET STUDENT'S ENROLLED COURSES
// =====================================================


export const getEnrolledCourses = catchAsyncErrors(
  async (req, res, next) => {
    const enrollments = await EntrollmentCourse.find({
      student: req.user._id,
      status: { $in: ["active", "completed"] },
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


// =====================================================
// GET ONE ENROLLED COURSE + LESSONS
// =====================================================



export const getMyCourseWithLessons = catchAsyncErrors(
  async (req, res, next) => {
    const { courseId } = req.params;

    console.log("Course ID:", courseId);
    console.log("Student ID:", req.user._id);

    const enrollment = await EntrollmentCourse.findOne({
      student: req.user._id,
      course: courseId,
      status: { $in: ["active", "completed"] },
    }).populate({
      path: "course",
      populate: {
        path: "trainer",
        select: "fullname username email imageUrl bio",
      },
    });

    if (!enrollment) {
      return next(
        new ErrorHandler(
          "You are not enrolled in this course",
          403
        )
      );
    }

    const lessons = await Lesson.find({
      course: courseId,
      isPublished: true,
    }).sort({
      order: 1,
      createdAt: 1,
    });

    console.log("Lessons:", lessons.length);

    res.status(200).json({
      success: true,
      course: enrollment.course,
      enrollment,
      lessons,
    });
  }
);
