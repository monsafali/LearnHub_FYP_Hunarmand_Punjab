import express from "express";
import {
  getChatCourses,
  getCourseMembers,
  getCourseMessages,
} from "../controllers/chatController.js";
import { isAuthenticated, authorizedRole } from "../middleware/isAuth.js";

const router = express.Router();
router.use(isAuthenticated, authorizedRole("Student"));

router.get("/courses", getChatCourses);
router.get("/courses/:courseId/messages", getCourseMessages);
router.get("/courses/:courseId/members", getCourseMembers);

export default router;
