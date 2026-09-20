import { create } from "zustand";
import { API_BASE_URL } from "../utils/api";



const useInstructorStore = create((set) => ({
  courses: [],
  students: [],
  lessons: [],

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

      const response =
        await API_BASE_URL.get(
          "/course/getCourse"
        );

      set({
        courses:
          response.data.courses || [],
        loading: false,
      });

      return {
        success: true,
        courses:
          response.data.courses || [],
      };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to fetch courses";

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

      const response =
        await API_BASE_URL.post(
          "/course/createCourse",
          formData
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
        course:
          response.data.course,

        message:
          response.data.message,
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

  updateCourse: async (
    id,
    data
  ) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response =
        await API_BASE_URL.put(
          `/course/updateCourse/${id}`,
          data
        );

      set((state) => ({
        courses:
          state.courses.map(
            (course) =>
              course._id === id
                ? response.data.course
                : course
          ),

        loading: false,
      }));

      return {
        success: true,

        course:
          response.data.course,

        message:
          response.data.message,
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

      const response =
        await API_BASE_URL.delete(
          `/course/deleteCourse/${id}`
        );

      set((state) => ({
        courses:
          state.courses.filter(
            (course) =>
              course._id !== id
          ),

        loading: false,
      }));

      return {
        success: true,

        message:
          response.data.message,
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

  createLesson: async (
    courseId,
    formData
  ) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response =
        await API_BASE_URL.post(
          `/course/${courseId}/lessons`,
          formData
        );

      set((state) => ({
        lessons: [
          response.data.lesson,
          ...state.lessons,
        ],

        loading: false,
      }));

      return {
        success: true,

        lesson:
          response.data.lesson,

        message:
          response.data.message,
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
  // GET LESSONS
  // =====================================================

  getCourseLessons: async (
    courseId
  ) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response =
        await API_BASE_URL.get(
          `/course/${courseId}/lessons`
        );

      set({
        lessons:
          response.data.lessons || [],

        loading: false,
      });

      return {
        success: true,

        lessons:
          response.data.lessons || [],
      };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to fetch lessons";

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
  // PUBLISH LESSON
  // =====================================================

  toggleLessonPublish: async (
    lessonId
  ) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response =
        await API_BASE_URL.patch(
          `/course/lessons/${lessonId}/publish`
        );

      set((state) => ({
        lessons:
          state.lessons.map(
            (lesson) =>
              lesson._id === lessonId
                ? response.data.lesson
                : lesson
          ),

        loading: false,
      }));

      return {
        success: true,

        lesson:
          response.data.lesson,

        message:
          response.data.message,
      };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to update lesson";

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

  getEnrolledStudents: async (
    courseId
  ) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response =
        await API_BASE_URL.get(
          `/course/EntrolledStudents?courseId=${courseId}`
        );

      set({
        students:
          response.data.students || [],

        loading: false,
      });

      return {
        success: true,

        students:
          response.data.students || [],
      };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to fetch enrolled students";

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
