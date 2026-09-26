import { ArrowLeft, BookOpen, ChevronDown, ChevronRight } from "lucide-react";

export const CourseHeader = ({
  course,
  lectureCount,
  sidebarOpen,
  onToggleSidebar,
  onBack,
}) => (
  <div className="border-b bg-white">
    <div className="mx-auto max-w-7xl px-4 py-5">
      <button
        onClick={onBack}
        className="mb-3 flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
      >
        <ArrowLeft size={18} />
        Back to My Courses
      </button>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{course.name}</h1>

          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <BookOpen size={16} />
              {lectureCount} Lectures
            </span>

            {course.trainer && (
              <span>
                Instructor:{" "}
                <span className="font-medium text-gray-700">
                  {course.trainer.fullname}
                </span>
              </span>
            )}
          </div>
        </div>

        <button
          onClick={onToggleSidebar}
          className="flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50 lg:hidden"
        >
          {sidebarOpen ? (
            <>
              <ChevronDown size={18} />
              Hide Panel
            </>
          ) : (
            <>
              <ChevronRight size={18} />
              Show Panel
            </>
          )}
        </button>
      </div>
    </div>
  </div>
);
