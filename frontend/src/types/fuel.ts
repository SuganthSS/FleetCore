export interface FuelRecord {
  id: string;
  fuelRecordNumber: string;
  fuelType: string;
  quantity: number;
  pricePerUnit: number;
  totalCost: number;
  odometerReading: number;
  stationName: string;
  stationLocation: string | null; // receiptNumber
  refueledAt: string; // ISO date string
  notes: string | null;
  companyId: string;
  vehicleId: string;
  driverId: string;
  tripId: string | null;
  createdAt: string;
  updatedAt: string;
  vehicle?: {
    id: string;
    registrationNumber: string;
    make: string;
    model: string;
    status: string;
  };
  trip?: {
    id: string;
    tripNumber: string;
    status: string;
  } | null;
  company?: {
    id: string;
    name: string;
  };
}

export interface FuelRecordQueryFilters {
  page?: number;
  limit?: number;
  search?: string;
  vehicleId?: string;
  tripId?: string;
  companyId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateFuelRecordPayload {
  vehicleId: string;
  tripId?: string | null;
  fuelDate: string; // ISO datetime string
  fuelStation: string;
  quantity: number;
  pricePerUnit: number;
  totalCost: number;
  odometerReading: number;
  receiptNumber?: string | null;
  notes?: string | null;
  companyId: string;
}
