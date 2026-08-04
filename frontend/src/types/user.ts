export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export type UserRoleName =
  | 'Administrator'
  | 'Fleet Manager'
  | 'Dispatcher'
  | 'Accountant'
  | 'Driver';

export interface UserRole {
  id: string;
  name: string;
  description?: string;
}

export interface UserItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  roleId: string;
  roleName?: string;
  role?: UserRole;
  companyId: string;
  companyName?: string;
  status: UserStatus;
  lastLogin?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedUsersResult {
  users: UserItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phone?: string;
  roleId: string;
  companyId?: string;
  status?: UserStatus;
}

export interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  roleId?: string;
  status?: UserStatus;
}
