import apiClient from './api';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type {
  Driver,
  DriverQueryFilters,
  CreateDriverPayload,
  UpdateDriverPayload,
} from '@/types/driver';

export const driverService = {
  getDrivers: async (filters?: DriverQueryFilters): Promise<PaginatedResponse<Driver>> => {
    const { data } = await apiClient.get<PaginatedResponse<Driver>>('/drivers', {
      params: filters,
    });
    return data;
  },

  getDriver: async (id: string): Promise<ApiResponse<Driver>> => {
    const { data } = await apiClient.get<ApiResponse<Driver>>(`/drivers/${id}`);
    return data;
  },

  createDriver: async (payload: CreateDriverPayload): Promise<ApiResponse<Driver>> => {
    const { data } = await apiClient.post<ApiResponse<Driver>>('/drivers', payload);
    return data;
  },

  updateDriver: async (id: string, payload: UpdateDriverPayload): Promise<ApiResponse<Driver>> => {
    const { data } = await apiClient.put<ApiResponse<Driver>>(`/drivers/${id}`, payload);
    return data;
  },

  deleteDriver: async (id: string): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.delete<ApiResponse<void>>(`/drivers/${id}`);
    return data;
  },
};

export default driverService;
