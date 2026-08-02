import { z } from 'zod';

/**
 * Zod validation schema for creating a new FuelRecord entry.
 */
export const createFuelRecordSchema = z.object({
  vehicleId: z
    .string({ required_error: 'Vehicle ID is required' })
    .uuid({ message: 'Invalid Vehicle ID UUID format' }),

  companyId: z
    .string({ required_error: 'Company ID is required' })
    .uuid({ message: 'Invalid Company ID UUID format' }),

  tripId: z
    .string()
    .uuid({ message: 'Invalid Trip ID UUID format' })
    .optional()
    .nullable(),

  fuelDate: z
    .string({ required_error: 'Fuel date is required' })
    .datetime({ message: 'Fuel date must be a valid ISO datetime string' }),

  fuelStation: z
    .string({ required_error: 'Fuel station is required' })
    .trim()
    .min(1, { message: 'Fuel station cannot be empty' })
    .max(150, { message: 'Fuel station must be 150 characters maximum' }),

  quantity: z
    .number({ required_error: 'Quantity is required' })
    .positive({ message: 'Quantity must be a positive number' }),

  pricePerUnit: z
    .number({ required_error: 'Price per unit is required' })
    .positive({ message: 'Price per unit must be a positive number' }),

  totalCost: z
    .number({ required_error: 'Total cost is required' })
    .positive({ message: 'Total cost must be a positive number' }),

  odometerReading: z
    .number({ required_error: 'Odometer reading is required' })
    .int({ message: 'Odometer reading must be an integer' })
    .positive({ message: 'Odometer reading must be a positive integer' }),

  receiptNumber: z
    .string()
    .trim()
    .max(100, { message: 'Receipt number must be 100 characters maximum' })
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
 * Zod validation schema for updating an existing FuelRecord entry.
 * All fields are optional via `.partial()`.
 */
export const updateFuelRecordSchema = createFuelRecordSchema.partial();

/**
 * Zod validation schema for fuel record URL path parameter validation.
 */
export const fuelRecordIdParamSchema = z.object({
  id: z
    .string({ required_error: 'Fuel record ID is required' })
    .uuid({ message: 'Invalid Fuel record ID UUID format' }),
});

/**
 * Zod validation schema for fuel record list query parameters and filters.
 */
export const fuelRecordQuerySchema = z.object({
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

  tripId: z
    .string()
    .uuid({ message: 'Invalid Trip ID UUID format' })
    .optional(),

  companyId: z
    .string()
    .uuid({ message: 'Invalid Company ID UUID format' })
    .optional(),

  sortBy: z
    .enum(['createdAt', 'fuelDate', 'totalCost', 'odometerReading'])
    .optional()
    .default('createdAt'),

  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

/**
 * Inferred TypeScript input types derived from Zod validation schemas.
 */
export type CreateFuelRecordInput = z.infer<typeof createFuelRecordSchema>;
export type UpdateFuelRecordInput = z.infer<typeof updateFuelRecordSchema>;
export type FuelRecordIdInput = z.infer<typeof fuelRecordIdParamSchema>;
export type FuelRecordQueryInput = z.infer<typeof fuelRecordQuerySchema>;
