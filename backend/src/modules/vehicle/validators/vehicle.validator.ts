import { VehicleStatus, VehicleType, FuelType } from '@prisma/client';
import { z } from 'zod';

const currentYear = new Date().getFullYear();

/**
 * Zod validation schema for creating a new Vehicle record.
 */
export const createVehicleSchema = z.object({
  registrationNumber: z
    .string({ required_error: 'Registration number is required' })
    .trim()
    .min(1, { message: 'Registration number cannot be empty' })
    .max(30, { message: 'Registration number must be 30 characters maximum' }),

  vin: z
    .string({ required_error: 'VIN is required' })
    .trim()
    .min(1, { message: 'VIN cannot be empty' })
    .max(17, { message: 'VIN must be 17 characters maximum' }),

  make: z
    .string({ required_error: 'Vehicle make is required' })
    .trim()
    .min(1, { message: 'Vehicle make cannot be empty' })
    .max(100, { message: 'Vehicle make must be 100 characters maximum' }),

  model: z
    .string({ required_error: 'Vehicle model is required' })
    .trim()
    .min(1, { message: 'Vehicle model cannot be empty' })
    .max(100, { message: 'Vehicle model must be 100 characters maximum' }),

  manufacturingYear: z
    .number({ required_error: 'Manufacturing year is required' })
    .int({ message: 'Manufacturing year must be an integer' })
    .min(1900, { message: 'Manufacturing year must be 1900 or later' })
    .max(currentYear + 1, { message: `Manufacturing year cannot exceed ${currentYear + 1}` }),

  vehicleType: z.nativeEnum(VehicleType, {
    errorMap: () => ({ message: 'Invalid vehicle type' }),
  }),

  fuelType: z.nativeEnum(FuelType, {
    errorMap: () => ({ message: 'Invalid fuel type' }),
  }),

  capacity: z
    .number()
    .positive({ message: 'Capacity must be a positive number' })
    .optional()
    .nullable(),

  status: z
    .nativeEnum(VehicleStatus, {
      errorMap: () => ({ message: 'Invalid vehicle status' }),
    })
    .optional(),

  companyId: z
    .string({ required_error: 'Company ID is required' })
    .uuid({ message: 'Invalid Company ID UUID format' }),
});

/**
 * Zod validation schema for updating an existing Vehicle record.
 * All fields are optional.
 */
export const updateVehicleSchema = createVehicleSchema.partial();

/**
 * Zod validation schema for vehicle URL path parameter validation.
 */
export const vehicleIdParamSchema = z.object({
  id: z
    .string({ required_error: 'Vehicle ID is required' })
    .uuid({ message: 'Invalid Vehicle ID UUID format' }),
});

/**
 * Zod validation schema for vehicle list query parameters and filters.
 */
export const vehicleQuerySchema = z.object({
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
    .nativeEnum(VehicleStatus, {
      errorMap: () => ({ message: 'Invalid vehicle status filter' }),
    })
    .optional(),

  vehicleType: z
    .nativeEnum(VehicleType, {
      errorMap: () => ({ message: 'Invalid vehicle type filter' }),
    })
    .optional(),

  fuelType: z
    .nativeEnum(FuelType, {
      errorMap: () => ({ message: 'Invalid fuel type filter' }),
    })
    .optional(),

  sortBy: z.enum(['createdAt', 'registrationNumber', 'make', 'model', 'manufacturingYear', 'status', 'capacity']).optional().default('createdAt'),

  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

/**
 * Inferred TypeScript input types derived from Zod validation schemas.
 */
export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;
export type VehicleIdInput = z.infer<typeof vehicleIdParamSchema>;
export type VehicleQueryInput = z.infer<typeof vehicleQuerySchema>;
