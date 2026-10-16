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
  getInstructorAnalytics,
  getInstructorCourseContent,
  updateLesson,
  deleteLesson,
  updateAssignment,
  deleteAssignment,
} from "../controllers/courseController.js";

import { authorizedRole, isAuthenticated } from "../middleware/isAuth.js";

const router = express.Router();

// =====================================================
// COURSES
// =====================================================

router.get("/getCourse", isAuthenticated, GetCourse);

router.get("/analytics", isAuthenticated, authorizedRole("Instructor"), getInstructorAnalytics);
router.get("/instructor/course/:courseId/content", isAuthenticated, authorizedRole("Instructor"), getInstructorCourseContent);
router.put("/instructor/lessons/:lessonId", isAuthenticated, authorizedRole("Instructor"), updateLesson);
router.delete("/instructor/lessons/:lessonId", isAuthenticated, authorizedRole("Instructor"), deleteLesson);
router.put("/instructor/assignments/:assignmentId", isAuthenticated, authorizedRole("Instructor"), updateAssignment);
router.delete("/instructor/assignments/:assignmentId", isAuthenticated, authorizedRole("Instructor"), deleteAssignment);

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



router.post(
  "/:courseId/lessons",
  isAuthenticated,
  authorizedRole("Instructor"),
  createLesson,
);

router.get("/:courseId/lessons", isAuthenticated, getCourseLessons);


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
