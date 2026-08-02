export type CustomerStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';

export type CustomerType = 'CORPORATE' | 'INDIVIDUAL' | 'PARTNER';

export interface Customer {
  id: string;
  customerCode: string;
  companyName: string;
  contactPerson: string | null;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postalCode: string | null;
  status: CustomerStatus;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  company?: {
    id: string;
    name: string;
  };
  _count?: {
    shipments: number;
  };
}

export interface CustomerQueryFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: CustomerStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateCustomerPayload {
  customerCode: string;
  companyName: string;
  contactPerson?: string | null;
  email: string;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postalCode?: string | null;
  status?: CustomerStatus;
  companyId: string;
}
