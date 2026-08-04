import { z } from 'zod';
import { PERMISSION_CATEGORIES, PERMISSION_ACTIONS } from '../services/role.service';

/**
 * Strict validator: only canonical PascalCase actions and known categories are
 * accepted when saving permissions via PUT /api/v1/roles/:id/permissions.
 * This ensures the database is always written with the canonical schema.
 */
export const updateRolePermissionsSchema = z.object({
  permissions: z.record(
    z.enum(PERMISSION_CATEGORIES as unknown as [string, ...string[]]),
    z.array(z.enum(PERMISSION_ACTIONS as unknown as [string, ...string[]]))
  ),
});

export type UpdateRolePermissionsInput = z.infer<typeof updateRolePermissionsSchema>;
