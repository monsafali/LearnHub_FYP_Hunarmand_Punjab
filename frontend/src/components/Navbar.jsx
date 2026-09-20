// import { Link, useNavigate } from "react-router-dom";
// import useAuthStore from "../store/authStore";

// const Navbar = () => {
//   const navigate = useNavigate();
//   const { user, logout } = useAuthStore();

//   const handleLogout = async () => {
//     await logout();
//     navigate("/");
//   };

//   const getDashboardPath = () => {
//     if (user?.role === "Admin") {
//       return "/admin/dashboard";
//     }

//     if (user?.role === "Instructor") {
//       return "/instructor/dashboard";
//     }

//     if (user?.role === "Student") {
//       return "/student/lms";
//     }

//     return "/";
//   };

//   return (
//     <nav className="border-b bg-white">
//       <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
//         {/* Logo */}
//         <Link to="/" className="text-2xl font-bold">
//           LearnHub
//         </Link>

//         {/* Navigation */}
//         <div className="flex items-center gap-6">
//           <Link to="/">Home</Link>

//           {user && (
//             <Link to={getDashboardPath()}>
//               {user.role === "Student" ? "LMS" : "Dashboard"}
//             </Link>
//           )}

//           {user && (
//             <>
//               <Link to="/profile">My Profile</Link>

//               <button
//                 onClick={handleLogout}
//                 className="rounded bg-red-500 px-4 py-2 text-white"
//               >
//                 Logout
//               </button>
//             </>
//           )}

//           {!user && (
//             <>
//               <Link to="/login">Login</Link>
//               <Link to="/signup">Signup</Link>
//             </>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;



import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  User,
} from "lucide-react";

import useAuthStore from "../store/authStore";

const Navbar = () => {
  const navigate = useNavigate();

  const { user, logout } = useAuthStore();

  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    setProfileOpen(false);

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
    <nav className="sticky top-0 z-50 border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-blue-600"
        >
          LearnHub
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
          >
            Home
          </Link>

          {/* Logged in user */}
          {user ? (
            <div className="relative">
              {/* Profile Button */}
              <button
                onClick={() => setProfileOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-gray-100"
              >
                {/* Avatar */}
                {user.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt={user.fullname || "Profile"}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                    {user.fullname?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}

                {/* User name */}
                <div className="hidden text-left sm:block">
                  <p className="max-w-[130px] truncate text-sm font-semibold text-gray-800">
                    {user.fullname}
                  </p>

                  <p className="text-xs text-gray-500">
                    {user.role}
                  </p>
                </div>

                <ChevronDown
                  size={17}
                  className={`text-gray-500 transition-transform ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown */}
              {profileOpen && (
                <>
                  {/* Overlay - click outside */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileOpen(false)}
                  />

                  <div className="absolute right-0 z-50 mt-3 w-64 overflow-hidden rounded-xl border bg-white shadow-xl">
                    {/* User information */}
                    <div className="border-b bg-gray-50 px-4 py-4">
                      <div className="flex items-center gap-3">
                        {user.imageUrl ? (
                          <img
                            src={user.imageUrl}
                            alt={user.fullname || "Profile"}
                            className="h-11 w-11 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
                            {user.fullname
                              ?.charAt(0)
                              ?.toUpperCase() || "U"}
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="truncate font-semibold text-gray-800">
                            {user.fullname}
                          </p>

                          <p className="truncate text-xs text-gray-500">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu */}
                    <div className="p-2">
                      {/* Dashboard / LMS */}
                      <Link
                        to={getDashboardPath()}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition hover:bg-gray-100"
                      >
                        <LayoutDashboard size={18} />

                        <span>
                          {user.role === "Student"
                            ? "My LMS"
                            : "Dashboard"}
                        </span>
                      </Link>

                      {/* Profile */}
                      <Link
                        to="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition hover:bg-gray-100"
                      >
                        <User size={18} />

                        <span>My Profile</span>
                      </Link>

                      {/* Change Password */}
                      <Link
                        to="/change-password"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition hover:bg-gray-100"
                      >
                        <LockKeyhole size={18} />

                        <span>Change Password</span>
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="border-t p-2">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-600 transition hover:bg-red-50"
                      >
                        <LogOut size={18} />

                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            /* Not logged in */
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                Signup
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
