import { z } from 'zod';

export const CompanyProfileSchema = z.object({
  organizationName: z.string().min(2, 'Organization Name must be at least 2 characters'),
  legalName: z.string().optional(),
  registrationNumber: z.string().optional(),
  taxId: z.string().optional(),
  industry: z.string().optional(),
  fleetSize: z.string().optional(),
  primaryEmail: z.string().email('Invalid primary email address'),
  supportEmail: z.string().email('Invalid support email address').optional().or(z.literal('')),
  phone: z.string().optional(),
  website: z.string().optional(),
  address: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  timezone: z.string().optional(),
  language: z.string().optional(),
  currency: z.string().optional(),
  businessHours: z.string().optional(),
});

export const GeneralSettingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).default('light'),
  accentColor: z.string().default('#004ac6'),
  dateFormat: z.string().default('YYYY-MM-DD'),
  timeFormat: z.string().default('24h'),
  measurementUnits: z.enum(['metric', 'imperial']).default('metric'),
  distanceUnits: z.enum(['km', 'mi']).default('km'),
  weightUnits: z.enum(['kg', 'lbs', 'tons']).default('kg'),
  fuelUnits: z.enum(['liters', 'gallons']).default('liters'),
});

export const SecuritySettingsSchema = z.object({
  passwordPolicy: z.enum(['standard', 'strict', 'enterprise']).default('strict'),
  sessionTimeoutMinutes: z.number().min(5).max(1440).default(60),
  twoFactorAuth: z.boolean().default(true),
  allowedLoginDevices: z.array(z.string()).default(['Desktop', 'Mobile', 'Tablet']),
});

export const NotificationSettingsSchema = z.object({
  emailNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(true),
  maintenanceAlerts: z.boolean().default(true),
  tripAlerts: z.boolean().default(true),
  fuelAlerts: z.boolean().default(true),
  driverAlerts: z.boolean().default(true),
  aiAlerts: z.boolean().default(true),
});

export const AISettingsSchema = z.object({
  provider: z.string().default('Groq'),
  model: z.string().default('llama-3.3-70b-versatile'),
  temperature: z.number().min(0).max(2).default(0.7),
  maxTokens: z.number().min(100).max(32000).default(4096),
  streaming: z.boolean().default(true),
  aiAssistant: z.boolean().default(true),
  routeOptimization: z.boolean().default(true),
  maintenancePrediction: z.boolean().default(true),
  riskAnalysis: z.boolean().default(true),
});

export type CompanyProfileInput = z.infer<typeof CompanyProfileSchema>;
export type GeneralSettingsInput = z.infer<typeof GeneralSettingsSchema>;
export type SecuritySettingsInput = z.infer<typeof SecuritySettingsSchema>;
export type NotificationSettingsInput = z.infer<typeof NotificationSettingsSchema>;
export type AISettingsInput = z.infer<typeof AISettingsSchema>;
