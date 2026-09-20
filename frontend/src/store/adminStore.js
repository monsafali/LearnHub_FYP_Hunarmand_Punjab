import { create } from "zustand";
import { API_BASE_URL } from "../utils/api";

const useAdminStore = create((set) => ({
  analytics: null,

  instructors: [],
  users: [],

  loading: false,
  error: null,

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
        "/admin/analytics"
      );

      set({
        analytics: response.data.analytics,
        loading: false,
      });

      return {
        success: true,
        analytics: response.data.analytics,
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
  // GET INSTRUCTORS
  // =====================================================

  getInstructors: async () => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response = await API_BASE_URL.get(
        "/admin/instructors"
      );

      set({
        instructors: response.data.instructors || [],
        loading: false,
      });

      return {
        success: true,
        instructors:
          response.data.instructors || [],
      };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to load instructors";

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
  // CREATE INSTRUCTOR
  // =====================================================

  createInstructor: async (data) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response =
        await API_BASE_URL.post(
          "/admin/instructors",
          data
        );

      set((state) => ({
        instructors: [
          response.data.instructor,
          ...state.instructors,
        ],
        loading: false,
      }));

      return {
        success: true,
        instructor: response.data.instructor,
        message: response.data.message,
      };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to create instructor";

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
  // UPDATE INSTRUCTOR
  // =====================================================

  updateInstructor: async (id, data) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response =
        await API_BASE_URL.put(
          `/admin/instructors/${id}`,
          data
        );

      set((state) => ({
        instructors: state.instructors.map(
          (instructor) =>
            instructor._id === id
              ? response.data.instructor
              : instructor
        ),

        loading: false,
      }));

      return {
        success: true,
        instructor: response.data.instructor,
        message: response.data.message,
      };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to update instructor";

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
  // TOGGLE INSTRUCTOR STATUS
  // =====================================================

deleteInstructor: async (id) => {
  try {
    set({
      loading: true,
      error: null,
    });

    const response = await API_BASE_URL.delete(
      `/admin/instructor/${id}`
    );

    set((state) => ({
      instructors: state.instructors.filter(
        (instructor) => instructor._id !== id
      ),
      loading: false,
    }));

    return {
      success: true,
      message: response.data.message,
    };
  } catch (error) {
    const message =
      error.response?.data?.message ||
      "Failed to delete instructor";

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
  // GET USERS
  // =====================================================

  getUsers: async () => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response = await API_BASE_URL.get(
        "/admin/users"
      );

      set({
        users: response.data.users || [],
        loading: false,
      });

      return {
        success: true,
        users: response.data.users || [],
      };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to load users";

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

export default useAdminStore;
