import { useState } from "react";
import { Link } from "react-router-dom";

import useAuthStore from "../../store/authStore";
import OtpModal from "../../components/OtpModal";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Eye, EyeOff } from "lucide-react";
const Signup = () => {
  const signup = useAuthStore((state) => state.signup);

  const loading = useAuthStore((state) => state.loading);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    if (formData.password !== formData.confirmPassword) {
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
            src={new URL("../../assets/v4.mp4", import.meta.url)}
            type="video/mp4"
          />
        </video>

        {/* Dark Overlay */}

        <div className="absolute inset-0 bg-black/50" />

        {/* ================================================= */}
        {/* SIGNUP CONTENT */}
        {/* ================================================= */}

        <div className="relative z-10 min-h-screen py-4">
          <div className="mx-auto max-w-6xl">
            {/* Signup Card - LEFT SIDE */}

            <div className="w-full max-w-lg rounded-2xl bg-white/95 shadow-2xl backdrop-blur-sm sm:p-10">
              {/* Heading */}

              <h1 className="text-3xl font-bold text-gray-900">
                Create Student Account
              </h1>

              <p className="mt-2 text-gray-500">
                Join our LMS and start learning.
              </p>

              {/* Error */}

              {error && (
                <div className="mt-2 rounded-lg bg-red-100 p-3 text-red-600">
                  {error}
                </div>
              )}

              {/* Signup Form */}

              <form onSubmit={handleSubmit} className="mt-2 space-y-2">
                {/* Fullname */}

                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  placeholder="Full name"
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                {/* Username */}

                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Username"
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                {/* Email */}

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                {/* Password */}
                {/* Password */}

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pr-12 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {/* Confirm Password */}

                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pr-12 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>

                {/* Create Account */}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Creating account..." : "Create Account"}
                </button>
              </form>

              {/* Login */}

              <p className="mt-6 text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-blue-600 hover:underline"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <OtpModal />
    </>
  );
};

export default Signup;
