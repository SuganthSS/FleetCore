export type ShipmentPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type ShipmentStatus =
  | 'PENDING'
  | 'DISPATCHED'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'FAILED';

export interface ShipmentTrip {
  id: string;
  tripNumber: string;
  status: string;
}

export interface Shipment {
  id: string;
  shipmentNumber: string;
  title: string;
  description: string | null;
  cargoType: string | null;
  weight: number | null;
  volume: number | null;
  quantity: number | null;
  pickupAddress: string;
  pickupCity: string;
  pickupState: string | null;
  pickupCountry: string;
  pickupPostalCode: string | null;
  pickupDate: string | null;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryState: string | null;
  deliveryCountry: string;
  deliveryPostalCode: string | null;
  expectedDeliveryDate: string | null;
  priority: ShipmentPriority;
  status: ShipmentStatus;
  customerId: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  customer?: {
    id: string;
    customerCode: string;
    companyName: string;
    email: string;
  };
  company?: {
    id: string;
    name: string;
  };
  trips?: ShipmentTrip[];
}

export interface ShipmentQueryFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: ShipmentStatus;
  priority?: ShipmentPriority;
  customerId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateShipmentPayload {
  shipmentNumber: string;
  title: string;
  description?: string | null;
  cargoType?: string | null;
  weight?: number | null;
  volume?: number | null;
  quantity?: number | null;
  pickupAddress: string;
  pickupCity: string;
  pickupState?: string | null;
  pickupCountry: string;
  pickupPostalCode?: string | null;
  pickupDate?: string | null;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryState?: string | null;
  deliveryCountry: string;
  deliveryPostalCode?: string | null;
  expectedDeliveryDate?: string | null;
  priority?: ShipmentPriority;
  status?: ShipmentStatus;
  customerId: string;
  companyId: string;
}
