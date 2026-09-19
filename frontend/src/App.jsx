import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Unauthorized from "./pages/auth/Unauthorized";

import AdminDashboard from "./pages/admin/AdminDashboard";
import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import StudentDashboard from "./pages/student/StudentDashboard";

import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Routes>
      {/* Public */}
      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/signup"
        element={<Signup />}
      />

      <Route
        path="/unauthorized"
        element={<Unauthorized />}
      />

      {/* Admin */}
      <Route
        element={
          <ProtectedRoute
            allowedRoles={["Admin"]}
          />
        }
      >
        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />
      </Route>

      {/* Instructor */}
      <Route
        element={
          <ProtectedRoute
            allowedRoles={["Instructor"]}
          />
        }
      >
        <Route
          path="/instructor/dashboard"
          element={<InstructorDashboard />}
        />
      </Route>

      {/* Student */}
      <Route
        element={
          <ProtectedRoute
            allowedRoles={["Student"]}
          />
        }
      >
        <Route
          path="/student/dashboard"
          element={<StudentDashboard />}
        />
      </Route>

      {/* Default */}
      <Route
        path="*"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />
    </Routes>
  );
};

export default App;
