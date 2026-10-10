// import dotenv from "dotenv";
// dotenv.config();
// import fileUpload from "express-fileupload";
// import express from "express";
// import { createServer } from "node:http";
// import { Server as SocketIOServer } from "socket.io";
// import cookieParser from "cookie-parser";
// import cors from "cors";

// import path from "path";

// const __dirname = path.resolve();

// import AuthRoutes from "./routes/auth.routes.js";
// import InstructorRoutes from "./routes/instructor.routes.js";
// import CoursesRoutes from "./routes/student.routes.js";
// import adminRoutes from "./routes/admin.routes.js";
// import ChatRoutes from "./routes/chat.routes.js";



// import connectDB from "./database/Database.js";
// import { connectCloudinary } from "./utils/cloudinaryConfig.js";
// import { errorMiddleware } from "./middleware/errorMiddleware.js";

// import { seedSuperAdmin } from "./utils/seed.js";

// const port = process.env.PORT;
// const app = express();
// const httpServer = createServer(app);
// app.use(express.urlencoded({ extended: true }));
// app.use(
//   fileUpload({
//     useTempFiles: true,
//     tempFileDir: "/tmp/",
//   }),
// );

// app.use(
//   cors({
//     origin: process.env.CLIENT_URL,
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//   }),
// );
// app.use(express.json());
// app.use(cookieParser());

// app.use("/api/auth", AuthRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/course", InstructorRoutes);
// app.use("/api/student", CoursesRoutes);
// app.use("/api/chat", ChatRoutes);



// const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
//   .split(",")
//   .map((origin) => origin.trim());






// app.use(errorMiddleware);

// const startServer = async () => {
//   try {
//     await connectDB();
//     await seedSuperAdmin();
//     connectCloudinary();

//     httpServer.listen(port, () => {
//       console.log(`Server is running on port ${port}`);
//     });
//   } catch (error) {
//     console.error("Startup Error:", error);
//   }
// };

// startServer();





import dotenv from "dotenv";
dotenv.config();

import fileUpload from "express-fileupload";
import express from "express";
import { createServer } from "node:http";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import AuthRoutes from "./routes/auth.routes.js";
import InstructorRoutes from "./routes/instructor.routes.js";
import CoursesRoutes from "./routes/student.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import ChatRoutes from "./routes/chat.routes.js";

import connectDB from "./database/Database.js";
import { connectCloudinary } from "./utils/cloudinaryConfig.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";
import { seedSuperAdmin } from "./utils/seed.js";

import { initializeSocket } from "./utils/socket.js";

const __dirname = path.resolve();
const port = process.env.PORT || 5000;

const app = express();
const httpServer = createServer(app);

const allowedOrigins = (
  process.env.CLIENT_URL || "http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim());

app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// API routes
app.use("/api/auth", AuthRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/course", InstructorRoutes);
app.use("/api/student", CoursesRoutes);
app.use("/api/chat", ChatRoutes);

// Initialize Socket.IO
initializeSocket(httpServer, allowedOrigins);

// Error middleware
app.use(errorMiddleware);

// Start server
const startServer = async () => {
  try {
    await connectDB();

    await seedSuperAdmin();

    await connectCloudinary();

    httpServer.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Startup Error:", error);
    process.exit(1);
  }
};

startServer();

export { app, httpServer };
