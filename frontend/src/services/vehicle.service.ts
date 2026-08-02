import apiClient from './api';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type {
  Vehicle,
  VehicleQueryFilters,
  CreateVehiclePayload,
  UpdateVehiclePayload,
} from '@/types/vehicle';

export const vehicleService = {
  getVehicles: async (filters?: VehicleQueryFilters): Promise<PaginatedResponse<Vehicle>> => {
    const { data } = await apiClient.get<PaginatedResponse<Vehicle>>('/vehicles', {
      params: filters,
    });
    return data;
  },

  getVehicle: async (id: string): Promise<ApiResponse<Vehicle>> => {
    const { data } = await apiClient.get<ApiResponse<Vehicle>>(`/vehicles/${id}`);
    return data;
  },

  createVehicle: async (payload: CreateVehiclePayload): Promise<ApiResponse<Vehicle>> => {
    const { data } = await apiClient.post<ApiResponse<Vehicle>>('/vehicles', payload);
    return data;
  },

  updateVehicle: async (id: string, payload: UpdateVehiclePayload): Promise<ApiResponse<Vehicle>> => {
    const { data } = await apiClient.put<ApiResponse<Vehicle>>(`/vehicles/${id}`, payload);
    return data;
  },

  deleteVehicle: async (id: string): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.delete<ApiResponse<void>>(`/vehicles/${id}`);
    return data;
  },
};
export default vehicleService;
