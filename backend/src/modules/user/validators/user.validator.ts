import { UserStatus } from '@prisma/client';
import { z } from 'zod';

export const createUserSchema = z.object({
  firstName: z
    .string({ required_error: 'First name is required' })
    .trim()
    .min(1, { message: 'First name cannot be empty' })
    .max(100, { message: 'First name must be 100 characters maximum' }),

  lastName: z
    .string({ required_error: 'Last name is required' })
    .trim()
    .min(1, { message: 'Last name cannot be empty' })
    .max(100, { message: 'Last name must be 100 characters maximum' }),

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

  password: z
    .string({ required_error: 'Password is required' })
    .min(6, { message: 'Password must be at least 6 characters' }),

  companyId: z
    .preprocess(
      (val) => (val === '' ? undefined : val),
      z.string({ required_error: 'Company ID is required' }).uuid({ message: 'Invalid Company ID UUID format' }).optional()
    ),

  roleId: z
    .string({ required_error: 'Role ID is required' })
    .uuid({ message: 'Invalid Role ID UUID format' }),

  status: z
    .nativeEnum(UserStatus, {
      errorMap: () => ({ message: 'Invalid user status' }),
    })
    .optional()
    .default(UserStatus.ACTIVE),

  department: z
    .string()
    .trim()
    .max(100, { message: 'Department must be 100 characters maximum' })
    .optional()
    .nullable(),

  designation: z
    .string()
    .trim()
    .max(100, { message: 'Designation must be 100 characters maximum' })
    .optional()
    .nullable(),
});

export const updateUserSchema = createUserSchema
  .omit({ password: true })
  .partial();

export const userIdParamSchema = z.object({
  id: z
    .string({ required_error: 'User ID is required' })
    .uuid({ message: 'Invalid User ID UUID format' }),
});

export const userQuerySchema = z.object({
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

  companyId: z
    .preprocess((val) => (val === '' ? undefined : val), z.string().uuid({ message: 'Invalid Company ID UUID format' }).optional()),

  roleId: z
    .preprocess((val) => (val === '' ? undefined : val), z.string().uuid({ message: 'Invalid Role ID UUID format' }).optional()),

  status: z
    .nativeEnum(UserStatus, {
      errorMap: () => ({ message: 'Invalid status filter' }),
    })
    .optional(),

  sortBy: z
    .enum(['createdAt', 'firstName', 'lastName', 'email', 'lastLogin'])
    .optional()
    .default('createdAt'),

  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export const userStatusBodySchema = z.object({
  status: z.nativeEnum(UserStatus, {
    errorMap: () => ({ message: 'Invalid user status' }),
  }),
});

export const userResetPasswordBodySchema = z.object({
  password: z
    .string({ required_error: 'New password is required' })
    .min(6, { message: 'New password must be at least 6 characters' }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserIdInput = z.infer<typeof userIdParamSchema>;
export type UserQueryInput = z.infer<typeof userQuerySchema>;
export type UserStatusBodyInput = z.infer<typeof userStatusBodySchema>;
export type UserResetPasswordBodyInput = z.infer<typeof userResetPasswordBodySchema>;
