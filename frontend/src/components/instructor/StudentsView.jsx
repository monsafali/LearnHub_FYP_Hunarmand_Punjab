import Icon from "../ui/Icon";
import { StatusBadge } from "./CourseThumb";
import { inputClass } from "../../utils/instructorHelpers";

export const StudentsView = ({
  instructorCourses,
  studentsCourseId,
  loadStudents,
  studentsLoading,
  students,
}) => {
  const studentsCourse = instructorCourses.find(
    (c) => c._id === studentsCourseId,
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 md:flex-row md:items-center">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-900">
            {studentsCourse
              ? studentsCourse.name
              : "Choose a course to see its students"}
          </p>
          <p className="text-sm text-slate-500">
            {studentsCourse && !studentsLoading
              ? `${students.length} ${students.length === 1 ? "student" : "students"} enrolled`
              : "Enrollments are loaded per course"}
          </p>
        </div>

        <select
          value={studentsCourseId}
          onChange={(e) => loadStudents(e.target.value)}
          className={`${inputClass} md:w-72`}
        >
          <option value="">Select a course</option>
          {instructorCourses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.name}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
        {!studentsCourseId ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <Icon name="users" className="h-7 w-7" />
            </div>
            <p className="mt-4 text-sm text-slate-500">
              Pick a course above to see who has enrolled.
            </p>
          </div>
        ) : studentsLoading ? (
          <div className="divide-y divide-slate-100">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="flex animate-pulse items-center gap-4 p-5"
              >
                <div className="h-12 w-12 rounded-full bg-slate-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-40 rounded bg-slate-100" />
                  <div className="h-3 w-56 rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : students.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-slate-500">
            No students are enrolled in this course yet.
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {students.map((enrollment) => {
              const student = enrollment.student;

              return (
                <li
                  key={enrollment._id}
                  className="flex flex-wrap items-center gap-4 p-5 transition hover:bg-slate-50/70"
                >
                  {student?.imageUrl ? (
                    <img
                      src={student.imageUrl}
                      alt={student.fullname}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 font-semibold text-white">
                      {student?.fullname?.charAt(0)?.toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-slate-900">
                      {student?.fullname}
                    </p>
                    <p className="truncate text-sm text-slate-500">
                      @{student?.username}
                    </p>
                  </div>

                  <p className="hidden truncate text-sm text-slate-500 md:block md:w-56">
                    {student?.email}
                  </p>

                  <StatusBadge status={enrollment.status} />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};
