export interface TrackingRecord {
  id: string;
  latitude: number;
  longitude: number;
  speed: number | null;
  heading: number | null;
  altitude: number | null;
  accuracy: number | null;
  recordedAt: string; // ISO date string
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postalCode: string | null;
  companyId: string;
  vehicleId: string;
  driverId: string | null;
  tripId: string;
  createdAt: string;
  updatedAt?: string;
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
    vehicleId: string;
    driverId: string;
  };
  driver?: {
    id: string;
    firstName: string;
    lastName: string;
    licenseNumber: string;
  } | null;
  company?: {
    id: string;
    name: string;
  };
}

export interface TrackingQueryFilters {
  page?: number;
  limit?: number;
  search?: string;
  tripId?: string;
  vehicleId?: string;
  driverId?: string;
  companyId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateTrackingPayload {
  vehicleId: string;
  driverId?: string | null;
  tripId: string;
  latitude: number;
  longitude: number;
  speed?: number | null;
  heading?: number | null;
  altitude?: number | null;
  accuracy?: number | null;
  recordedAt: string; // ISO date string
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postalCode?: string | null;
  companyId: string;
}
