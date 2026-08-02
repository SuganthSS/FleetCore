import { Driver, Prisma } from '@prisma/client';
import { prisma } from '../../../config/database';
import { hashPassword } from '../../auth/utils/password.util';
import {
  CreateDriverInput,
  UpdateDriverInput,
  DriverQueryInput,
} from '../validators/driver.validator';

export interface PaginatedDriverResult {
  items: Driver[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class DriverService {
  /**
   * Creates a new Driver profile after validating company, user, and unique constraints.
   *
   * @param input Data for creating driver
   * @returns Created Driver record
   */
  async createDriver(input: CreateDriverInput): Promise<Driver> {
    const company = await prisma.company.findUnique({
      where: { id: input.companyId },
    });
    if (!company) {
      throw new Error(`Company with ID '${input.companyId}' does not exist.`);
    }

    let finalUserId = input.userId;

    if (!finalUserId) {
      // Validate firstName, lastName, email
      const { firstName, lastName, email, phone } = input;
      if (!firstName || !lastName || !email) {
        throw new Error('First name, last name, and email are required to create a new driver user.');
      }

      // Check email uniqueness
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        throw new Error(`User with email '${email}' already exists.`);
      }

      // Find 'Driver' Role
      const driverRole = await prisma.role.findUnique({
        where: { name: 'Driver' },
      });
      if (!driverRole) {
        throw new Error("Default 'Driver' role not found in database. Please seed the database.");
      }

      // Create User
      const passwordHash = await hashPassword('Driver@FleetCore2026!');
      const newUser = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          phone: phone || null,
          passwordHash,
          companyId: input.companyId,
          roleId: driverRole.id,
          status: 'ACTIVE',
          emailVerified: true,
        },
      });

