import { z } from 'zod';
import { MaintenanceType, MaintenanceStatus } from '@prisma/client';

/**
 * Zod validation schema for creating a new MaintenanceRecord entry.
 */
export const createMaintenanceSchema = z.object({
  vehicleId: z
    .string({ required_error: 'Vehicle ID is required' })
    .uuid({ message: 'Invalid Vehicle ID UUID format' }),

  companyId: z
    .string({ required_error: 'Company ID is required' })
    .uuid({ message: 'Invalid Company ID UUID format' }),

  driverId: z
    .string()
    .uuid({ message: 'Invalid Driver ID UUID format' })
    .optional()
    .nullable(),

  maintenanceType: z.nativeEnum(MaintenanceType, {
    errorMap: () => ({
      message:
        'Invalid maintenance type. Allowed values: PREVENTIVE, CORRECTIVE, INSPECTION, EMERGENCY, TIRE_SERVICE, OIL_CHANGE, BRAKE_SERVICE, OTHER',
    }),
  }),

  status: z
    .nativeEnum(MaintenanceStatus, {
      errorMap: () => ({
        message:
          'Invalid status. Allowed values: SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED, OVERDUE',
      }),
    })
    .optional()
    .default(MaintenanceStatus.SCHEDULED),

  title: z
    .string({ required_error: 'Title is required' })
    .trim()
    .min(1, { message: 'Title cannot be empty' })
    .max(150, { message: 'Title must be 150 characters maximum' }),

  description: z
    .string()
    .trim()
    .max(500, { message: 'Description must be 500 characters maximum' })
    .optional()
    .nullable(),

  scheduledDate: z
    .string({ required_error: 'Scheduled date is required' })
    .datetime({ message: 'Scheduled date must be a valid ISO datetime string' }),

  completedDate: z
    .string()
    .datetime({ message: 'Completed date must be a valid ISO datetime string' })
    .optional()
    .nullable(),

  estimatedCost: z
    .number()
    .positive({ message: 'Estimated cost must be a positive number' })
    .optional()
    .nullable(),

  actualCost: z
    .number()
    .positive({ message: 'Actual cost must be a positive number' })
    .optional()
    .nullable(),

  serviceProvider: z
    .string()
    .trim()
    .max(150, { message: 'Service provider must be 150 characters maximum' })
    .optional()
    .nullable(),

  odometerReading: z
    .number()
    .int({ message: 'Odometer reading must be an integer' })
    .positive({ message: 'Odometer reading must be a positive integer' })
    .optional()
    .nullable(),

  nextMaintenanceDate: z
    .string()
    .datetime({ message: 'Next maintenance date must be a valid ISO datetime string' })
    .optional()
    .nullable(),

  notes: z
    .string()
    .trim()
    .max(500, { message: 'Notes must be 500 characters maximum' })
    .optional()
    .nullable(),
});

/**
 * Zod validation schema for updating an existing MaintenanceRecord entry.
 * All fields are optional via `.partial()`.
 */
export const updateMaintenanceSchema = createMaintenanceSchema.partial();

/**
 * Zod validation schema for maintenance record URL path parameter validation.
 */
export const maintenanceIdParamSchema = z.object({
  id: z
    .string({ required_error: 'Maintenance record ID is required' })
    .uuid({ message: 'Invalid Maintenance record ID UUID format' }),
});

/**
 * Zod validation schema for maintenance record list query parameters and filters.
 */
export const maintenanceQuerySchema = z.object({
  page: z.coerce
    .number()
    .int({ message: 'Page must be an integer' })
    .min(1, { message: 'Page must be greater than or equal to 1' })
    .optional()
    .default(1),

  limit: z.coerce
    .number()
    .int({ message: 'Limit must be an integer' })
    .min(1, { message: 'Limit must be greater than or equal to 1' })
    .max(100, { message: 'Limit cannot exceed 100' })
    .optional()
    .default(10),

  search: z.string().trim().optional(),

  vehicleId: z
    .string()
    .uuid({ message: 'Invalid Vehicle ID UUID format' })
    .optional(),

  companyId: z
    .string()
    .uuid({ message: 'Invalid Company ID UUID format' })
    .optional(),

  maintenanceType: z.nativeEnum(MaintenanceType).optional(),

  status: z.nativeEnum(MaintenanceStatus).optional(),

  sortBy: z
    .enum([
      'createdAt',
      'scheduledDate',
      'completedDate',
      'estimatedCost',
      'actualCost',
    ])
    .optional()
    .default('createdAt'),

  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

/**
 * Inferred TypeScript input types derived from Zod validation schemas.
 */
export type CreateMaintenanceInput = z.infer<typeof createMaintenanceSchema>;
export type UpdateMaintenanceInput = z.infer<typeof updateMaintenanceSchema>;
export type MaintenanceIdInput = z.infer<typeof maintenanceIdParamSchema>;
export type MaintenanceQueryInput = z.infer<typeof maintenanceQuerySchema>;
