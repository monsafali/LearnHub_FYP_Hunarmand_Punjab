import { Link } from "react-router-dom";

export const EmptyCoursesState = () => (
  <div className="rounded-xl border bg-white p-12 text-center">
    <h2 className="text-2xl font-bold">No courses yet</h2>

    <p className="mt-3 text-gray-500">
      You haven't enrolled in any courses yet.
    </p>

    <Link
      to="/"
      className="mt-6 inline-block rounded-lg bg-black px-6 py-3 text-white"
    >
      Browse Courses
    </Link>
  </div>
);
