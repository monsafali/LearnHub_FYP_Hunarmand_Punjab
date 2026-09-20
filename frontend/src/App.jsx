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
import Home from "./pages/home/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./components/MainLayout";

const App = () => {
  return (

    <Routes>

  {/* ================= PUBLIC ================= */}

  <Route path="/" element={<Home />} />

  <Route path="/login" element={<Login />} />

  <Route path="/signup" element={<Signup />} />

  <Route
    path="/forgot-password"
    element={<ForgotPassword />}
  />

  <Route
    path="/reset-password"
    element={<ResetPassword />}
  />

  <Route
    path="/unauthorized"
    element={<Unauthorized />}
  />


  {/* ================= STUDENT ================= */}


      <Route element={<ProtectedRoute allowedRoles={["Student"]} />}>
  <Route element={<MainLayout />}>
    <Route
      path="/student/lms"
      element={<StudentLMS />}
    />

    <Route
      path="/student/lms/course/:courseId"
      element={<StudentCourse />}
    />
  </Route>
</Route>

  {/* ================= INSTRUCTOR ================= */}

  <Route
    element={
      <ProtectedRoute allowedRoles={["Instructor"]} />
    }
  >
    <Route element={<MainLayout />}>

      <Route
        path="/instructor/dashboard"
        element={<InstructorDashboard />}
      />

    </Route>
  </Route>


  {/* ================= ADMIN ================= */}

  <Route
    element={
      <ProtectedRoute allowedRoles={["Admin"]} />
    }
  >
    <Route element={<MainLayout />}>

      <Route
        path="/admin/dashboard"
        element={<AdminDashboard />}
      />

    </Route>
  </Route>


  {/* ================= PROFILE ================= */}

  <Route
    element={
      <ProtectedRoute
        allowedRoles={[
          "Admin",
          "Instructor",
          "Student",
        ]}
      />
    }
  >
    <Route element={<MainLayout />}>

      <Route
        path="/profile"
        element={<Profile />}
      />

      <Route
        path="/change-password"
        element={<ChangePassword />}
      />

    </Route>
  </Route>


  <Route
    path="*"
    element={<Navigate to="/" replace />}
  />

</Routes>
  );
};

export default App;
