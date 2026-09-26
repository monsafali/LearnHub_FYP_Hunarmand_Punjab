import { Play } from "lucide-react";

export const LecturePanel = ({ lesson, lessons }) => {
  if (!lesson) {
    return (
      <div className="flex min-h-[500px] items-center justify-center bg-gray-50 px-5">
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
            <Play size={35} className="text-blue-600" fill="currentColor" />
          </div>

          <h2 className="text-xl font-semibold text-gray-900">
            Select a lecture
          </h2>

          <p className="mt-2 text-gray-500">
            Select a lecture from the course content to start learning.
          </p>
        </div>
      </div>
    );
  }

  const lectureNumber = lessons.findIndex((l) => l._id === lesson._id) + 1;

  return (
    <div>
      <div className="bg-black">
        <div className="mx-auto aspect-video max-h-[700px] w-full">
          <video
            key={lesson._id}
            className="h-full w-full object-contain"
            controls
            playsInline
            src={lesson.videoUrl}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      <div className="bg-white">
        <div className="mx-auto max-w-5xl px-5 py-7 md:px-8">
          <div className="mb-6">
            <p className="mb-2 text-sm font-medium text-blue-600">
              Lecture {lectureNumber}
            </p>
            <h2 className="text-2xl font-bold text-gray-900">{lesson.title}</h2>
          </div>

          {lesson.description && (
            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                About this lecture
              </h3>
              <p className="whitespace-pre-line leading-7 text-gray-600">
                {lesson.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
