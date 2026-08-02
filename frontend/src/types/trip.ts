export type TripStatus =
  | 'SCHEDULED'
  | 'DISPATCHED'
  | 'IN_TRANSIT'
  | 'PAUSED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'FAILED';

export interface Trip {
  id: string;
  tripNumber: string;
  scheduledStartTime: string | null;
  scheduledEndTime: string | null;
  actualStartTime: string | null;
  actualEndTime: string | null;
  status: TripStatus;
  actualDistance: number | null;
  actualDuration: number | null;
  remarks: string | null;
  shipmentId: string;
  vehicleId: string;
  driverId: string;
  routeId: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  shipment?: {
    id: string;
    shipmentNumber: string;
    title: string;
    status: string;
  };
  vehicle?: {
    id: string;
    registrationNumber: string;
    make: string;
    model: string;
    status: string;
  };
  driver?: {
    id: string;
    employeeId: string;
    firstName: string;
    lastName: string;
    status: string;
  };
  route?: {
    id: string;
    routeCode: string;
    originCity: string;
    destinationCity: string;
    status: string;
  };
  company?: {
    id: string;
    name: string;
  };
}

export interface TripQueryFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: TripStatus;
  vehicleId?: string;
  driverId?: string;
  shipmentId?: string;
  routeId?: string;
  companyId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateTripPayload {
  tripNumber: string;
  shipmentId: string;
  vehicleId: string;
  driverId: string;
  routeId: string;
  companyId: string;
  plannedStartTime: string;
  plannedEndTime?: string | null;
  actualStartTime?: string | null;
  actualEndTime?: string | null;
  status?: TripStatus;
}
