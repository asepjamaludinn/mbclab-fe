import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  withCredentials: true,
});

const PUBLIC_ENDPOINTS = [
  "/assistant-profiles/public",
  "/practicum-modules/public",
];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const requestUrl = originalRequest?.url || "";

    const isPublicRequest = PUBLIC_ENDPOINTS.some((endpoint) =>
      requestUrl.includes(endpoint),
    );

    if (isPublicRequest) {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/login" &&
      originalRequest.url !== "/auth/refresh"
    ) {
      originalRequest._retry = true;

      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/auth/refresh`,
          {},
          { withCredentials: true },
        );

        return api(originalRequest);
      } catch (refreshError) {
        window.location.href = "/login/student";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
