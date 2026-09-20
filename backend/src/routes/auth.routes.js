// routes/authRoutes.js
import express from "express";

import { authorizedRole, isAuthenticated } from "../middleware/isAuth.js";
import {
  loginUser,
  logoutUser,
  updatePassword,
  GetMe,
  verifyLoginOtp,
  SignupUser,
  forgotPassword,
  resetPassword,
  updateProfile,
  CreateInstructor,
} from "../controllers/auth.controller.js";

const router = express.Router();

// Admin only
router.post("/create-instructor",isAuthenticated,authorizedRole("Admin"),CreateInstructor,
);

// student Signup
router.post("/signup", SignupUser);
router.post("/login", loginUser);
router.post("/logout", isAuthenticated, logoutUser);
router.get("/Getme", isAuthenticated, GetMe);
router.post("/verifyotp", verifyLoginOtp);
router.put("/updatePassword", isAuthenticated, updatePassword);
router.put("/updateProfile", isAuthenticated, updateProfile);
router.post("/forgotPassword", forgotPassword);
router.put("/resetPassword", resetPassword);

export default router;
