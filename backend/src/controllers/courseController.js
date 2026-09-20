import Course from "../models/Courses.model.js";
import Enrollment from "../models/EnrollmentCourse.model.js";
import Lesson from "../models/Lesson.model.js";

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
    .populate(
      "trainer",
      "fullname username email imageUrl bio"
    )
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

export const createCourse = catchAsyncErrors(
  async (req, res, next) => {
    const {
      name,
      category,
      description,
      price,
    } = req.body;

    if (
      !name ||
      !category ||
      !description ||
      price === undefined
    ) {
      return next(
        new ErrorHandler(
          "All course fields are required",
          400
        )
      );
    }

    if (!req.files || !req.files.image) {
      return next(
        new ErrorHandler(
          "Course image is required",
          400
        )
      );
    }

    const image = req.files.image;

    const result = await uploadToCloudinary(
      image,
      "lms/courses"
    );

    const course = await Course.create({
      name: name.trim(),
      category: category.trim(),
      description,
      price: Number(price),

      imageUrl: result.secure_url,
      imagePublicId: result.public_id,

      trainer: req.user._id,
    });

    await course.populate(
      "trainer",
      "fullname username email imageUrl bio"
    );

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course,
    });
  }
);


// =====================================================
// UPDATE COURSE
// =====================================================

export const updateCourse = catchAsyncErrors(
  async (req, res, next) => {
    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {
      return next(
        new ErrorHandler(
          "Course not found",
          404
        )
      );
    }

    // Instructor ownership
    if (
      course.trainer.toString() !==
      req.user._id.toString()
    ) {
      return next(
        new ErrorHandler(
          "You are not authorized to update this course",
          403
        )
      );
    }

    const {
      name,
      category,
      description,
      price,
    } = req.body;

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

      const result = await uploadToCloudinary(
        image,
        "lms/courses"
      );

      // Delete old Cloudinary image
      if (course.imagePublicId) {
        await deleteFromCloudinary(
          course.imagePublicId
        );
      }

      course.imageUrl = result.secure_url;
      course.imagePublicId = result.public_id;
    }

    await course.save();

    await course.populate(
      "trainer",
      "fullname username email imageUrl bio"
    );

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course,
    });
  }
);


// =====================================================
// DELETE COURSE
// =====================================================

export const deleteCourse = catchAsyncErrors(
  async (req, res, next) => {
    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {
      return next(
        new ErrorHandler(
          "Course not found",
          404
        )
      );
    }

    // Instructor ownership
    if (
      course.trainer.toString() !==
      req.user._id.toString()
    ) {
      return next(
        new ErrorHandler(
          "You are not authorized to delete this course",
          403
        )
      );
    }

    // Don't delete courses with students
    const enrolledStudents =
      await Enrollment.countDocuments({
        course: id,
        status: "active",
      });

    if (enrolledStudents > 0) {
      return next(
        new ErrorHandler(
          "Cannot delete a course with enrolled students",
          400
        )
      );
    }

    // Find lessons
    const lessons = await Lesson.find({
      course: id,
    });

    // Delete lesson videos
    for (const lesson of lessons) {
      if (lesson.videoPublicId) {
        await deleteFromCloudinary(
          lesson.videoPublicId
        );
      }
    }

    // Delete lessons from MongoDB
    await Lesson.deleteMany({
      course: id,
    });

    // Delete course image
    if (course.imagePublicId) {
      await deleteFromCloudinary(
        course.imagePublicId
      );
    }

    // Delete course
    await Course.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message:
        "Course and all related lessons deleted successfully",
    });
  }
);


// =====================================================
// CREATE LESSON
// =====================================================

