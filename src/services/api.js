import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
  clearUserData,
} from "./authStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// attaching access token
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthRequest =
      originalRequest.url.includes("/User/login") ||
      originalRequest.url.includes("/User/refresh");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthRequest
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject: reject,
          });
        });
      }

      isRefreshing = true;

      const refreshToken = getRefreshToken();

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/User/refresh`,
          {
            refreshToken,
          },
        );

        const newAccessToken = res.data.accessToken;
        const newRefreshToken = res.data.refreshToken;

        setTokens(newAccessToken, newRefreshToken);

        api.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);

        return api(originalRequest);
      } catch (err) {
        console.error("Token refresh failed:", err);
        processQueue(err, null);

        // logout user
        clearTokens();
        clearUserData();
        window.location.href = "/login";

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // 🌐 GLOBAL OFFLINE DETECTION
    if (!error.response) {
      console.error("Backend server is unreachable.");
      window.dispatchEvent(new CustomEvent("server-offline", { detail: "Server is unreachable" }));
      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);

export default api;
