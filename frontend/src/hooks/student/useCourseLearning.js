import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useStudentStore from "../../store/studentStore";

export const useCourseLearning = (courseId, onNotFound) => {
  const { selectedCourse, lessons, loading, error, getMyCourseWithLessons } =
    useStudentStore();

  const [selectedLesson, setSelectedLesson] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!courseId) return;

    const loadCourse = async () => {
      const result = await getMyCourseWithLessons(courseId);
      if (!result.success) {
        toast.error(result.message);
        onNotFound?.();
      }
    };

    loadCourse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  useEffect(() => {
    if (lessons.length > 0 && !selectedLesson) {
      setSelectedLesson(lessons[0]);
    }
  }, [lessons, selectedLesson]);

  const selectLesson = (lesson) => {
    setSelectedLesson(lesson);
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return {
    selectedCourse,
    lessons,
    loading,
    error,
    selectedLesson,
    selectLesson,
    sidebarOpen,
    toggleSidebar,
  };
};
