import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../store/authStore";

const ProtectedRoute = ({ allowedRoles }) => {
  const user = useAuthStore((state) => state.user);
  
  const checkingAuth = useAuthStore(
    (state) => state.checkingAuth
  );

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <h2>Checking authentication...</h2>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Wrong role
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
