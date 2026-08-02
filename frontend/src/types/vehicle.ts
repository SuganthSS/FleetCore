export type VehicleType = 'TRUCK' | 'VAN' | 'TRAILER' | 'BUS' | 'CAR' | 'SPECIALIZED';

export type FuelType = 'DIESEL' | 'PETROL' | 'ELECTRIC' | 'HYBRID' | 'CNG' | 'LPG';

export type VehicleStatus = 'AVAILABLE' | 'ON_TRIP' | 'MAINTENANCE' | 'OUT_OF_SERVICE' | 'DECOMMISSIONED';

export interface Vehicle {
  id: string;
  registrationNumber: string;
  vin: string;
  make: string;
  model: string;
  manufacturingYear: number;
  vehicleType: VehicleType;
  fuelType: FuelType;
  capacity: number | null;
  status: VehicleStatus;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  company?: {
    id: string;
    name: string;
  };
}

export interface VehicleQueryFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: VehicleStatus;
  vehicleType?: VehicleType;
  fuelType?: FuelType;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateVehiclePayload {
  registrationNumber: string;
  vin: string;
  make: string;
  model: string;
  manufacturingYear: number;
  vehicleType: VehicleType;
  fuelType: FuelType;
  capacity?: number | null;
  status?: VehicleStatus;
  companyId: string;
}

export type UpdateVehiclePayload = Partial<CreateVehiclePayload>;
