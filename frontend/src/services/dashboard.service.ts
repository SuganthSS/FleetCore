import apiClient from './api';
import type { ApiResponse } from '@/types/api';
import type { DashboardOverviewResult } from '@/types/dashboard';

export const dashboardService = {
  getOverview: async (companyId?: string): Promise<ApiResponse<DashboardOverviewResult>> => {
    const { data } = await apiClient.get<ApiResponse<DashboardOverviewResult>>('/dashboard', {
      params: companyId ? { companyId } : undefined,
    });
    return data;
  },
};
