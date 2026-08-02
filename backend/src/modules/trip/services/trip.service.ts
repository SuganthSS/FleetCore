import { Trip, Prisma } from '@prisma/client';
import { prisma } from '../../../config/database';
import {
  CreateTripInput,
  UpdateTripInput,
  TripQueryInput,
} from '../validators/trip.validator';

export interface PaginatedTripResult {
  items: Trip[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const defaultTripInclude = {
  shipment: {
    select: {
      id: true,
      shipmentNumber: true,
      title: true,
      status: true,
    },
  },
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
      employeeId: true,
      firstName: true,
      lastName: true,
      status: true,
    },
  },
  route: {
    select: {
      id: true,
      routeCode: true,
      originCity: true,
      destinationCity: true,
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

export class TripService {
  /**
   * Creates a new Trip record after verifying company, shipment, vehicle, driver, route,
   * tenant alignment, and tripNumber uniqueness.
   *
   * @param input Data for creating trip
   * @returns Created Trip record with full relations
   */
  async createTrip(input: CreateTripInput): Promise<Trip> {
    const company = await prisma.company.findUnique({
      where: { id: input.companyId },
    });
    if (!company) {
      throw new Error(`Company with ID '${input.companyId}' does not exist.`);
    }

    const shipment = await prisma.shipment.findUnique({
      where: { id: input.shipmentId },
    });
    if (!shipment) {
      throw new Error(`Shipment with ID '${input.shipmentId}' does not exist.`);
    }
    if (shipment.companyId !== input.companyId) {
      throw new Error(
        `Shipment with ID '${input.shipmentId}' does not belong to the specified company.`
      );
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

    const driver = await prisma.driver.findUnique({
      where: { id: input.driverId },
    });
    if (!driver) {
      throw new Error(`Driver with ID '${input.driverId}' does not exist.`);
    }
    if (driver.companyId !== input.companyId) {
      throw new Error(
        `Driver with ID '${input.driverId}' does not belong to the specified company.`
      );
    }

    const route = await prisma.route.findUnique({
      where: { id: input.routeId },
    });
    if (!route) {
      throw new Error(`Route with ID '${input.routeId}' does not exist.`);
    }
    if (route.companyId !== input.companyId) {
      throw new Error(
        `Route with ID '${input.routeId}' does not belong to the specified company.`
      );
    }

    const existingTrip = await prisma.trip.findUnique({
      where: { tripNumber: input.tripNumber },
    });
    if (existingTrip) {
      throw new Error(
        `Trip with number '${input.tripNumber}' already exists.`
      );
    }

    const trip = await prisma.trip.create({
      data: {
        tripNumber: input.tripNumber,
        scheduledStartTime: new Date(input.plannedStartTime),
        scheduledEndTime: input.plannedEndTime ? new Date(input.plannedEndTime) : null,
        actualStartTime: input.actualStartTime ? new Date(input.actualStartTime) : null,
        actualEndTime: input.actualEndTime ? new Date(input.actualEndTime) : null,
        status: input.status,
        shipmentId: input.shipmentId,
        vehicleId: input.vehicleId,
        driverId: input.driverId,
        routeId: input.routeId,
        companyId: input.companyId,
      },
      include: defaultTripInclude,
    });

    return trip;
  }

  /**
   * Retrieves a single Trip by UUID with optional companyId tenant isolation.
   *
   * @param id Trip UUID
   * @param companyId Optional company tenant isolation filter
   * @returns Found Trip record
   */
  async getTripById(id: string, companyId?: string): Promise<Trip> {
    const where: Prisma.TripWhereInput = { id };
    if (companyId) {
      where.companyId = companyId;
    }

    const trip = await prisma.trip.findFirst({
      where,
      include: defaultTripInclude,
    });

    if (!trip) {
      throw new Error(`Trip with ID '${id}' not found.`);
    }

    return trip;
  }

  /**
   * Retrieves a paginated list of trips with search, filter, and sorting.
   *
   * @param query Query filters, search string, pagination & sorting options
   * @param companyId Optional company tenant isolation filter
   * @returns Paginated trip result with metadata
   */
  async getTrips(
    query: TripQueryInput,
    companyId?: string
  ): Promise<PaginatedTripResult> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.TripWhereInput = {};

    const activeCompanyId = companyId || query.companyId;
    if (activeCompanyId) {
      where.companyId = activeCompanyId;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.vehicleId) {
      where.vehicleId = query.vehicleId;
    }

    if (query.driverId) {
      where.driverId = query.driverId;
    }

    if (query.shipmentId) {
      where.shipmentId = query.shipmentId;
    }

    if (query.routeId) {
      where.routeId = query.routeId;
    }

    if (query.search && query.search.trim() !== '') {
      const searchTerm = query.search.trim();
      where.OR = [
        { tripNumber: { contains: searchTerm, mode: 'insensitive' } },
        { shipment: { shipmentNumber: { contains: searchTerm, mode: 'insensitive' } } },
        { vehicle: { registrationNumber: { contains: searchTerm, mode: 'insensitive' } } },
        { driver: { employeeId: { contains: searchTerm, mode: 'insensitive' } } },
        { route: { routeCode: { contains: searchTerm, mode: 'insensitive' } } },
      ];
    }

    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder || 'desc';

    const orderByField =
      sortBy === 'plannedStartTime'
        ? 'scheduledStartTime'
        : sortBy;

    const [items, total] = await Promise.all([
      prisma.trip.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [orderByField]: sortOrder,
        },
        include: defaultTripInclude,
      }),
      prisma.trip.count({ where }),
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
   * Updates an existing Trip by ID, verifying tenant isolation, relations, and unique constraints.
   *
   * @param id Trip UUID to update
   * @param input Data fields to update
   * @param companyId Optional company tenant isolation filter
   * @returns Updated Trip record
   */
  async updateTrip(
    id: string,
    input: UpdateTripInput,
    companyId?: string
  ): Promise<Trip> {
    const existingTrip = await this.getTripById(id, companyId);
    const activeCompanyId = companyId || existingTrip.companyId;

    if (
      input.tripNumber &&
      input.tripNumber !== existingTrip.tripNumber
    ) {
      const duplicateNumber = await prisma.trip.findUnique({
        where: { tripNumber: input.tripNumber },
      });
      if (duplicateNumber) {
        throw new Error(
          `Trip with number '${input.tripNumber}' already exists.`
        );
      }
    }

    if (input.shipmentId && input.shipmentId !== existingTrip.shipmentId) {
      const shipment = await prisma.shipment.findUnique({
        where: { id: input.shipmentId },
      });
      if (!shipment) {
        throw new Error(`Shipment with ID '${input.shipmentId}' does not exist.`);
      }
      if (shipment.companyId !== activeCompanyId) {
        throw new Error(
          `Shipment with ID '${input.shipmentId}' does not belong to the specified company.`
        );
      }
    }

    if (input.vehicleId && input.vehicleId !== existingTrip.vehicleId) {
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

    if (input.driverId && input.driverId !== existingTrip.driverId) {
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

    if (input.routeId && input.routeId !== existingTrip.routeId) {
      const route = await prisma.route.findUnique({
        where: { id: input.routeId },
      });
      if (!route) {
        throw new Error(`Route with ID '${input.routeId}' does not exist.`);
      }
      if (route.companyId !== activeCompanyId) {
        throw new Error(
          `Route with ID '${input.routeId}' does not belong to the specified company.`
        );
      }
    }

    const updatedTrip = await prisma.trip.update({
      where: { id: existingTrip.id },
      data: {
        tripNumber: input.tripNumber,
        scheduledStartTime:
          input.plannedStartTime !== undefined
            ? new Date(input.plannedStartTime)
            : undefined,
        scheduledEndTime:
          input.plannedEndTime !== undefined
            ? input.plannedEndTime
              ? new Date(input.plannedEndTime)
              : null
            : undefined,
        actualStartTime:
          input.actualStartTime !== undefined
            ? input.actualStartTime
              ? new Date(input.actualStartTime)
              : null
            : undefined,
        actualEndTime:
          input.actualEndTime !== undefined
            ? input.actualEndTime
              ? new Date(input.actualEndTime)
              : null
            : undefined,
        status: input.status,
        shipmentId: input.shipmentId,
        vehicleId: input.vehicleId,
        driverId: input.driverId,
        routeId: input.routeId,
      },
      include: defaultTripInclude,
    });

    return updatedTrip;
  }

  /**
   * Hard deletes a Trip by ID after verifying tenant isolation.
   *
   * @param id Trip UUID to delete
   * @param companyId Optional company tenant isolation filter
   * @returns Deleted Trip record
   */
  async deleteTrip(id: string, companyId?: string): Promise<Trip> {
    const existingTrip = await this.getTripById(id, companyId);

    return await prisma.trip.delete({
      where: { id: existingTrip.id },
    });
  }
}

export const tripService = new TripService();
