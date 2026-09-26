import { API_BASE_URL } from "../utils/api";

// src/store/authStore.js

import { create } from "zustand";

const useAuthStore = create((set, get) => ({
  user: null,

  loading: false,
  checkingAuth: true,

  otpLoading: false,

  showOtpModal: false,
  otpPurpose: null,
  otpUsername: "",

  login: async (username, password, role) => {
    try {
      set({ loading: true });

      const response = await API_BASE_URL.post("/auth/login", {
        username,
        password,
        role,
      });

      set({
        loading: false,
        showOtpModal: true,
        otpPurpose: "login",
        otpUsername: username,
      });

      return {
        success: true,
        message: response.data?.message || "OTP sent successfully",
      };
    } catch (error) {
      set({ loading: false });

      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  },

  signup: async (formData) => {
    try {
      set({ loading: true });

      const response = await API_BASE_URL.post("/auth/signup", formData);

      set({
        loading: false,
        showOtpModal: true,
        otpPurpose: "signup",
        otpUsername: formData.username,
      });

      return {
        success: true,
        message: response.data?.message || "OTP sent successfully",
      };
    } catch (error) {
      set({ loading: false });

      return {
        success: false,
        message: error.response?.data?.message || "Signup failed",
      };
    }
  },

  verifyOtp: async (otp) => {
    try {
      set({ otpLoading: true });

      const username = get().otpUsername;

      const response = await API_BASE_URL.post("/auth/verifyotp", {
        username,
        otp,
      });

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
        message: response.data?.message || "OTP verified successfully",
      };
    } catch (error) {
      set({ otpLoading: false });

      return {
        success: false,
        message: error.response?.data?.message || "Invalid OTP",
      };
    }
  },

  checkAuth: async () => {
    try {
      set({ checkingAuth: true });

      const response = await API_BASE_URL.get("/auth/Getme");

      set({
        user: response.data.user,
        checkingAuth: false,
      });
    } catch (error) {
      console.log(
        "GetMe error:",
        error.response?.data?.message || error.message,
      );

      set({
        user: null,
        checkingAuth: false,
      });
    }
  },

  forgotPassword: async (email) => {
    try {
      set({ loading: true });

      const response = await API_BASE_URL.post("/auth/forgotPassword", {
        email,
      });

      set({ loading: false });

      return {
        success: true,
        message: response.data?.message || "OTP sent to your email",
      };
    } catch (error) {
      set({ loading: false });

      return {
        success: false,
        message: error.response?.data?.message || "Failed to send OTP",
      };
    }
  },

  resetPassword: async ({ email, otp, newPassword, confirmPassword }) => {
    try {
      set({ loading: true });

      const response = await API_BASE_URL.put("/auth/resetPassword", {
        email,
        otp,
        newPassword,
        confirmPassword,
      });

      set({ loading: false });

      return {
        success: true,
        message: response.data?.message || "Password reset successfully",
      };
    } catch (error) {
      set({ loading: false });

      return {
        success: false,
        message: error.response?.data?.message || "Failed to reset password",
      };
    }
  },

  updatePassword: async ({ oldPassword, newPassword }) => {
    try {
      set({ loading: true });

      const response = await API_BASE_URL.put("/auth/updatePassword", {
        oldPassword,
        newPassword,
      });

      set({ loading: false });

      return {
        success: true,
        message: response.data?.message || "Password updated successfully",
      };
    } catch (error) {
      set({ loading: false });

      return {
        success: false,
        message: error.response?.data?.message || "Failed to update password",
      };
    }
  },

  updateProfile: async (formData) => {
    try {
      set({ loading: true });

      const response = await API_BASE_URL.put("/auth/updateProfile", formData);

      set({
        loading: false,
        user: response.data.user,
      });

      return {
        success: true,
        user: response.data.user,
        message: response.data?.message || "Profile updated successfully",
      };
    } catch (error) {
      console.log(
        "Update profile error:",
        error.response?.data || error.message,
      );

      set({ loading: false });

      return {
        success: false,
        message: error.response?.data?.message || "Failed to update profile",
      };
    }
  },

  logout: async () => {
    try {
      await API_BASE_URL.post("/auth/logout");
    } catch (error) {
      console.log("Logout error:", error);
    } finally {
      set({
        user: null,
        showOtpModal: false,
        otpPurpose: null,
        otpUsername: "",
      });
    }
  },

  closeOtpModal: () => {
    set({
      showOtpModal: false,
      otpPurpose: null,
      otpUsername: "",
    });
  },
}));

export default useAuthStore;
