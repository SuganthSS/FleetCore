import { apiClient } from './api';
import type { PaginatedResponse, ApiResponse } from '@/types/api';
import type { Route, RouteQueryFilters, CreateRoutePayload } from '@/types/route';

export const routeService = {
  getRoutes: async (
    filters?: RouteQueryFilters
  ): Promise<PaginatedResponse<Route>> => {
    const { data } = await apiClient.get<PaginatedResponse<Route>>('/routes', {
      params: filters,
    });
    return data;
  },

  getRoute: async (id: string): Promise<ApiResponse<Route>> => {
    const { data } = await apiClient.get<ApiResponse<Route>>(`/routes/${id}`);
    return data;
  },

  createRoute: async (payload: CreateRoutePayload): Promise<ApiResponse<Route>> => {
    const { data } = await apiClient.post<ApiResponse<Route>>('/routes', payload);
    return data;
  },

  updateRoute: async (
    id: string,
    payload: Partial<CreateRoutePayload>
  ): Promise<ApiResponse<Route>> => {
    const { data } = await apiClient.put<ApiResponse<Route>>(`/routes/${id}`, payload);
    return data;
  },

  deleteRoute: async (id: string): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.delete<ApiResponse<void>>(`/routes/${id}`);
    return data;
  },
};
export default routeService;
