import { apiClient } from './api';
import type { ApiResponse } from '@/types/api';
import type { AuditLogItem, AuditQueryFilters, AuditMetaResponse } from '@/types/audit';

export const auditService = {
  /**
   * Fetch paginated audit logs with search, sort, and filters.
   */
  async getAuditLogs(filters: AuditQueryFilters = {}) {
    const params = new URLSearchParams();
    if (filters.page) params.append('page', String(filters.page));
    if (filters.limit) params.append('limit', String(filters.limit));
    if (filters.search) params.append('search', filters.search);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.user) params.append('user', filters.user);
    if (filters.role) params.append('role', filters.role);
    if (filters.module) params.append('module', filters.module);
    if (filters.severity) params.append('severity', filters.severity);
    if (filters.action) params.append('action', filters.action);
    if (filters.status) params.append('status', filters.status);

    const { data } = await apiClient.get<ApiResponse<AuditLogItem[]>>('/audit', { params });
    return data;
  },

  /**
   * Fetch single audit log detail entry.
   */
  async getAuditLogById(id: string) {
    const { data } = await apiClient.get<ApiResponse<AuditLogItem>>(`/audit/${id}`);
    return data;
  },

  /**
   * Fetch metadata taxonomy for filter dropdown options.
   */
  async getAuditMeta() {
    const { data } = await apiClient.get<ApiResponse<AuditMetaResponse>>('/audit/meta');
    return data;
  },
};
