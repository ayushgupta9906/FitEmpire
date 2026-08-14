import axios, { AxiosError } from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';

// Normalize base URL so trailing /v1 or / does not produce /v1/v1 duplicates
let rawBase = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://3.109.213.45/api').trim();
if (rawBase.endsWith('/')) rawBase = rawBase.slice(0, -1);
if (rawBase.endsWith('/v1')) rawBase = rawBase.slice(0, -3);

const BASE_URL = rawBase;

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
