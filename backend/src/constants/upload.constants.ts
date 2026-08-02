/**
 * Reusable constants defining Cloudinary subfolder paths for the FleetCore ecosystem.
 */
export const UPLOAD_FOLDER = {
  COMPANY: 'companies',
  USER: 'users',
  DRIVER: 'drivers',
  VEHICLE: 'vehicles',
  CUSTOMER: 'customers',
  SHIPMENT: 'shipments',
  MAINTENANCE: 'maintenance',
  FUEL: 'fuel',
  DOCUMENT: 'documents',
  AI: 'ai',
  MISC: 'misc',
} as const;

export type UploadFolderType = typeof UPLOAD_FOLDER[keyof typeof UPLOAD_FOLDER];
