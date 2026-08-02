export interface NotificationRecord {
  id: string;
  title: string;
  message: string;
  type: 'SYSTEM' | 'VEHICLE' | 'DRIVER' | 'TRIP' | 'FUEL' | 'MAINTENANCE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  isRead: boolean;
  readAt: string | null;
  companyId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any> | null;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    department?: string | null;
  };
  company?: {
    id: string;
    name: string;
  };
}

export interface NotificationQueryFilters {
  page?: number;
  limit?: number;
  search?: string;
  userId?: string;
  companyId?: string;
  type?: string;
  priority?: string;
  isRead?: boolean | string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateNotificationPayload {
  userId: string;
  title: string;
  message: string;
  type?: 'SYSTEM' | 'VEHICLE' | 'DRIVER' | 'TRIP' | 'FUEL' | 'MAINTENANCE';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  isRead?: boolean;
  readAt?: string | null;
  metadata?: Record<string, any> | null;
  companyId: string;
}
