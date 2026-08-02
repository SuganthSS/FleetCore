import { apiClient } from './api';
import type { PaginatedResponse, ApiResponse } from '@/types/api';
import type { NotificationRecord, NotificationQueryFilters, CreateNotificationPayload } from '@/types/notification';

export const notificationService = {
  getNotifications: async (
    filters?: NotificationQueryFilters
  ): Promise<PaginatedResponse<NotificationRecord>> => {
    const { data } = await apiClient.get<PaginatedResponse<NotificationRecord>>('/notifications', {
      params: filters,
    });
    return data;
  },

  getNotification: async (id: string): Promise<ApiResponse<NotificationRecord>> => {
    const { data } = await apiClient.get<ApiResponse<NotificationRecord>>(`/notifications/${id}`);
    return data;
  },

  createNotification: async (
    payload: CreateNotificationPayload
  ): Promise<ApiResponse<NotificationRecord>> => {
    const { data } = await apiClient.post<ApiResponse<NotificationRecord>>('/notifications', payload);
    return data;
  },

  updateNotification: async (
    id: string,
    payload: Partial<CreateNotificationPayload>
  ): Promise<ApiResponse<NotificationRecord>> => {
    const { data } = await apiClient.put<ApiResponse<NotificationRecord>>(`/notifications/${id}`, payload);
    return data;
  },

  deleteNotification: async (id: string): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.delete<ApiResponse<void>>(`/notifications/${id}`);
    return data;
  },
};
export default notificationService;
