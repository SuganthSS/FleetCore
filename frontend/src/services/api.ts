import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
const TIMEOUT_MS = 15000;

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* ── Request interceptor: attach Authorization header ── */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

/* ── Response interceptor: normalize errors ── */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<{ message?: string; errors?: string[] }>) => {
    if (error.response) {
      const status = error.response.status;
      const message =
        error.response.data?.message ||
        error.message ||
        'An unexpected error occurred';

      if (status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('authUser');
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }

      return Promise.reject(new Error(message));
    }

    if (error.request) {
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }

    return Promise.reject(new Error(error.message || 'An unexpected error occurred'));
  }
);

export default apiClient;
