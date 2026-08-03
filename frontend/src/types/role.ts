export type PermissionAction =
  | 'View'
  | 'Create'
  | 'Edit'
  | 'Delete'
  | 'Export'
  | 'Approve'
  | 'Assign'
  | 'Manage';

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

export interface RoleDetail {
  id: string;
  name: string;
  description: string | null;
  isSystem: boolean;
  permissions: Record<string, string[]>;
  assignedUsersCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PermissionMatrixResponse {
  categories: string[];
  actions: string[];
  matrix: {
    roleId: string;
    roleName: string;
    permissions: Record<string, string[]>;
  }[];
}
