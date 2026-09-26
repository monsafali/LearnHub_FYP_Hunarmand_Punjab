import { useState } from "react";
import { toast } from "react-hot-toast";
import useInstructorStore from "../../store/instructorStore";

const emptyLessonForm = { title: "" };

export const useLessonManager = () => {
  const { loading, createLesson } = useInstructorStore();

  const [showLessonModal, setShowLessonModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [lessonForm, setLessonForm] = useState(emptyLessonForm);
  const [lessonVideo, setLessonVideo] = useState(null);

  const handleLessonChange = (e) => {
    const { name, value } = e.target;
    setLessonForm((prev) => ({ ...prev, [name]: value }));
  };

  const openLessonModal = (course) => {
    setSelectedCourse(course);
    setLessonForm(emptyLessonForm);
    setLessonVideo(null);
    setShowLessonModal(true);
  };

  const closeLessonModal = () => setShowLessonModal(false);

  const handleCreateLesson = async (e) => {
    e.preventDefault();

    if (!selectedCourse) {
      toast.error("Please select a course");
      return;
    }

    if (!lessonVideo) {
      toast.error("Please select a video");
      return;
    }

    const formData = new FormData();
    formData.append("title", lessonForm.title);
    formData.append("video", lessonVideo);

    const result = await createLesson(selectedCourse._id, formData);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message || "Lesson created successfully");
    setShowLessonModal(false);
    setLessonForm(emptyLessonForm);
    setLessonVideo(null);
  };

  return {
    loading,
    showLessonModal,
    selectedCourse,
    lessonForm,
    lessonVideo,
    setLessonVideo,
    handleLessonChange,
    openLessonModal,
    closeLessonModal,
    handleCreateLesson,
  };
};
