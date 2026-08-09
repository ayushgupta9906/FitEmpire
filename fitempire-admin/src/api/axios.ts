import axios, { AxiosError } from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';

// Use env var VITE_API_BASE_URL in production; fall back to local backend
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor — attach JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fitempire_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401, auto-refresh smoothly without kicking user out
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('fitempire_refresh_token');
        if (!refreshToken) {
          return Promise.reject(error);
        }

        const response = await axios.post(`${BASE_URL}/v1/auth/refresh`, null, {
          headers: { 'X-Refresh-Token': refreshToken },
        });

        if (response.data?.data?.accessToken) {
          const { accessToken, refreshToken: newRefreshToken } = response.data.data;
          localStorage.setItem('fitempire_access_token', accessToken);
          if (newRefreshToken) {
            localStorage.setItem('fitempire_refresh_token', newRefreshToken);
          }

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.warn('Silent refresh failed:', refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
