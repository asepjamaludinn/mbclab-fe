import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
  throw new Error("NEXT_PUBLIC_API_URL belum diatur.");
}

export const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

const PUBLIC_ENDPOINTS = [
  "/assistant-profiles/public",
  "/practicum-modules/public",
];

let isRefreshing = false;
let refreshSubscribers: Array<(success: boolean) => void> = [];

function subscribeTokenRefresh(cb: (success: boolean) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(success: boolean) {
  refreshSubscribers.forEach((cb) => cb(success));
  refreshSubscribers = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const requestUrl = originalRequest?.url || "";
    const status = error.response?.status;

    const isPublicRequest = PUBLIC_ENDPOINTS.some((endpoint) =>
      requestUrl.includes(endpoint),
    );

    if (isPublicRequest) {
      return Promise.reject(error);
    }

    if (status === 429) {
      return Promise.reject(error);
    }

    if (
      status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/login" &&
      originalRequest.url !== "/auth/refresh"
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((success) => {
            if (success) {
              resolve(api(originalRequest));
            } else {
              reject(error);
            }
          });
        });
      }

      isRefreshing = true;

      try {
        await axios.post(
          `${apiUrl}/auth/refresh`,
          {},
          { withCredentials: true },
        );

        isRefreshing = false;
        onRefreshed(true);

        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        onRefreshed(false);

        if (typeof window !== "undefined") {
          if (window.location.pathname.startsWith("/admin")) {
            window.location.href = "/login/admin";
          } else {
            window.location.href = "/login/student";
          }
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
