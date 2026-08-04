import { Prisma } from '@prisma/client';
import { prisma } from '../../../config/database';


export const PERMISSION_CATEGORIES = [
  'Dashboard',
  'Users',
  'Vehicles',
  'Drivers',
  'Trips',
  'Routes',
  'Shipments',
  'Fuel',
  'Maintenance',
  'Tracking',
  'Notifications',
  'Reports',
  'Analytics',
  'AI',
  'Settings',
  'Documents',
  'Audit Logs',
] as const;

export const PERMISSION_ACTIONS = [
  'View',
  'Create',
  'Edit',
  'Delete',
  'Export',
  'Approve',
  'Assign',
  'Manage',
] as const;

export type PermissionCategory = (typeof PERMISSION_CATEGORIES)[number];
export type PermissionAction = (typeof PERMISSION_ACTIONS)[number];

/**
 * The canonical permissions type used throughout the system.
 * Every value MUST be a string[] — never a boolean, object, or null.
 */
export type RolePermissions = Record<string, string[]>;

export interface RoleDetail {
  id: string;
  name: string;
  description: string | null;
  isSystem: boolean;
  permissions: RolePermissions;
  assignedUsersCount: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Normalises raw Prisma JSON permissions into the canonical RolePermissions shape.
 *
 * Handles the three shapes that may exist in the database:
 *   1. Administrator legacy shape: { all: true, scope: '*' }
 *      → converted to full-access across all categories
 *   2. Snake_case verb shape (from old seed): { vehicles: ['read', 'write'] }
 *      → mapped to canonical PascalCase actions where possible, extras dropped
 *   3. Already-canonical shape: { Vehicles: ['View', 'Create'] }
 *      → returned unchanged
 *
 * This function guarantees that every value in the returned map is string[].
 */
function normalisePermissions(
  raw: unknown,
  roleName: string
): RolePermissions {
  const VALID_ACTIONS = new Set<string>(PERMISSION_ACTIONS);
  const VALID_CATEGORIES = new Set<string>(PERMISSION_CATEGORIES);

  // Verb-to-Action mapping for legacy seed data
  const LEGACY_VERB_MAP: Record<string, string> = {
    read: 'View',
    write: 'Create',
    update_status: 'Edit',
    update: 'Edit',
    edit: 'Edit',
    delete: 'Delete',
    export: 'Export',
    approve: 'Approve',
    assign: 'Assign',
    manage: 'Manage',
  };

  // Category key normalisation (legacy lowercase → canonical PascalCase)
  const LEGACY_CATEGORY_MAP: Record<string, string> = {
    dashboard: 'Dashboard',
    users: 'Users',
    vehicles: 'Vehicles',
    drivers: 'Drivers',
    trips: 'Trips',
    routes: 'Routes',
    shipments: 'Shipments',
    fuel: 'Fuel',
    maintenance: 'Maintenance',
    tracking: 'Tracking',
    notifications: 'Notifications',
    reports: 'Reports',
    analytics: 'Analytics',
    ai: 'AI',
    settings: 'Settings',
    documents: 'Documents',
    'audit logs': 'Audit Logs',
    audit_logs: 'Audit Logs',
    profile: 'Settings', // legacy driver role key → closest canonical
  };

  // Null / undefined → empty permissions object
  if (raw === null || raw === undefined) {
    return {};
  }

  // Must be a plain object
  if (typeof raw !== 'object' || Array.isArray(raw)) {
    return {};
  }

  const obj = raw as Record<string, unknown>;

  // ── Case 1: Legacy Administrator shape { all: true, scope: '*' } ──────────
  // Detect by the presence of an "all" key whose value is NOT an array.
  if ('all' in obj && !Array.isArray(obj['all'])) {
    // Administrators have blanket access to everything — grant 'Manage' on all
    // categories so the UI shows full privileges.
    const full: RolePermissions = {};
    for (const cat of PERMISSION_CATEGORIES) {
      full[cat] = ['Manage'];
    }
    return full;
  }

  // ── Case 2 & 3: Key-value map of category → actions[] ────────────────────
  const normalised: RolePermissions = {};

  for (const [rawKey, rawValue] of Object.entries(obj)) {
    // Resolve category key
    const canonicalCategory =
      VALID_CATEGORIES.has(rawKey)
        ? rawKey
        : LEGACY_CATEGORY_MAP[rawKey.toLowerCase()];

    if (!canonicalCategory) {
      // Unknown category — skip silently
      continue;
    }

    // Value must be an array of strings
    if (!Array.isArray(rawValue)) {
      // Tolerate scalar boolean true as "all actions"
      if (rawValue === true) {
        normalised[canonicalCategory] = ['Manage'];
      }
      // Everything else we skip
      continue;
    }

    const actions: string[] = [];
    for (const v of rawValue) {
      if (typeof v !== 'string') continue;

      // Already canonical?
      if (VALID_ACTIONS.has(v)) {
        actions.push(v);
      } else {
        // Try legacy verb mapping
        const mapped = LEGACY_VERB_MAP[v.toLowerCase()];
        if (mapped) {
          actions.push(mapped);
        }
        // Unknown verbs are silently dropped
      }
    }

    // Deduplicate
    normalised[canonicalCategory] = [...new Set(actions)];
  }

  // Administrator name override: always grant full access regardless of stored shape
  if (roleName === 'Administrator') {
    const full: RolePermissions = {};
    for (const cat of PERMISSION_CATEGORIES) {
      full[cat] = ['Manage'];
    }
    return full;
  }

  return normalised;
}


export class RoleService {
  /**
   * Retrieves all enterprise roles along with assigned user counts.
   */
  async getRoles(): Promise<RoleDetail[]> {
    const roles = await prisma.role.findMany({
      include: {
        _count: {
          select: { users: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return roles.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      isSystem: r.isSystem,
      permissions: normalisePermissions(r.permissions, r.name),
      assignedUsersCount: r._count.users,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));
  }

  /**
   * Retrieves a single role profile by ID or Name.
   */
  async getRoleById(idOrName: string): Promise<RoleDetail> {
    const role = await prisma.role.findFirst({
      where: {
        OR: [{ id: idOrName }, { name: idOrName }],
      },
      include: {
        _count: {
          select: { users: true },
        },
      },
    });

    if (!role) {
      throw new Error(`Role '${idOrName}' not found.`);
    }

    return {
      id: role.id,
      name: role.name,
      description: role.description,
      isSystem: role.isSystem,
      permissions: normalisePermissions(role.permissions, role.name),
      assignedUsersCount: role._count.users,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  }

  /**
   * Retrieves full permission matrix meta structure.
   */
  async getPermissionMatrix() {
    const roles = await this.getRoles();
    return {
      categories: PERMISSION_CATEGORIES,
      actions: PERMISSION_ACTIONS,
      matrix: roles.map((r) => ({
        roleId: r.id,
        roleName: r.name,
        permissions: r.permissions,
      })),
    };
  }

  /**
   * Updates permissions for a specific role.
   * The incoming permissions MUST already conform to RolePermissions
   * (Record<string, string[]>). The validator ensures this.
   */
  async updateRolePermissions(id: string, permissions: RolePermissions): Promise<RoleDetail> {
    const role = await prisma.role.findUnique({ where: { id } });
    if (!role) {
      throw new Error(`Role with ID '${id}' does not exist.`);
    }

    const updated = await prisma.role.update({
      where: { id },
      data: {
        permissions: permissions as unknown as Prisma.InputJsonValue,
      },
      include: {
        _count: {
          select: { users: true },
        },
      },
    });

    return {
      id: updated.id,
      name: updated.name,
      description: updated.description,
      isSystem: updated.isSystem,
      permissions: normalisePermissions(updated.permissions, updated.name),
      assignedUsersCount: updated._count.users,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }
}

export const roleService = new RoleService();
