import { apiClient } from './api';
import type { PaginatedResponse, ApiResponse } from '@/types/api';
import type { FuelRecord, FuelRecordQueryFilters, CreateFuelRecordPayload } from '@/types/fuel';

export const fuelService = {
  getFuelRecords: async (
    filters?: FuelRecordQueryFilters
  ): Promise<PaginatedResponse<FuelRecord>> => {
    const { data } = await apiClient.get<PaginatedResponse<FuelRecord>>('/fuel', {
      params: filters,
    });
    return data;
  },

  getFuelRecord: async (id: string): Promise<ApiResponse<FuelRecord>> => {
    const { data } = await apiClient.get<ApiResponse<FuelRecord>>(`/fuel/${id}`);
    return data;
  },

  createFuelRecord: async (
    payload: CreateFuelRecordPayload
  ): Promise<ApiResponse<FuelRecord>> => {
    const { data } = await apiClient.post<ApiResponse<FuelRecord>>('/fuel', payload);
    return data;
  },

  updateFuelRecord: async (
    id: string,
    payload: Partial<CreateFuelRecordPayload>
  ): Promise<ApiResponse<FuelRecord>> => {
    const { data } = await apiClient.put<ApiResponse<FuelRecord>>(`/fuel/${id}`, payload);
    return data;
  },

  deleteFuelRecord: async (id: string): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.delete<ApiResponse<void>>(`/fuel/${id}`);
    return data;
  },
};
export default fuelService;
