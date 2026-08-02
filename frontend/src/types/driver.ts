export type ExperienceLevel = 'JUNIOR' | 'MID' | 'SENIOR' | 'EXPERT';

export type DriverAvailability = 'AVAILABLE' | 'ON_TRIP' | 'OFF_DUTY' | 'ON_LEAVE' | 'SUSPENDED';

export interface DriverUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  avatarUrl?: string | null;
}

export interface DriverCompany {
  id: string;
  name: string;
}

export interface Driver {
  id: string;
  employeeId: string;
  experienceLevel: ExperienceLevel;
  availability: DriverAvailability;
  licenseNumber: string;
  licenseExpiry: string; // ISO date string
  joiningDate: string | null; // ISO date string
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  userId: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  user?: DriverUser;
  company?: DriverCompany;
}

export interface DriverQueryFilters {
  page?: number;
  limit?: number;
  search?: string;
  availability?: DriverAvailability;
  experienceLevel?: ExperienceLevel;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateDriverPayload {
  employeeId: string;
  userId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string | null;
  experienceLevel: ExperienceLevel;
  availability: DriverAvailability;
  licenseNumber: string;
  licenseExpiry: string; // ISO date format (YYYY-MM-DD)
  joiningDate?: string | null; // ISO date format (YYYY-MM-DD)
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
  companyId: string;
}

export type UpdateDriverPayload = Partial<CreateDriverPayload>;
