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

export interface RoleDetail {
  id: string;
  name: string;
  description: string | null;
  isSystem: boolean;
  permissions: Record<string, string[]>;
  assignedUsersCount: number;
  createdAt: Date;
  updatedAt: Date;
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
      permissions: (r.permissions as Record<string, string[]>) || {},
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
      permissions: (role.permissions as Record<string, string[]>) || {},
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
   */
  async updateRolePermissions(id: string, permissions: Record<string, string[]>): Promise<RoleDetail> {
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
      permissions: (updated.permissions as Record<string, string[]>) || {},
      assignedUsersCount: updated._count.users,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }
}

export const roleService = new RoleService();
