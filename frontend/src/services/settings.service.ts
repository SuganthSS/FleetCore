import api from './api';
import type { ApiResponse } from '@/types/api';
import type {
  AllSettings,
  CompanyProfile,
  GeneralSettings,
  SecuritySettings,
  NotificationSettings,
  AISettings,
  IntegrationSettings,
} from '@/types/settings';

export const settingsService = {
  // Fetch combined settings
  async getAllSettings(): Promise<AllSettings> {
    const response = await api.get<ApiResponse<AllSettings>>('/settings');
    return response.data.data;
  },

  // Company Profile
  async getCompanyProfile(): Promise<CompanyProfile> {
    const response = await api.get<ApiResponse<CompanyProfile>>('/settings/company');
    return response.data.data;
  },

  async updateCompanyProfile(data: Partial<CompanyProfile>): Promise<CompanyProfile> {
    const response = await api.put<ApiResponse<CompanyProfile>>('/settings/company', data);
    return response.data.data;
  },

  async uploadCompanyLogo(file: File): Promise<{ logoUrl: string }> {
    const formData = new FormData();
    formData.append('logo', file);
    const response = await api.post<ApiResponse<{ logoUrl: string }>>(
      '/settings/company/logo',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data.data;
  },

  async deleteCompanyLogo(): Promise<void> {
    await api.delete('/settings/company/logo');
  },

  // General Settings / Preferences
  async getGeneralSettings(): Promise<GeneralSettings> {
    const response = await api.get<ApiResponse<GeneralSettings>>('/settings/general');
    return response.data.data;
  },

  async updateGeneralSettings(data: Partial<GeneralSettings>): Promise<GeneralSettings> {
    const response = await api.put<ApiResponse<GeneralSettings>>('/settings/general', data);
    return response.data.data;
  },

  // Security Settings
  async getSecuritySettings(): Promise<SecuritySettings> {
    const response = await api.get<ApiResponse<SecuritySettings>>('/settings/security');
    return response.data.data;
  },

  async updateSecuritySettings(data: Partial<SecuritySettings>): Promise<SecuritySettings> {
    const response = await api.put<ApiResponse<SecuritySettings>>('/settings/security', data);
    return response.data.data;
  },

  // Notification Settings
  async getNotificationSettings(): Promise<NotificationSettings> {
    const response = await api.get<ApiResponse<NotificationSettings>>('/settings/notifications');
    return response.data.data;
  },

  async updateNotificationSettings(data: Partial<NotificationSettings>): Promise<NotificationSettings> {
    const response = await api.put<ApiResponse<NotificationSettings>>('/settings/notifications', data);
    return response.data.data;
  },

  // AI Settings
  async getAISettings(): Promise<AISettings> {
    const response = await api.get<ApiResponse<AISettings>>('/settings/ai');
    return response.data.data;
  },

  async updateAISettings(data: Partial<AISettings>): Promise<AISettings> {
    const response = await api.put<ApiResponse<AISettings>>('/settings/ai', data);
    return response.data.data;
  },

  // Integration Settings
  async getIntegrationSettings(): Promise<IntegrationSettings> {
    const response = await api.get<ApiResponse<IntegrationSettings>>('/settings/integrations');
    return response.data.data;
  },

  async updateIntegrationSettings(
    integrationId: string,
    enabled: boolean
  ): Promise<{ integrationId: string; enabled: boolean }> {
    const response = await api.put<ApiResponse<{ integrationId: string; enabled: boolean }>>(
      '/settings/integrations',
      { integrationId, enabled }
    );
    return response.data.data;
  },
};
