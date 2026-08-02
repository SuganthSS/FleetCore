import { apiClient } from './api';
import type { PaginatedResponse, ApiResponse } from '@/types/api';
import type { Trip, TripQueryFilters, CreateTripPayload } from '@/types/trip';

export const tripService = {
  getTrips: async (
    filters?: TripQueryFilters
  ): Promise<PaginatedResponse<Trip>> => {
    const { data } = await apiClient.get<PaginatedResponse<Trip>>('/trips', {
      params: filters,
    });
    return data;
  },

  getTrip: async (id: string): Promise<ApiResponse<Trip>> => {
    const { data } = await apiClient.get<ApiResponse<Trip>>(`/trips/${id}`);
    return data;
  },

  createTrip: async (payload: CreateTripPayload): Promise<ApiResponse<Trip>> => {
    const { data } = await apiClient.post<ApiResponse<Trip>>('/trips', payload);
    return data;
  },

  updateTrip: async (
    id: string,
    payload: Partial<CreateTripPayload>
  ): Promise<ApiResponse<Trip>> => {
    const { data } = await apiClient.put<ApiResponse<Trip>>(`/trips/${id}`, payload);
    return data;
  },

  deleteTrip: async (id: string): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.delete<ApiResponse<void>>(`/trips/${id}`);
    return data;
  },
};
export default tripService;
