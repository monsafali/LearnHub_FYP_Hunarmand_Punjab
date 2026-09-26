import { useState } from "react";
import { toast } from "react-hot-toast";
import useInstructorStore from "../../store/instructorStore";

const emptyCourseForm = { name: "", category: "", description: "", price: "" };

export const useCourseManager = () => {
  const { courses, loading, getCourses, createCourse, updateCourse, deleteCourse } =
    useInstructorStore();

  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [showEditCourse, setShowEditCourse] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseForm, setCourseForm] = useState(emptyCourseForm);
  const [courseImage, setCourseImage] = useState(null);

  const resetCourseForm = () => {
    setCourseForm(emptyCourseForm);
    setCourseImage(null);
  };

  const handleCourseChange = (e) => {
    const { name, value } = e.target;
    setCourseForm((prev) => ({ ...prev, [name]: value }));
  };

  const openCreateCourse = () => {
    resetCourseForm();
    setShowCreateCourse(true);
  };

  const closeCreateCourse = () => setShowCreateCourse(false);

  const handleCreateCourse = async (e) => {
    e.preventDefault();

    if (!courseImage) {
      toast.error("Please select a course image");
      return;
    }

    const data = new FormData();
    data.append("name", courseForm.name);
    data.append("category", courseForm.category);
    data.append("description", courseForm.description);
    data.append("price", courseForm.price);
    data.append("image", courseImage);

    const result = await createCourse(data);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message || "Course created successfully");
    resetCourseForm();
    setShowCreateCourse(false);
  };

  const openEditCourse = (course) => {
    setSelectedCourse(course);
    setCourseForm({
      name: course.name || "",
      category: course.category || "",
      description: course.description || "",
      price: course.price ?? "",
    });
    setShowEditCourse(true);
  };

  const closeEditCourse = () => {
    setShowEditCourse(false);
    setSelectedCourse(null);
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    if (!selectedCourse) return;

    const result = await updateCourse(selectedCourse._id, {
      name: courseForm.name,
      category: courseForm.category,
      description: courseForm.description,
      price: Number(courseForm.price),
    });

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message || "Course updated successfully");
    closeEditCourse();
  };

  const handleDeleteCourse = async (course) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${course.name}"?`);
    if (!confirmed) return;

    const result = await deleteCourse(course._id);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message || "Course deleted successfully");
    return course._id;
  };

  return {
    courses,
    loading,
    getCourses,
    showCreateCourse,
    showEditCourse,
    selectedCourse,
    courseForm,
    courseImage,
    setCourseImage,
    handleCourseChange,
    openCreateCourse,
    closeCreateCourse,
    handleCreateCourse,
    openEditCourse,
    closeEditCourse,
    handleUpdateCourse,
    handleDeleteCourse,
  };
};
