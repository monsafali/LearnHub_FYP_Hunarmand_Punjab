import { useState } from "react";
import { Link } from "react-router-dom";

import useAuthStore from "../../store/authStore";
import OtpModal from "../../components/OtpModal";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
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
  <Navbar />

  {/* ================================================= */}
  {/* FULL PAGE BACKGROUND VIDEO */}
  {/* ================================================= */}

  <div className="relative min-h-screen overflow-hidden">

    {/* Background Video */}
    <video
      autoPlay
      loop
      muted
      playsInline
      className="absolute inset-0 h-full w-full object-cover"
    >
      <source
        src={new URL( "../../assets/v2.mp4", import.meta.url)}
        type="video/mp4"
      />
    </video>

    {/* Dark Overlay */}
    <div className="absolute inset-0 bg-black/50" />

    {/* ================================================= */}
    {/* LOGIN CONTENT */}
    {/* ================================================= */}

    <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">

      <div className="w-full max-w-md rounded-2xl bg-white/95 p-8 shadow-2xl backdrop-blur-sm">

        {/* Heading */}

        <h1 className="text-3xl font-bold text-gray-900">
          Login
        </h1>

        <p className="mt-2 text-gray-500">
          Login to your LMS account
        </p>

        {/* Error */}

        {error && (
          <div className="mt-5 rounded-lg bg-red-100 p-3 text-red-600">
            {error}
          </div>
        )}

        {/* Login Form */}

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-5"
        >

          {/* Username */}

          <div>
            <label className="mb-1 block font-medium text-gray-700">
              Username
            </label>

            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Password */}

          <div>
            <label className="mb-1 block font-medium text-gray-700">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Role */}

          <div>
            <label className="mb-1 block font-medium text-gray-700">
              Login As
            </label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
            >
              <option value="Student">
                Student
              </option>

              <option value="Instructor">
                Instructor
              </option>

              <option value="Admin">
                Admin
              </option>
            </select>
          </div>

          {/* Forgot Password */}

          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Sending OTP..." : "Login"}
          </button>

        </form>

        {/* Signup */}

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}

          <Link
            to="/signup"
            className="font-semibold text-blue-600 hover:underline"
          >
            Signup
          </Link>
        </p>

      </div>
    </div>
  </div>

  {/* OTP Popup */}

  <OtpModal />

  <Footer />
</>




  );
};

export default Login;
