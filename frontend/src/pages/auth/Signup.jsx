import { useState } from "react";
import { Link } from "react-router-dom";

import useAuthStore from "../../store/authStore";
import OtpModal from "../../components/OtpModal";

const Signup = () => {
  const signup = useAuthStore(
    (state) => state.signup
  );

  const loading = useAuthStore(
    (state) => state.loading
  );

  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError("Passwords do not match");
      return;
    }

    const result = await signup(formData);

    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-10">
        <div className="w-full max-w-lg rounded-xl bg-white p-8 shadow-lg">
          <h1 className="text-3xl font-bold">
            Create Student Account
          </h1>

          <p className="mt-2 text-gray-500">
            Join our LMS and start learning.
          </p>

          {error && (
            <div className="mt-5 rounded-lg bg-red-100 p-3 text-red-600">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-4"
          >
            {/* Fullname */}
            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              placeholder="Full name"
              required
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
            />

            {/* Username */}
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              required
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
            />

            {/* Email */}
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
            />

            {/* Password */}
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
            />

            {/* Confirm Password */}
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              required
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
            />

            {/* Role */}
            <div className="rounded-lg bg-gray-100 p-3">
              <p className="text-sm text-gray-500">
                Account Type
              </p>

              <p className="font-semibold">
                Student
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white disabled:opacity-50"
            >
              {loading
                ? "Creating account..."
                : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-blue-600"
            >
              Login
            </Link>
          </p>
        </div>
      </div>

      <OtpModal />
    </>
  );
};

export default Signup;
