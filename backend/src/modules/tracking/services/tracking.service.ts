import { VehicleLocationHistory, Prisma } from '@prisma/client';
import { prisma } from '../../../config/database';
import {
  CreateTrackingInput,
  UpdateTrackingInput,
  TrackingQueryInput,
} from '../validators/tracking.validator';

export interface PaginatedTrackingResult {
  items: VehicleLocationHistory[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const defaultTrackingInclude = {
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
      vehicleId: true,
      driverId: true,
    },
  },
  driver: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      licenseNumber: true,
    },
  },
  company: {
    select: {
      id: true,
      name: true,
    },
  },
};

export class TrackingService {
  /**
   * Creates a new VehicleLocationHistory tracking entry after validating company,
   * vehicle, trip, and optional driver tenant scoping and relationship integrity.
   *
   * @param input Data for creating GPS tracking location point
   * @returns Created VehicleLocationHistory with relations
   */
  async createTracking(
    input: CreateTrackingInput
  ): Promise<VehicleLocationHistory> {
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
        `Trip with ID '${input.tripId}' is assigned to vehicle '${trip.vehicleId}', which does not match input vehicle '${input.vehicleId}'.`
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
      if (trip.driverId !== activeDriverId) {
        throw new Error(
          `Trip with ID '${input.tripId}' is assigned to driver '${trip.driverId}', which does not match input driver '${activeDriverId}'.`
        );
      }
    } else {
      activeDriverId = trip.driverId;
    }

    const tracking = await prisma.vehicleLocationHistory.create({
      data: {
        latitude: input.latitude,
        longitude: input.longitude,
        speed: input.speed ?? null,
        heading: input.heading ?? null,
        altitude: input.altitude ?? null,
        recordedAt: new Date(input.recordedAt),
        companyId: input.companyId,
        vehicleId: input.vehicleId,
        driverId: activeDriverId,
        tripId: input.tripId,
      },
      include: defaultTrackingInclude,
    });

    return tracking;
  }

  /**
   * Retrieves a single VehicleLocationHistory record by UUID with optional companyId tenant isolation.
   *
   * @param id VehicleLocationHistory UUID
   * @param companyId Optional company tenant isolation filter
   * @returns Found VehicleLocationHistory entry
   */
  async getTrackingById(
    id: string,
    companyId?: string
  ): Promise<VehicleLocationHistory> {
    const where: Prisma.VehicleLocationHistoryWhereInput = { id };
    if (companyId) {
      where.companyId = companyId;
    }

    const tracking = await prisma.vehicleLocationHistory.findFirst({
      where,
      include: defaultTrackingInclude,
    });

    if (!tracking) {
      throw new Error(`Tracking location record with ID '${id}' not found.`);
    }

    return tracking;
  }

  /**
   * Retrieves a paginated list of tracking location records with filter, search, and sorting.
   *
   * @param query Query filters, pagination & sorting options
   * @param companyId Optional company tenant isolation filter
   * @returns Paginated tracking result with metadata
   */
  async getTrackingHistory(
    query: TrackingQueryInput,
    companyId?: string
  ): Promise<PaginatedTrackingResult> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.VehicleLocationHistoryWhereInput = {};

    const activeCompanyId = companyId || query.companyId;
    if (activeCompanyId) {
      where.companyId = activeCompanyId;
    }

    if (query.tripId) {
      where.tripId = query.tripId;
    }

    if (query.vehicleId) {
      where.vehicleId = query.vehicleId;
    }

    if (query.driverId) {
      where.driverId = query.driverId;
    }

    const sortBy = query.sortBy || 'recordedAt';
    const sortOrder = query.sortOrder || 'desc';

    const [items, total] = await Promise.all([
      prisma.vehicleLocationHistory.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
        include: defaultTrackingInclude,
      }),
      prisma.vehicleLocationHistory.count({ where }),
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
   * Updates an existing VehicleLocationHistory tracking record by ID, verifying tenant isolation and relations.
   *
   * @param id VehicleLocationHistory UUID to update
   * @param input Data fields to update
   * @param companyId Optional company tenant isolation filter
   * @returns Updated VehicleLocationHistory entry
   */
  async updateTracking(
    id: string,
    input: UpdateTrackingInput,
    companyId?: string
  ): Promise<VehicleLocationHistory> {
    const existingRecord = await this.getTrackingById(id, companyId);
    const activeCompanyId = companyId || existingRecord.companyId;

    const targetVehicleId = input.vehicleId || existingRecord.vehicleId;
    const targetTripId = input.tripId || existingRecord.tripId;
    const targetDriverId = input.driverId || existingRecord.driverId;

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

    const trip = await prisma.trip.findUnique({
      where: { id: targetTripId },
    });
    if (trip) {
      if (trip.vehicleId !== targetVehicleId) {
        throw new Error(
          `Trip with ID '${targetTripId}' is assigned to vehicle '${trip.vehicleId}', which does not match vehicle '${targetVehicleId}'.`
        );
      }
      if (trip.driverId !== targetDriverId) {
        throw new Error(
          `Trip with ID '${targetTripId}' is assigned to driver '${trip.driverId}', which does not match driver '${targetDriverId}'.`
        );
      }
    }

    const updatedRecord = await prisma.vehicleLocationHistory.update({
      where: { id: existingRecord.id },
      data: {
        latitude: input.latitude,
        longitude: input.longitude,
        speed:
          input.speed !== undefined
            ? input.speed
            : undefined,
        heading:
          input.heading !== undefined
            ? input.heading
            : undefined,
        altitude:
          input.altitude !== undefined
            ? input.altitude
            : undefined,
        recordedAt: input.recordedAt
          ? new Date(input.recordedAt)
          : undefined,
        vehicleId: input.vehicleId,
        tripId: input.tripId,
        driverId: input.driverId !== undefined ? input.driverId || undefined : undefined,
      },
      include: defaultTrackingInclude,
    });

    return updatedRecord;
  }

  /**
   * Hard deletes a VehicleLocationHistory record by ID after verifying tenant isolation.
   *
   * @param id VehicleLocationHistory UUID to delete
   * @param companyId Optional company tenant isolation filter
   * @returns Deleted VehicleLocationHistory entry
   */
  async deleteTracking(
    id: string,
    companyId?: string
  ): Promise<VehicleLocationHistory> {
    const existingRecord = await this.getTrackingById(id, companyId);

    return await prisma.vehicleLocationHistory.delete({
      where: { id: existingRecord.id },
    });
  }
}

export const trackingService = new TrackingService();
