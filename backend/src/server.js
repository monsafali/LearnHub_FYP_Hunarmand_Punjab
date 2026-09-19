import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import path from "path";


const __dirname = path.resolve();





import AuthRoutes from "./routes/auth.routes.js";
import InstructorRoutes from "./routes/instructor.routes.js";
import CoursesRoutes from "./routes/student.routes.js";




import connectDB from "./database/Database.js";
import { connectCloudinary } from "./utils/cloudinaryConfig.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";





import { seedSuperAdmin } from "./utils/seed.js";





const port = process.env.PORT
const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());



app.use("/api/auth", AuthRoutes);
app.use("/api/course", InstructorRoutes)
app.use("/api/students", CoursesRoutes)





app.use(errorMiddleware);




const startServer = async () => {
  try {
    await connectDB();
    await seedSuperAdmin();
    connectCloudinary();

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Startup Error:", error);
  }
};




startServer();
