export const CourseThumb = ({ course, className = "" }) =>
  course.imageUrl ? (
    <img src={course.imageUrl} alt={course.name} className={`object-cover ${className}`} />
  ) : (
    <div
      className={`flex items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-600 text-xl font-semibold text-white ${className}`}
    >
      {course.name?.charAt(0)?.toUpperCase()}
    </div>
  );

export const StatusBadge = ({ status }) => {
  const value = (status || "active").toLowerCase();
  const style =
    value === "completed"
      ? "bg-sky-50 text-sky-700 ring-sky-200"
      : value === "pending"
        ? "bg-amber-50 text-amber-700 ring-amber-200"
        : "bg-emerald-50 text-emerald-700 ring-emerald-200";

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ring-inset ${style}`}>
      {status || "active"}
    </span>
  );
};

export const SubmissionStatusBadge = ({ status }) => {
  const value = (status || "submitted").toLowerCase();
  const style =
    value === "graded"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : value === "late"
        ? "bg-rose-50 text-rose-700 ring-rose-200"
        : "bg-amber-50 text-amber-700 ring-amber-200";

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ring-inset ${style}`}>
      {status || "submitted"}
    </span>
  );
};
