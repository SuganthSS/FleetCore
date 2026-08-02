import { CustomerStatus } from '@prisma/client';
import { z } from 'zod';

/**
 * Zod validation schema for creating a new Customer record.
 */
export const createCustomerSchema = z.object({
  customerCode: z
    .string({ required_error: 'Customer code is required' })
    .trim()
    .min(1, { message: 'Customer code cannot be empty' })
    .max(50, { message: 'Customer code must be 50 characters maximum' }),

  companyName: z
    .string({ required_error: 'Company name is required' })
    .trim()
    .min(1, { message: 'Company name cannot be empty' })
    .max(200, { message: 'Company name must be 200 characters maximum' }),

  contactPerson: z
    .string()
    .trim()
    .max(100, { message: 'Contact person must be 100 characters maximum' })
    .optional()
    .nullable(),

  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email({ message: 'Invalid email address' }),

  phone: z
    .string()
    .trim()
    .max(20, { message: 'Phone must be 20 characters maximum' })
    .optional()
    .nullable(),

  address: z
    .string()
    .trim()
    .max(300, { message: 'Address must be 300 characters maximum' })
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

  status: z
    .nativeEnum(CustomerStatus, {
      errorMap: () => ({ message: 'Invalid customer status' }),
    })
    .optional(),

  companyId: z
    .string({ required_error: 'Company ID is required' })
    .uuid({ message: 'Invalid Company ID UUID format' }),
});

/**
 * Zod validation schema for updating an existing Customer record.
 * All fields are optional.
 */
export const updateCustomerSchema = createCustomerSchema.partial();

/**
 * Zod validation schema for customer URL path parameter validation.
 */
export const customerIdParamSchema = z.object({
  id: z
    .string({ required_error: 'Customer ID is required' })
    .uuid({ message: 'Invalid Customer ID UUID format' }),
});

/**
 * Zod validation schema for customer list query parameters and filters.
 */
export const customerQuerySchema = z.object({
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
    .nativeEnum(CustomerStatus, {
      errorMap: () => ({ message: 'Invalid status filter' }),
    })
    .optional(),

  sortBy: z
    .enum(['createdAt', 'companyName', 'customerCode'])
    .optional()
    .default('createdAt'),

  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

/**
 * Inferred TypeScript input types derived from Zod validation schemas.
 */
export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
export type CustomerIdInput = z.infer<typeof customerIdParamSchema>;
export type CustomerQueryInput = z.infer<typeof customerQuerySchema>;
