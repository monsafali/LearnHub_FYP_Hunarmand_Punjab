import Course from "../models/Courses.model.js";
import Enrollment from "../models/EnrollmentCourse.model.js";
import Lesson from "../models/Lesson.model.js";

import { ErrorHandler } from "../middleware/errorMiddleware.js";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../utils/cloudinaryConfig.js";

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
export const createCourse = async (req, res, next) => {
  try {
    const { name, category, description, price } = req.body;

    // Validate fields
    if (!name || !category || !description || price === undefined) {
      return next(new ErrorHandler("All course fields are required", 400));
    }

    // Check image
    if (!req.files || !req.files.image) {
      return next(new ErrorHandler("Course image is required", 400));
    }

    const image = req.files.image;

    // Upload image to Cloudinary
    const result = await uploadToCloudinary(image, "lms/courses");

    // Save course in MongoDB
    const course = await Course.create({
      name,
      category,
      description,
      price: Number(price),

      imageUrl: result.secure_url,
      imagePublicId: result.public_id,

      trainer: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    next(error);
  }
};

export const createLesson = catchAsyncErrors(async (req, res, next) => {
  const { courseId } = req.params;

  const { title, description, duration, order } = req.body;

  // 1. Check required fields
  if (!title) {
    return next(new ErrorHandler("Lesson title is required", 400));
  }

  // 2. Check course exists
  const course = await Course.findById(courseId);

  if (!course) {
    return next(new ErrorHandler("Course not found", 404));
  }

  // 3. Make sure instructor owns this course
  if (course.trainer.toString() !== req.user._id.toString()) {
    return next(
      new ErrorHandler(
        "You are not authorized to add lessons to this course",
        403,
      ),
    );
  }

  // 4. Check video
  if (!req.files || !req.files.video) {
    return next(new ErrorHandler("Lesson video is required", 400));
  }

  const video = req.files.video;

  // 5. Upload video to Cloudinary
  const result = await uploadToCloudinary(video, "lms/lessons");

  // 6. Create lesson in MongoDB
  const lesson = await Lesson.create({
    course: courseId,

    title: title.trim(),

    description: description || "",

    videoUrl: result.secure_url,

    videoPublicId: result.public_id,

    duration: Number(duration) || 0,

    order: Number(order) || 0,

    isPublished: false,
  });

  // 7. Return response
  res.status(201).json({
    success: true,
    message: "Lesson created successfully",
    lesson,
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

  // 1. Find course
  const course = await Course.findById(id);

  if (!course) {
    return next(new ErrorHandler("Course not found", 404));
  }

  // 2. Check ownership
  if (course.trainer.toString() !== req.user._id.toString()) {
    return next(
      new ErrorHandler("You are not authorized to delete this course", 403),
    );
  }

  // 3. Don't delete if students are actively enrolled
  const enrolledStudents = await Enrollment.countDocuments({
    course: id,
    status: "active",
  });

  if (enrolledStudents > 0) {
    return next(
      new ErrorHandler("Cannot delete a course with enrolled students", 400),
    );
  }

  // 4. Find all lessons
  const lessons = await Lesson.find({
    course: id,
  });

  // 5. Delete lesson videos from Cloudinary
  for (const lesson of lessons) {
    if (lesson.videoPublicId) {
      await deleteFromCloudinary(lesson.videoPublicId);
    }

    // Delete lesson thumbnail if you have one
    if (lesson.thumbnailPublicId) {
      await deleteFromCloudinary(lesson.thumbnailPublicId);
    }
  }

  // 6. Delete lessons from MongoDB
  await Lesson.deleteMany({
    course: id,
  });

  // 7. Delete course image from Cloudinary
  if (course.imagePublicId) {
    await deleteFromCloudinary(course.imagePublicId);
  }

  // 8. Delete course from MongoDB
  await Course.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Course and all related lessons deleted successfully",
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
