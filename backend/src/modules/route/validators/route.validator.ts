import { RouteType, RouteStatus } from '@prisma/client';
import { z } from 'zod';

/**
 * Zod validation schema for creating a new Route record.
 */
export const createRouteSchema = z.object({
  routeCode: z
    .string({ required_error: 'Route code is required' })
    .trim()
    .min(1, { message: 'Route code cannot be empty' })
    .max(50, { message: 'Route code must be 50 characters maximum' }),

  name: z
    .string({ required_error: 'Route name is required' })
    .trim()
    .min(1, { message: 'Route name cannot be empty' })
    .max(150, { message: 'Route name must be 150 characters maximum' }),

  description: z
    .string()
    .trim()
    .max(500, { message: 'Description must be 500 characters maximum' })
    .optional()
    .nullable(),

  origin: z
    .string({ required_error: 'Origin is required' })
    .trim()
    .min(1, { message: 'Origin cannot be empty' })
    .max(200, { message: 'Origin must be 200 characters maximum' }),

  destination: z
    .string({ required_error: 'Destination is required' })
    .trim()
    .min(1, { message: 'Destination cannot be empty' })
    .max(200, { message: 'Destination must be 200 characters maximum' }),

  distance: z
    .number({ required_error: 'Distance is required', invalid_type_error: 'Distance must be a number' })
    .positive({ message: 'Distance must be a positive number' }),

  estimatedDuration: z
    .number({ required_error: 'Estimated duration is required', invalid_type_error: 'Estimated duration must be a number' })
    .int({ message: 'Estimated duration must be an integer' })
    .positive({ message: 'Estimated duration must be a positive integer' }),

  routeType: z
    .nativeEnum(RouteType, {
      errorMap: () => ({ message: 'Invalid route type' }),
    })
    .optional(),

  status: z
    .nativeEnum(RouteStatus, {
      errorMap: () => ({ message: 'Invalid route status' }),
    })
    .optional(),

  companyId: z
    .string({ required_error: 'Company ID is required' })
    .uuid({ message: 'Invalid Company ID UUID format' }),
});

/**
 * Zod validation schema for updating an existing Route record.
 * All fields are optional via `.partial()`.
 */
export const updateRouteSchema = createRouteSchema.partial();

/**
 * Zod validation schema for route URL path parameter validation.
 */
export const routeIdParamSchema = z.object({
  id: z
    .string({ required_error: 'Route ID is required' })
    .uuid({ message: 'Invalid Route ID UUID format' }),
});

/**
 * Zod validation schema for route list query parameters and filters.
 */
export const routeQuerySchema = z.object({
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

  routeType: z
    .nativeEnum(RouteType, {
      errorMap: () => ({ message: 'Invalid route type filter' }),
    })
    .optional(),

  status: z
    .nativeEnum(RouteStatus, {
      errorMap: () => ({ message: 'Invalid status filter' }),
    })
    .optional(),

  companyId: z
    .string()
    .uuid({ message: 'Invalid Company ID UUID format' })
    .optional(),

  sortBy: z
    .enum(['createdAt', 'routeCode', 'name', 'distance'])
    .optional()
    .default('createdAt'),

  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

/**
 * Inferred TypeScript input types derived from Zod validation schemas.
 */
export type CreateRouteInput = z.infer<typeof createRouteSchema>;
export type UpdateRouteInput = z.infer<typeof updateRouteSchema>;
export type RouteIdInput = z.infer<typeof routeIdParamSchema>;
export type RouteQueryInput = z.infer<typeof routeQuerySchema>;
