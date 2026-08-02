export type RouteType =
  | 'HIGHWAY'
  | 'URBAN'
  | 'INTERSTATE'
  | 'CROSS_BORDER'
  | 'REGIONAL'
  | 'LAST_MILE';

export type RouteStatus =
  | 'PLANNED'
  | 'ACTIVE'
  | 'OPTIMIZED'
  | 'COMPLETED'
  | 'CANCELLED';

export interface Route {
  id: string;
  routeCode: string;
  name: string;
  description: string | null;
  originAddress: string;
  originCity: string;
  originState: string | null;
  originCountry: string;
  destinationAddress: string;
  destinationCity: string;
  destinationState: string | null;
  destinationCountry: string;
  plannedDistance: number | null;
  estimatedDuration: number | null;
  routeType: RouteType;
  status: RouteStatus;
  shipmentId: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  company?: {
    id: string;
    name: string;
  };
}

export interface RouteQueryFilters {
  page?: number;
  limit?: number;
  search?: string;
  routeType?: RouteType;
  status?: RouteStatus;
  companyId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateRoutePayload {
  routeCode: string;
  name: string;
  description?: string | null;
  origin: string;
  destination: string;
  distance: number;
  estimatedDuration: number;
  routeType?: RouteType;
  status?: RouteStatus;
  companyId: string;
}
