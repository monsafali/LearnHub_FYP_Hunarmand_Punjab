import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

const ChangePassword = () => {
  const updatePassword = useAuthStore(
    (state) => state.updatePassword
  );

  const loading = useAuthStore(
    (state) => state.loading
  );

  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const result = await updatePassword({
      oldPassword,
      newPassword,
    });

    if (!result.success) {
      setError(result.message);
      return;
    }

    setSuccess(result.message);

    setOldPassword("");
    setNewPassword("");
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-lg rounded-xl bg-white p-8 shadow">
        <h1 className="mb-2 text-2xl font-bold">
          Change Password
        </h1>

        <p className="mb-6 text-gray-500">
          Update your account password.
        </p>

        {error && (
          <div className="mb-4 rounded bg-red-100 p-3 text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded bg-green-100 p-3 text-green-600">
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label className="mb-2 block font-medium">
              Old Password
            </label>

            <input
              type="password"
              value={oldPassword}
              onChange={(e) =>
                setOldPassword(e.target.value)
              }
              required
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              New Password
            </label>

            <input
              type="password"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(e.target.value)
              }
              required
              minLength={8}
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading
              ? "Updating..."
              : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
