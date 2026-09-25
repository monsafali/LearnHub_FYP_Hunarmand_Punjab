

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import useAuthStore from "../../store/authStore";
import useStudentStore from "../../store/studentStore";

const Home = () => {
  const navigate = useNavigate();

  const user = useAuthStore(
    (state) => state.user
  );

  const courses = useStudentStore(
    (state) => state.courses
  );

  const loading = useStudentStore(
    (state) => state.loading
  );

  const getAllCourses = useStudentStore(
    (state) => state.getAllCourses
  );

  const enrollCourse = useStudentStore(
    (state) => state.enrollCourse
  );

  // =====================================================
  // LOAD ALL COURSES
  // =====================================================

  useEffect(() => {
    getAllCourses();
  }, [getAllCourses]);

  // =====================================================
  // OPEN COURSE DETAILS
  // =====================================================

  const handleCourseClick = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  // =====================================================
  // ENROLL
  // =====================================================

  const handleEnroll = async (courseId) => {
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

    const result = await enrollCourse(courseId);

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

  return (

<div className="flex min-h-screen flex-col bg-gray-50">
  <Navbar />

  {/* ================================================= */}
  {/* HERO VIDEO */}
  {/* ================================================= */}
 
  <section className="relative min-h-[600px] overflow-hidden bg-black">
    {/* Background Video */}
    <video
      autoPlay
      loop
      muted
      playsInline
      className="absolute inset-0 h-full w-full object-cover "
    >
      <source
        src={new URL( "../../assets/v1.mp4", import.meta.url)}
        type="video/mp4"
      />
    </video>

    {/* Dark Overlay */}
    <div className="absolute inset-0 bg-black/60" />

    {/* Hero Content */}
    <div className="relative z-10 flex min-h-[600px] items-center px-6 py-20">
      <div className="mx-auto w-full max-w-7xl">
        <h1 className="max-w-3xl text-5xl font-bold tracking-tight text-white md:text-6xl">
          Learn New Skills.
          <br />
          Build Your Future.
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-gray-200 md:text-xl">
          Explore courses created by our instructors
          and start learning today.
        </p>

        <div className="mt-8 flex gap-4">
          <button
            onClick={() => {
              document
                .getElementById("all-courses")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="rounded-lg bg-white px-6 py-3 font-semibold text-black transition hover:bg-gray-200"
          >
            Explore Courses
          </button>
        </div>
      </div>
    </div>
  </section>

  {/* ================================================= */}
  {/* ALL COURSES */}
  {/* ================================================= */}

  <section id="all-courses" className="flex-1 px-6 py-16">
    <div className="mx-auto max-w-7xl">

      <div className="mb-10">
        <h2 className="text-3xl font-bold">
          All Courses
        </h2>

        <p className="mt-2 text-gray-600">
          Browse courses from all of our instructors.
        </p>
      </div>

      {/* ================================================= */}
      {/* LOADING */}
      {/* ================================================= */}

      {loading && (
        <div className="py-20 text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

          <p className="text-lg text-gray-500">
            Loading courses...
          </p>
        </div>
      )}

      {/* ================================================= */}
      {/* NO COURSES */}
      {/* ================================================= */}

      {!loading && courses.length === 0 && (
        <div className="rounded-xl border bg-white p-12 text-center">
          <h3 className="text-xl font-semibold">
            No courses available
          </h3>

          <p className="mt-2 text-gray-500">
            Instructors haven't created any courses yet.
          </p>
        </div>
      )}

      {/* ================================================= */}
      {/* COURSES */}
      {/* ================================================= */}

      {!loading && courses.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {courses.map((course) => (
            <div
              key={course._id}
              className="group overflow-hidden rounded-xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >

              {/* COURSE CLICK AREA */}

              <div
                onClick={() =>
                  handleCourseClick(course._id)
                }
                className="cursor-pointer"
              >

                {/* Course Image */}

                <div className="overflow-hidden">
                  <img
                    src={
                      course.imageUrl ||
                      "https://via.placeholder.com/800x450?text=Course"
                    }
                    alt={course.name}
                    className="h-52 w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="p-5">

                  {/* Category */}

                  <p className="text-sm font-medium text-blue-600">
                    {course.category}
                  </p>

                  {/* Name */}

                  <h3 className="mt-2 text-xl font-bold transition group-hover:text-blue-600">
                    {course.name}
                  </h3>

                  {/* Description */}

                  <p className="mt-3 line-clamp-3 text-sm text-gray-600">
                    {course.description}
                  </p>

                  {/* Instructor */}

                  {course.trainer && (
                    <div className="mt-5 flex items-center gap-3">

                      {course.trainer.imageUrl ? (
                        <img
                          src={course.trainer.imageUrl}
                          alt={course.trainer.fullname}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 font-semibold">
                          {course.trainer.fullname?.charAt(0)}
                        </div>
                      )}

                      <div>
                        <p className="text-sm font-semibold">
                          {course.trainer.fullname}
                        </p>

                        <p className="text-xs text-gray-500">
                          Instructor
                        </p>
                      </div>

                    </div>
                  )}
                </div>
              </div>

              {/* PRICE + ENROLL */}

              <div className="flex items-center justify-between border-t px-5 py-4">

                <div>
                  <p className="text-xs text-gray-500">
                    Course Price
                  </p>

                  <p className="text-xl font-bold">
                    Rs. {course.price}
                  </p>
                </div>

                <button
                  onClick={() =>
                    handleEnroll(course._id)
                  }
                  className="rounded-lg bg-black px-5 py-2.5 font-medium text-white transition hover:bg-gray-800"
                >
                  Enroll
                </button>

              </div>
            </div>
          ))}

        </div>
      )}
    </div>
  </section>

  <Footer />
</div>




  );
};

export default Home;

