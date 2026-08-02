import { ExperienceLevel, DriverAvailability } from '@prisma/client';
import { z } from 'zod';

/**
 * Zod validation schema for creating a new Driver record.
 */
export const createDriverSchema = z.object({
  employeeId: z
    .string({ required_error: 'Employee ID is required' })
    .trim()
    .min(1, { message: 'Employee ID cannot be empty' })
    .max(50, { message: 'Employee ID must be 50 characters maximum' }),

  userId: z
    .string()
    .uuid({ message: 'Invalid User ID UUID format' })
    .optional(),

  firstName: z
    .string()
    .trim()
    .min(1, { message: 'First name is required' })
    .optional(),

  lastName: z
    .string()
    .trim()
    .min(1, { message: 'Last name is required' })
    .optional(),

  email: z
    .string()
    .trim()
    .email({ message: 'Invalid email address format' })
    .optional(),

  phone: z
    .string()
    .trim()
    .max(30, { message: 'Phone must be 30 characters maximum' })
    .optional()
    .nullable(),

  companyId: z
    .string({ required_error: 'Company ID is required' })
    .uuid({ message: 'Invalid Company ID UUID format' }),


  experienceLevel: z
    .nativeEnum(ExperienceLevel, {
      errorMap: () => ({ message: 'Invalid experience level' }),
    })
    .optional(),

  availability: z
    .nativeEnum(DriverAvailability, {
      errorMap: () => ({ message: 'Invalid availability status' }),
    })
    .optional(),

  licenseNumber: z
    .string({ required_error: 'License number is required' })
    .trim()
    .min(1, { message: 'License number cannot be empty' })
    .max(50, { message: 'License number must be 50 characters maximum' }),

  licenseExpiry: z.coerce.date({
    required_error: 'License expiry date is required',
    invalid_type_error: 'License expiry must be a valid datetime string or Date',
  }),

  joiningDate: z.coerce
    .date({
      invalid_type_error: 'Joining date must be a valid datetime string or Date',
    })
    .optional()
    .nullable(),

  emergencyContactName: z
    .string()
    .trim()
    .max(100, { message: 'Emergency contact name must be 100 characters maximum' })
    .optional()
    .nullable(),

  emergencyContactPhone: z
    .string()
    .trim()
    .max(20, { message: 'Emergency contact phone must be 20 characters maximum' })
    .optional()
    .nullable(),
});

/**
 * Zod validation schema for updating an existing Driver record.
 * All fields are optional.
 */
export const updateDriverSchema = createDriverSchema.partial();

/**
 * Zod validation schema for driver URL path parameter validation.
 */
export const driverIdParamSchema = z.object({
  id: z
    .string({ required_error: 'Driver ID is required' })
    .uuid({ message: 'Invalid Driver ID UUID format' }),
});

/**
 * Zod validation schema for driver list query parameters and filters.
 */
export const driverQuerySchema = z.object({
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

  availability: z
    .nativeEnum(DriverAvailability, {
      errorMap: () => ({ message: 'Invalid availability filter' }),
    })
    .optional(),

  experienceLevel: z
    .nativeEnum(ExperienceLevel, {
      errorMap: () => ({ message: 'Invalid experience level filter' }),
    })
    .optional(),

  companyId: z
    .string()
    .uuid({ message: 'Invalid Company ID UUID format' })
    .optional(),

  sortBy: z
    .enum(['createdAt', 'employeeId', 'licenseExpiry', 'joiningDate'])
    .optional()
    .default('createdAt'),

  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

/**
 * Inferred TypeScript input types derived from Zod validation schemas.
 */
export type CreateDriverInput = z.infer<typeof createDriverSchema>;
export type UpdateDriverInput = z.infer<typeof updateDriverSchema>;
export type DriverIdInput = z.infer<typeof driverIdParamSchema>;
export type DriverQueryInput = z.infer<typeof driverQuerySchema>;
