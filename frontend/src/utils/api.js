import axios from "axios";

// Use a same-origin API path by default. Configure an absolute backend URL only
// when the deployment does not provide a reverse proxy for /api.
const apiBaseUrl = import.meta.env.VITE_BACKEND_URL || "/api";

export const API_BASE_URL = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
});


