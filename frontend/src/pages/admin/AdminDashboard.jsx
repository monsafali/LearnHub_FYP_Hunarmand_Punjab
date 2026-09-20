import { useEffect, useState } from "react";
import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  Menu,
  ShieldCheck,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import useAuthStore from "../../store/authStore";
import useAdminStore from "../../store/adminStore";

const AdminDashboard = () => {
  const user = useAuthStore((state) => state.user);

  const {
    analytics,
    instructors,
    users,
    loading,

    getAnalytics,
    getInstructors,
    getUsers,

    createInstructor,
    updateInstructor,
    toggleInstructorStatus,
  } = useAdminStore();

  const [activeTab, setActiveTab] = useState(
    "dashboard"
  );

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [selectedInstructor, setSelectedInstructor] =
    useState(null);

  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [editForm, setEditForm] = useState({
    fullname: "",
    username: "",
    email: "",
    cnic: "",
    district: "",
    districtId: "",
    tehsil: "",
    address: "",
    contactno: "",
    bio: "",
  });


  // =====================================================
  // INITIAL DATA
  // =====================================================

  useEffect(() => {
    getAnalytics();
    getInstructors();
    getUsers();
  }, []);


  // =====================================================
  // CREATE INSTRUCTOR
  // =====================================================

  const handleCreateInstructor = async (e) => {
    e.preventDefault();

    if (
      form.password !== form.confirmPassword
    ) {
      toast.error("Passwords do not match");
      return;
    }

    const result =
      await createInstructor(form);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);

    setShowCreateModal(false);

    setForm({
      fullname: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    getAnalytics();
  };


  // =====================================================
  // OPEN EDIT MODAL
  // =====================================================

  const openEditModal = (instructor) => {
    setSelectedInstructor(instructor);

    setEditForm({
      fullname: instructor.fullname || "",
      username: instructor.username || "",
      email: instructor.email || "",
      cnic: instructor.cnic || "",
      district: instructor.district || "",
      districtId: instructor.districtId || "",
      tehsil: instructor.tehsil || "",
      address: instructor.address || "",
      contactno: instructor.contactno || "",
      bio: instructor.bio || "",
    });

    setShowEditModal(true);
  };


  // =====================================================
  // UPDATE INSTRUCTOR
  // =====================================================

  const handleUpdateInstructor = async (e) => {
    e.preventDefault();

    const result =
      await updateInstructor(
        selectedInstructor._id,
        editForm
      );

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);

    setShowEditModal(false);
    setSelectedInstructor(null);
  };


  // =====================================================
  // ACTIVATE / DEACTIVATE
  // =====================================================

  const handleToggleStatus = async (id) => {
    const result =
      await toggleInstructorStatus(id);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
  };


  // =====================================================
  // FILTER USERS
  // =====================================================

  const filteredUsers = users.filter((item) => {
    const value = search.toLowerCase();

    return (
      item.fullname
        ?.toLowerCase()
        .includes(value) ||
      item.username
        ?.toLowerCase()
        .includes(value) ||
      item.email
        ?.toLowerCase()
        .includes(value) ||
      item.role
        ?.toLowerCase()
        .includes(value)
    );
  });


  return (
    <div className="min-h-screen bg-gray-100">


      {/* Mobile Header */}
      <div className="flex items-center justify-between border-b bg-white px-4 py-4 lg:hidden">
        <h1 className="text-xl font-bold text-blue-600">
          Admin Panel
        </h1>

        <button
          onClick={() =>
            setSidebarOpen(true)
          }
          className="rounded-lg p-2 hover:bg-gray-100"
        >
          <Menu />
        </button>
      </div>


      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-gray-900 text-white transition-transform lg:translate-x-0 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >

        <div className="flex h-16 items-center justify-between border-b border-gray-700 px-5">
          <h1 className="text-xl font-bold">
            LearnHub Admin
          </h1>

          <button
            onClick={() =>
              setSidebarOpen(false)
            }
            className="lg:hidden"
          >
            <X />
          </button>
        </div>


        <div className="p-4">

          <p className="mb-6 text-xs uppercase text-gray-400">
            Administration
          </p>


          <SidebarButton
            icon={<LayoutDashboard size={19} />}
            text="Dashboard"
            active={activeTab === "dashboard"}
            onClick={() => {
              setActiveTab("dashboard");
              setSidebarOpen(false);
            }}
          />


          <SidebarButton
            icon={<UserPlus size={19} />}
            text="Instructors"
            active={activeTab === "instructors"}
            onClick={() => {
              setActiveTab("instructors");
              setSidebarOpen(false);
            }}
          />


          <SidebarButton
            icon={<Users size={19} />}
            text="Users"
            active={activeTab === "users"}
            onClick={() => {
              setActiveTab("users");
              setSidebarOpen(false);
            }}
          />

        </div>
      </aside>


      {/* Main */}
      <main className="lg:ml-64">


        {/* Desktop Header */}
        <header className="hidden items-center justify-between border-b bg-white px-8 py-5 lg:flex">

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {activeTab === "dashboard" &&
                "Dashboard"}

              {activeTab === "instructors" &&
                "Manage Instructors"}

              {activeTab === "users" &&
                "Users"}
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Welcome, {user?.fullname}
            </p>
          </div>

          <div className="flex items-center gap-3">

            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={user.fullname}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
                {user?.fullname
                  ?.charAt(0)
                  ?.toUpperCase()}
              </div>
            )}

            <div>
              <p className="text-sm font-semibold">
                {user?.fullname}
              </p>

              <p className="text-xs text-gray-500">
                Administrator
              </p>
            </div>

          </div>
        </header>


        <div className="p-4 md:p-8">


          {/* ================================================= */}
          {/* DASHBOARD */}
          {/* ================================================= */}

          {activeTab === "dashboard" && (
            <>

              <div className="mb-8">
                <h2 className="text-2xl font-bold">
                  Overview
                </h2>

                <p className="mt-1 text-gray-500">
                  Platform statistics and analytics
                </p>
              </div>


              {/* Statistics */}
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                <StatCard
                  title="Total Users"
                  value={
                    analytics?.totalUsers || 0
                  }
                  icon={<Users />}
                />

                <StatCard
                  title="Students"
                  value={
                    analytics?.totalStudents || 0
                  }
                  icon={<GraduationCap />}
                />

                <StatCard
                  title="Instructors"
                  value={
                    analytics?.totalInstructors || 0
                  }
                  icon={<ShieldCheck />}
                />

                <StatCard
                  title="Courses"
                  value={
                    analytics?.totalCourses || 0
                  }
                  icon={<BookOpen />}
                />

              </div>


              {/* Second row */}
              <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                <StatCard
                  title="Enrollments"
                  value={
                    analytics?.totalEnrollments || 0
                  }
                  icon={<BookOpen />}
                />

                <StatCard
                  title="Active Users"
                  value={
                    analytics?.activeUsers || 0
                  }
                  icon={<Users />}
                />

                <StatCard
                  title="Inactive Users"
                  value={
                    analytics?.inactiveUsers || 0
                  }
                  icon={<Users />}
                />

              </div>


              {/* Quick Actions */}
              <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">

                <h2 className="text-lg font-semibold">
                  Quick Actions
                </h2>

                <div className="mt-5 flex flex-wrap gap-3">

                  <button
                    onClick={() => {
                      setActiveTab(
                        "instructors"
                      );
                      setShowCreateModal(
                        true
                      );
                    }}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    <UserPlus size={18} />
                    Create Instructor
                  </button>

                  <button
                    onClick={() =>
                      setActiveTab("users")
                    }
                    className="flex items-center gap-2 rounded-lg border px-5 py-3 text-sm font-medium hover:bg-gray-50"
                  >
                    <Users size={18} />
                    View Users
                  </button>

                </div>

              </div>

            </>
          )}


          {/* ================================================= */}
          {/* INSTRUCTORS */}
          {/* ================================================= */}

          {activeTab === "instructors" && (
            <>

              <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">

                <div>
                  <h2 className="text-2xl font-bold">
                    Instructors
                  </h2>

                  <p className="text-sm text-gray-500">
                    Manage your platform instructors
                  </p>
                </div>

                <button
                  onClick={() =>
                    setShowCreateModal(true)
                  }
                  className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
                >
                  <UserPlus size={18} />
                  Create Instructor
                </button>

              </div>


              <div className="overflow-hidden rounded-xl bg-white shadow-sm">

                <div className="overflow-x-auto">

                  <table className="w-full text-left">

                    <thead className="border-b bg-gray-50 text-sm text-gray-600">

                      <tr>
                        <th className="px-5 py-4">
                          Instructor
                        </th>

                        <th className="px-5 py-4">
                          Email
                        </th>

                        <th className="px-5 py-4">
                          Status
                        </th>

                        <th className="px-5 py-4">
                          Actions
                        </th>
                      </tr>

                    </thead>

                    <tbody>

                      {instructors.map(
                        (instructor) => (
                          <tr
                            key={
                              instructor._id
                            }
                            className="border-b last:border-0"
                          >

                            <td className="px-5 py-4">

                              <div className="flex items-center gap-3">

                                {instructor.imageUrl ? (
                                  <img
                                    src={
                                      instructor.imageUrl
                                    }
                                    className="h-10 w-10 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                                    {instructor.fullname
                                      ?.charAt(
                                        0
                                      )
                                      ?.toUpperCase()}
                                  </div>
                                )}

                                <div>
                                  <p className="font-medium">
                                    {
                                      instructor.fullname
                                    }
                                  </p>

                                  <p className="text-xs text-gray-500">
                                    @
                                    {
                                      instructor.username
                                    }
                                  </p>
                                </div>

                              </div>

                            </td>

                            <td className="px-5 py-4 text-sm text-gray-600">
                              {
                                instructor.email
                              }
                            </td>

                            <td className="px-5 py-4">

                              <span
                                className={`rounded-full px-3 py-1 text-xs font-medium ${
                                  instructor.isActive
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {instructor.isActive
                                  ? "Active"
                                  : "Inactive"}
                              </span>

                            </td>

                            <td className="px-5 py-4">

                              <div className="flex flex-wrap gap-2">

                                <button
                                  onClick={() =>
                                    openEditModal(
                                      instructor
                                    )
                                  }
                                  className="rounded-lg border px-3 py-2 text-xs font-medium hover:bg-gray-50"
                                >
                                  Edit
                                </button>

                                <button
                                  onClick={() =>
                                    handleToggleStatus(
                                      instructor._id
                                    )
                                  }
                                  className={`rounded-lg px-3 py-2 text-xs font-medium text-white ${
                                    instructor.isActive
                                      ? "bg-red-500 hover:bg-red-600"
                                      : "bg-green-600 hover:bg-green-700"
                                  }`}
                                >
                                  {instructor.isActive
                                    ? "Deactivate"
                                    : "Activate"}
                                </button>

                              </div>

                            </td>

                          </tr>
                        )
                      )}

                    </tbody>

                  </table>

                </div>

                {instructors.length === 0 && (
                  <div className="p-10 text-center text-gray-500">
                    No instructors found.
                  </div>
                )}

              </div>

            </>
          )}


          {/* ================================================= */}
          {/* USERS */}
          {/* ================================================= */}

          {activeTab === "users" && (
            <>

              <div className="mb-6">

                <h2 className="text-2xl font-bold">
                  All Users
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  View all registered users
                </p>

              </div>


              <div className="mb-5">
                <input
                  type="text"
                  placeholder="Search by name, username, email or role..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  className="w-full rounded-lg border bg-white px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>


              <div className="overflow-hidden rounded-xl bg-white shadow-sm">

                <div className="overflow-x-auto">

                  <table className="w-full text-left">

                    <thead className="border-b bg-gray-50 text-sm text-gray-600">

                      <tr>
                        <th className="px-5 py-4">
                          User
                        </th>

                        <th className="px-5 py-4">
                          Email
                        </th>

                        <th className="px-5 py-4">
                          Role
                        </th>

                        <th className="px-5 py-4">
                          Status
                        </th>
                      </tr>

                    </thead>

                    <tbody>

                      {filteredUsers.map(
                        (item) => (
                          <tr
                            key={item._id}
                            className="border-b last:border-0"
                          >

                            <td className="px-5 py-4">

                              <div className="flex items-center gap-3">

                                {item.imageUrl ? (
                                  <img
                                    src={
                                      item.imageUrl
                                    }
                                    className="h-9 w-9 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold">
                                    {item.fullname
                                      ?.charAt(
                                        0
                                      )
                                      ?.toUpperCase()}
                                  </div>
                                )}

                                <div>
                                  <p className="font-medium">
                                    {
                                      item.fullname
                                    }
                                  </p>

                                  <p className="text-xs text-gray-500">
                                    @
                                    {
                                      item.username
                                    }
                                  </p>
                                </div>

                              </div>

                            </td>

                            <td className="px-5 py-4 text-sm text-gray-600">
                              {item.email}
                            </td>

                            <td className="px-5 py-4">

                              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                                {item.role}
                              </span>

                            </td>

                            <td className="px-5 py-4">

                              <span
                                className={`rounded-full px-3 py-1 text-xs font-medium ${
                                  item.isActive &&
                                  !item.deactivated
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {item.isActive &&
                                !item.deactivated
                                  ? "Active"
                                  : "Inactive"}
                              </span>

                            </td>

                          </tr>
                        )
                      )}

                    </tbody>

                  </table>

                </div>

              </div>

            </>
          )}

        </div>

      </main>


      {/* ================================================= */}
      {/* CREATE INSTRUCTOR MODAL */}
      {/* ================================================= */}

      {showCreateModal && (
        <Modal
          title="Create Instructor"
          onClose={() =>
            setShowCreateModal(false)
          }
        >

          <form
            onSubmit={
              handleCreateInstructor
            }
            className="space-y-4"
          >

            <Input
              label="Full Name"
              value={form.fullname}
              onChange={(e) =>
                setForm({
                  ...form,
                  fullname: e.target.value,
                })
              }
            />

            <Input
              label="Username"
              value={form.username}
              onChange={(e) =>
                setForm({
                  ...form,
                  username: e.target.value,
                })
              }
            />

            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
            />

            <Input
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
            />

            <Input
              label="Confirm Password"
              type="password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({
                  ...form,
                  confirmPassword:
                    e.target.value,
                })
              }
            />

            <button
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading
                ? "Creating..."
                : "Create Instructor"}
            </button>

          </form>

        </Modal>
      )}


      {/* ================================================= */}
      {/* EDIT INSTRUCTOR MODAL */}
      {/* ================================================= */}

      {showEditModal && (
        <Modal
          title="Update Instructor"
          onClose={() =>
            setShowEditModal(false)
          }
        >

          <form
            onSubmit={
              handleUpdateInstructor
            }
            className="space-y-4"
          >

            <Input
              label="Full Name"
              value={editForm.fullname}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  fullname: e.target.value,
                })
              }
            />

            <Input
              label="Username"
              value={editForm.username}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  username: e.target.value,
                })
              }
            />

            <Input
              label="Email"
              type="email"
              value={editForm.email}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  email: e.target.value,
                })
              }
            />

            <div className="grid gap-4 md:grid-cols-2">

              <Input
                label="CNIC"
                value={editForm.cnic}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    cnic: e.target.value,
                  })
                }
              />

              <Input
                label="Contact"
                value={
                  editForm.contactno
                }
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    contactno:
                      e.target.value,
                  })
                }
              />

              <Input
                label="District"
                value={
                  editForm.district
                }
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    district:
                      e.target.value,
                  })
                }
              />

              <Input
                label="Tehsil"
                value={editForm.tehsil}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    tehsil:
                      e.target.value,
                  })
                }
              />

            </div>

            <Input
              label="Address"
              value={editForm.address}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  address: e.target.value,
                })
              }
            />

            <div>
              <label className="mb-1 block text-sm font-medium">
                Bio
              </label>

              <textarea
                value={editForm.bio}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    bio: e.target.value,
                  })
                }
                rows={4}
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <button
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading
                ? "Updating..."
                : "Update Instructor"}
            </button>

          </form>

        </Modal>
      )}

    </div>
  );
};


// =====================================================
// SIDEBAR BUTTON
// =====================================================

const SidebarButton = ({
  icon,
  text,
  active,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`mb-2 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
        active
          ? "bg-blue-600 text-white"
          : "text-gray-300 hover:bg-gray-800 hover:text-white"
      }`}
    >
      {icon}
      {text}
    </button>
  );
};


// =====================================================
// STAT CARD
// =====================================================

const StatCard = ({
  title,
  value,
  icon,
}) => {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm text-gray-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            {value}
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
          {icon}
        </div>

      </div>

    </div>
  );
};


// =====================================================
// INPUT
// =====================================================

const Input = ({
  label,
  type = "text",
  value,
  onChange,
}) => {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        required
        className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
      />
    </div>
  );
};


// =====================================================
// MODAL
// =====================================================

const Modal = ({
  title,
  onClose,
  children,
}) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">

      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b px-6 py-4">

          <h2 className="text-xl font-bold">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <X size={20} />
          </button>

        </div>

        <div className="p-6">
          {children}
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
