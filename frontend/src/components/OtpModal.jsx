import { useState } from "react";
import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router-dom";

const OtpModal = () => {
  const navigate = useNavigate();

  const showOtpModal = useAuthStore(
    (state) => state.showOtpModal
  );

  const otpPurpose = useAuthStore(
    (state) => state.otpPurpose
  );

  const otpUsername = useAuthStore(
    (state) => state.otpUsername
  );

  const otpLoading = useAuthStore(
    (state) => state.otpLoading
  );

  const verifyOtp = useAuthStore(
    (state) => state.verifyOtp
  );

  const closeOtpModal = useAuthStore(
    (state) => state.closeOtpModal
  );

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  if (!showOtpModal) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!otp || otp.length !== 6) {
      setError("Please enter the 6 digit OTP");
      return;
    }

    const result = await verifyOtp(otp);

    if (!result.success) {
      setError(result.message);
      return;
    }

    // Redirect based on role
    if (result.user.role === "Admin") {
      navigate("/admin/dashboard", {
        replace: true,
      });
    } else if (result.user.role === "Instructor") {
      navigate("/instructor/dashboard", {
        replace: true,
      });
    } else if (result.user.role === "Student") {
      navigate("/student/lms", {
        replace: true,
      })
    } else {
      navigate("/", {
        replace: true,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl">
        <h2 className="text-2xl font-bold">
          Verify OTP
        </h2>

        <p className="mt-2 text-gray-600">
          We sent a verification code to your email.
        </p>

        <p className="mt-1 text-sm text-gray-500">
          Username: {otpUsername}
        </p>

        {otpPurpose === "login" && (
          <p className="mt-2 text-sm text-blue-600">
            OTP is required for every login.
          </p>
        )}

        {otpPurpose === "signup" && (
          <p className="mt-2 text-sm text-green-600">
            Verify your email to complete signup.
          </p>
        )}

        {error && (
          <div className="mt-4 rounded-lg bg-red-100 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4"
        >
          <input
            type="text"
            value={otp}
            onChange={(e) =>
              setOtp(
                e.target.value
                  .replace(/\D/g, "")
                  .slice(0, 6)
              )
            }
            placeholder="Enter 6 digit OTP"
            maxLength={6}
            className="w-full rounded-lg border px-4 py-3 text-center text-2xl tracking-[8px] outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            disabled={otpLoading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {otpLoading
              ? "Verifying..."
              : "Verify OTP"}
          </button>

          <button
            type="button"
            onClick={closeOtpModal}
            className="w-full rounded-lg border px-4 py-3"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default OtpModal;
