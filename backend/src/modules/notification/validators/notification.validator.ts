import { z } from 'zod';
import { NotificationType, NotificationPriority } from '@prisma/client';

/**
 * Zod validation schema for creating a new Notification record.
 */
export const createNotificationSchema = z.object({
  companyId: z
    .string({ required_error: 'Company ID is required' })
    .uuid({ message: 'Invalid Company ID UUID format' }),

  userId: z
    .string({ required_error: 'User ID is required' })
    .uuid({ message: 'Invalid User ID UUID format' }),

  title: z
    .string({ required_error: 'Title is required' })
    .trim()
    .min(1, { message: 'Title cannot be empty' })
    .max(150, { message: 'Title must be 150 characters maximum' }),

  message: z
    .string({ required_error: 'Message is required' })
    .trim()
    .min(1, { message: 'Message cannot be empty' })
    .max(1000, { message: 'Message must be 1000 characters maximum' }),

  type: z
    .nativeEnum(NotificationType, {
      errorMap: () => ({ message: 'Invalid notification type' }),
    })
    .optional()
    .default(NotificationType.SYSTEM),

  priority: z
    .nativeEnum(NotificationPriority, {
      errorMap: () => ({ message: 'Invalid notification priority' }),
    })
    .optional()
    .default(NotificationPriority.MEDIUM),

  isRead: z.boolean().optional().default(false),

  readAt: z
    .string()
    .datetime({ message: 'Read date must be a valid ISO datetime string' })
    .optional()
    .nullable(),

  metadata: z.record(z.unknown()).optional().nullable(),
});

/**
 * Zod validation schema for updating an existing Notification record.
 * All fields are optional via `.partial()`.
 */
export const updateNotificationSchema = createNotificationSchema.partial();

/**
 * Zod validation schema for Notification URL path parameter validation.
 */
export const notificationIdParamSchema = z.object({
  id: z
    .string({ required_error: 'Notification ID is required' })
    .uuid({ message: 'Invalid Notification ID UUID format' }),
});

/**
 * Zod validation schema for Notification list query parameters and filters.
 */
export const notificationQuerySchema = z.object({
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

  userId: z
    .string()
    .uuid({ message: 'Invalid User ID UUID format' })
    .optional(),

  companyId: z
    .string()
    .uuid({ message: 'Invalid Company ID UUID format' })
    .optional(),

  type: z.nativeEnum(NotificationType).optional(),

  priority: z.nativeEnum(NotificationPriority).optional(),

  isRead: z
    .union([z.boolean(), z.string().transform((val) => val === 'true')])
    .optional(),

  sortBy: z
    .enum(['createdAt', 'readAt', 'priority'])
    .optional()
    .default('createdAt'),

  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

/**
 * Inferred TypeScript input types derived from Zod validation schemas.
 */
export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;
export type UpdateNotificationInput = z.infer<typeof updateNotificationSchema>;
export type NotificationIdInput = z.infer<typeof notificationIdParamSchema>;
export type NotificationQueryInput = z.infer<typeof notificationQuerySchema>;
