import { Prisma, User, UserStatus } from '@prisma/client';
import { prisma } from '../../../config/database';
import { hashPassword } from '../../auth/utils/password.util';
import {
  CreateUserInput,
  UpdateUserInput,
  UserQueryInput,
} from '../validators/user.validator';

export interface PaginatedUserResult {
  items: Omit<User, 'passwordHash'>[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const defaultUserSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  companyId: true,
  roleId: true,
  department: true,
  designation: true,
  avatarUrl: true,
  status: true,
  emailVerified: true,
  lastLogin: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  company: {
    select: {
      id: true,
      name: true,
    },
  },
  role: {
    select: {
      id: true,
      name: true,
      permissions: true,
    },
  },
};

export class UserService {
  /**
   * Creates a new user record after verifying constraints.
   */
  async createUser(input: CreateUserInput): Promise<any> {
    // 1. Verify company exists (or fallback to primary default company)
    let companyId = input.companyId;
    if (!companyId) {
      const defaultCompany = await prisma.company.findFirst();
      if (!defaultCompany) {
        throw new Error('No system company exists to assign user.');
      }
      companyId = defaultCompany.id;
    } else {
      const company = await prisma.company.findUnique({
        where: { id: companyId },
      });
      if (!company) {
        throw new Error(`Company with ID '${companyId}' does not exist.`);
      }
    }

    // 2. Verify role exists
    const role = await prisma.role.findUnique({
      where: { id: input.roleId },
    });
    if (!role) {
      throw new Error(`Role with ID '${input.roleId}' does not exist.`);
    }

    // 3. Verify unique email
    const existingUser = await prisma.user.findFirst({
      where: { email: input.email.toLowerCase().trim() },
    });
    if (existingUser) {
      throw new Error(`Email '${input.email}' is already registered.`);
    }

    // 4. Hash password
    const passwordHash = await hashPassword(input.password);

    // 5. Create user
    return await prisma.user.create({
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email.toLowerCase().trim(),
        phone: input.phone || null,
        passwordHash,
        companyId,
        roleId: input.roleId,
        status: input.status,
        department: input.department || null,
        designation: input.designation || null,
      },
      select: defaultUserSelect,
    });
  }

  /**
   * Retrieves a single user record by ID.
   */
  async getUserById(id: string, companyId?: string): Promise<any> {
    const where: Prisma.UserWhereInput = {
      id,
      deletedAt: null,
    };

    if (companyId) {
      where.companyId = companyId;
    }

    const user = await prisma.user.findFirst({
      where,
      select: defaultUserSelect,
    });

    if (!user) {
      throw new Error(`User with ID '${id}' not found.`);
    }

    return user;
  }

