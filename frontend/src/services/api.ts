import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
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

/* ── Custom interface for internal config with retry flag ── */
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

/* ── Response interceptor: handle 401 auto-refresh & error normalization ── */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<{ message?: string; errors?: string[] }>) => {
    const originalRequest = error.config as CustomAxiosRequestConfig | undefined;

    if (error.response && error.response.status === 401 && originalRequest && !originalRequest._retry) {
      // Do not attempt refresh on login or refresh endpoint failures
      const isAuthEndpoint = originalRequest.url?.includes('/auth/login') || originalRequest.url?.includes('/auth/refresh');

      if (!isAuthEndpoint) {
        originalRequest._retry = true;
        const refreshToken = localStorage.getItem('refreshToken');

        if (refreshToken) {
          try {
            const { data } = await axios.post<{
              success: boolean;
              data: { accessToken: string; refreshToken: string };
            }>(`${BASE_URL}/auth/refresh`, { refreshToken });

            if (data.success && data.data?.accessToken) {
              const newAccessToken = data.data.accessToken;
              const newRefreshToken = data.data.refreshToken;

              localStorage.setItem('accessToken', newAccessToken);
              if (newRefreshToken) {
                localStorage.setItem('refreshToken', newRefreshToken);
              }

              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              }

              return apiClient(originalRequest);
            }
          } catch (refreshErr) {
            // Refresh token failed/expired -> force full logout
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('authUser');
            if (!window.location.pathname.includes('/login')) {
              window.location.href = '/login';
            }
            return Promise.reject(refreshErr);
          }
        }
      }
    }

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
