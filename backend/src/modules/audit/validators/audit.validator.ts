import { z } from 'zod';

export const auditQuerySchema = z.object({
  page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 15)),
  search: z.string().optional(),
  sortBy: z.enum(['timestamp', 'userName', 'roleName', 'module', 'action', 'severity']).optional().default('timestamp'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  user: z.string().optional(),
  role: z.string().optional(),
  module: z.string().optional(),
  severity: z.string().optional(),
  action: z.string().optional(),
  status: z.string().optional(),
});

export type AuditQueryInput = z.infer<typeof auditQuerySchema>;
