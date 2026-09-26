import { useNavigate } from "react-router-dom";

import { useMyCourses } from "../../hooks/student/useMyCourses";
import { EnrolledCourseCard } from "../../components/student/EnrolledCourseCard";
import { EmptyCoursesState } from "../../components/student/EmptyCoursesState";

const StudentLMS = () => {
  const navigate = useNavigate();
  const { enrolledCourses, loading } = useMyCourses();

  const goToCourse = (courseId) => navigate(`/student/lms/course/${courseId}`);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <main className="flex-1">
        <section className="bg-white px-6 py-10">
          <div className="mx-auto max-w-7xl">
            <h1 className="text-3xl font-bold">Student LMS</h1>
            <p className="mt-2 text-gray-600">Continue learning from your enrolled courses.</p>
          </div>
        </section>

        <section className="px-6 py-10">
          <div className="mx-auto max-w-7xl">
            {loading && <div className="py-20 text-center">Loading your courses...</div>}

            {!loading && enrolledCourses.length === 0 && <EmptyCoursesState />}

            {!loading && enrolledCourses.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {enrolledCourses.map((enrollment) => (
                  <EnrolledCourseCard
                    key={enrollment._id}
                    enrollment={enrollment}
                    onContinue={goToCourse}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default StudentLMS;
