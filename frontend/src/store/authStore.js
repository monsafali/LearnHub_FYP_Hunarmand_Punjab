import { API_BASE_URL } from "../utils/api";


import { create } from "zustand";


const useAuthStore = create((set, get) => ({
  user: null,

  loading: false,
  checkingAuth: true,
  otpLoading: false,

  showOtpModal: false,

  otpPurpose: null,

  otpUsername: "",

  // =========================
  // LOGIN
  // =========================

  login: async (username, password, role) => {
    try {
      set({ loading: true });

      const response = await API_BASE_URL.post(
        "/auth/login",
        {
          username,
          password,
          role,
        }
      );

      set({
        loading: false,
        showOtpModal: true,
        otpPurpose: "login",
        otpUsername: username,
      });

      return {
        success: true,
        message:
          response.data?.message ||
          "OTP sent successfully",
      };
    } catch (error) {
      set({ loading: false });

      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Login failed",
      };
    }
  },

  // =========================
  // SIGNUP
  // =========================

  signup: async (formData) => {
    try {
      set({ loading: true });

      const response = await API_BASE_URL.post(
        "/auth/signup",
        formData
      );

      set({
        loading: false,
        showOtpModal: true,
        otpPurpose: "signup",
        otpUsername: formData.username,
      });

      return {
        success: true,
        message:
          response.data?.message ||
          "OTP sent successfully",
      };
    } catch (error) {
      set({ loading: false });

      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Signup failed",
      };
    }
  },

  // =========================
  // VERIFY OTP
  // =========================

  verifyOtp: async (otp) => {
    try {
      set({ otpLoading: true });

      const username = get().otpUsername;

      const response = await API_BASE_URL.post(
        "/auth/verifyotp",
        {
          username,
          otp,
        }
      );

      set({
        user: response.data.user,
        otpLoading: false,
        showOtpModal: false,
        otpPurpose: null,
        otpUsername: "",
      });

      return {
        success: true,
        user: response.data.user,
        message:
          response.data?.message ||
          "OTP verified successfully",
      };
    } catch (error) {
      set({ otpLoading: false });

      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Invalid OTP",
      };
    }
  },

  // =========================
  // GET ME
  // =========================


checkAuth: async () => {
  try {
    set({ checkingAuth: true });

    console.log("Checking authentication...");

    const response = await API_BASE_URL.get("/auth/Getme");

    console.log("GetMe response:", response.data);

    set({
      user: response.data.user,
      checkingAuth: false,
    });
  } catch (error) {
    console.log(
      "GetMe error:",
      error.response?.data || error.message
    );

    set({
      user: null,
      checkingAuth: false,
    });
  }
},

  // =========================
  // CLOSE OTP MODAL
  // =========================

  closeOtpModal: () => {
    set({
      showOtpModal: false,
      otpPurpose: null,
      otpUsername: "",
    });
  },

  // =========================
  // LOGOUT
  // =========================

  logout: async () => {
    try {
      await API_BASE_URL.post("/auth/logout");
    } catch (error) {
      console.log(
        "Logout error:",
        error.response?.data?.message
      );
    } finally {
      set({
        user: null,
        showOtpModal: false,
        otpPurpose: null,
        otpUsername: "",
      });
    }
  },
}));

export default useAuthStore;
