import { apiClient } from './api';
import type { PaginatedResponse, ApiResponse } from '@/types/api';
import type { Shipment, ShipmentQueryFilters, CreateShipmentPayload } from '@/types/shipment';

export const shipmentService = {
  getShipments: async (
    filters?: ShipmentQueryFilters
  ): Promise<PaginatedResponse<Shipment>> => {
    const { data } = await apiClient.get<PaginatedResponse<Shipment>>('/shipments', {
      params: filters,
    });
    return data;
  },

  getShipment: async (id: string): Promise<ApiResponse<Shipment>> => {
    const { data } = await apiClient.get<ApiResponse<Shipment>>(`/shipments/${id}`);
    return data;
  },

  createShipment: async (payload: CreateShipmentPayload): Promise<ApiResponse<Shipment>> => {
    const { data } = await apiClient.post<ApiResponse<Shipment>>('/shipments', payload);
    return data;
  },

  updateShipment: async (
    id: string,
    payload: Partial<CreateShipmentPayload>
  ): Promise<ApiResponse<Shipment>> => {
    const { data } = await apiClient.put<ApiResponse<Shipment>>(`/shipments/${id}`, payload);
    return data;
  },

  deleteShipment: async (id: string): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.delete<ApiResponse<void>>(`/shipments/${id}`);
    return data;
  },
};
export default shipmentService;
