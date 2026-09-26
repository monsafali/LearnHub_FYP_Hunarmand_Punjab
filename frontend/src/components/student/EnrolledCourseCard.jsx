export const EnrolledCourseCard = ({ enrollment, onContinue }) => {
  const course = enrollment.course;
  if (!course) return null;

  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <img
        src={course.imageUrl}
        alt={course.name}
        className="h-48 w-full object-cover"
      />

      <div className="p-5">
        <p className="text-sm text-blue-600">{course.category}</p>

        <h2 className="mt-2 text-xl font-bold">{course.name}</h2>

        <p className="mt-2 text-sm text-gray-600">{course.description}</p>

        {course.trainer && (
          <div className="mt-4">
            <p className="text-sm text-gray-500">Instructor</p>
            <p className="font-semibold">{course.trainer.fullname}</p>
          </div>
        )}

        <div className="mt-5">
          <div className="mb-2 flex justify-between text-sm">
            <span>Progress</span>
            <span>{enrollment.progress}%</span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-black"
              style={{ width: `${enrollment.progress}%` }}
            />
          </div>
        </div>

        <button
          onClick={() => onContinue(course._id)}
          className="mt-6 w-full rounded-lg bg-black px-4 py-3 font-medium text-white hover:bg-gray-800"
        >
          Continue Learning
        </button>
      </div>
    </div>
  );
};
