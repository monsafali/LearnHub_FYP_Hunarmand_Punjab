import express from "express";

import {
  GetCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  EntrolledStudents,
  getCourseById,
  createLesson,
  getCourseLessons,
  createAssignment,
  getAssignmentSubmissions,
  gradeAssignment,
  getInstructorAssignments,
} from "../controllers/courseController.js";

import { authorizedRole, isAuthenticated } from "../middleware/isAuth.js";

const router = express.Router();

// =====================================================
// COURSES
// =====================================================

router.get("/getCourse", isAuthenticated, GetCourse);

router.get("/getCourseById/:id", isAuthenticated, getCourseById);

router.post(
  "/createCourse",
  isAuthenticated,
  authorizedRole("Instructor"),
  createCourse,
);

router.put(
  "/updateCourse/:id",
  isAuthenticated,
  authorizedRole("Instructor"),
  updateCourse,
);

router.delete(
  "/deleteCourse/:id",
  isAuthenticated,
  authorizedRole("Instructor"),
  deleteCourse,
);

router.get(
  "/EntrolledStudents",
  isAuthenticated,
  authorizedRole("Instructor"),
  EntrolledStudents,
);

// =====================================================
// LESSONS
// =====================================================

router.post(
  "/:courseId/lessons",
  isAuthenticated,
  authorizedRole("Instructor"),
  createLesson,
);

router.get("/:courseId/lessons", isAuthenticated, getCourseLessons);

// =====================================================
// ASSIGNMENTS
// =====================================================

router.post(
  "/:courseId/assignments",
  isAuthenticated,
  authorizedRole("Instructor"),
  createAssignment,
);

router.get(
  "/instructor/course/:courseId/assignments",
  isAuthenticated,
  authorizedRole("Instructor"),
  getInstructorAssignments,
);

router.get(
  "/assignments/:assignmentId/submissions",
  isAuthenticated,
  authorizedRole("Instructor"),
  getAssignmentSubmissions,
);

router.put(
  "/submission/:submissionId/grade",
  isAuthenticated,
  authorizedRole("Instructor"),
  gradeAssignment,
);

export default router;
