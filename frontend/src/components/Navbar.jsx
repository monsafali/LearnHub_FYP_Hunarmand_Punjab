import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const getDashboardPath = () => {
    if (user?.role === "Admin") {
      return "/admin/dashboard";
    }

    if (user?.role === "Instructor") {
      return "/instructor/dashboard";
    }

    if (user?.role === "Student") {
      return "/student/lms";
    }

    return "/";
  };

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold">
          LearnHub
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-6">
          <Link to="/">Home</Link>

          {user && (
            <Link to={getDashboardPath()}>
              {user.role === "Student" ? "LMS" : "Dashboard"}
            </Link>
          )}

          {user && (
            <>
              <Link to="/profile">My Profile</Link>

              <button
                onClick={handleLogout}
                className="rounded bg-red-500 px-4 py-2 text-white"
              >
                Logout
              </button>
            </>
          )}

          {!user && (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
