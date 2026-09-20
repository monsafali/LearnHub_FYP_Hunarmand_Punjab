

import { API_BASE_URL } from "../utils/api";

import { create } from "zustand";


const useStudentStore = create((set) => ({
  courses: [],

  enrolledCourses: [],

  selectedCourse: null,

  lessons: [],

  loading: false,

  error: null,


  // =====================================================
  // GET ALL PUBLIC COURSES
  // =====================================================

  getAllCourses: async () => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response =
        await API_BASE_URL.get(
          "/student/courses"
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
  // ENROLL
  // =====================================================

  enrollCourse: async (
    courseId
  ) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response =
        await API_BASE_URL.post(
          `/student/courses/${courseId}/enroll`
        );

      set({
        loading: false,
      });

      return {
        success: true,

        enrollment:
          response.data.enrollment,

        message:
          response.data.message ||
          "Successfully enrolled",
      };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to enroll in course";

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
  // GET MY COURSES
  // =====================================================

  getMyCourses: async () => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response =
        await API_BASE_URL.get(
          "/student/my-courses"
        );

      set({
        enrolledCourses:
          response.data.enrollments ||
          [],

        loading: false,
      });

      return {
        success: true,

        enrollments:
          response.data.enrollments ||
          [],
      };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to load your courses";

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
  // GET COURSE + LESSONS
  // =====================================================

 getMyCourseWithLessons: async (courseId) => {
  try {
    set({ loading: true, error: null });

    const response = await API_BASE_URL.get(
      `/student/my-courses/${courseId}`
    );

    set({
      selectedCourse: response.data.course,
      lessons: response.data.lessons || [],
      loading: false,
    });

    return {
      success: true,
      course: response.data.course,
      lessons: response.data.lessons || [],
    };
  } catch (error) {
    const message =
      error.response?.data?.message ||
      "Failed to load course";

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
  // CLEAR COURSE
  // =====================================================

  clearSelectedCourse: () => {
    set({
      selectedCourse: null,
      lessons: [],
    });
  },
}));

export default useStudentStore;
