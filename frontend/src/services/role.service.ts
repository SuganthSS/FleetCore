import { apiClient } from './api';
import type { ApiResponse } from '@/types/api';
import type { RoleDetail, RolePermissions, PermissionMatrixResponse } from '@/types/role';


export const roleService = {
  /**
   * List all enterprise roles with user counts and capabilities.
   * The backend normalises all permission shapes before returning.
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
   * Get complete permission matrix definition (categories + actions + matrix).
   */
  getPermissionMatrix: async (): Promise<ApiResponse<PermissionMatrixResponse>> => {
    const { data } = await apiClient.get<ApiResponse<PermissionMatrixResponse>>('/roles/permissions');
    return data;
  },

  /**
   * Update permissions for a specific role.
   * Only canonical PermissionCategory keys and PermissionAction values are accepted.
   */
  updateRolePermissions: async (
    id: string,
    permissions: RolePermissions
  ): Promise<ApiResponse<RoleDetail>> => {
    const { data } = await apiClient.put<ApiResponse<RoleDetail>>(`/roles/${id}/permissions`, {
      permissions,
    });
    return data;
  },
};