export const createLesson = catchAsyncErrors(
  async (req, res, next) => {
    const { courseId } = req.params;

    const {
      title,
      description,
      duration,
      order,
    } = req.body;

    // Check title
    if (!title || !title.trim()) {
      return next(
        new ErrorHandler(
          "Lesson title is required",
          400
        )
      );
    }

    // Find course
    const course = await Course.findById(
      courseId
    );

    if (!course) {
      return next(
        new ErrorHandler(
          "Course not found",
          404
        )
      );
    }

    // Check ownership
    if (
      course.trainer.toString() !==
      req.user._id.toString()
    ) {
      return next(
        new ErrorHandler(
          "You are not authorized to add lessons to this course",
          403
        )
      );
    }

    // Check video
    if (!req.files || !req.files.video) {
      return next(
        new ErrorHandler(
          "Lesson video is required",
          400
        )
      );
    }

    const video = req.files.video;

    // Upload video
    const result = await uploadToCloudinary(
      video,
      "lms/lessons"
    );

    // Create lesson
    const lesson = await Lesson.create({
      course: courseId,

      title: title.trim(),

      description:
        description?.trim() || "",

      videoUrl: result.secure_url,

      videoPublicId:
        result.public_id,

      duration:
        Number(duration) || 0,

      order:
        Number(order) || 0,

      // Instructor can publish later
      isPublished: false,
    });

    res.status(201).json({
      success: true,
      message:
        "Lesson created successfully",
      lesson,
    });
  }
);


// =====================================================
// GET COURSE LESSONS
// =====================================================

export const getCourseLessons =
  catchAsyncErrors(
    async (req, res, next) => {
      const { courseId } = req.params;

      const course =
        await Course.findById(courseId);

      if (!course) {
        return next(
          new ErrorHandler(
            "Course not found",
            404
          )
        );
      }

      const lessons =
        await Lesson.find({
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
    }
  );


// =====================================================
// PUBLISH / UNPUBLISH LESSON
// =====================================================

export const toggleLessonPublish =
  catchAsyncErrors(
    async (req, res, next) => {
      const { lessonId } = req.params;

      const lesson =
        await Lesson.findById(
          lessonId
        );

      if (!lesson) {
        return next(
          new ErrorHandler(
            "Lesson not found",
            404
          )
        );
      }

      const course =
        await Course.findById(
          lesson.course
        );

      if (!course) {
        return next(
          new ErrorHandler(
            "Course not found",
            404
          )
        );
      }

      // Ownership
      if (
        course.trainer.toString() !==
        req.user._id.toString()
      ) {
        return next(
          new ErrorHandler(
            "You are not authorized to modify this lesson",
            403
          )
        );
      }

      lesson.isPublished =
        !lesson.isPublished;

      await lesson.save();

      res.status(200).json({
        success: true,

        message: lesson.isPublished
          ? "Lesson published successfully"
          : "Lesson unpublished successfully",

        lesson,
      });
    }
  );


// =====================================================
// GET SINGLE COURSE
// =====================================================

export const getCourseById =
  catchAsyncErrors(
    async (req, res, next) => {
      const { id } = req.params;

      const course =
        await Course.findById(id)
          .populate(
            "trainer",
            "fullname username email imageUrl bio"
          );

      if (!course) {
        return next(
          new ErrorHandler(
            "Course not found",
            404
          )
        );
      }

      res.status(200).json({
        success: true,
        course,
      });
    }
  );


// =====================================================
// ENROLLED STUDENTS
// =====================================================

export const EntrolledStudents =
  catchAsyncErrors(
    async (req, res, next) => {
      const { courseId } =
        req.query;

      if (!courseId) {
        return next(
          new ErrorHandler(
            "courseId is required",
            400
          )
        );
      }

      const course =
        await Course.findById(
          courseId
        );

      if (!course) {
        return next(
          new ErrorHandler(
            "Course not found",
            404
          )
        );
      }

      if (
        course.trainer.toString() !==
        req.user._id.toString()
      ) {
        return next(
          new ErrorHandler(
            "You are not authorized to view these students",
            403
          )
        );
      }

      const enrollments =
        await Enrollment.find({
          course: courseId,
          status: "active",
        })
          .populate(
            "student",
            "fullname username email imageUrl"
          )
          .populate(
            "course",
            "name category imageUrl"
          )
          .sort({
            createdAt: -1,
          });

      res.status(200).json({
        success: true,
        count: enrollments.length,
        students: enrollments,
      });
    }
  );
