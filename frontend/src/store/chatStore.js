import { create } from "zustand";
import { io } from "socket.io-client";
import { API_BASE_URL } from "../utils/api";

// The REST base URL ends in `/api`; Socket.IO connects to the server origin
// and uses its own `/socket.io` transport path, not an `/api` namespace.
const socketUrl = (() => {
  const configuredUrl = import.meta.env.VITE_BACKEND_URL;
  if (!configuredUrl) return window.location.origin;

  try {
    const url = new URL(configuredUrl, window.location.origin);
    url.pathname = url.pathname.replace(/\/api\/?$/, "") || "/";
    url.search = "";
    url.hash = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return window.location.origin;
  }
})();

const useChatStore = create((set, get) => ({
  courses: [],
  selectedCourse: null,
  messages: [],
  members: [],
  loadingCourses: false,
  loadingChat: false,
  sending: false,
  connected: false,
  error: null,
  socket: null,

  fetchCourses: async () => {
    set({ loadingCourses: true, error: null });
    try {
      const { data } = await API_BASE_URL.get("/chat/courses");
      set({ courses: data.courses || [], loadingCourses: false });
      return data.courses || [];
    } catch (error) {
      set({ loadingCourses: false, error: error.response?.data?.message || "Could not load course chats" });
      return [];
    }
  },

  connect: () => {
    const existing = get().socket;
    if (existing?.connected) return existing;
    existing?.removeAllListeners();
    existing?.disconnect();

    const socket = io(socketUrl, { withCredentials: true, transports: ["websocket", "polling"] });
    socket.on("connect", () => {
      set({ connected: true });
      const courseId = get().selectedCourse?._id;
      if (courseId) socket.emit("chat:join", { courseId });
    });
    socket.on("disconnect", () => set({ connected: false }));
    socket.on("connect_error", (error) => set({ connected: false, error: error.message || "Chat connection failed" }));
    socket.on("chat:message", (message) => {
      set((state) => {
        if (state.messages.some((item) => item._id === message._id)) return state;
        return { messages: [...state.messages, message] };
      });
      get().fetchCourses();
    });
    set({ socket });
    return socket;
  },

  selectCourse: async (course) => {
    const previousCourse = get().selectedCourse;
    if (previousCourse && previousCourse._id !== course?._id) {
      get().socket?.emit("chat:leave", { courseId: previousCourse._id });
    }
    set({ selectedCourse: course, messages: [], members: [], loadingChat: true, error: null });
    const socket = get().connect();
    try {
      const [messagesResponse, membersResponse] = await Promise.all([
        API_BASE_URL.get(`/chat/courses/${course._id}/messages`),
        API_BASE_URL.get(`/chat/courses/${course._id}/members`),
      ]);
      set({
        messages: messagesResponse.data.messages || [],
        members: membersResponse.data.members || [],
        loadingChat: false,
      });
      const join = () => socket.emit("chat:join", { courseId: course._id }, (response) => {
        if (!response?.success) set({ error: response?.message || "Could not join this course chat" });
      });
      if (socket.connected) join();
      else socket.once("connect", join);
    } catch (error) {
      set({ loadingChat: false, error: error.response?.data?.message || "Could not load chat" });
    }
  },

  sendMessage: (content) => new Promise((resolve) => {
    const { socket, selectedCourse } = get();
    const normalized = content.trim();
    if (!normalized || !selectedCourse || !socket?.connected) {
      resolve({ success: false, message: "Connect to a course chat before sending" });
      return;
    }
    set({ sending: true, error: null });
    socket.timeout(10000).emit("chat:send", {
      courseId: selectedCourse._id,
      content: normalized,
    }, (timeoutError, response) => {
      set({ sending: false });
      if (timeoutError || !response?.success) {
        const message = response?.message || "Message could not be sent. Please try again.";
        set({ error: message });
        resolve({ success: false, message });
        return;
      }
      set((state) => state.messages.some((item) => item._id === response.message._id)
        ? state
        : { messages: [...state.messages, response.message] });
      get().fetchCourses();
      resolve({ success: true });
    });
  }),

  disconnect: () => {
    const { socket } = get();
    socket?.removeAllListeners();
    socket?.disconnect();
    set({ socket: null, connected: false, selectedCourse: null, messages: [], members: [] });
  },
}));

export default useChatStore;
