import Course from "../models/Courses.model.js";
import Enrollment from "../models/EnrollmentCourse.model.js";

import { ErrorHandler } from "../middleware/errorMiddleware.js";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";

// Get all courses
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

// Create course
export const createCourse = catchAsyncErrors(async (req, res, next) => {
  const { name, category, description, image, price } = req.body;

  if (!name || !category || !description || !image || price === undefined) {
    return next(new ErrorHandler("All course fields are required", 400));
  }

  const course = await Course.create({
    name,
    category,
    description,
    image,
    price,
    trainer: req.user._id,
  });

  const populatedCourse = await Course.findById(course._id).populate(
    "trainer",
    "fullname username email imageUrl bio",
  );

  res.status(201).json({
    success: true,
    message: "Course created successfully",
    course: populatedCourse,
  });
});

// Update course
export const updateCourse = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const course = await Course.findById(id);

  if (!course) {
    return next(new ErrorHandler("Course not found", 404));
  }

  // Make sure instructor owns this course
  if (course.trainer.toString() !== req.user._id.toString()) {
    return next(
      new ErrorHandler("You are not authorized to update this course", 403),
    );
  }

  const { name, category, description, image, price } = req.body;

  if (name !== undefined) course.name = name;
  if (category !== undefined) course.category = category;
  if (description !== undefined) course.description = description;
  if (image !== undefined) course.image = image;
  if (price !== undefined) course.price = price;

  await course.save();

  res.status(200).json({
    success: true,
    message: "Course updated successfully",
    course,
  });
});

// Delete course
export const deleteCourse = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const course = await Course.findById(id);

  if (!course) {
    return next(new ErrorHandler("Course not found", 404));
  }

  // Make sure instructor owns this course
  if (course.trainer.toString() !== req.user._id.toString()) {
    return next(
      new ErrorHandler("You are not authorized to delete this course", 403),
    );
  }

  // Optional but recommended:
  // Don't allow deleting a course that has students
  const enrolledStudents = await Enrollment.countDocuments({
    course: id,
    status: "active",
  });

  if (enrolledStudents > 0) {
    return next(
      new ErrorHandler("Cannot delete a course with enrolled students", 400),
    );
  }

  await Course.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Course deleted successfully",
  });
});

// Get enrolled students for instructor's course
export const EntrolledStudents = catchAsyncErrors(async (req, res, next) => {
  const { courseId } = req.query;

  if (!courseId) {
    return next(new ErrorHandler("courseId is required", 400));
  }

  // Check course
  const course = await Course.findById(courseId);

  if (!course) {
    return next(new ErrorHandler("Course not found", 404));
  }

  // Make sure this instructor owns the course
  if (course.trainer.toString() !== req.user._id.toString()) {
    return next(
      new ErrorHandler("You are not authorized to view these students", 403),
    );
  }

  const enrollments = await Enrollment.find({
    course: courseId,
    status: "active",
  })
    .populate("student", "fullname username email imageUrl")
    .populate("course", "name category image")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: enrollments.length,
    students: enrollments,
  });
});

// Get single course
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
