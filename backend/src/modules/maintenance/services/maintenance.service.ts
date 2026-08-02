import { MaintenanceRecord, Prisma } from '@prisma/client';
import { prisma } from '../../../config/database';
import {
  CreateMaintenanceInput,
  UpdateMaintenanceInput,
  MaintenanceQueryInput,
} from '../validators/maintenance.validator';

export interface PaginatedMaintenanceResult {
  items: MaintenanceRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const defaultMaintenanceInclude = {
  vehicle: {
    select: {
      id: true,
      registrationNumber: true,
      make: true,
      model: true,
      status: true,
    },
  },
  driver: {
    select: {
      id: true,
      licenseNumber: true,
      user: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  },
  company: {
    select: {
      id: true,
      name: true,
    },
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapMaintenance(record: any): any {
  if (!record) return record;
  if (record.driver) {
    record.driver.firstName = record.driver.user?.firstName || '';
    record.driver.lastName = record.driver.user?.lastName || '';
    delete record.driver.user;
  }
  return record;
}


export class MaintenanceService {
  /**
   * Generates a unique maintenance work order reference code.
   */
  private generateMaintenanceRecordNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    return `MAINT-${timestamp}-${random}`;
  }

  /**
   * Creates a new MaintenanceRecord work order entry after validating company,
   * vehicle, and optional driver tenant scoping.
   *
   * @param input Data for creating maintenance work order
   * @returns Created MaintenanceRecord with relations
   */
  async createMaintenance(
    input: CreateMaintenanceInput
  ): Promise<MaintenanceRecord> {
    const company = await prisma.company.findUnique({
      where: { id: input.companyId },
    });
    if (!company) {
      throw new Error(`Company with ID '${input.companyId}' does not exist.`);
    }

    const vehicle = await prisma.vehicle.findUnique({
      where: { id: input.vehicleId },
    });
    if (!vehicle) {
      throw new Error(`Vehicle with ID '${input.vehicleId}' does not exist.`);
    }
    if (vehicle.companyId !== input.companyId) {
      throw new Error(
        `Vehicle with ID '${input.vehicleId}' does not belong to the specified company.`
      );
    }

    let activeDriverId = input.driverId;
    if (activeDriverId) {
      const driver = await prisma.driver.findUnique({
        where: { id: activeDriverId },
      });
      if (!driver) {
        throw new Error(`Driver with ID '${activeDriverId}' does not exist.`);
      }
      if (driver.companyId !== input.companyId) {
        throw new Error(
          `Driver with ID '${activeDriverId}' does not belong to the specified company.`
        );
      }
    } else {
      // Fallback to first available company driver to fulfill database relation requirement
      const defaultDriver = await prisma.driver.findFirst({
        where: { companyId: input.companyId },
      });
      if (!defaultDriver) {
        throw new Error(
          `No active driver found for company ID '${input.companyId}'.`
        );
      }
      activeDriverId = defaultDriver.id;
    }

    const maintenanceRecordNumber = this.generateMaintenanceRecordNumber();

    const maintenance = await prisma.maintenanceRecord.create({
      data: {
        maintenanceRecordNumber,
        maintenanceType: input.maintenanceType,
        status: input.status,
        scheduledDate: new Date(input.scheduledDate),
        completedDate: input.completedDate ? new Date(input.completedDate) : null,
        serviceProvider: input.serviceProvider || input.title,
        description: input.description || null,
        cost: input.actualCost ?? input.estimatedCost ?? null,
        odometerReading: input.odometerReading ?? null,
        nextMaintenanceDate: input.nextMaintenanceDate
          ? new Date(input.nextMaintenanceDate)
          : null,
        notes: input.notes || null,
        companyId: input.companyId,
        vehicleId: input.vehicleId,
        driverId: activeDriverId,
      },
      include: defaultMaintenanceInclude,
    });

    return mapMaintenance(maintenance);
  }

  /**
   * Retrieves a single MaintenanceRecord by UUID with optional companyId tenant isolation.
   *
   * @param id MaintenanceRecord UUID
   * @param companyId Optional company tenant isolation filter
   * @returns Found MaintenanceRecord entry
   */
  async getMaintenanceById(
    id: string,
    companyId?: string
  ): Promise<MaintenanceRecord> {
    const where: Prisma.MaintenanceRecordWhereInput = { id };
    if (companyId) {
      where.companyId = companyId;
    }

    const maintenance = await prisma.maintenanceRecord.findFirst({
      where,
      include: defaultMaintenanceInclude,
    });

    if (!maintenance) {
      throw new Error(`Maintenance record with ID '${id}' not found.`);
    }

    return mapMaintenance(maintenance);
  }

  /**
   * Retrieves a paginated list of maintenance records with search, filter, and sorting.
   *
   * @param query Query filters, search string, pagination & sorting options
   * @param companyId Optional company tenant isolation filter
   * @returns Paginated maintenance record result with metadata
   */
  async getMaintenances(
    query: MaintenanceQueryInput,
    companyId?: string
  ): Promise<PaginatedMaintenanceResult> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.MaintenanceRecordWhereInput = {};

    const activeCompanyId = companyId || query.companyId;
    if (activeCompanyId) {
      where.companyId = activeCompanyId;
    }

    if (query.vehicleId) {
      where.vehicleId = query.vehicleId;
    }

    if (query.maintenanceType) {
      where.maintenanceType = query.maintenanceType;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.search && query.search.trim() !== '') {
      const searchTerm = query.search.trim();
      where.OR = [
        { description: { contains: searchTerm, mode: 'insensitive' } },
        { serviceProvider: { contains: searchTerm, mode: 'insensitive' } },
        { maintenanceRecordNumber: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder || 'desc';

    const orderByField =
      sortBy === 'actualCost' || sortBy === 'estimatedCost' ? 'cost' : sortBy;

    const [items, total] = await Promise.all([
      prisma.maintenanceRecord.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [orderByField]: sortOrder,
        },
        include: defaultMaintenanceInclude,
      }),
      prisma.maintenanceRecord.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      items: items.map(mapMaintenance),
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Updates an existing MaintenanceRecord by ID, verifying tenant isolation and relation integrity.
   *
   * @param id MaintenanceRecord UUID to update
   * @param input Data fields to update
   * @param companyId Optional company tenant isolation filter
   * @returns Updated MaintenanceRecord entry
   */
  async updateMaintenance(
    id: string,
    input: UpdateMaintenanceInput,
    companyId?: string
  ): Promise<MaintenanceRecord> {
    const existingRecord = await this.getMaintenanceById(id, companyId);
    const activeCompanyId = companyId || existingRecord.companyId;

    if (input.vehicleId && input.vehicleId !== existingRecord.vehicleId) {
      const vehicle = await prisma.vehicle.findUnique({
        where: { id: input.vehicleId },
      });
      if (!vehicle) {
        throw new Error(`Vehicle with ID '${input.vehicleId}' does not exist.`);
      }
      if (vehicle.companyId !== activeCompanyId) {
        throw new Error(
          `Vehicle with ID '${input.vehicleId}' does not belong to the specified company.`
        );
      }
    }

    if (input.driverId && input.driverId !== existingRecord.driverId) {
      const driver = await prisma.driver.findUnique({
        where: { id: input.driverId },
      });
      if (!driver) {
        throw new Error(`Driver with ID '${input.driverId}' does not exist.`);
      }
      if (driver.companyId !== activeCompanyId) {
        throw new Error(
          `Driver with ID '${input.driverId}' does not belong to the specified company.`
        );
      }
    }

    const updatedRecord = await prisma.maintenanceRecord.update({
      where: { id: existingRecord.id },
      data: {
        maintenanceType: input.maintenanceType,
        status: input.status,
        scheduledDate: input.scheduledDate
          ? new Date(input.scheduledDate)
          : undefined,
        completedDate:
          input.completedDate !== undefined
            ? input.completedDate
              ? new Date(input.completedDate)
              : null
            : undefined,
        serviceProvider:
          input.serviceProvider !== undefined
            ? input.serviceProvider || input.title || null
            : input.title
            ? input.title
            : undefined,
        description:
          input.description !== undefined
            ? input.description || null
            : undefined,
        cost:
          input.actualCost !== undefined
            ? input.actualCost
            : input.estimatedCost !== undefined
            ? input.estimatedCost
            : undefined,
        odometerReading:
          input.odometerReading !== undefined
            ? input.odometerReading
            : undefined,
        nextMaintenanceDate:
          input.nextMaintenanceDate !== undefined
            ? input.nextMaintenanceDate
              ? new Date(input.nextMaintenanceDate)
              : null
            : undefined,
        notes: input.notes !== undefined ? input.notes || null : undefined,
        vehicleId: input.vehicleId,
        driverId: input.driverId !== undefined ? input.driverId || undefined : undefined,
      },
      include: defaultMaintenanceInclude,
    });

    return mapMaintenance(updatedRecord);
  }

  /**
   * Hard deletes a MaintenanceRecord by ID after verifying tenant isolation.
   *
   * @param id MaintenanceRecord UUID to delete
   * @param companyId Optional company tenant isolation filter
   * @returns Deleted MaintenanceRecord entry
   */
  async deleteMaintenance(
    id: string,
    companyId?: string
  ): Promise<MaintenanceRecord> {
    const existingRecord = await this.getMaintenanceById(id, companyId);

    return await prisma.maintenanceRecord.delete({
      where: { id: existingRecord.id },
    });
  }
}

export const maintenanceService = new MaintenanceService();
