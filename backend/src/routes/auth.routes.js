// routes/authRoutes.js
import express from "express";

import { isAuthenticated } from "../middleware/isAuth.js";
import {
  loginUser,
  logoutUser,
  forceResetStudentSesssion,
  updatePassword,
  GetMe,
  verifyLoginOtp,
  SignupUser,
  forgotPassword,
  resetPassword,
  updateProfile
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", SignupUser);
router.post("/login", loginUser);
router.post("/logout", isAuthenticated, logoutUser);
router.get("/Getme", isAuthenticated, GetMe);
router.post("/verifyotp", verifyLoginOtp);
router.put("/reset/:username", forceResetStudentSesssion);
router.put("/updatePassword", isAuthenticated, updatePassword);
router.put("/updateProfile", isAuthenticated, updateProfile);
router.post("/forgotPassword", forgotPassword);
router.put("/resetPassword", resetPassword)

export default router;
