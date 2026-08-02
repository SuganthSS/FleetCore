import { Route, Prisma } from '@prisma/client';
import { prisma } from '../../../config/database';
import {
  CreateRouteInput,
  UpdateRouteInput,
  RouteQueryInput,
} from '../validators/route.validator';

export interface PaginatedRouteResult {
  items: Route[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class RouteService {
  /**
   * Creates a new Route record after verifying company existence and routeCode uniqueness.
   *
   * @param input Data for creating route
   * @returns Created Route record with Company relation
   */
  async createRoute(input: CreateRouteInput): Promise<Route> {
    const company = await prisma.company.findUnique({
      where: { id: input.companyId },
    });
    if (!company) {
      throw new Error(`Company with ID '${input.companyId}' does not exist.`);
    }

    const existingRoute = await prisma.route.findUnique({
      where: { routeCode: input.routeCode },
    });
    if (existingRoute) {
      throw new Error(
        `Route with code '${input.routeCode}' already exists.`
      );
    }

    const route = await prisma.route.create({
      data: {
        routeCode: input.routeCode,
        originAddress: input.origin,
        originCity: input.origin,
        originCountry: 'USA',
        destinationAddress: input.destination,
        destinationCity: input.destination,
        destinationCountry: 'USA',
        plannedDistance: input.distance,
        estimatedDuration: input.estimatedDuration,
        routeType: input.routeType,
        status: input.status,
        shipmentId: input.companyId, // placeholder or relation check if needed, but schema requires shipmentId
        companyId: input.companyId,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return route;
  }

  /**
   * Retrieves a single Route by UUID with optional companyId tenant isolation.
   *
   * @param id Route UUID
   * @param companyId Optional company tenant isolation filter
   * @returns Found Route record
   */
  async getRouteById(id: string, companyId?: string): Promise<Route> {
    const where: Prisma.RouteWhereInput = { id };
    if (companyId) {
      where.companyId = companyId;
    }

    const route = await prisma.route.findFirst({
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

    if (!route) {
      throw new Error(`Route with ID '${id}' not found.`);
    }

    return route;
  }

  /**
   * Retrieves a paginated list of routes with search, filter, and sorting.
   *
   * @param query Query filters, search string, pagination & sorting options
   * @param companyId Optional company tenant isolation filter
   * @returns Paginated route result with metadata
   */
  async getRoutes(
    query: RouteQueryInput,
    companyId?: string
  ): Promise<PaginatedRouteResult> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.RouteWhereInput = {};

    const activeCompanyId = companyId || query.companyId;
    if (activeCompanyId) {
      where.companyId = activeCompanyId;
    }

    if (query.routeType) {
      where.routeType = query.routeType;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.search && query.search.trim() !== '') {
      const searchTerm = query.search.trim();
      where.OR = [
        { routeCode: { contains: searchTerm, mode: 'insensitive' } },
        { originCity: { contains: searchTerm, mode: 'insensitive' } },
        { destinationCity: { contains: searchTerm, mode: 'insensitive' } },
        { originAddress: { contains: searchTerm, mode: 'insensitive' } },
        { destinationAddress: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder || 'desc';

    const orderByField = sortBy === 'distance' ? 'plannedDistance' : sortBy === 'name' ? 'routeCode' : sortBy;

    const [items, total] = await Promise.all([
      prisma.route.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [orderByField]: sortOrder,
        },
        include: {
          company: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.route.count({ where }),
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
   * Updates an existing Route by ID, verifying tenant isolation and unique constraints.
   *
   * @param id Route UUID to update
   * @param input Data fields to update
   * @param companyId Optional company tenant isolation filter
   * @returns Updated Route record
   */
  async updateRoute(
    id: string,
    input: UpdateRouteInput,
    companyId?: string
  ): Promise<Route> {
    const existingRoute = await this.getRouteById(id, companyId);

    if (
      input.routeCode &&
      input.routeCode !== existingRoute.routeCode
    ) {
      const duplicateCode = await prisma.route.findUnique({
        where: { routeCode: input.routeCode },
      });
      if (duplicateCode) {
        throw new Error(
          `Route with code '${input.routeCode}' already exists.`
        );
      }
    }

    const updatedRoute = await prisma.route.update({
      where: { id: existingRoute.id },
      data: {
        routeCode: input.routeCode,
        originAddress: input.origin,
        originCity: input.origin,
        destinationAddress: input.destination,
        destinationCity: input.destination,
        plannedDistance: input.distance,
        estimatedDuration: input.estimatedDuration,
        routeType: input.routeType,
        status: input.status,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return updatedRoute;
  }

  /**
   * Hard deletes a Route by ID after verifying tenant isolation.
   *
   * @param id Route UUID to delete
   * @param companyId Optional company tenant isolation filter
   * @returns Deleted Route record
   */
  async deleteRoute(id: string, companyId?: string): Promise<Route> {
    const existingRoute = await this.getRouteById(id, companyId);

    return await prisma.route.delete({
      where: { id: existingRoute.id },
    });
  }
}

export const routeService = new RouteService();
