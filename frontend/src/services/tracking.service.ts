import { apiClient } from './api';
import type { PaginatedResponse, ApiResponse } from '@/types/api';
import type { TrackingRecord, TrackingQueryFilters, CreateTrackingPayload } from '@/types/tracking';

export const trackingService = {
  getTrackingHistory: async (
    filters?: TrackingQueryFilters
  ): Promise<PaginatedResponse<TrackingRecord>> => {
    const { data } = await apiClient.get<PaginatedResponse<TrackingRecord>>('/tracking', {
      params: filters,
    });
    return data;
  },

  getTracking: async (id: string): Promise<ApiResponse<TrackingRecord>> => {
    const { data } = await apiClient.get<ApiResponse<TrackingRecord>>(`/tracking/${id}`);
    return data;
  },

  createTracking: async (
    payload: CreateTrackingPayload
  ): Promise<ApiResponse<TrackingRecord>> => {
    const { data } = await apiClient.post<ApiResponse<TrackingRecord>>('/tracking', payload);
    return data;
  },

  updateTracking: async (
    id: string,
    payload: Partial<CreateTrackingPayload>
  ): Promise<ApiResponse<TrackingRecord>> => {
    const { data } = await apiClient.put<ApiResponse<TrackingRecord>>(`/tracking/${id}`, payload);
    return data;
  },

  deleteTracking: async (id: string): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.delete<ApiResponse<void>>(`/tracking/${id}`);
    return data;
  },
};
export default trackingService;
