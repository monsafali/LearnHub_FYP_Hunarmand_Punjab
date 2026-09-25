import express from "express";

import {
  CreateInstructor,
  getAdminAnalytics,
  getAllUsers,
  getAllInstructors,
  getInstructorById,
  updateInstructor,
  deleteInstructor,
} from "../controllers//adminController.js";

import { isAuthenticated, authorizedRole } from "../middleware/isAuth.js";

const router = express.Router();

// Analytics
router.get(
  "/analytics",
  isAuthenticated,
  authorizedRole("Admin"),
  getAdminAnalytics,
);

// Users
router.get("/users", isAuthenticated, authorizedRole("Admin"), getAllUsers);

// Instructors
router.get(
  "/instructors",
  isAuthenticated,
  authorizedRole("Admin"),
  getAllInstructors,
);

router.get(
  "/instructors/:id",
  isAuthenticated,
  authorizedRole("Admin"),
  getInstructorById,
);

// Create instructor
router.post(
  "/instructors",
  isAuthenticated,
  authorizedRole("Admin"),
  CreateInstructor,
);

// Update instructor
router.put(
  "/instructors/:id",
  isAuthenticated,
  authorizedRole("Admin"),
  updateInstructor,
);

// Activate / deactivate
router.delete(
  "/instructor/:id",
  isAuthenticated,
  authorizedRole("Admin"),
  deleteInstructor,
);

export default router;
