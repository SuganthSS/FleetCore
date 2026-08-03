export type SettingsTab =
  | 'profile'
  | 'general'
  | 'appearance'
  | 'notifications'
  | 'security'
  | 'integrations'
  | 'ai';

export interface CompanyProfile {
  organizationName: string;
  legalName?: string;
  registrationNumber?: string;
  taxId?: string;
  industry?: string;
  fleetSize?: string;
  primaryEmail: string;
  supportEmail?: string;
  phone?: string;
  website?: string;
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  postalCode?: string;
  timezone?: string;
  language?: string;
  currency?: string;
  businessHours?: string;
  logoUrl?: string;
}

export interface GeneralSettings {
  theme: 'light' | 'dark' | 'system';
  accentColor: string;
  dateFormat: string;
  timeFormat: string;
  measurementUnits: 'metric' | 'imperial';
  distanceUnits: 'km' | 'mi';
  weightUnits: 'kg' | 'lbs' | 'tons';
  fuelUnits: 'liters' | 'gallons';
}

export interface ApiKeyItem {
  id: string;
  name: string;
  prefix: string;
  createdAt: string;
  lastUsed: string;
  status: 'ACTIVE' | 'REVOKED';
}

export interface SecuritySettings {
  passwordPolicy: 'standard' | 'strict' | 'enterprise';
  sessionTimeoutMinutes: number;
  twoFactorAuth: boolean;
  allowedLoginDevices: string[];
  apiKeys?: ApiKeyItem[];
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  maintenanceAlerts: boolean;
  tripAlerts: boolean;
  fuelAlerts: boolean;
  driverAlerts: boolean;
  aiAlerts: boolean;
}

export interface AISettings {
  provider: string;
  model: string;
  temperature: number;
  maxTokens: number;
  streaming: boolean;
  aiAssistant: boolean;
  routeOptimization: boolean;
  maintenancePrediction: boolean;
  riskAnalysis: boolean;
}

export interface IntegrationItem {
  id: string;
  name: string;
  description: string;
  configured: boolean;
  status: 'CONNECTED' | 'DEGRADED' | 'NOT_CONFIGURED' | 'MOCK_MODE';
  cloudName?: string;
  folder?: string;
  connectionPool?: string;
  model?: string;
}

export interface IntegrationSettings {
  integrations: IntegrationItem[];
  systemStatus: {
    health: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY';
    uptimeSeconds: number;
    lastHealthCheck: string;
  };
}

export interface AllSettings {
  company: CompanyProfile;
  general: GeneralSettings;
  security: SecuritySettings;
  notifications: NotificationSettings;
  ai: AISettings;
  integrations: IntegrationSettings;
}
