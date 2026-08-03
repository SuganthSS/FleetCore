import apiClient from './api';
import type { ApiResponse } from '@/types/api';

export interface UserProfileData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department?: string;
  avatarUrl?: string;
  roleName: string;
  status: string;
  twoFactorEnabled: boolean;
  createdAt: string;
  recentActivity: Array<{
    id: string;
    action: string;
    ipAddress?: string;
    timestamp: string;
  }>;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    emailNotifications: boolean;
    smsNotifications: boolean;
    weeklyDigest: boolean;
  };
}

export interface UpdateProfileInput {
  firstName: string;
  lastName: string;
  phone?: string;
  department?: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export const profileService = {
  getProfile: async (): Promise<ApiResponse<UserProfileData>> => {
    // Reuses auth/me or current user info
    const { data } = await apiClient.get<ApiResponse<UserProfileData>>('/auth/me');
    return data;
  },

  updateProfile: async (input: UpdateProfileInput): Promise<ApiResponse<UserProfileData>> => {
    const { data } = await apiClient.put<ApiResponse<UserProfileData>>('/users/me', input);
    return data;
  },

  changePassword: async (input: ChangePasswordInput): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.patch<ApiResponse<void>>('/users/me/password', input);
    return data;
  },

  toggle2FA: async (enabled: boolean): Promise<ApiResponse<{ twoFactorEnabled: boolean }>> => {
    const { data } = await apiClient.patch<ApiResponse<{ twoFactorEnabled: boolean }>>('/users/me/2fa', { enabled });
    return data;
  },

  uploadAvatar: async (file: File): Promise<ApiResponse<{ avatarUrl: string }>> => {
    const formData = new FormData();
    formData.append('avatar', file);
    const { data } = await apiClient.post<ApiResponse<{ avatarUrl: string }>>('/users/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
};
