// routes/studentRoutes.js

import express from "express";

import {
  getAllCourses,
  getCourseById,
  enrollCourse,
  getEnrolledCourses,
  getMyCourseWithLessons,
} from "../controllers/studentController.js";

import { isAuthenticated, authorizedRole } from "../middleware/isAuth.js";

const router = express.Router();

// Browse courses
router.get("/courses", getAllCourses);
router.get("/courses/:id", getCourseById);

// Enroll in course
router.post(
  "/courses/:courseId/enroll",
  isAuthenticated,
  authorizedRole("Student"),
  enrollCourse,
);

// Student's enrolled courses
router.get(
  "/my-courses",
  isAuthenticated,
  authorizedRole("Student"),
  getEnrolledCourses,
);

router.get(
  "/my-courses/:courseId",
  isAuthenticated,
  authorizedRole("Student"),
  getMyCourseWithLessons,
);



export default router;
