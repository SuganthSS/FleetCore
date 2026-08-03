import { apiClient } from './api';
import type { ApiResponse } from '@/types/api';
import type { RoleDetail, PermissionMatrixResponse } from '@/types/role';


export const roleService = {
  /**
   * List all enterprise roles with user counts and capabilities.
   */
  getRoles: async (): Promise<ApiResponse<RoleDetail[]>> => {
    const { data } = await apiClient.get<ApiResponse<RoleDetail[]>>('/roles');
    return data;
  },

  /**
   * Get single role details.
   */
  getRoleById: async (id: string): Promise<ApiResponse<RoleDetail>> => {
    const { data } = await apiClient.get<ApiResponse<RoleDetail>>(`/roles/${id}`);
    return data;
  },

  /**
   * Get complete permission matrix definition.
   */
  getPermissionMatrix: async (): Promise<ApiResponse<PermissionMatrixResponse>> => {
    const { data } = await apiClient.get<ApiResponse<PermissionMatrixResponse>>('/roles/permissions');
    return data;
  },

  /**
   * Update permissions for a specific role.
   */
  updateRolePermissions: async (
    id: string,
    permissions: Record<string, string[]>
  ): Promise<ApiResponse<RoleDetail>> => {
    const { data } = await apiClient.put<ApiResponse<RoleDetail>>(`/roles/${id}/permissions`, {
      permissions,
    });
    return data;
  },
};
