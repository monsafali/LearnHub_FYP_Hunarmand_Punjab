import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

import useAuthStore from "../../store/authStore";
import useInstructorStore from "../../store/instructorStore";

const InstructorDashboard = () => {
  const user = useAuthStore((state) => state.user);

  const {
    courses,
    students,
    loading,
    getCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    createLesson,
    getEnrolledStudents,
  } = useInstructorStore();

  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [showEditCourse, setShowEditCourse] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [showStudentsModal, setShowStudentsModal] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState(null);

  // =========================
  // COURSE FORM
  // =========================
  const [courseForm, setCourseForm] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
  });

  const [courseImage, setCourseImage] = useState(null);

  // =========================
  // LESSON FORM
  // =========================
  const [lessonForm, setLessonForm] = useState({
    title: "",
    description: "",
    duration: "",
    order: "",
  });

  const [lessonVideo, setLessonVideo] = useState(null);

  // =========================
  // FETCH COURSES
  // =========================
  useEffect(() => {
    getCourses();
  }, [getCourses]);

  // =========================
  // ONLY CURRENT INSTRUCTOR COURSES
  // =========================
  const instructorCourses = useMemo(() => {
    if (!user) return [];

    return courses.filter((course) => {
      const trainerId =
        typeof course.trainer === "object"
          ? course.trainer?._id
          : course.trainer;

      return trainerId === user._id;
    });
  }, [courses, user]);

  // =========================
  // COURSE INPUT
  // =========================
  const handleCourseChange = (e) => {
    const { name, value } = e.target;

    setCourseForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // LESSON INPUT
  // =========================
  const handleLessonChange = (e) => {
    const { name, value } = e.target;

    setLessonForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // CREATE COURSE
  // =========================
  const handleCreateCourse = async (e) => {
    e.preventDefault();

    if (!courseImage) {
      toast.error("Please select course image");
      return;
    }

    const data = new FormData();

    data.append("name", courseForm.name);
    data.append("category", courseForm.category);
    data.append("description", courseForm.description);
    data.append("price", courseForm.price);
    data.append("image", courseImage);

    const result = await createCourse(data);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message || "Course created successfully");

    setCourseForm({
      name: "",
      category: "",
      description: "",
      price: "",
    });

    setCourseImage(null);
    setShowCreateCourse(false);
  };

  // =========================
  // OPEN EDIT
  // =========================
  const openEditCourse = (course) => {
    setSelectedCourse(course);

    setCourseForm({
      name: course.name || "",
      category: course.category || "",
      description: course.description || "",
      price: course.price || "",
    });

    setShowEditCourse(true);
  };

  // =========================
  // UPDATE COURSE
  // =========================
  const handleUpdateCourse = async (e) => {
    e.preventDefault();

    if (!selectedCourse) return;

    const result = await updateCourse(selectedCourse._id, {
      name: courseForm.name,
      category: courseForm.category,
      description: courseForm.description,
      price: Number(courseForm.price),
    });

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message || "Course updated successfully");

    setShowEditCourse(false);
    setSelectedCourse(null);
  };

  // =========================
  // DELETE COURSE
  // =========================
  const handleDeleteCourse = async (course) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${course.name}"?`,
    );

    if (!confirmed) return;

    const result = await deleteCourse(course._id);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message || "Course deleted successfully");
  };

  // =========================
  // OPEN LESSON MODAL
  // =========================
  const openLessonModal = (course) => {
    setSelectedCourse(course);

    setLessonForm({
      title: "",
      description: "",
      duration: "",
      order: "",
    });

    setLessonVideo(null);

    setShowLessonModal(true);
  };

  // =========================
  // CREATE LESSON
  // =========================

  const handleCreateLesson = async (e) => {
    e.preventDefault();

    if (!selectedCourse) {
      toast.error("Please select a course");
      return;
    }

    if (!lessonForm.video) {
      toast.error("Please select a video");
      return;
    }

    const formData = new FormData();

    formData.append("title", lessonForm.title);

    formData.append("description", lessonForm.description);

    formData.append("duration", lessonForm.duration);

    formData.append("order", lessonForm.order);

    formData.append("video", lessonForm.video);

    const result = await createLesson(selectedCourse._id, formData);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);

    // Close modal
    setShowLessonModal(false);

    // Reset form
    setLessonForm({
      title: "",
      description: "",
      duration: "",
      order: "",
      video: null,
    });
  };

  // =========================
  // OPEN STUDENTS
  // =========================
  const openStudents = async (course) => {
    setSelectedCourse(course);

    const result = await getEnrolledStudents(course._id);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    setShowStudentsModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* ================= HEADER ================= */}
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Instructor Dashboard
            </h1>

            <p className="mt-1 text-gray-500">Welcome, {user?.fullname}</p>
          </div>

          <button
            onClick={() => setShowCreateCourse(true)}
            className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
          >
            + Create Course
          </button>
        </div>

        {/* ================= STATS ================= */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Total Courses</p>

            <h2 className="mt-2 text-3xl font-bold">
              {instructorCourses.length}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Instructor</p>

            <h2 className="mt-2 text-xl font-bold">{user?.fullname}</h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Role</p>

            <h2 className="mt-2 text-xl font-bold">{user?.role}</h2>
          </div>
        </div>

        {/* ================= COURSES ================= */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">My Courses</h2>

            <button
              onClick={getCourses}
              className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-100"
            >
              Refresh
            </button>
          </div>

          {loading && instructorCourses.length === 0 ? (
            <div className="rounded-xl bg-white p-10 text-center">
              Loading courses...
            </div>
          ) : instructorCourses.length === 0 ? (
            <div className="rounded-xl bg-white p-10 text-center">
              <h3 className="text-lg font-semibold">No courses yet</h3>

              <p className="mt-2 text-gray-500">
                Create your first course to get started.
              </p>

              <button
                onClick={() => setShowCreateCourse(true)}
                className="mt-5 rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
              >
                Create Course
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {instructorCourses.map((course) => (
                <div
                  key={course._id}
                  className="overflow-hidden rounded-xl bg-white shadow-sm"
                >
                  {/* IMAGE */}
                  <img
                    src={course.imageUrl}
                    alt={course.name}
                    className="h-48 w-full object-cover"
                  />

                  <div className="p-5">
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <h3 className="text-xl font-bold">{course.name}</h3>

                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                        {course.category}
                      </span>
                    </div>

                    <p className="line-clamp-3 text-sm text-gray-600">
                      {course.description}
                    </p>

                    <p className="mt-3 text-lg font-bold">Rs. {course.price}</p>

                    {/* ACTIONS */}
                    <div className="mt-5 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => openEditCourse(course)}
                        className="rounded-lg bg-yellow-500 px-3 py-2 text-sm font-medium text-white hover:bg-yellow-600"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDeleteCourse(course)}
                        className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                      >
                        Delete
                      </button>

                      <button
                        onClick={() => openLessonModal(course)}
                        className="rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
                      >
                        + Lesson
                      </button>

                      <button
                        onClick={() => openStudents(course)}
                        className="rounded-lg bg-purple-600 px-3 py-2 text-sm font-medium text-white hover:bg-purple-700"
                      >
                        Students
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ================================================= */}
        {/* CREATE COURSE MODAL */}
        {/* ================================================= */}

        {showCreateCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Create Course</h2>

                <button
                  onClick={() => setShowCreateCourse(false)}
                  className="text-2xl text-gray-500"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleCreateCourse} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Course name"
                  value={courseForm.name}
                  onChange={handleCourseChange}
                  required
                  className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                />

                <input
                  type="text"
                  name="category"
                  placeholder="Category"
                  value={courseForm.category}
                  onChange={handleCourseChange}
                  required
                  className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                />

                <textarea
                  name="description"
                  placeholder="Course description"
                  value={courseForm.description}
                  onChange={handleCourseChange}
                  required
                  rows="5"
                  className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                />

                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={courseForm.price}
                  onChange={handleCourseChange}
                  min="0"
                  required
                  className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                />

                <div>
                  <label className="mb-2 block font-medium">Course Image</label>

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={(e) =>
                      setCourseImage(e.target.files?.[0] || null)
                    }
                    required
                    className="w-full rounded-lg border p-3"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create Course"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ================================================= */}
        {/* EDIT COURSE MODAL */}
        {/* ================================================= */}

        {showEditCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg rounded-xl bg-white p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Edit Course</h2>

                <button
                  onClick={() => setShowEditCourse(false)}
                  className="text-2xl text-gray-500"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleUpdateCourse} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Course name"
                  value={courseForm.name}
                  onChange={handleCourseChange}
                  required
                  className="w-full rounded-lg border p-3"
                />

                <input
                  type="text"
                  name="category"
                  placeholder="Category"
                  value={courseForm.category}
                  onChange={handleCourseChange}
                  required
                  className="w-full rounded-lg border p-3"
                />

                <textarea
                  name="description"
                  placeholder="Course description"
                  value={courseForm.description}
                  onChange={handleCourseChange}
                  required
                  rows="5"
                  className="w-full rounded-lg border p-3"
                />

                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={courseForm.price}
                  onChange={handleCourseChange}
                  min="0"
                  required
                  className="w-full rounded-lg border p-3"
                />

                <p className="text-sm text-gray-500">
                  Course image cannot currently be changed from the update API.
                </p>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-blue-600 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Update Course"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ================================================= */}
        {/* CREATE LESSON MODAL */}
        {/* ================================================= */}

        {showLessonModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6">
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Add Lesson</h2>

                  <button
                    onClick={() => setShowLessonModal(false)}
                    className="text-2xl text-gray-500"
                  >
                    ×
                  </button>
                </div>

                <p className="mt-1 text-sm text-gray-500">
                  Course: {selectedCourse?.name}
                </p>
              </div>

              <form onSubmit={handleCreateLesson} className="space-y-4">
                <input
                  type="text"
                  name="title"
                  placeholder="Lesson title"
                  value={lessonForm.title}
                  onChange={handleLessonChange}
                  required
                  className="w-full rounded-lg border p-3"
                />

                <textarea
                  name="description"
                  placeholder="Lesson description"
                  value={lessonForm.description}
                  onChange={handleLessonChange}
                  rows="4"
                  className="w-full rounded-lg border p-3"
                />

                <input
                  type="number"
                  name="duration"
                  placeholder="Duration in minutes"
                  value={lessonForm.duration}
                  onChange={handleLessonChange}
                  min="0"
                  className="w-full rounded-lg border p-3"
                />

                <input
                  type="number"
                  name="order"
                  placeholder="Lesson order"
                  value={lessonForm.order}
                  onChange={handleLessonChange}
                  min="0"
                  className="w-full rounded-lg border p-3"
                />

                <div>
                  <label className="mb-2 block font-medium">Lesson Video</label>

                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) =>
                      setLessonForm({
                        ...lessonForm,
                        video: e.target.files?.[0] || null,
                      })
                    }
                     className="w-full rounded-lg border p-3"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-green-600 py-3 font-medium text-white hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? "Uploading..." : "Create Lesson"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ================================================= */}
        {/* STUDENTS MODAL */}
        {/* ================================================= */}

        {showStudentsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Enrolled Students</h2>

                  <p className="text-sm text-gray-500">
                    {selectedCourse?.name}
                  </p>
                </div>

                <button
                  onClick={() => setShowStudentsModal(false)}
                  className="text-2xl text-gray-500"
                >
                  ×
                </button>
              </div>

              {students.length === 0 ? (
                <div className="rounded-lg bg-gray-50 p-8 text-center">
                  No students enrolled in this course.
                </div>
              ) : (
                <div className="space-y-3">
                  {students.map((enrollment) => {
                    const student = enrollment.student;

                    return (
                      <div
                        key={enrollment._id}
                        className="flex items-center gap-4 rounded-lg border p-4"
                      >
                        {student?.imageUrl ? (
                          <img
                            src={student.imageUrl}
                            alt={student.fullname}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                            {student?.fullname?.charAt(0).toUpperCase()}
                          </div>
                        )}

                        <div className="flex-1">
                          <h3 className="font-semibold">{student?.fullname}</h3>

                          <p className="text-sm text-gray-500">
                            @{student?.username}
                          </p>

                          <p className="text-sm text-gray-500">
                            {student?.email}
                          </p>
                        </div>

                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                          {enrollment.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorDashboard;
