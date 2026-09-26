import { API_BASE_URL } from "../utils/api";
import { create } from "zustand";

const useStudentStore = create((set) => ({
  courses: [],
  enrolledCourses: [],
  selectedCourse: null,
  lessons: [],
  assignments: [],
  assignmentResult: null,

  loading: false,
  assignmentsLoading: false,
  submissionLoading: false,
  resultLoading: false,
  error: null,

  // =====================================================
  // COURSES
  // =====================================================

  getAllCourses: async () => {
    try {
      set({ loading: true, error: null });

      const response = await API_BASE_URL.get("/student/courses");

      set({ courses: response.data.courses || [], loading: false });

      return { success: true, courses: response.data.courses || [] };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to load courses";
      set({ loading: false, error: message });
      return { success: false, message };
    }
  },

  getCourseById: async (courseId) => {
    try {
      set({ loading: true, error: null, selectedCourse: null });

      const response = await API_BASE_URL.get(`/student/courses/${courseId}`);

      set({ selectedCourse: response.data.course, loading: false });

      return { success: true, course: response.data.course };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to load course";
      set({ loading: false, error: message, selectedCourse: null });
      return { success: false, message };
    }
  },

  enrollCourse: async (courseId) => {
    try {
      set({ loading: true, error: null });

      const response = await API_BASE_URL.post(`/student/courses/${courseId}/enroll`);

      set({ loading: false });

      return {
        success: true,
        enrollment: response.data.enrollment,
        message: response.data.message || "Successfully enrolled",
      };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to enroll in course";
      set({ loading: false, error: message });
      return { success: false, message };
    }
  },

  getMyCourses: async () => {
    try {
      set({ loading: true, error: null });

      const response = await API_BASE_URL.get("/student/my-courses");

      set({ enrolledCourses: response.data.enrollments || [], loading: false });

      return { success: true, enrollments: response.data.enrollments || [] };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to load your courses";
      set({ loading: false, error: message });
      return { success: false, message };
    }
  },

  getMyCourseWithLessons: async (courseId) => {
    try {
      set({ loading: true, error: null });

      const response = await API_BASE_URL.get(`/student/my-courses/${courseId}`);

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
      const message = error.response?.data?.message || "Failed to load course";
      set({ loading: false, error: message });
      return { success: false, message };
    }
  },

  clearSelectedCourse: () => {
    set({ selectedCourse: null, lessons: [], assignments: [] });
  },

  // =====================================================
  // ASSIGNMENTS
  // =====================================================

  getMyCourseAssignments: async (courseId) => {
    try {
      set({ assignmentsLoading: true, error: null });

      const response = await API_BASE_URL.get(`/student/course/${courseId}`);

      const assignments = response.data.assignments || [];

      set({ assignments, assignmentsLoading: false });

      return { success: true, assignments };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to load assignments";
      set({ assignmentsLoading: false, error: message });
      return { success: false, message };
    }
  },

  submitAssignment: async (assignmentId, formData) => {
    try {
      set({ submissionLoading: true, error: null });

      const response = await API_BASE_URL.post(
        `/student/${assignmentId}/submit`,
        formData,
      );

      set((state) => ({
        assignments: state.assignments.map((assignment) =>
          assignment._id === assignmentId
            ? { ...assignment, mySubmission: response.data.submission }
            : assignment,
        ),
        submissionLoading: false,
      }));

      return {
        success: true,
        submission: response.data.submission,
        message: response.data.message || "Assignment submitted successfully",
      };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to submit assignment";
      set({ submissionLoading: false, error: message });
      return { success: false, message };
    }
  },

  getMyAssignmentResult: async (assignmentId) => {
    try {
      set({ resultLoading: true, error: null, assignmentResult: null });

      const response = await API_BASE_URL.get(`/student/${assignmentId}/result`);

      set({ assignmentResult: response.data.submission || null, resultLoading: false });

      return { success: true, submission: response.data.submission };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to load result";
      set({ resultLoading: false, error: message, assignmentResult: null });
      return { success: false, message };
    }
  },

  clearAssignmentResult: () => set({ assignmentResult: null }),
}));

export default useStudentStore;
