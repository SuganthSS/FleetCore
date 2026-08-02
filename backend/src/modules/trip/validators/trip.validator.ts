import { TripStatus } from '@prisma/client';
import { z } from 'zod';

/**
 * Zod validation schema for creating a new Trip record.
 */
export const createTripSchema = z.object({
  tripNumber: z
    .string({ required_error: 'Trip number is required' })
    .trim()
    .min(1, { message: 'Trip number cannot be empty' })
    .max(50, { message: 'Trip number must be 50 characters maximum' }),

  shipmentId: z
    .string({ required_error: 'Shipment ID is required' })
    .uuid({ message: 'Invalid Shipment ID UUID format' }),

  vehicleId: z
    .string({ required_error: 'Vehicle ID is required' })
    .uuid({ message: 'Invalid Vehicle ID UUID format' }),

  driverId: z
    .string({ required_error: 'Driver ID is required' })
    .uuid({ message: 'Invalid Driver ID UUID format' }),

  routeId: z
    .string({ required_error: 'Route ID is required' })
    .uuid({ message: 'Invalid Route ID UUID format' }),

  companyId: z
    .string({ required_error: 'Company ID is required' })
    .uuid({ message: 'Invalid Company ID UUID format' }),

  plannedStartTime: z
    .string({ required_error: 'Planned start time is required' })
    .datetime({ message: 'Planned start time must be a valid ISO datetime string' }),

  plannedEndTime: z
    .string()
    .datetime({ message: 'Planned end time must be a valid ISO datetime string' })
    .optional()
    .nullable(),

  actualStartTime: z
    .string()
    .datetime({ message: 'Actual start time must be a valid ISO datetime string' })
    .optional()
    .nullable(),

  actualEndTime: z
    .string()
    .datetime({ message: 'Actual end time must be a valid ISO datetime string' })
    .optional()
    .nullable(),

  status: z
    .nativeEnum(TripStatus, {
      errorMap: () => ({ message: 'Invalid trip status' }),
    })
    .optional(),
});

/**
 * Zod validation schema for updating an existing Trip record.
 * All fields are optional via `.partial()`.
 */
export const updateTripSchema = createTripSchema.partial();

/**
 * Zod validation schema for trip URL path parameter validation.
 */
export const tripIdParamSchema = z.object({
  id: z
    .string({ required_error: 'Trip ID is required' })
    .uuid({ message: 'Invalid Trip ID UUID format' }),
});

/**
 * Zod validation schema for trip list query parameters and filters.
 */
export const tripQuerySchema = z.object({
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

  status: z
    .nativeEnum(TripStatus, {
      errorMap: () => ({ message: 'Invalid status filter' }),
    })
    .optional(),

  vehicleId: z
    .string()
    .uuid({ message: 'Invalid Vehicle ID UUID format' })
    .optional(),

  driverId: z
    .string()
    .uuid({ message: 'Invalid Driver ID UUID format' })
    .optional(),

  shipmentId: z
    .string()
    .uuid({ message: 'Invalid Shipment ID UUID format' })
    .optional(),

  routeId: z
    .string()
    .uuid({ message: 'Invalid Route ID UUID format' })
    .optional(),

  companyId: z
    .string()
    .uuid({ message: 'Invalid Company ID UUID format' })
    .optional(),

  sortBy: z
    .enum(['createdAt', 'tripNumber', 'plannedStartTime', 'actualStartTime'])
    .optional()
    .default('createdAt'),

  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

/**
 * Inferred TypeScript input types derived from Zod validation schemas.
 */
export type CreateTripInput = z.infer<typeof createTripSchema>;
export type UpdateTripInput = z.infer<typeof updateTripSchema>;
export type TripIdInput = z.infer<typeof tripIdParamSchema>;
export type TripQueryInput = z.infer<typeof tripQuerySchema>;
