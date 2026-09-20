import { useState } from "react";
import { Link } from "react-router-dom";

import useAuthStore from "../../store/authStore";
import OtpModal from "../../components/OtpModal";

const Login = () => {
  const login = useAuthStore((state) => state.login);

  const loading = useAuthStore((state) => state.loading);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "Student",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const result = await login(
      formData.username,
      formData.password,
      formData.role,
    );

    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
          <h1 className="text-3xl font-bold">Login</h1>

          <p className="mt-2 text-gray-500">Login to your LMS account</p>

          {error && (
            <div className="mt-5 rounded-lg bg-red-100 p-3 text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* Username */}
            <div>
              <label className="mb-1 block font-medium">Username</label>

              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username"
                required
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-1 block font-medium">Password</label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            {/* Role */}
            <div>
              <label className="mb-1 block font-medium">Login As</label>

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full rounded-lg border px-4 py-3"
              >
                <option value="Student">Student</option>

                <option value="Instructor">Instructor</option>

                <option value="Admin">Admin</option>
              </select>
            </div>
                     <Link
            to="/forgot-password"
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot Password?
          </Link>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white disabled:opacity-50"
            >
              {loading ? "Sending OTP..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="font-semibold text-blue-600">
              Signup
            </Link>


          </p>


        </div>

      </div>

      {/* OTP popup */}
      <OtpModal />
    </>
  );
};

export default Login;
