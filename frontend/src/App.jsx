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
import StudentDashboard from "./pages/student/StudentDashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./components/MainLayout";

const App = () => {
  return (
    <Routes>

      {/* ================= AUTH ================= */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/signup"
        element={<Signup />}
      />

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

      {/* ================= AUTHENTICATED ================= */}

      <Route element={<ProtectedRoute allowedRoles={["Admin", "Instructor", "Student"]} />}>

        <Route element={<MainLayout />}>

          {/* Profile */}

          <Route
            path="/profile"
            element={<Profile />}
          />

          {/* Change Password */}

          <Route
            path="/change-password"
            element={<ChangePassword />}
          />

        </Route>

      </Route>

      {/* ================= ADMIN ================= */}

      <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>

        <Route element={<MainLayout />}>

          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />

        </Route>

      </Route>

      {/* ================= INSTRUCTOR ================= */}

      <Route element={<ProtectedRoute allowedRoles={["Instructor"]} />}>

        <Route element={<MainLayout />}>

          <Route
            path="/instructor/dashboard"
            element={<InstructorDashboard />}
          />

        </Route>

      </Route>

      {/* ================= STUDENT ================= */}

      <Route element={<ProtectedRoute allowedRoles={["Student"]} />}>

        <Route element={<MainLayout />}>

          <Route
            path="/student/dashboard"
            element={<StudentDashboard />}
          />

        </Route>

      </Route>

      {/* ================= DEFAULT ================= */}

      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />

    </Routes>
  );
};

export default App;
