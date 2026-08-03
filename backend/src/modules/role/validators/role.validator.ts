import { z } from 'zod';

export const updateRolePermissionsSchema = z.object({
  permissions: z.record(z.array(z.string())),
});

export type UpdateRolePermissionsInput = z.infer<typeof updateRolePermissionsSchema>;
