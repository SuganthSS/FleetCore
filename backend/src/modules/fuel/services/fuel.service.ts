import { FuelRecord, Prisma } from '@prisma/client';
import { prisma } from '../../../config/database';
import {
  CreateFuelRecordInput,
  UpdateFuelRecordInput,
  FuelRecordQueryInput,
} from '../validators/fuel.validator';

export interface PaginatedFuelRecordResult {
  items: FuelRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const defaultFuelInclude = {
  vehicle: {
    select: {
      id: true,
      registrationNumber: true,
      make: true,
      model: true,
      status: true,
    },
  },
  trip: {
    select: {
      id: true,
      tripNumber: true,
      status: true,
    },
  },
  company: {
    select: {
      id: true,
      name: true,
    },
  },
};

export class FuelService {
  /**
   * Generates a unique fuel record reference code.
   */
  private generateFuelRecordNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    return `FUEL-${timestamp}-${random}`;
  }

  /**
   * Creates a new FuelRecord entry after validating company, vehicle, optional trip alignment,
   * and optional receipt number uniqueness.
   *
   * @param input Data for creating fuel record
   * @returns Created FuelRecord with relations
   */
  async createFuelRecord(input: CreateFuelRecordInput): Promise<FuelRecord> {
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

    if (input.tripId) {
      const trip = await prisma.trip.findUnique({
        where: { id: input.tripId },
      });
      if (!trip) {
        throw new Error(`Trip with ID '${input.tripId}' does not exist.`);
      }
      if (trip.companyId !== input.companyId) {
        throw new Error(
          `Trip with ID '${input.tripId}' does not belong to the specified company.`
        );
      }
      if (trip.vehicleId !== input.vehicleId) {
        throw new Error(
          `Trip with ID '${input.tripId}' is not associated with vehicle '${input.vehicleId}'.`
        );
      }
    }

    if (input.receiptNumber) {
      const existingReceipt = await prisma.fuelRecord.findFirst({
        where: {
          stationLocation: input.receiptNumber,
          companyId: input.companyId,
        },
      });
      if (existingReceipt) {
        throw new Error(
          `Fuel record with receipt number '${input.receiptNumber}' already exists.`
        );
      }
    }

    const fuelRecordNumber = input.receiptNumber
      ? `REC-${input.receiptNumber}`
      : this.generateFuelRecordNumber();

    // Fetch an active driver for the vehicle or fallback to first company driver for relation requirement
    const defaultDriver = await prisma.driver.findFirst({
      where: { companyId: input.companyId },
    });
    if (!defaultDriver) {
      throw new Error(`No active driver found for company ID '${input.companyId}'.`);
    }

    const fuelRecord = await prisma.fuelRecord.create({
      data: {
        fuelRecordNumber,
        fuelType: 'DIESEL',
        quantity: input.quantity,
        pricePerUnit: input.pricePerUnit,
        totalCost: input.totalCost,
        odometerReading: input.odometerReading,
        stationName: input.fuelStation,
        stationLocation: input.receiptNumber || null,
        refueledAt: new Date(input.fuelDate),
        notes: input.notes || null,
        companyId: input.companyId,
        vehicleId: input.vehicleId,
        driverId: defaultDriver.id,
        tripId: input.tripId || '', // Schema requires string relation
      },
      include: defaultFuelInclude,
    });

    return fuelRecord;
  }

  /**
   * Retrieves a single FuelRecord by UUID with optional companyId tenant isolation.
   *
   * @param id FuelRecord UUID
   * @param companyId Optional company tenant isolation filter
   * @returns Found FuelRecord entry
   */
  async getFuelRecordById(id: string, companyId?: string): Promise<FuelRecord> {
    const where: Prisma.FuelRecordWhereInput = { id };
    if (companyId) {
      where.companyId = companyId;
    }

    const fuelRecord = await prisma.fuelRecord.findFirst({
      where,
      include: defaultFuelInclude,
    });

    if (!fuelRecord) {
      throw new Error(`Fuel record with ID '${id}' not found.`);
    }

    return fuelRecord;
  }

