import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Unauthorized from "./pages/auth/Unauthorized";

import Profile from "./pages/profile/Profile";
import ChangePassword from "./pages/auth/ChangePassword";

import AdminDashboard from "./pages/admin/AdminDashboard";
import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import StudentLMS from "./pages/student/StudentLMS";
import StudentCourse from "./pages/student/StudentCourse";
import CourseDetails from "./pages/Courses/CourseDetails";
import Home from "./pages/home/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./components/MainLayout";
import PaymentSuccess from "./pages/student/PaymentSuccess";
import EmbeddedCourseCheckout from "./pages/student/EmbeddedCourseCheckout";
import InstructorCourse from "./pages/instructor/InstructorCourse";

const App = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/courses/:id" element={<CourseDetails />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/checkout/course/:courseId" element={<EmbeddedCourseCheckout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/student/lms" element={<ProtectedRoute allowedRoles={["Student"]} />}>
          <Route index element={<StudentLMS />} />
        </Route>
        <Route path="/student/lms/course/:courseId" element={<ProtectedRoute allowedRoles={["Student"]} />}>
          <Route index element={<StudentCourse />} />
        </Route>
        <Route path="/instructor/dashboard" element={<ProtectedRoute allowedRoles={["Instructor"]} />}>
          <Route index element={<InstructorDashboard />} />
        </Route>
        <Route path="/instructor/course/:courseId" element={<ProtectedRoute allowedRoles={["Instructor"]} />}>
          <Route index element={<InstructorCourse />} />
        </Route>
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={["Admin"]} />}>
          <Route index element={<AdminDashboard />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["Admin", "Instructor", "Student"]} />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/change-password" element={<ChangePassword />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>

  );
};

export default App;
