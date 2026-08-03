import apiClient from './api';
import type { ApiResponse } from '@/types/api';
import type {
  UserItem,
  UserQueryParams,
  PaginatedUsersResult,
  CreateUserInput,
  UpdateUserInput,
  UserStatus,
} from '@/types/user';

export const userService = {
  /**
   * List users with search, filters, pagination, and sorting.
   */
  getUsers: async (params?: UserQueryParams): Promise<ApiResponse<PaginatedUsersResult>> => {
    const { data } = await apiClient.get<ApiResponse<PaginatedUsersResult>>('/users', {
      params,
    });
    return data;
  },

  /**
   * Get single user by ID.
   */
  getUserById: async (id: string): Promise<ApiResponse<UserItem>> => {
    const { data } = await apiClient.get<ApiResponse<UserItem>>(`/users/${id}`);
    return data;
  },

  /**
   * Create new user/employee.
   */
  createUser: async (input: CreateUserInput): Promise<ApiResponse<UserItem>> => {
    const { data } = await apiClient.post<ApiResponse<UserItem>>('/users', input);
    return data;
  },

  /**
   * Update existing user record.
   */
  updateUser: async (id: string, input: UpdateUserInput): Promise<ApiResponse<UserItem>> => {
    const { data } = await apiClient.put<ApiResponse<UserItem>>(`/users/${id}`, input);
    return data;
  },

  /**
   * Update user status (ACTIVE, INACTIVE, SUSPENDED).
   */
  updateUserStatus: async (id: string, status: UserStatus): Promise<ApiResponse<UserItem>> => {
    const { data } = await apiClient.patch<ApiResponse<UserItem>>(`/users/${id}/status`, {
      status,
    });
    return data;
  },

  /**
   * Reset user password.
   */
  resetPassword: async (id: string, password: string): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.patch<ApiResponse<void>>(`/users/${id}/reset-password`, {
      password,
    });
    return data;
  },

  /**
   * Soft delete user.
   */
  deleteUser: async (id: string): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.delete<ApiResponse<void>>(`/users/${id}`);
    return data;
  },

  /**
   * Get all system RBAC roles.
   */
  getRoles: async (): Promise<ApiResponse<{ id: string; name: string; description?: string }[]>> => {
    const { data } = await apiClient.get<
      ApiResponse<{ id: string; name: string; description?: string }[]>
    >('/users/meta/roles');
    return data;
  },
};

