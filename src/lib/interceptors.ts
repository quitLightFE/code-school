import { api } from "./api";
import { tokens } from "./tokens";

let isRefreshing = false;

api.interceptors.request.use((config) => {
  const token = tokens.getAccess();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isRefreshing
    ) {
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refresh = tokens.getRefresh();

        const { data } = await api.post("/auth/refresh/", {
          refresh,
        });

        tokens.set(data.access, refresh!);

        originalRequest.headers.Authorization = `Bearer ${data.access}`;

        return api(originalRequest);
      } catch {
        tokens.clear();

        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);