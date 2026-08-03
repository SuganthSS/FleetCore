export type AuditSeverity = 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type AuditStatus = 'SUCCESS' | 'FAILED' | 'WARNING';

export interface AuditLogItem {
  id: string;
  timestamp: string;
  userName: string;
  userEmail: string;
  roleName: string;
  module: string;
  action: string;
  severity: AuditSeverity;
  ipAddress: string;
  device: string;
  status: AuditStatus;
  description: string;
  metadata?: Record<string, unknown>;
}

export interface AuditQueryFilters {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'timestamp' | 'userName' | 'roleName' | 'module' | 'action' | 'severity';
  sortOrder?: 'asc' | 'desc';
  startDate?: string;
  endDate?: string;
  user?: string;
  role?: string;
  module?: string;
  severity?: string;
  action?: string;
  status?: string;
}

export interface AuditMetaResponse {
  modules: string[];
  roles: string[];
  severities: string[];
  actions: string[];
  users: string[];
  totalCount: number;
}
