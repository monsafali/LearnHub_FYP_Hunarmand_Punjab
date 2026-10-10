import { Server as SocketIOServer } from "socket.io";
import jwt from "jsonwebtoken";

import UserAuth from "../models/UserAuth.model.js";
import {
  assertCourseChatAccess,
  createCourseMessage,
} from "../controllers/chatController.js";

let io;

export const initializeSocket = (httpServer, allowedOrigins) => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie || "";

      const tokenFromCookie = cookieHeader
        .split(";")
        .map((item) => item.trim())
        .find((item) => item.startsWith("jwt-token="))
        ?.slice("jwt-token=".length);

      const authToken = socket.handshake.auth?.token;

      const token =
        authToken ||
        (tokenFromCookie ? decodeURIComponent(tokenFromCookie) : null);

      if (!token) {
        return next(new Error("Authentication required"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      const user = await UserAuth.findById(decoded.userId).select(
        "role fullname username imageUrl sessionVersion singleDeviceEnforced"
      );

      if (!user || user.role !== "Student") {
        return next(new Error("Student access required"));
      }

      if (
        user.singleDeviceEnforced &&
        decoded.sessionVersion !== user.sessionVersion
      ) {
        return next(new Error("Your session has expired"));
      }

      socket.data.user = user;

      next();
    } catch {
      next(new Error("Invalid or expired session"));
    }
  });

  io.on("connection", (socket) => {
    console.log("Student connected:", socket.id);

    socket.on("chat:join", async ({ courseId } = {}, acknowledge = () => {}) => {
      try {
        await assertCourseChatAccess(socket.data.user._id, courseId);

        const room = `course:${courseId}`;

        for (const joinedRoom of socket.rooms) {
          if (
            joinedRoom.startsWith("course:") &&
            joinedRoom !== room
          ) {
            socket.leave(joinedRoom);
          }
        }

        socket.join(room);

        acknowledge({
          success: true,
          courseId,
        });
      } catch (error) {
        acknowledge({
          success: false,
          message: error.message || "Unable to join this course chat",
        });
      }
    });

    socket.on("chat:leave", ({ courseId } = {}) => {
      if (courseId) {
        socket.leave(`course:${courseId}`);
      }
    });

    socket.on(
      "chat:send",
      async ({ courseId, content } = {}, acknowledge = () => {}) => {
        try {
          const message = await createCourseMessage({
            studentId: socket.data.user._id,
            courseId,
            content,
          });

          io.to(`course:${courseId}`).emit("chat:message", message);

          acknowledge({
            success: true,
            message,
          });
        } catch (error) {
          acknowledge({
            success: false,
            message: error.message || "Unable to send message",
          });
        }
      }
    );

    socket.on("disconnect", (reason) => {
      console.log("Student disconnected:", socket.id, reason);
    });
  });

  return io;
};

export { io };
