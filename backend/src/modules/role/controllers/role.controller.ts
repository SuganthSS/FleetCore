import { Request, Response } from 'express';
import { roleService } from '../services/role.service';
import { updateRolePermissionsSchema } from '../validators/role.validator';

export class RoleController {
  /**
   * GET /api/v1/roles
   * List all enterprise roles.
   */
  async getRoles(_req: Request, res: Response): Promise<void> {
    try {
      const roles = await roleService.getRoles();
      res.status(200).json({
        success: true,
        data: roles,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to retrieve roles';
      res.status(500).json({
        success: false,
        message,
      });
    }
  }

  /**
   * GET /api/v1/roles/permissions
   * Retrieve global permissions matrix.
   */
  async getPermissionMatrix(_req: Request, res: Response): Promise<void> {
    try {
      const matrix = await roleService.getPermissionMatrix();
      res.status(200).json({
        success: true,
        data: matrix,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to retrieve permission matrix';
      res.status(500).json({
        success: false,
        message,
      });
    }
  }

  /**
   * GET /api/v1/roles/:id
   * Retrieve details for a specific role.
   */
  async getRoleById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const role = await roleService.getRoleById(id);
      res.status(200).json({
        success: true,
        data: role,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to retrieve role';
      res.status(404).json({
        success: false,
        message,
      });
    }
  }

  /**
   * PUT /api/v1/roles/:id/permissions
   * Update role permissions.
   */
  async updateRolePermissions(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const parsed = updateRolePermissionsSchema.parse(req.body);
      const role = await roleService.updateRolePermissions(id, parsed.permissions);
      res.status(200).json({
        success: true,
        data: role,
        message: 'Role permissions updated successfully',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update permissions';
      res.status(400).json({
        success: false,
        message,
      });
    }
  }
}

export const roleController = new RoleController();
