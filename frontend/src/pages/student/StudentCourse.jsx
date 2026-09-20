import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  Play,
  Video,
} from "lucide-react";
import toast from "react-hot-toast";

import useStudentStore from "../../store/studentStore";

const StudentCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const {
    selectedCourse,
    lessons,
    loading,
    error,
    getMyCourseWithLessons,
  } = useStudentStore();

  const [selectedLesson, setSelectedLesson] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!courseId) return;

    const loadCourse = async () => {
      const result = await getMyCourseWithLessons(courseId);

      if (!result.success) {
        toast.error(result.message);
        navigate("/student/lms");
      }
    };

    loadCourse();
  }, [courseId, getMyCourseWithLessons, navigate]);

  // Select first lesson automatically
  useEffect(() => {
    if (lessons.length > 0 && !selectedLesson) {
      setSelectedLesson(lessons[0]);
    }
  }, [lessons, selectedLesson]);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

          <p className="text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error && !selectedCourse) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="text-center">
          <p className="mb-4 text-red-500">{error}</p>

          <button
            onClick={() => navigate("/student/lms")}
            className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
          >
            Back to LMS
          </button>
        </div>
      </div>
    );
  }

  if (!selectedCourse) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Course Header */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5">
          <button
            onClick={() => navigate("/student/lms")}
            className="mb-3 flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
          >
            <ArrowLeft size={18} />
            Back to My Courses
          </button>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {selectedCourse.name}
              </h1>

              <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <BookOpen size={16} />
                  {lessons.length} Lectures
                </span>

                {selectedCourse.trainer && (
                  <span>
                    Instructor:{" "}
                    <span className="font-medium text-gray-700">
                      {selectedCourse.trainer.fullname}
                    </span>
                  </span>
                )}
              </div>
            </div>

            {/* Mobile sidebar toggle */}
            <button
              onClick={() => setSidebarOpen((prev) => !prev)}
              className="flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50 lg:hidden"
            >
              {sidebarOpen ? (
                <>
                  <ChevronDown size={18} />
                  Hide Lectures
                </>
              ) : (
                <>
                  <ChevronRight size={18} />
                  Show Lectures
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Learning Area */}
      <div className="mx-auto flex max-w-7xl flex-col lg:flex-row">
        {/* LEFT - Lecture Sidebar */}
        <aside
          className={`w-full border-b bg-white lg:sticky lg:top-0 lg:h-[calc(100vh-145px)] lg:w-[350px] lg:flex-shrink-0 lg:overflow-y-auto lg:border-b-0 lg:border-r ${
            sidebarOpen ? "block" : "hidden lg:block"
          }`}
        >
          <div className="border-b px-5 py-4">
            <h2 className="font-semibold text-gray-900">Course Content</h2>

            <p className="mt-1 text-sm text-gray-500">
              {lessons.length}{" "}
              {lessons.length === 1 ? "lecture" : "lectures"}
            </p>
          </div>

          {lessons.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <Video
                size={40}
                className="mx-auto mb-3 text-gray-300"
              />

              <p className="font-medium text-gray-700">
                No lectures available
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Your instructor has not published any lectures yet.
              </p>
            </div>
          ) : (
            <div>
              {lessons.map((lesson, index) => {
                const isSelected =
                  selectedLesson?._id === lesson._id;

                return (
                  <button
                    key={lesson._id}
                    onClick={() => {
                      setSelectedLesson(lesson);

                      // On mobile close sidebar after selecting
                      if (window.innerWidth < 1024) {
                        setSidebarOpen(false);
                      }
                    }}
                    className={`flex w-full items-start gap-3 border-b px-4 py-4 text-left transition ${
                      isSelected
                        ? "border-l-4 border-l-blue-600 bg-blue-50"
                        : "border-l-4 border-l-transparent hover:bg-gray-50"
                    }`}
                  >
                    {/* Lecture number / play icon */}
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
                        <span className="text-sm font-semibold">
                          {index + 1}
                        </span>
                      )}
                    </div>

                    {/* Lecture info */}
                    <div className="min-w-0 flex-1">
                      <p
                        className={`line-clamp-2 text-sm font-medium ${
                          isSelected
                            ? "text-blue-700"
                            : "text-gray-800"
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
                          <span className="font-medium text-blue-600">
                            Playing
                          </span>
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

        {/* RIGHT - Video Area */}
        <main className="min-w-0 flex-1">
          {selectedLesson ? (
            <div>
              {/* Video */}
              <div className="bg-black">
                <div className="mx-auto aspect-video max-h-[700px] w-full">
                  <video
                    key={selectedLesson._id}
                    className="h-full w-full object-contain"
                    controls
                    playsInline
                    src={selectedLesson.videoUrl}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>

              {/* Lecture Information */}
              <div className="bg-white">
                <div className="mx-auto max-w-5xl px-5 py-7 md:px-8">
                  <div className="mb-6">
                    <p className="mb-2 text-sm font-medium text-blue-600">
                      Lecture{" "}
                      {lessons.findIndex(
                        (lesson) =>
                          lesson._id === selectedLesson._id
                      ) + 1}
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedLesson.title}
                    </h2>
                  </div>

                  {selectedLesson.description && (
                    <div>
                      <h3 className="mb-2 text-lg font-semibold text-gray-900">
                        About this lecture
                      </h3>

                      <p className="whitespace-pre-line leading-7 text-gray-600">
                        {selectedLesson.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* No lesson selected */
            <div className="flex min-h-[500px] items-center justify-center bg-gray-50 px-5">
              <div className="text-center">
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
                  <Play
                    size={35}
                    className="text-blue-600"
                    fill="currentColor"
                  />
                </div>

                <h2 className="text-xl font-semibold text-gray-900">
                  Select a lecture
                </h2>

                <p className="mt-2 text-gray-500">
                  Select a lecture from the course content to start
                  learning.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const formatDuration = (seconds) => {
  const totalSeconds = Number(seconds) || 0;

  if (totalSeconds < 60) {
    return `${totalSeconds}s`;
  }

  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  if (remainingSeconds === 0) {
    return `${minutes}m`;
  }

  return `${minutes}m ${remainingSeconds}s`;
};

export default StudentCourse;