  /**
   * Lists users with filtering, sorting, pagination, and tenant isolation.
   */
  async getUsers(
    query: UserQueryInput,
    companyId?: string
  ): Promise<PaginatedUserResult> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      deletedAt: null,
    };

    const activeCompanyId = companyId || query.companyId;
    if (activeCompanyId) {
      where.companyId = activeCompanyId;
    }

    if (query.roleId) {
      where.roleId = query.roleId;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.search && query.search.trim() !== '') {
      const searchTerm = query.search.trim();
      where.OR = [
        { firstName: { contains: searchTerm, mode: 'insensitive' } },
        { lastName: { contains: searchTerm, mode: 'insensitive' } },
        { email: { contains: searchTerm, mode: 'insensitive' } },
        { department: { contains: searchTerm, mode: 'insensitive' } },
        { designation: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder || 'desc';

    const [items, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
        select: defaultUserSelect,
      }),
      prisma.user.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      items,
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Updates an existing user with authorization checks.
   */
  async updateUser(
    id: string,
    input: UpdateUserInput,
    companyId?: string,
    isActorAdmin = false
  ): Promise<any> {
    const existingUser = await this.getUserById(id, companyId);

    // Prevent modifying Administrator if actor is not Administrator
    if (existingUser.role.name === 'Administrator' && !isActorAdmin) {
      throw new Error('Unauthorized to modify an Administrator user.');
    }

    // Verify unique email if email is changing
    if (input.email && input.email.toLowerCase().trim() !== existingUser.email) {
      const duplicateEmail = await prisma.user.findFirst({
        where: { email: input.email.toLowerCase().trim() },
      });
      if (duplicateEmail) {
        throw new Error(`Email '${input.email}' is already in use.`);
      }
    }

    // Verify role if changing
    if (input.roleId && input.roleId !== existingUser.roleId) {
      const roleExists = await prisma.role.findUnique({
        where: { id: input.roleId },
      });
      if (!roleExists) {
        throw new Error(`Role with ID '${input.roleId}' does not exist.`);
      }
      // If setting to Administrator, actor must be Administrator
      if (roleExists.name === 'Administrator' && !isActorAdmin) {
        throw new Error('Only an Administrator can assign the Administrator role.');
      }
    }

    // Verify company if changing (Only Administrator can change companyId)
    if (input.companyId && input.companyId !== existingUser.companyId) {
      if (!isActorAdmin) {
        throw new Error('Only an Administrator can change a user\'s company.');
      }
      const companyExists = await prisma.company.findUnique({
        where: { id: input.companyId },
      });
      if (!companyExists) {
        throw new Error(`Company with ID '${input.companyId}' does not exist.`);
      }
    }

    return await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email ? input.email.toLowerCase().trim() : undefined,
        phone: input.phone !== undefined ? input.phone : undefined,
        companyId: input.companyId,
        roleId: input.roleId,
        status: input.status,
        department: input.department !== undefined ? input.department : undefined,
        designation: input.designation !== undefined ? input.designation : undefined,
      },
      select: defaultUserSelect,
    });
  }

  /**
   * Soft deletes a user by setting deletedAt timestamp.
   */
  async deleteUser(
    id: string,
    companyId?: string,
    isActorAdmin = false
  ): Promise<any> {
    const existingUser = await this.getUserById(id, companyId);

    // Prevent modifying Administrator if actor is not Administrator
    if (existingUser.role.name === 'Administrator' && !isActorAdmin) {
      throw new Error('Unauthorized to modify an Administrator user.');
    }

    return await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        deletedAt: new Date(),
        status: UserStatus.INACTIVE, // Deactivate on soft delete
      },
      select: defaultUserSelect,
    });
  }

  /**
   * Updates operational status of a user.
   */
  async updateUserStatus(
    id: string,
    status: UserStatus,
    companyId?: string,
    isActorAdmin = false
  ): Promise<any> {
    const existingUser = await this.getUserById(id, companyId);

    // Prevent modifying Administrator if actor is not Administrator
    if (existingUser.role.name === 'Administrator' && !isActorAdmin) {
      throw new Error('Unauthorized to modify an Administrator user.');
    }

    return await prisma.user.update({
      where: { id: existingUser.id },
      data: { status },
      select: defaultUserSelect,
    });
  }

  /**
   * Resets password of a user.
   */
  async resetUserPassword(
    id: string,
    passwordPlaintext: string,
    companyId?: string,
    isActorAdmin = false
  ): Promise<any> {
    const existingUser = await this.getUserById(id, companyId);

    // Prevent modifying Administrator if actor is not Administrator
    if (existingUser.role.name === 'Administrator' && !isActorAdmin) {
      throw new Error('Unauthorized to modify an Administrator user.');
    }

    const passwordHash = await hashPassword(passwordPlaintext);

    return await prisma.user.update({
      where: { id: existingUser.id },
      data: { passwordHash },
      select: defaultUserSelect,
    });
  }

  /**
   * Retrieves available system roles.
   */
  async getRoles(): Promise<any[]> {
    return await prisma.role.findMany({
      select: {
        id: true,
        name: true,
        description: true,
      },
      orderBy: { name: 'asc' },
    });
  }
}

export const userService = new UserService();

