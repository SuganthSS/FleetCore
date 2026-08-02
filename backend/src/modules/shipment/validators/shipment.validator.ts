import { ShipmentPriority, ShipmentStatus } from '@prisma/client';
import { z } from 'zod';

/**
 * Zod validation schema for creating a new Shipment record.
 */
export const createShipmentSchema = z.object({
  shipmentNumber: z
    .string({ required_error: 'Shipment number is required' })
    .trim()
    .min(1, { message: 'Shipment number cannot be empty' })
    .max(50, { message: 'Shipment number must be 50 characters maximum' }),

  title: z
    .string({ required_error: 'Title is required' })
    .trim()
    .min(1, { message: 'Title cannot be empty' })
    .max(200, { message: 'Title must be 200 characters maximum' }),

  description: z
    .string()
    .trim()
    .max(1000, { message: 'Description must be 1000 characters maximum' })
    .optional()
    .nullable(),

  cargoType: z
    .string()
    .trim()
    .max(100, { message: 'Cargo type must be 100 characters maximum' })
    .optional()
    .nullable(),

  weight: z
    .number({ invalid_type_error: 'Weight must be a number' })
    .positive({ message: 'Weight must be a positive number' })
    .optional()
    .nullable(),

  volume: z
    .number({ invalid_type_error: 'Volume must be a number' })
    .positive({ message: 'Volume must be a positive number' })
    .optional()
    .nullable(),

  quantity: z
    .number({ invalid_type_error: 'Quantity must be a number' })
    .int({ message: 'Quantity must be an integer' })
    .positive({ message: 'Quantity must be a positive integer' })
    .optional()
    .nullable(),

  pickupAddress: z
    .string({ required_error: 'Pickup address is required' })
    .trim()
    .min(1, { message: 'Pickup address cannot be empty' })
    .max(300, { message: 'Pickup address must be 300 characters maximum' }),

  pickupCity: z
    .string({ required_error: 'Pickup city is required' })
    .trim()
    .min(1, { message: 'Pickup city cannot be empty' })
    .max(100, { message: 'Pickup city must be 100 characters maximum' }),

  pickupState: z
    .string()
    .trim()
    .max(100, { message: 'Pickup state must be 100 characters maximum' })
    .optional()
    .nullable(),

  pickupCountry: z
    .string({ required_error: 'Pickup country is required' })
    .trim()
    .min(1, { message: 'Pickup country cannot be empty' })
    .max(100, { message: 'Pickup country must be 100 characters maximum' }),

  pickupPostalCode: z
    .string()
    .trim()
    .max(20, { message: 'Pickup postal code must be 20 characters maximum' })
    .optional()
    .nullable(),

  pickupDate: z
    .string()
    .datetime({ message: 'Invalid datetime format for pickup date' })
    .optional()
    .nullable(),

  deliveryAddress: z
    .string({ required_error: 'Delivery address is required' })
    .trim()
    .min(1, { message: 'Delivery address cannot be empty' })
    .max(300, { message: 'Delivery address must be 300 characters maximum' }),

  deliveryCity: z
    .string({ required_error: 'Delivery city is required' })
    .trim()
    .min(1, { message: 'Delivery city cannot be empty' })
    .max(100, { message: 'Delivery city must be 100 characters maximum' }),

  deliveryState: z
    .string()
    .trim()
    .max(100, { message: 'Delivery state must be 100 characters maximum' })
    .optional()
    .nullable(),

  deliveryCountry: z
    .string({ required_error: 'Delivery country is required' })
    .trim()
    .min(1, { message: 'Delivery country cannot be empty' })
    .max(100, { message: 'Delivery country must be 100 characters maximum' }),

  deliveryPostalCode: z
    .string()
    .trim()
    .max(20, { message: 'Delivery postal code must be 20 characters maximum' })
    .optional()
    .nullable(),

  expectedDeliveryDate: z
    .string()
    .datetime({ message: 'Invalid datetime format for expected delivery date' })
    .optional()
    .nullable(),

  priority: z
    .nativeEnum(ShipmentPriority, {
      errorMap: () => ({ message: 'Invalid shipment priority' }),
    })
    .optional(),

  status: z
    .nativeEnum(ShipmentStatus, {
      errorMap: () => ({ message: 'Invalid shipment status' }),
    })
    .optional(),

  customerId: z
    .string({ required_error: 'Customer ID is required' })
    .uuid({ message: 'Invalid Customer ID UUID format' }),

  companyId: z
    .string({ required_error: 'Company ID is required' })
    .uuid({ message: 'Invalid Company ID UUID format' }),
});

/**
 * Zod validation schema for updating an existing Shipment record.
 * All fields are optional via `.partial()`.
 */
export const updateShipmentSchema = createShipmentSchema.partial();

/**
 * Zod validation schema for shipment URL path parameter validation.
 */
export const shipmentIdParamSchema = z.object({
  id: z
    .string({ required_error: 'Shipment ID is required' })
    .uuid({ message: 'Invalid Shipment ID UUID format' }),
});

/**
 * Zod validation schema for shipment list query parameters and filters.
 */
export const shipmentQuerySchema = z.object({
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
    .nativeEnum(ShipmentStatus, {
      errorMap: () => ({ message: 'Invalid status filter' }),
    })
    .optional(),

  priority: z
    .nativeEnum(ShipmentPriority, {
      errorMap: () => ({ message: 'Invalid priority filter' }),
    })
    .optional(),

  customerId: z
    .string()
    .uuid({ message: 'Invalid Customer ID UUID format' })
    .optional(),

  companyId: z
    .string()
    .uuid({ message: 'Invalid Company ID UUID format' })
    .optional(),

  sortBy: z
    .enum(['createdAt', 'shipmentNumber', 'pickupDate', 'expectedDeliveryDate'])
    .optional()
    .default('createdAt'),

  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

/**
 * Inferred TypeScript input types derived from Zod validation schemas.
 */
export type CreateShipmentInput = z.infer<typeof createShipmentSchema>;
export type UpdateShipmentInput = z.infer<typeof updateShipmentSchema>;
export type ShipmentIdInput = z.infer<typeof shipmentIdParamSchema>;
export type ShipmentQueryInput = z.infer<typeof shipmentQuerySchema>;
