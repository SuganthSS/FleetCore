import { Vehicle, Prisma } from '@prisma/client';
import { prisma } from '../../../config/database';
import {
  CreateVehicleInput,
  UpdateVehicleInput,
  VehicleQueryInput,
} from '../validators/vehicle.validator';

export interface PaginatedVehicleResult {
  items: Vehicle[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class VehicleService {
  /**
   * Creates a new Vehicle record after validating company existence and uniqueness of registrationNumber and VIN.
   *
   * @param input Data for creating vehicle
   * @returns Created Vehicle record
   */
  async createVehicle(input: CreateVehicleInput): Promise<Vehicle> {
    const company = await prisma.company.findUnique({
      where: { id: input.companyId },
    });

    if (!company) {
      throw new Error(`Company with ID '${input.companyId}' does not exist.`);
    }

    const existingReg = await prisma.vehicle.findUnique({
      where: { registrationNumber: input.registrationNumber },
    });
    if (existingReg) {
      throw new Error(`Vehicle with registration number '${input.registrationNumber}' already exists.`);
    }

    const existingVin = await prisma.vehicle.findUnique({
      where: { vin: input.vin },
    });
    if (existingVin) {
      throw new Error(`Vehicle with VIN '${input.vin}' already exists.`);
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        registrationNumber: input.registrationNumber,
        vin: input.vin,
        make: input.make,
        model: input.model,
        manufacturingYear: input.manufacturingYear,
        vehicleType: input.vehicleType,
        fuelType: input.fuelType,
        capacity: input.capacity ?? null,
        status: input.status,
        companyId: input.companyId,
      },
    });

    return vehicle;
  }

  /**
   * Retrieves a single Vehicle by its unique UUID and optional companyId for tenant isolation.
   *
   * @param id Vehicle UUID
   * @param companyId Optional company tenant isolation filter
   * @returns Found Vehicle record
   */
  async getVehicleById(id: string, companyId?: string): Promise<Vehicle> {
    const where: Prisma.VehicleWhereInput = { id };
    if (companyId) {
      where.companyId = companyId;
    }

    const vehicle = await prisma.vehicle.findFirst({
      where,
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!vehicle) {
      throw new Error(`Vehicle with ID '${id}' not found.`);
    }

    return vehicle;
  }

  /**
   * Retrieves a paginated list of vehicles matching search, filter, and sorting parameters.
   *
   * @param query Query filters, search string, pagination & sorting options
   * @param companyId Optional company tenant isolation filter
   * @returns Paginated vehicle result with metadata
   */
  async getVehicles(
    query: VehicleQueryInput,
    companyId?: string
  ): Promise<PaginatedVehicleResult> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.VehicleWhereInput = {};

    const activeCompanyId = companyId;
    if (activeCompanyId) {
      where.companyId = activeCompanyId;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.vehicleType) {
      where.vehicleType = query.vehicleType;
    }

    if (query.fuelType) {
      where.fuelType = query.fuelType;
    }

    if (query.search && query.search.trim() !== '') {
      const searchTerm = query.search.trim();
      where.OR = [
        { registrationNumber: { contains: searchTerm, mode: 'insensitive' } },
        { vin: { contains: searchTerm, mode: 'insensitive' } },
        { make: { contains: searchTerm, mode: 'insensitive' } },
        { model: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder || 'desc';

    const [items, total] = await Promise.all([
      prisma.vehicle.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
      prisma.vehicle.count({ where }),
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
   * Updates an existing vehicle record by ID.
   *
   * @param id Vehicle UUID to update
   * @param input Data fields to update
   * @param companyId Optional company tenant isolation filter
   * @returns Updated Vehicle record
   */
  async updateVehicle(
    id: string,
    input: UpdateVehicleInput,
    companyId?: string
  ): Promise<Vehicle> {
    const existingVehicle = await this.getVehicleById(id, companyId);

    if (
      input.registrationNumber &&
      input.registrationNumber !== existingVehicle.registrationNumber
    ) {
      const duplicateReg = await prisma.vehicle.findUnique({
        where: { registrationNumber: input.registrationNumber },
      });
      if (duplicateReg) {
        throw new Error(
          `Vehicle with registration number '${input.registrationNumber}' already exists.`
        );
      }
    }

    if (input.vin && input.vin !== existingVehicle.vin) {
      const duplicateVin = await prisma.vehicle.findUnique({
        where: { vin: input.vin },
      });
      if (duplicateVin) {
        throw new Error(`Vehicle with VIN '${input.vin}' already exists.`);
      }
    }

    const updatedVehicle = await prisma.vehicle.update({
      where: { id: existingVehicle.id },
      data: {
        registrationNumber: input.registrationNumber,
        vin: input.vin,
        make: input.make,
        model: input.model,
        manufacturingYear: input.manufacturingYear,
        vehicleType: input.vehicleType,
        fuelType: input.fuelType,
        capacity: input.capacity !== undefined ? input.capacity : undefined,
        status: input.status,
      },
    });

    return updatedVehicle;
  }

  /**
   * Hard deletes a vehicle record by ID.
   *
   * @param id Vehicle UUID to delete
   * @param companyId Optional company tenant isolation filter
   * @returns Deleted Vehicle record
   */
  async deleteVehicle(id: string, companyId?: string): Promise<Vehicle> {
    const existingVehicle = await this.getVehicleById(id, companyId);

    return await prisma.vehicle.delete({
      where: { id: existingVehicle.id },
    });
  }
}

export const vehicleService = new VehicleService();
