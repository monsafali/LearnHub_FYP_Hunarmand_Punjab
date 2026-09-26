import { create } from "zustand";
import { API_BASE_URL } from "../utils/api";

const useInstructorStore = create((set) => ({
  courses: [],
  students: [],
  assignments: [],
  submissions: [],
  analytics: null,

  loading: false,
  assignmentsLoading: false,
  submissionsLoading: false,
  error: null,

  // =====================================================
  // COURSES
  // =====================================================

  getCourses: async () => {
    try {
      set({ loading: true, error: null });

      const response = await API_BASE_URL.get("/course/getCourse");
      const courses = response.data?.courses || [];

      set({ courses, loading: false });

      return { success: true, courses };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to load courses";
      set({ loading: false, error: message });
      return { success: false, message };
    }
  },

  getAnalytics: async () => {
    try {
      set({ loading: true, error: null });

      const response = await API_BASE_URL.get("/course/analytics");

      set({ analytics: response.data?.analytics || null, loading: false });

      return { success: true, analytics: response.data?.analytics };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to load analytics";
      set({ loading: false, error: message });
      return { success: false, message };
    }
  },

  createCourse: async (formData) => {
    try {
      set({ loading: true, error: null });

      const response = await API_BASE_URL.post(
        "/course/createCourse",
        formData,
      );

      set((state) => ({
        courses: [response.data.course, ...state.courses],
        loading: false,
      }));

      return {
        success: true,
        course: response.data.course,
        message: response.data?.message || "Course created successfully",
      };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to create course";
      set({ loading: false, error: message });
      return { success: false, message };
    }
  },

  updateCourse: async (id, data) => {
    try {
      set({ loading: true, error: null });

      const response = await API_BASE_URL.put(
        `/course/updateCourse/${id}`,
        data,
      );

      set((state) => ({
        courses: state.courses.map((course) =>
          course._id === id ? response.data.course : course,
        ),
        loading: false,
      }));

      return {
        success: true,
        course: response.data.course,
        message: response.data?.message || "Course updated successfully",
      };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update course";
      set({ loading: false, error: message });
      return { success: false, message };
    }
  },

  deleteCourse: async (id) => {
    try {
      set({ loading: true, error: null });

      const response = await API_BASE_URL.delete(`/course/deleteCourse/${id}`);

      set((state) => ({
        courses: state.courses.filter((course) => course._id !== id),
        loading: false,
      }));

      return {
        success: true,
        message: response.data?.message || "Course deleted successfully",
      };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to delete course";
      set({ loading: false, error: message });
      return { success: false, message };
    }
  },

  // =====================================================
  // LESSONS
  // =====================================================

  createLesson: async (courseId, formData) => {
    try {
      set({ loading: true, error: null });

      const response = await API_BASE_URL.post(
        `/course/${courseId}/lessons`,
        formData,
      );

      set({ loading: false });

      return {
        success: true,
        lesson: response.data.lesson,
        message: response.data?.message || "Lesson created successfully",
      };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to create lesson";
      set({ loading: false, error: message });
      return { success: false, message };
    }
  },

  getCourseLessons: async (courseId) => {
    try {
      const response = await API_BASE_URL.get(`/course/${courseId}/lessons`);
      const lessons = response.data?.lessons || [];
      return { success: true, lessons };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to load lessons";
      return { success: false, message };
    }
  },

  // =====================================================
  // STUDENTS
  // =====================================================

  getEnrolledStudents: async (courseId) => {
    try {
      set({ loading: true, error: null });

      const response = await API_BASE_URL.get(
        `/course/EntrolledStudents?courseId=${courseId}`,
      );

      const students =
        response.data?.students || response.data?.enrollments || [];

      set({ students, loading: false });

      return { success: true, students };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to load students";
      set({ loading: false, error: message });
      return { success: false, message };
    }
  },

  // =====================================================
  // ASSIGNMENTS
  // =====================================================

  getInstructorAssignments: async (courseId) => {
    try {
      set({ assignmentsLoading: true, error: null });

      const response = await API_BASE_URL.get(
        `/course/instructor/course/${courseId}/assignments`,
      );

      const assignments = response.data?.assignments || [];

      set({ assignments, assignmentsLoading: false });

      return { success: true, assignments };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to load assignments";
      set({ assignmentsLoading: false, error: message });
      return { success: false, message };
    }
  },

  createAssignment: async (courseId, formData) => {
    try {
      set({ assignmentsLoading: true, error: null });

      const response = await API_BASE_URL.post(
        `/course/${courseId}/assignments`,
        formData,
      );

      set((state) => ({
        assignments: [response.data.assignment, ...state.assignments],
        assignmentsLoading: false,
      }));

      return {
        success: true,
        assignment: response.data.assignment,
        message: response.data?.message || "Assignment created successfully",
      };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to create assignment";
      set({ assignmentsLoading: false, error: message });
      return { success: false, message };
    }
  },

  getAssignmentSubmissions: async (assignmentId) => {
    try {
      set({ submissionsLoading: true, error: null });

      const response = await API_BASE_URL.get(
        `/course/assignments/${assignmentId}/submissions`,
      );

      const submissions = response.data?.submissions || [];

      set({ submissions, submissionsLoading: false });

      return {
        success: true,
        submissions,
        assignment: response.data?.assignment,
        totalSubmissions: response.data?.totalSubmissions,
      };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to load submissions";
      set({ submissionsLoading: false, error: message });
      return { success: false, message };
    }
  },

  gradeAssignment: async (submissionId, data) => {
    try {
      set({ submissionsLoading: true, error: null });

      const response = await API_BASE_URL.put(
        `/course/submission/${submissionId}/grade`,
        data,
      );

      set((state) => ({
        submissions: state.submissions.map((submission) =>
          submission._id === submissionId
            ? response.data.submission
            : submission,
        ),
        submissionsLoading: false,
      }));

      return {
        success: true,
        submission: response.data.submission,
        message: response.data?.message || "Assignment graded successfully",
      };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to grade assignment";
      set({ submissionsLoading: false, error: message });
      return { success: false, message };
    }
  },
}));

export default useInstructorStore;
