import { apiClient } from './api';
import type { PaginatedResponse, ApiResponse } from '@/types/api';
import type { Customer, CustomerQueryFilters, CreateCustomerPayload } from '@/types/customer';

export const customerService = {
  getCustomers: async (
    filters?: CustomerQueryFilters
  ): Promise<PaginatedResponse<Customer>> => {
    const { data } = await apiClient.get<PaginatedResponse<Customer>>('/customers', {
      params: filters,
    });
    return data;
  },

  getCustomer: async (id: string): Promise<ApiResponse<Customer>> => {
    const { data } = await apiClient.get<ApiResponse<Customer>>(`/customers/${id}`);
    return data;
  },

  createCustomer: async (payload: CreateCustomerPayload): Promise<ApiResponse<Customer>> => {
    const { data } = await apiClient.post<ApiResponse<Customer>>('/customers', payload);
    return data;
  },

  updateCustomer: async (
    id: string,
    payload: Partial<CreateCustomerPayload>
  ): Promise<ApiResponse<Customer>> => {
    const { data } = await apiClient.put<ApiResponse<Customer>>(`/customers/${id}`, payload);
    return data;
  },

  deleteCustomer: async (id: string): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.delete<ApiResponse<void>>(`/customers/${id}`);
    return data;
  },
};
export default customerService;
