/**
 * Canonical permission action values.
 * Must stay in sync with backend PERMISSION_ACTIONS constant.
 */
export type PermissionAction =
  | 'View'
  | 'Create'
  | 'Edit'
  | 'Delete'
  | 'Export'
  | 'Approve'
  | 'Assign'
  | 'Manage';

/**
 * Canonical module category names.
 * Must stay in sync with backend PERMISSION_CATEGORIES constant.
 */
export type PermissionCategory =
  | 'Dashboard'
  | 'Users'
  | 'Vehicles'
  | 'Drivers'
  | 'Trips'
  | 'Routes'
  | 'Shipments'
  | 'Fuel'
  | 'Maintenance'
  | 'Tracking'
  | 'Notifications'
  | 'Reports'
  | 'Analytics'
  | 'AI'
  | 'Settings'
  | 'Documents'
  | 'Audit Logs';

/**
 * The single, authoritative permissions type used by every component in the
 * role module.  After passing through the backend normalisePermissions()
 * function the API response ALWAYS satisfies this type — every value is a
 * string[], never a boolean, object, or null.
 */
export type RolePermissions = Partial<Record<PermissionCategory, PermissionAction[]>>;

/**
 * Complete role record as returned by the API.
 */
export interface RoleDetail {
  id: string;
  name: string;
  description: string | null;
  isSystem: boolean;
  /** Guaranteed by the backend normaliser to be Record<string, string[]> */
  permissions: RolePermissions;
  assignedUsersCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PermissionMatrixResponse {
  categories: PermissionCategory[];
  actions: PermissionAction[];
  matrix: {
    roleId: string;
    roleName: string;
    permissions: RolePermissions;
  }[];
}