  /**
   * Retrieves a paginated list of fuel records with search, filter, and sorting.
   *
   * @param query Query filters, search string, pagination & sorting options
   * @param companyId Optional company tenant isolation filter
   * @returns Paginated fuel record result with metadata
   */
  async getFuelRecords(
    query: FuelRecordQueryInput,
    companyId?: string
  ): Promise<PaginatedFuelRecordResult> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.FuelRecordWhereInput = {};

    const activeCompanyId = companyId || query.companyId;
    if (activeCompanyId) {
      where.companyId = activeCompanyId;
    }

    if (query.vehicleId) {
      where.vehicleId = query.vehicleId;
    }

    if (query.tripId) {
      where.tripId = query.tripId;
    }

    if (query.search && query.search.trim() !== '') {
      const searchTerm = query.search.trim();
      where.OR = [
        { stationName: { contains: searchTerm, mode: 'insensitive' } },
        { stationLocation: { contains: searchTerm, mode: 'insensitive' } },
        { fuelRecordNumber: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder || 'desc';

    const orderByField = sortBy === 'fuelDate' ? 'refueledAt' : sortBy;

    const [items, total] = await Promise.all([
      prisma.fuelRecord.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [orderByField]: sortOrder,
        },
        include: defaultFuelInclude,
      }),
      prisma.fuelRecord.count({ where }),
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
   * Updates an existing FuelRecord by ID, verifying tenant isolation and relation integrity.
   *
   * @param id FuelRecord UUID to update
   * @param input Data fields to update
   * @param companyId Optional company tenant isolation filter
   * @returns Updated FuelRecord entry
   */
  async updateFuelRecord(
    id: string,
    input: UpdateFuelRecordInput,
    companyId?: string
  ): Promise<FuelRecord> {
    const existingRecord = await this.getFuelRecordById(id, companyId);
    const activeCompanyId = companyId || existingRecord.companyId;
    const targetVehicleId = input.vehicleId || existingRecord.vehicleId;

    if (
      input.receiptNumber &&
      input.receiptNumber !== existingRecord.stationLocation
    ) {
      const duplicateReceipt = await prisma.fuelRecord.findFirst({
        where: {
          stationLocation: input.receiptNumber,
          companyId: activeCompanyId,
        },
      });
      if (duplicateReceipt) {
        throw new Error(
          `Fuel record with receipt number '${input.receiptNumber}' already exists.`
        );
      }
    }

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

    if (input.tripId && input.tripId !== existingRecord.tripId) {
      const trip = await prisma.trip.findUnique({
        where: { id: input.tripId },
      });
      if (!trip) {
        throw new Error(`Trip with ID '${input.tripId}' does not exist.`);
      }
      if (trip.companyId !== activeCompanyId) {
        throw new Error(
          `Trip with ID '${input.tripId}' does not belong to the specified company.`
        );
      }
      if (trip.vehicleId !== targetVehicleId) {
        throw new Error(
          `Trip with ID '${input.tripId}' is not associated with vehicle '${targetVehicleId}'.`
        );
      }
    }

    const updatedRecord = await prisma.fuelRecord.update({
      where: { id: existingRecord.id },
      data: {
        quantity: input.quantity,
        pricePerUnit: input.pricePerUnit,
        totalCost: input.totalCost,
        odometerReading: input.odometerReading,
        stationName: input.fuelStation,
        stationLocation:
          input.receiptNumber !== undefined
            ? input.receiptNumber || null
            : undefined,
        refueledAt: input.fuelDate ? new Date(input.fuelDate) : undefined,
        notes: input.notes !== undefined ? input.notes || null : undefined,
        vehicleId: input.vehicleId,
        tripId: input.tripId !== undefined ? input.tripId || '' : undefined,
      },
      include: defaultFuelInclude,
    });

    return updatedRecord;
  }

  /**
   * Hard deletes a FuelRecord by ID after verifying tenant isolation.
   *
   * @param id FuelRecord UUID to delete
   * @param companyId Optional company tenant isolation filter
   * @returns Deleted FuelRecord entry
   */
  async deleteFuelRecord(id: string, companyId?: string): Promise<FuelRecord> {
    const existingRecord = await this.getFuelRecordById(id, companyId);

    return await prisma.fuelRecord.delete({
      where: { id: existingRecord.id },
    });
  }
}

export const fuelService = new FuelService();
