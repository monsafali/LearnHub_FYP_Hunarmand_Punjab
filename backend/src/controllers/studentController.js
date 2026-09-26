import Course from "../models/Courses.model.js";
import EntrollmentCourse from "../models/EnrollmentCourse.model.js";
import Lesson from "../models/Lesson.model.js";
import Assignment from "../models/assignment.model.js";
import AssignmentSubmission from "../models/assignmentSubmission.model.js";

import { ErrorHandler } from "../middleware/errorMiddleware.js";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";

import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../utils/cloudinaryConfig.js";



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
  })
});


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



export const getMyCourseAssignments = catchAsyncErrors(
  async (req, res, next) => {
    const { courseId } = req.params;

    const enrollment = await EntrollmentCourse.findOne({
      student: req.user._id,
      course: courseId,
      status: {
        $in: ["active", "completed"],
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

    const assignments = await Assignment.find({
      course: courseId,
      isPublished: true,
    }).sort({
      createdAt: -1,
    });

    const assignmentIds = assignments.map(
      (assignment) => assignment._id
    );

    const submissions = await AssignmentSubmission.find({
      assignment: {
        $in: assignmentIds,
      },
      student: req.user._id,
    });

    const assignmentsWithSubmission = assignments.map(
      (assignment) => {
        const submission = submissions.find(
          (item) =>
            item.assignment.toString() ===
            assignment._id.toString()
        );

        return {
          ...assignment.toObject(),
          submission: submission || null,
        };
      }
    );

    res.status(200).json({
      success: true,
      assignments: assignmentsWithSubmission,
    });
  }
);


export const submitAssignment = catchAsyncErrors(
  async (req, res, next) => {
    const { assignmentId } = req.params;

    // -----------------------------
    // Find assignment
    // -----------------------------
    const assignment = await Assignment.findById(
      assignmentId
    );

    if (!assignment) {
      return next(
        new ErrorHandler(
          "Assignment not found",
          404
        )
      );
    }

    // -----------------------------
    // Check enrollment
    // -----------------------------
    const enrollment =
      await EntrollmentCourse.findOne({
        student: req.user._id,

        course: assignment.course,

        status: {
          $in: ["active", "completed"],
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


    if (!req.files || !req.files.answer) {
      return next(
        new ErrorHandler(
          "Answer PDF is required",
          400
        )
      );
    }

    const answer = req.files.answer;

    if (answer.mimetype !== "application/pdf") {
      return next(
        new ErrorHandler(
          "Only PDF files are allowed",
          400
        )
      );
    }

    // -----------------------------
    // Check existing submission
    // -----------------------------
    const existingSubmission =
      await AssignmentSubmission.findOne({
        assignment: assignmentId,
        student: req.user._id,
      });

    if (existingSubmission) {
      return next(
        new ErrorHandler(
          "You have already submitted this assignment",
          400
        )
      );
    }

    // -----------------------------
    // Upload answer
    // -----------------------------
    const result = await uploadToCloudinary(
      answer,
      "lms/assignment-answers"
    );

    // -----------------------------
    // Create submission
    // -----------------------------
    const submission =
      await AssignmentSubmission.create({
        assignment: assignmentId,

        student: req.user._id,

        answerUrl: result.secure_url,

        answerPublicId: result.public_id,

        submittedAt: new Date(),

        status: "submitted",
      });

    res.status(201).json({
      success: true,

      message:
        "Assignment submitted successfully",

      submission,
    });
  }
);




export const getMyAssignmentResult =
  catchAsyncErrors(async (req, res, next) => {
    const { assignmentId } = req.params;

    const submission =
      await AssignmentSubmission.findOne({
        assignment: assignmentId,
        student: req.user._id,
      }).populate({
        path: "assignment",
        select:
          "title description totalMarks dueDate course",
      });

    if (!submission) {
      return next(
        new ErrorHandler(
          "You have not submitted this assignment",
          404
        )
      );
    }

    res.status(200).json({
      success: true,

      result: submission,
    });
  });

