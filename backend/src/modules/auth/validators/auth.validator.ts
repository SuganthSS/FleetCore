import { z } from 'zod';
import { validatePasswordStrength } from '../utils/password.util';

/**
 * Reusable Zod refinement schema for strict corporate password strength.
 * Integrates with `validatePasswordStrength()` to eliminate duplicated rules.
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .max(128, 'Password cannot exceed 128 characters')
  .refine(
    (val) => validatePasswordStrength(val).isValid,
    (val) => ({
      message: validatePasswordStrength(val).errors.join('; '),
    })
  );

/**
 * Schema for user login requests
 */
export const loginSchema = z.object({
  email: z.string().email('Invalid email address format'),
  password: z.string().min(1, 'Password is required'),
});

/**
 * Schema for token refresh requests
 */
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

/**
 * Schema for password change requests
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, 'Password confirmation is required'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'New password and confirmation password do not match',
    path: ['confirmPassword'],
  });

/**
 * Schema for forgot password requests
 */
export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address format'),
});

/**
 * Schema for reset password requests
 */
export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Password reset token is required'),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, 'Password confirmation is required'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'New password and confirmation password do not match',
    path: ['confirmPassword'],
  });

// Inferred TypeScript types derived directly from Zod schemas
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
