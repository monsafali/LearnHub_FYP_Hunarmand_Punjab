import { create } from "zustand";
import { API_BASE_URL } from "../utils/api";





const useInstructorStore = create((set) => ({
  courses: [],
  students: [],
  analytics: null,

  loading: false,
  error: null,

  // =====================================================
  // GET COURSES
  // =====================================================

  getCourses: async () => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response = await API_BASE_URL.get(
        "/course/getCourse",
      );

      const courses = response.data?.courses || [];

      set({
        courses,
        loading: false,
      });

      return {
        success: true,
        courses,
      };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to load courses";

      set({
        loading: false,
        error: message,
      });

      return {
        success: false,
        message,
      };
    }
  },

  // =====================================================
  // GET ANALYTICS
  // =====================================================

  getAnalytics: async () => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response = await API_BASE_URL.get(
        "/course/analytics",
      );

      set({
        analytics: response.data?.analytics || null,
        loading: false,
      });

      return {
        success: true,
        analytics: response.data?.analytics,
      };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to load analytics";

      set({
        loading: false,
        error: message,
      });

      return {
        success: false,
        message,
      };
    }
  },

  // =====================================================
  // CREATE COURSE
  // =====================================================

  createCourse: async (formData) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response = await API_BASE_URL.post(
        "/course/createCourse",
        formData,
      );

      set((state) => ({
        courses: [
          response.data.course,
          ...state.courses,
        ],
        loading: false,
      }));

      return {
        success: true,
        course: response.data.course,
        message:
          response.data?.message ||
          "Course created successfully",
      };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to create course";

      set({
        loading: false,
        error: message,
      });

      return {
        success: false,
        message,
      };
    }
  },

  // =====================================================
  // UPDATE COURSE
  // =====================================================

  updateCourse: async (id, data) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response = await API_BASE_URL.put(
        `/course/updateCourse/${id}`,
        data,
      );

      set((state) => ({
        courses: state.courses.map((course) =>
          course._id === id
            ? response.data.course
            : course,
        ),

        loading: false,
      }));

      return {
        success: true,
        course: response.data.course,
        message:
          response.data?.message ||
          "Course updated successfully",
      };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to update course";

      set({
        loading: false,
        error: message,
      });

      return {
        success: false,
        message,
      };
    }
  },

  // =====================================================
  // DELETE COURSE
  // =====================================================

  deleteCourse: async (id) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response = await API_BASE_URL.delete(
        `/course/deleteCourse/${id}`,
      );

      set((state) => ({
        courses: state.courses.filter(
          (course) => course._id !== id,
        ),
        loading: false,
      }));

      return {
        success: true,
        message:
          response.data?.message ||
          "Course deleted successfully",
      };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to delete course";

      set({
        loading: false,
        error: message,
      });

      return {
        success: false,
        message,
      };
    }
  },

  // =====================================================
  // CREATE LESSON
  // =====================================================

  createLesson: async (courseId, formData) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response = await API_BASE_URL.post(
        `/course/${courseId}/lessons`,
        formData,
      );

      set({
        loading: false,
      });

      return {
        success: true,
        lesson: response.data.lesson,
        message:
          response.data?.message ||
          "Lesson created successfully",
      };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to create lesson";

      set({
        loading: false,
        error: message,
      });

      return {
        success: false,
        message,
      };
    }
  },

  // =====================================================
  // GET ENROLLED STUDENTS
  // =====================================================

  getEnrolledStudents: async (courseId) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response =
        await API_BASE_URL.get(
          `/course/EntrolledStudents?courseId=${courseId}`,
        );

      const students =
        response.data?.students ||
        response.data?.enrollments ||
        [];

      set({
        students,
        loading: false,
      });

      return {
        success: true,
        students,
      };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to load students";

      set({
        loading: false,
        error: message,
      });

      return {
        success: false,
        message,
      };
    }
  },
}));

export default useInstructorStore;
