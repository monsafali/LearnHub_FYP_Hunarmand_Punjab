import useAuthStore from "../../store/authStore";

const AdminDashboard = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-gray-600">
            Welcome, {user?.fullname}
          </p>
        </div>

        <button
          onClick={logout}
          className="rounded-lg bg-red-600 px-5 py-2 text-white"
        >
          Logout
        </button>
      </div>

      <div className="mt-8 rounded-xl bg-white p-6 shadow">
        <h2 className="text-xl font-semibold">
          Admin Panel
        </h2>

        <p className="mt-2 text-gray-600">
          Manage instructors, students, courses and
          platform settings.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
