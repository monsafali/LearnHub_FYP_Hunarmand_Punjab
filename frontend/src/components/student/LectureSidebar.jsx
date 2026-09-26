import { CheckCircle, Clock, Play, Video } from "lucide-react";
import { formatDuration } from "../../utils/studentHelpers";

export const LectureSidebar = ({
  lessons,
  selectedLesson,
  onSelect,
  sidebarOpen,
}) => (
  <aside
    className={`w-full border-b bg-white lg:sticky lg:top-0 lg:h-[calc(100vh-145px)] lg:w-[350px] lg:flex-shrink-0 lg:overflow-y-auto lg:border-b-0 lg:border-r ${
      sidebarOpen ? "block" : "hidden lg:block"
    }`}
  >
    <div className="border-b px-5 py-4">
      <h2 className="font-semibold text-gray-900">Course Content</h2>
      <p className="mt-1 text-sm text-gray-500">
        {lessons.length} {lessons.length === 1 ? "lecture" : "lectures"}
      </p>
    </div>

    {lessons.length === 0 ? (
      <div className="px-5 py-10 text-center">
        <Video size={40} className="mx-auto mb-3 text-gray-300" />
        <p className="font-medium text-gray-700">No lectures available</p>
        <p className="mt-1 text-sm text-gray-500">
          Your instructor has not published any lectures yet.
        </p>
      </div>
    ) : (
      <div>
        {lessons.map((lesson, index) => {
          const isSelected = selectedLesson?._id === lesson._id;

          return (
            <button
              key={lesson._id}
              onClick={() => onSelect(lesson)}
              className={`flex w-full items-start gap-3 border-b px-4 py-4 text-left transition ${
                isSelected
                  ? "border-l-4 border-l-blue-600 bg-blue-50"
                  : "border-l-4 border-l-transparent hover:bg-gray-50"
              }`}
            >
              <div
                className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${
                  isSelected
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {isSelected ? (
                  <Play size={15} fill="currentColor" />
                ) : (
                  <span className="text-sm font-semibold">{index + 1}</span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p
                  className={`line-clamp-2 text-sm font-medium ${
                    isSelected ? "text-blue-700" : "text-gray-800"
                  }`}
                >
                  {lesson.title}
                </p>

                <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                  {lesson.duration > 0 && (
                    <span className="flex items-center gap-1">
                      <Clock size={13} />
                      {formatDuration(lesson.duration)}
                    </span>
                  )}

                  {isSelected && (
                    <span className="font-medium text-blue-600">Playing</span>
                  )}
                </div>
              </div>

              {isSelected && (
                <CheckCircle
                  size={18}
                  className="flex-shrink-0 text-blue-600"
                />
              )}
            </button>
          );
        })}
      </div>
    )}
  </aside>
);
