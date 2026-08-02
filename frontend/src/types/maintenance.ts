export type MaintenanceType =
  | 'PREVENTIVE'
  | 'CORRECTIVE'
  | 'INSPECTION'
  | 'EMERGENCY'
  | 'TIRE_SERVICE'
  | 'OIL_CHANGE'
  | 'BRAKE_SERVICE'
  | 'OTHER';

export type MaintenanceStatus =
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'OVERDUE';

export interface MaintenanceRecord {
  id: string;
  maintenanceRecordNumber: string;
  maintenanceType: MaintenanceType;
  status: MaintenanceStatus;
  scheduledDate: string; // ISO date string
  completedDate: string | null; // ISO date string
  serviceProvider: string | null;
  description: string | null;
  cost: number | null; // Represents estimated or actual cost
  odometerReading: number | null;
  nextMaintenanceDate: string | null; // ISO date string
  notes: string | null;
  companyId: string;
  vehicleId: string;
  driverId: string;
  createdAt: string;
  updatedAt: string;
  vehicle?: {
    id: string;
    registrationNumber: string;
    make: string;
    model: string;
    status: string;
  };
  driver?: {
    id: string;
    firstName: string;
    lastName: string;
    licenseNumber: string;
    user?: {
      firstName: string;
      lastName: string;
    };
  };
  company?: {
    id: string;
    name: string;
  };
}

export interface MaintenanceQueryFilters {
  page?: number;
  limit?: number;
  search?: string;
  vehicleId?: string;
  maintenanceType?: MaintenanceType;
  status?: MaintenanceStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateMaintenancePayload {
  vehicleId: string;
  driverId?: string | null;
  maintenanceType: MaintenanceType;
  status: MaintenanceStatus;
  title: string;
  description?: string | null;
  scheduledDate: string; // ISO datetime string
  completedDate?: string | null; // ISO datetime string
  estimatedCost?: number | null;
  actualCost?: number | null;
  serviceProvider?: string | null;
  odometerReading?: number | null;
  nextMaintenanceDate?: string | null; // ISO datetime string
  notes?: string | null;
  companyId: string;
}
