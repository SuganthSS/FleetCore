import { z } from 'zod';

/**
 * Zod validation schema for creating a new Tracking / VehicleLocationHistory entry.
 */
export const createTrackingSchema = z.object({
  tripId: z
    .string({ required_error: 'Trip ID is required' })
    .uuid({ message: 'Invalid Trip ID UUID format' }),

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

  latitude: z
    .number({ required_error: 'Latitude is required' })
    .min(-90, { message: 'Latitude must be between -90 and 90 degrees' })
    .max(90, { message: 'Latitude must be between -90 and 90 degrees' }),

  longitude: z
    .number({ required_error: 'Longitude is required' })
    .min(-180, { message: 'Longitude must be between -180 and 180 degrees' })
    .max(180, { message: 'Longitude must be between -180 and 180 degrees' }),

  speed: z
    .number()
    .min(0, { message: 'Speed must be a non-negative number' })
    .optional()
    .nullable(),

  heading: z
    .number()
    .min(0, { message: 'Heading must be between 0 and 360 degrees' })
    .max(360, { message: 'Heading must be between 0 and 360 degrees' })
    .optional()
    .nullable(),

  altitude: z.number().optional().nullable(),

  accuracy: z
    .number()
    .min(0, { message: 'Accuracy must be a non-negative number' })
    .optional()
    .nullable(),

  recordedAt: z
    .string({ required_error: 'Recorded date is required' })
    .datetime({ message: 'Recorded date must be a valid ISO datetime string' }),

  address: z
    .string()
    .trim()
    .max(255, { message: 'Address must be 255 characters maximum' })
    .optional()
    .nullable(),

  city: z
    .string()
    .trim()
    .max(100, { message: 'City must be 100 characters maximum' })
    .optional()
    .nullable(),

  state: z
    .string()
    .trim()
    .max(100, { message: 'State must be 100 characters maximum' })
    .optional()
    .nullable(),

  country: z
    .string()
    .trim()
    .max(100, { message: 'Country must be 100 characters maximum' })
    .optional()
    .nullable(),

  postalCode: z
    .string()
    .trim()
    .max(20, { message: 'Postal code must be 20 characters maximum' })
    .optional()
    .nullable(),
});

/**
 * Zod validation schema for updating an existing Tracking entry.
 * All fields are optional via `.partial()`.
 */
export const updateTrackingSchema = createTrackingSchema.partial();

/**
 * Zod validation schema for tracking record URL path parameter validation.
 */
export const trackingIdParamSchema = z.object({
  id: z
    .string({ required_error: 'Tracking ID is required' })
    .uuid({ message: 'Invalid Tracking ID UUID format' }),
});

/**
 * Zod validation schema for tracking record list query parameters and filters.
 */
export const trackingQuerySchema = z.object({
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

  tripId: z
    .string()
    .uuid({ message: 'Invalid Trip ID UUID format' })
    .optional(),

  vehicleId: z
    .string()
    .uuid({ message: 'Invalid Vehicle ID UUID format' })
    .optional(),

  companyId: z
    .string()
    .uuid({ message: 'Invalid Company ID UUID format' })
    .optional(),

  driverId: z
    .string()
    .uuid({ message: 'Invalid Driver ID UUID format' })
    .optional(),

  sortBy: z
    .enum(['createdAt', 'recordedAt', 'speed'])
    .optional()
    .default('recordedAt'),

  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

/**
 * Inferred TypeScript input types derived from Zod validation schemas.
 */
export type CreateTrackingInput = z.infer<typeof createTrackingSchema>;
export type UpdateTrackingInput = z.infer<typeof updateTrackingSchema>;
export type TrackingIdInput = z.infer<typeof trackingIdParamSchema>;
export type TrackingQueryInput = z.infer<typeof trackingQuerySchema>;
