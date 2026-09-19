import express from "express";

import {
  GetCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  EntrolledStudents,
  getCourseById,
} from "../controllers/courseController.js";

import { authorizedRole, isAuthenticated } from "../middleware/isAuth.js";

const router = express.Router();

router.get("/getCourse", isAuthenticated, GetCourse);

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

router.get("/getCourseById/:id", isAuthenticated, getCourseById);

export default router;
