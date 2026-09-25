import { useEffect } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";




import useStudentStore from "../../store/studentStore";

const StudentLMS = () => {
  const navigate = useNavigate();

  const enrolledCourses =
    useStudentStore(
      (state) =>
        state.enrolledCourses
    );

  const loading =
    useStudentStore(
      (state) => state.loading
    );

  const getMyCourses =
    useStudentStore(
      (state) =>
        state.getMyCourses
    );


  useEffect(() => {
    getMyCourses();
  }, []);




  return (
    <div className="flex min-h-screen flex-col bg-gray-50">


      <main className="flex-1">

        <section className="bg-white px-6 py-10">

          <div className="mx-auto max-w-7xl">

            <h1 className="text-3xl font-bold">
              Student LMS
            </h1>

            <p className="mt-2 text-gray-600">
              Continue learning from your enrolled courses.
            </p>

          </div>

        </section>


        <section className="px-6 py-10">

          <div className="mx-auto max-w-7xl">


            {loading && (
              <div className="py-20 text-center">
                Loading your courses...
              </div>
            )}


            {!loading &&
              enrolledCourses.length === 0 && (
                <div className="rounded-xl border bg-white p-12 text-center">

                  <h2 className="text-2xl font-bold">
                    No courses yet
                  </h2>

                  <p className="mt-3 text-gray-500">
                    You haven't enrolled in any
                    courses yet.
                  </p>

                  <Link
                    to="/"
                    className="mt-6 inline-block rounded-lg bg-black px-6 py-3 text-white"
                  >
                    Browse Courses
                  </Link>

                </div>
              )}


            {!loading &&
              enrolledCourses.length > 0 && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                  {enrolledCourses.map(
                    (enrollment) => {

                      const course =
                        enrollment.course;

                      if (!course) {
                        return null;
                      }

                      return (
                        <div
                          key={
                            enrollment._id
                          }
                          className="overflow-hidden rounded-xl border bg-white shadow-sm"
                        >

                          {/* Image */}

                          <img
                            src={
                              course.imageUrl
                            }
                            alt={
                              course.name
                            }
                            className="h-48 w-full object-cover"
                          />


                          <div className="p-5">

                            <p className="text-sm text-blue-600">
                              {
                                course.category
                              }
                            </p>

                            <h2 className="mt-2 text-xl font-bold">
                              {
                                course.name
                              }
                            </h2>


                            <p className="mt-2 text-sm text-gray-600">
                              {
                                course.description
                              }
                            </p>


                            {/* Instructor */}

                            {course.trainer && (
                              <div className="mt-4">

                                <p className="text-sm text-gray-500">
                                  Instructor
                                </p>

                                <p className="font-semibold">
                                  {
                                    course
                                      .trainer
                                      .fullname
                                  }
                                </p>

                              </div>
                            )}


                            {/* Progress */}

                            <div className="mt-5">

                              <div className="mb-2 flex justify-between text-sm">

                                <span>
                                  Progress
                                </span>

                                <span>
                                  {
                                    enrollment.progress
                                  }
                                  %
                                </span>

                              </div>


                              <div className="h-2 overflow-hidden rounded-full bg-gray-200">

                                <div
                                  className="h-full bg-black"
                                  style={{
                                    width: `${enrollment.progress}%`,
                                  }}
                                />

                              </div>

                            </div>


                            {/* Continue */}

                            <button
                              onClick={() =>
                                navigate(
                                  `/student/lms/course/${course._id}`
                                )
                              }
                              className="mt-6 w-full rounded-lg bg-black px-4 py-3 font-medium text-white hover:bg-gray-800"
                            >
                              Continue Learning
                            </button>

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>
              )}

          </div>

        </section>

      </main>




    </div>
  );
};

export default StudentLMS;
