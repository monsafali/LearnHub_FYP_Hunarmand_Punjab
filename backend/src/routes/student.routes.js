// routes/studentRoutes.js

import express from "express";

import {
  getAllCourses,
  enrollCourse,
  getEnrolledCourses,
} from "../controllers/studentController.js";

import { isAuthenticated, authorizedRole } from "../middleware/isAuth.js";

const router = express.Router();

// Browse courses
router.get("/courses", getAllCourses);

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

export default router;
