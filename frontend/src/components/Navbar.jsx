import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

const Navbar = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">

        {/* Logo */}

        <Link
          to="/"
          className="text-2xl font-bold text-blue-600"
        >
          LMS
        </Link>

        {/* Desktop */}

        <div className="hidden items-center gap-6 md:flex">

          <Link
            to="/"
            className="text-gray-700 hover:text-blue-600"
          >
            Home
          </Link>

          {user.role === "Admin" && (
            <Link
              to="/admin/dashboard"
              className="text-gray-700 hover:text-blue-600"
            >
              Dashboard
            </Link>
          )}

          {user.role === "Instructor" && (
            <Link
              to="/instructor/dashboard"
              className="text-gray-700 hover:text-blue-600"
            >
              Dashboard
            </Link>
          )}

          {user.role === "Student" && (
            <Link
              to="/student/dashboard"
              className="text-gray-700 hover:text-blue-600"
            >
              Dashboard
            </Link>
          )}

          {/* User menu */}

          <div className="relative">

            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-100"
            >
              {user.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt={user.fullname}
                  className="h-11 w-11 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                  {user.fullname?.charAt(0).toUpperCase()}
                </div>
              )}

              <span className="font-medium">
                {user.fullname}
              </span>

              <span>⌄</span>
            </button>

            {open && (
              <div className="absolute right-0 z-50 mt-2 w-56 rounded-lg border bg-white py-2 shadow-lg">

                <div className="border-b px-4 py-3">
                  <p className="font-semibold">
                    {user.fullname}
                  </p>

                  <p className="text-sm text-gray-500">
                    {user.email}
                  </p>

                  <p className="mt-1 text-xs text-blue-600">
                    {user.role}
                  </p>
                </div>

                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  My Profile
                </Link>

                <Link
                  to="/change-password"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Change Password
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>

              </div>
            )}
          </div>
        </div>

        {/* Mobile button */}

        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg border px-3 py-2 md:hidden"
        >
          ☰
        </button>
      </div>

      {/* Mobile menu */}

      {open && (
        <div className="border-t px-4 py-4 md:hidden">

          <div className="mb-4">
            <p className="font-semibold">
              {user.fullname}
            </p>

            <p className="text-sm text-gray-500">
              {user.email}
            </p>
          </div>

          <div className="space-y-2">

            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 hover:bg-gray-100"
            >
              My Profile
            </Link>

            <Link
              to="/change-password"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 hover:bg-gray-100"
            >
              Change Password
            </Link>

            <button
              onClick={handleLogout}
              className="w-full rounded-lg px-3 py-2 text-left text-red-600 hover:bg-red-50"
            >
              Logout
            </button>

          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
