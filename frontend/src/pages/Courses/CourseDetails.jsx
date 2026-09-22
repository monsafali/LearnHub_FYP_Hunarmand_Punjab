
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import useAuthStore from "../../store/authStore";
import useStudentStore from "../../store/studentStore";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = useAuthStore(
    (state) => state.user
  );

  const course = useStudentStore(
    (state) => state.selectedCourse
  );

  const loading = useStudentStore(
    (state) => state.loading
  );

  const error = useStudentStore(
    (state) => state.error
  );

  const getCourseById = useStudentStore(
    (state) => state.getCourseById
  );

  const enrollCourse = useStudentStore(
    (state) => state.enrollCourse
  );

  const clearSelectedCourse = useStudentStore(
    (state) => state.clearSelectedCourse
  );

  // =====================================================
  // LOAD COURSE
  // =====================================================

  useEffect(() => {
    if (id) {
      getCourseById(id);
    }

    return () => {
      clearSelectedCourse();
    };
  }, [
    id,
    getCourseById,
    clearSelectedCourse,
  ]);

  // =====================================================
  // ENROLL
  // =====================================================

  const handleEnroll = async () => {
    if (!course) return;

    // Not logged in
    if (!user) {
      toast.error(
        "Please login as a student to enroll"
      );

      navigate("/login");
      return;
    }

    // Not student
    if (user.role !== "Student") {
      toast.error(
        "Only students can enroll in courses"
      );

      return;
    }

    const result = await enrollCourse(
      course._id
    );

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(
      result.message ||
        "Successfully enrolled"
    );

    navigate("/student/lms");
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        <Navbar />

        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">

            <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

            <p className="text-lg text-gray-500">
              Loading course...
            </p>

          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // =====================================================
  // ERROR / COURSE NOT FOUND
  // =====================================================

  if (error || !course) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        <Navbar />

        <main className="flex flex-1 items-center justify-center px-6">
          <div className="w-full max-w-lg rounded-2xl border bg-white p-10 text-center shadow-sm">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-2xl">
              !
            </div>

            <h2 className="mt-5 text-2xl font-bold">
              Course Not Found
            </h2>

            <p className="mt-2 text-gray-500">
              {error ||
                "The course you are looking for does not exist."}
            </p>

            <button
              onClick={() => navigate("/")}
              className="mt-6 rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
            >
              Back to Courses
            </button>

          </div>
        </main>

        <Footer />
      </div>
    );
  }

  const trainer = course.trainer;

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">

      <Navbar />

      {/* ================================================= */}
      {/* COURSE HEADER */}
      {/* ================================================= */}

      <section className="bg-gray-950 px-6 py-14 text-white">

        <div className="mx-auto max-w-7xl">

          {/* Breadcrumb */}

          <button
            onClick={() => navigate("/")}
            className="mb-8 text-sm text-gray-400 transition hover:text-white"
          >
            ← Back to all courses
          </button>

          <div className="grid items-center gap-10 lg:grid-cols-2">

            {/* Course Info */}

            <div>

              <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium">
                {course.category}
              </span>

              <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl">
                {course.name}
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-300">
                {course.description}
              </p>

              {/* Trainer Small Info */}

              {trainer && (
                <div className="mt-8 flex items-center gap-4">

                  {trainer.imageUrl ? (
                    <img
                      src={trainer.imageUrl}
                      alt={trainer.fullname}
                      className="h-12 w-12 rounded-full border-2 border-white/20 object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-lg font-bold">
                      {trainer.fullname?.charAt(
                        0
                      )}
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-gray-400">
                      Created by
                    </p>

                    <p className="font-semibold">
                      {trainer.fullname}
                    </p>
                  </div>

                </div>
              )}

            </div>

            {/* Course Image */}

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl">

              <img
                src={
                  course.imageUrl ||
                  "https://via.placeholder.com/800x450?text=Course"
                }
                alt={course.name}
                className="h-full max-h-[420px] w-full object-cover"
              />

            </div>

          </div>
        </div>

      </section>

      {/* ================================================= */}
      {/* COURSE CONTENT */}
      {/* ================================================= */}

      <main className="flex-1 px-6 py-14">

        <div className="mx-auto max-w-7xl">

          <div className="grid gap-8 lg:grid-cols-3">

            {/* ================================================= */}
            {/* LEFT - COURSE INFORMATION */}
            {/* ================================================= */}

            <div className="space-y-8 lg:col-span-2">

              {/* About Course */}

              <section className="rounded-2xl border bg-white p-7 shadow-sm">

                <h2 className="text-2xl font-bold">
                  About This Course
                </h2>

                <p className="mt-5 whitespace-pre-line leading-8 text-gray-600">
                  {course.description}
                </p>

              </section>

              {/* Course Information */}

              <section className="rounded-2xl border bg-white p-7 shadow-sm">

                <h2 className="text-2xl font-bold">
                  Course Information
                </h2>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">

                  <div className="rounded-xl bg-gray-50 p-5">
                    <p className="text-sm text-gray-500">
                      Course Name
                    </p>

                    <p className="mt-1 font-semibold">
                      {course.name}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-5">
                    <p className="text-sm text-gray-500">
                      Category
                    </p>

                    <p className="mt-1 font-semibold">
                      {course.category}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-5">
                    <p className="text-sm text-gray-500">
                      Course Price
                    </p>

                    <p className="mt-1 font-semibold">
                      Rs. {course.price}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-5">
                    <p className="text-sm text-gray-500">
                      Instructor
                    </p>

                    <p className="mt-1 font-semibold">
                      {trainer?.fullname ||
                        "Unknown"}
                    </p>
                  </div>

                </div>

              </section>

              {/* ================================================= */}
              {/* TRAINER INFORMATION */}
              {/* ================================================= */}

              {trainer && (
                <section className="rounded-2xl border bg-white p-7 shadow-sm">

                  <div className="mb-6">
                    <p className="text-sm font-medium text-blue-600">
                      YOUR INSTRUCTOR
                    </p>

                    <h2 className="mt-1 text-2xl font-bold">
                      Meet Your Instructor
                    </h2>
                  </div>

                  <div className="flex flex-col gap-6 sm:flex-row">

                    {/* Trainer Image */}

                    <div className="shrink-0">

                      {trainer.imageUrl ? (
                        <img
                          src={trainer.imageUrl}
                          alt={trainer.fullname}
                          className="h-28 w-28 rounded-2xl object-cover"
                        />
                      ) : (
                        <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-gray-200 text-4xl font-bold text-gray-600">
                          {trainer.fullname?.charAt(
                            0
                          )}
                        </div>
                      )}

                    </div>

                    {/* Trainer Details */}

                    <div className="flex-1">

                      <h3 className="text-2xl font-bold">
                        {trainer.fullname}
                      </h3>

                      {trainer.username && (
                        <p className="mt-1 text-gray-500">
                          @{trainer.username}
                        </p>
                      )}

                      {trainer.email && (
                        <p className="mt-3 text-sm text-gray-600">
                          {trainer.email}
                        </p>
                      )}

                      {trainer.bio && (
                        <p className="mt-4 leading-7 text-gray-600">
                          {trainer.bio}
                        </p>
                      )}

                    </div>

                  </div>

                </section>
              )}

            </div>

            {/* ================================================= */}
            {/* RIGHT - ENROLL CARD */}
            {/* ================================================= */}

            <aside>

              <div className="sticky top-6 overflow-hidden rounded-2xl border bg-white shadow-lg">

                {/* Image */}

                <img
                  src={
                    course.imageUrl ||
                    "https://via.placeholder.com/800x450?text=Course"
                  }
                  alt={course.name}
                  className="h-48 w-full object-cover"
                />

                <div className="p-6">

                  <p className="text-sm text-gray-500">
                    Course Price
                  </p>

                  <p className="mt-1 text-3xl font-bold">
                    Rs. {course.price}
                  </p>

                  <div className="my-6 border-t" />

                  {/* Course Info */}

                  <div className="space-y-4">

                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">
                        Category
                      </span>

                      <span className="font-medium">
                        {course.category}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">
                        Instructor
                      </span>

                      <span className="max-w-[150px] truncate font-medium">
                        {trainer?.fullname ||
                          "Unknown"}
                      </span>
                    </div>

                  </div>

                  {/* Enroll */}

                  <button
                    onClick={handleEnroll}
                    className="mt-7 w-full rounded-xl bg-black px-6 py-3.5 font-semibold text-white transition hover:bg-gray-800"
                  >
                    Enroll Now
                  </button>

                  <p className="mt-4 text-center text-xs text-gray-500">
                    Enroll now to start learning this
                    course.
                  </p>

                </div>
              </div>

            </aside>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
};

export default CourseDetails;

