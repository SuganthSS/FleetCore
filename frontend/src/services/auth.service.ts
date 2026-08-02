import apiClient from './api';
import type { LoginRequest, LoginResponse, RefreshTokenResponse } from '@/types/auth';

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const { data } = await apiClient.post<LoginResponse>('/auth/login', credentials);
    return data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  refresh: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const { data } = await apiClient.post<RefreshTokenResponse>('/auth/refresh', {
      refreshToken,
    });
    return data;
  },
};
