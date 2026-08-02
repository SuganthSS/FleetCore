import { apiClient } from './api';
import type { PaginatedResponse, ApiResponse } from '@/types/api';
import type { MaintenanceRecord, MaintenanceQueryFilters, CreateMaintenancePayload } from '@/types/maintenance';

export const maintenanceService = {
  getMaintenances: async (
    filters?: MaintenanceQueryFilters
  ): Promise<PaginatedResponse<MaintenanceRecord>> => {
    const { data } = await apiClient.get<PaginatedResponse<MaintenanceRecord>>('/maintenance', {
      params: filters,
    });
    return data;
  },

  getMaintenance: async (id: string): Promise<ApiResponse<MaintenanceRecord>> => {
    const { data } = await apiClient.get<ApiResponse<MaintenanceRecord>>(`/maintenance/${id}`);
    return data;
  },

  createMaintenance: async (
    payload: CreateMaintenancePayload
  ): Promise<ApiResponse<MaintenanceRecord>> => {
    const { data } = await apiClient.post<ApiResponse<MaintenanceRecord>>('/maintenance', payload);
    return data;
  },

  updateMaintenance: async (
    id: string,
    payload: Partial<CreateMaintenancePayload>
  ): Promise<ApiResponse<MaintenanceRecord>> => {
    const { data } = await apiClient.put<ApiResponse<MaintenanceRecord>>(`/maintenance/${id}`, payload);
    return data;
  },

  deleteMaintenance: async (id: string): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.delete<ApiResponse<void>>(`/maintenance/${id}`);
    return data;
  },
};
export default maintenanceService;