      finalUserId = newUser.id;
    } else {
      const user = await prisma.user.findUnique({
        where: { id: finalUserId },
      });
      if (!user) {
        throw new Error(`User with ID '${finalUserId}' does not exist.`);
      }

      if (user.companyId !== input.companyId) {
        throw new Error(`User '${finalUserId}' belongs to a different company.`);
      }

      const existingUserDriver = await prisma.driver.findUnique({
        where: { userId: finalUserId },
      });
      if (existingUserDriver) {
        throw new Error(`User '${finalUserId}' is already assigned to a driver profile.`);
      }
    }


    const existingEmpId = await prisma.driver.findUnique({
      where: { employeeId: input.employeeId },
    });
    if (existingEmpId) {
      throw new Error(`Driver with employee ID '${input.employeeId}' already exists.`);
    }

    const existingLicense = await prisma.driver.findUnique({
      where: { licenseNumber: input.licenseNumber },
    });
    if (existingLicense) {
      throw new Error(`Driver with license number '${input.licenseNumber}' already exists.`);
    }

    const driver = await prisma.driver.create({
      data: {
        employeeId: input.employeeId,
        userId: finalUserId,
        companyId: input.companyId,

        experienceLevel: input.experienceLevel,
        availability: input.availability,
        licenseNumber: input.licenseNumber,
        licenseExpiry: input.licenseExpiry,
        joiningDate: input.joiningDate ?? null,
        emergencyContactName: input.emergencyContactName ?? null,
        emergencyContactPhone: input.emergencyContactPhone ?? null,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return driver;
  }

  /**
   * Retrieves a single Driver profile by UUID and optional companyId for multi-tenant isolation.
   *
   * @param id Driver UUID
   * @param companyId Optional company tenant isolation filter
   * @returns Found Driver record
   */
  async getDriverById(id: string, companyId?: string): Promise<Driver> {
    const where: Prisma.DriverWhereInput = { id };
    if (companyId) {
      where.companyId = companyId;
    }

    const driver = await prisma.driver.findFirst({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            avatarUrl: true,
            status: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!driver) {
      throw new Error(`Driver with ID '${id}' not found.`);
    }

    return driver;
  }

  /**
   * Retrieves a paginated list of drivers matching search, filter, and sorting parameters.
   *
   * @param query Query filters, search string, pagination & sorting options
   * @param companyId Optional company tenant isolation filter
   * @returns Paginated driver result with metadata
   */
  async getDrivers(
    query: DriverQueryInput,
    companyId?: string
  ): Promise<PaginatedDriverResult> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.DriverWhereInput = {};

    const activeCompanyId = companyId || query.companyId;
    if (activeCompanyId) {
      where.companyId = activeCompanyId;
    }

    if (query.availability) {
      where.availability = query.availability;
    }

    if (query.experienceLevel) {
      where.experienceLevel = query.experienceLevel;
    }

    if (query.search && query.search.trim() !== '') {
      const searchTerm = query.search.trim();
      where.OR = [
        { employeeId: { contains: searchTerm, mode: 'insensitive' } },
        { licenseNumber: { contains: searchTerm, mode: 'insensitive' } },
        { user: { firstName: { contains: searchTerm, mode: 'insensitive' } } },
        { user: { lastName: { contains: searchTerm, mode: 'insensitive' } } },
        { user: { email: { contains: searchTerm, mode: 'insensitive' } } },
      ];
    }

    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder || 'desc';

    const [items, total] = await Promise.all([
      prisma.driver.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
          company: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.driver.count({ where }),
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
   * Updates an existing driver record by ID.
   *
   * @param id Driver UUID to update
   * @param input Data fields to update
   * @param companyId Optional company tenant isolation filter
   * @returns Updated Driver record
   */
  async updateDriver(
    id: string,
    input: UpdateDriverInput,
    companyId?: string
  ): Promise<Driver> {
    const existingDriver = await this.getDriverById(id, companyId);

    if (input.employeeId && input.employeeId !== existingDriver.employeeId) {
      const duplicateEmp = await prisma.driver.findUnique({
        where: { employeeId: input.employeeId },
      });
      if (duplicateEmp) {
        throw new Error(`Driver with employee ID '${input.employeeId}' already exists.`);
      }
    }

    if (input.licenseNumber && input.licenseNumber !== existingDriver.licenseNumber) {
      const duplicateLicense = await prisma.driver.findUnique({
        where: { licenseNumber: input.licenseNumber },
      });
      if (duplicateLicense) {
        throw new Error(`Driver with license number '${input.licenseNumber}' already exists.`);
      }
    }

    if (input.userId && input.userId !== existingDriver.userId) {
      const user = await prisma.user.findUnique({
        where: { id: input.userId },
      });
      if (!user) {
        throw new Error(`User with ID '${input.userId}' does not exist.`);
      }
      const activeCompanyId = companyId || existingDriver.companyId;
      if (user.companyId !== activeCompanyId) {
        throw new Error(`User '${input.userId}' belongs to a different company.`);
      }
      const duplicateUser = await prisma.driver.findUnique({
        where: { userId: input.userId },
      });
      if (duplicateUser) {
        throw new Error(`User '${input.userId}' is already assigned to a driver profile.`);
      }
    }

    const { firstName, lastName, email, phone } = input;
    if (
      firstName !== undefined ||
      lastName !== undefined ||
      email !== undefined ||
      phone !== undefined
    ) {
      const existingUserEmail = (existingDriver as { user?: { email: string } }).user?.email;
      if (email && email !== existingUserEmail) {
        const existingEmailUser = await prisma.user.findUnique({
          where: { email },
        });
        if (existingEmailUser && existingEmailUser.id !== existingDriver.userId) {
          throw new Error(`User with email '${email}' already exists.`);
        }
      }

      await prisma.user.update({
        where: { id: existingDriver.userId },
        data: {
          firstName: firstName !== undefined ? firstName : undefined,
          lastName: lastName !== undefined ? lastName : undefined,
          email: email !== undefined ? email : undefined,
          phone: phone !== undefined ? phone : undefined,
        },
      });
    }

    const updatedDriver = await prisma.driver.update({
      where: { id: existingDriver.id },
      data: {

        employeeId: input.employeeId,
        userId: input.userId,
        experienceLevel: input.experienceLevel,
        availability: input.availability,
        licenseNumber: input.licenseNumber,
        licenseExpiry: input.licenseExpiry,
        joiningDate: input.joiningDate !== undefined ? input.joiningDate : undefined,
        emergencyContactName:
          input.emergencyContactName !== undefined ? input.emergencyContactName : undefined,
        emergencyContactPhone:
          input.emergencyContactPhone !== undefined ? input.emergencyContactPhone : undefined,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return updatedDriver;
  }

  /**
   * Hard deletes a driver record by ID.
   *
   * @param id Driver UUID to delete
   * @param companyId Optional company tenant isolation filter
   * @returns Deleted Driver record
   */
  async deleteDriver(id: string, companyId?: string): Promise<Driver> {
    const existingDriver = await this.getDriverById(id, companyId);

    return await prisma.driver.delete({
      where: { id: existingDriver.id },
    });
  }
}

export const driverService = new DriverService();
