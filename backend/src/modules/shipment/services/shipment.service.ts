import { Shipment, Prisma } from '@prisma/client';
import { prisma } from '../../../config/database';
import {
  CreateShipmentInput,
  UpdateShipmentInput,
  ShipmentQueryInput,
} from '../validators/shipment.validator';

export interface PaginatedShipmentResult {
  items: Shipment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class ShipmentService {
  /**
   * Creates a new Shipment record after verifying company, customer, and unique constraints.
   *
   * @param input Data for creating shipment
   * @returns Created Shipment record with Customer and Company relations
   */
  async createShipment(input: CreateShipmentInput): Promise<Shipment> {
    const company = await prisma.company.findUnique({
      where: { id: input.companyId },
    });
    if (!company) {
      throw new Error(`Company with ID '${input.companyId}' does not exist.`);
    }

    const customer = await prisma.customer.findUnique({
      where: { id: input.customerId },
    });
    if (!customer) {
      throw new Error(`Customer with ID '${input.customerId}' does not exist.`);
    }
    if (customer.companyId !== input.companyId) {
      throw new Error(
        `Customer with ID '${input.customerId}' does not belong to the specified company.`
      );
    }

    const existingShipment = await prisma.shipment.findUnique({
      where: { shipmentNumber: input.shipmentNumber },
    });
    if (existingShipment) {
      throw new Error(
        `Shipment with number '${input.shipmentNumber}' already exists.`
      );
    }

    const shipment = await prisma.shipment.create({
      data: {
        shipmentNumber: input.shipmentNumber,
        title: input.title,
        description: input.description ?? null,
        cargoType: input.cargoType ?? null,
        weight: input.weight ?? null,
        volume: input.volume ?? null,
        quantity: input.quantity ?? null,
        pickupAddress: input.pickupAddress,
        pickupCity: input.pickupCity,
        pickupState: input.pickupState ?? null,
        pickupCountry: input.pickupCountry,
        pickupPostalCode: input.pickupPostalCode ?? null,
        pickupDate: input.pickupDate ? new Date(input.pickupDate) : null,
        deliveryAddress: input.deliveryAddress,
        deliveryCity: input.deliveryCity,
        deliveryState: input.deliveryState ?? null,
        deliveryCountry: input.deliveryCountry,
        deliveryPostalCode: input.deliveryPostalCode ?? null,
        expectedDeliveryDate: input.expectedDeliveryDate
          ? new Date(input.expectedDeliveryDate)
          : null,
        priority: input.priority,
        status: input.status,
        customerId: input.customerId,
        companyId: input.companyId,
      },
      include: {
        customer: {
          select: {
            id: true,
            customerCode: true,
            companyName: true,
            email: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        trips: {
          select: {
            id: true,
            tripNumber: true,
            status: true,
          },
        },
      },
    });

    return shipment;
  }

  /**
   * Retrieves a single Shipment by UUID with optional companyId tenant isolation.
   *
   * @param id Shipment UUID
   * @param companyId Optional company tenant isolation filter
   * @returns Found Shipment record
   */
  async getShipmentById(id: string, companyId?: string): Promise<Shipment> {
    const where: Prisma.ShipmentWhereInput = { id };
    if (companyId) {
      where.companyId = companyId;
    }

    const shipment = await prisma.shipment.findFirst({
      where,
      include: {
        customer: {
          select: {
            id: true,
            customerCode: true,
            companyName: true,
            email: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        trips: {
          select: {
            id: true,
            tripNumber: true,
            status: true,
          },
        },
      },
    });

    if (!shipment) {
      throw new Error(`Shipment with ID '${id}' not found.`);
    }

    return shipment;
  }

  /**
   * Retrieves a paginated list of shipments with search, filter, and sorting.
   *
   * @param query Query filters, search string, pagination & sorting options
   * @param companyId Optional company tenant isolation filter
   * @returns Paginated shipment result with metadata
   */
  async getShipments(
    query: ShipmentQueryInput,
    companyId?: string
  ): Promise<PaginatedShipmentResult> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.ShipmentWhereInput = {};

    const activeCompanyId = companyId || query.companyId;
    if (activeCompanyId) {
      where.companyId = activeCompanyId;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.priority) {
      where.priority = query.priority;
    }

    if (query.customerId) {
      where.customerId = query.customerId;
    }

    if (query.search && query.search.trim() !== '') {
      const searchTerm = query.search.trim();
      where.OR = [
        { shipmentNumber: { contains: searchTerm, mode: 'insensitive' } },
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { cargoType: { contains: searchTerm, mode: 'insensitive' } },
        { pickupCity: { contains: searchTerm, mode: 'insensitive' } },
        { deliveryCity: { contains: searchTerm, mode: 'insensitive' } },
        {
          customer: {
            companyName: { contains: searchTerm, mode: 'insensitive' },
          },
        },
      ];
    }

    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder || 'desc';

    const [items, total] = await Promise.all([
      prisma.shipment.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
        include: {
          customer: {
            select: {
              id: true,
              customerCode: true,
              companyName: true,
              email: true,
            },
          },
          company: {
            select: {
              id: true,
              name: true,
            },
          },
          trips: {
            select: {
              id: true,
              tripNumber: true,
              status: true,
            },
          },
        },
      }),
      prisma.shipment.count({ where }),
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
   * Updates an existing Shipment by ID, verifying tenant isolation and unique constraints.
   *
   * @param id Shipment UUID to update
   * @param input Data fields to update
   * @param companyId Optional company tenant isolation filter
   * @returns Updated Shipment record
   */
  async updateShipment(
    id: string,
    input: UpdateShipmentInput,
    companyId?: string
  ): Promise<Shipment> {
    const existingShipment = await this.getShipmentById(id, companyId);

    if (
      input.shipmentNumber &&
      input.shipmentNumber !== existingShipment.shipmentNumber
    ) {
      const duplicateNumber = await prisma.shipment.findUnique({
        where: { shipmentNumber: input.shipmentNumber },
      });
      if (duplicateNumber) {
        throw new Error(
          `Shipment with number '${input.shipmentNumber}' already exists.`
        );
      }
    }

    if (input.customerId && input.customerId !== existingShipment.customerId) {
      const customer = await prisma.customer.findUnique({
        where: { id: input.customerId },
      });
      if (!customer) {
        throw new Error(
          `Customer with ID '${input.customerId}' does not exist.`
        );
      }
      const activeCompanyId = companyId || existingShipment.companyId;
      if (customer.companyId !== activeCompanyId) {
        throw new Error(
          `Customer with ID '${input.customerId}' does not belong to the specified company.`
        );
      }
    }

    const updatedShipment = await prisma.shipment.update({
      where: { id: existingShipment.id },
      data: {
        shipmentNumber: input.shipmentNumber,
        title: input.title,
        description: input.description !== undefined ? input.description : undefined,
        cargoType: input.cargoType !== undefined ? input.cargoType : undefined,
        weight: input.weight !== undefined ? input.weight : undefined,
        volume: input.volume !== undefined ? input.volume : undefined,
        quantity: input.quantity !== undefined ? input.quantity : undefined,
        pickupAddress: input.pickupAddress,
        pickupCity: input.pickupCity,
        pickupState: input.pickupState !== undefined ? input.pickupState : undefined,
        pickupCountry: input.pickupCountry,
        pickupPostalCode:
          input.pickupPostalCode !== undefined ? input.pickupPostalCode : undefined,
        pickupDate:
          input.pickupDate !== undefined
            ? input.pickupDate
              ? new Date(input.pickupDate)
              : null
            : undefined,
        deliveryAddress: input.deliveryAddress,
        deliveryCity: input.deliveryCity,
        deliveryState:
          input.deliveryState !== undefined ? input.deliveryState : undefined,
        deliveryCountry: input.deliveryCountry,
        deliveryPostalCode:
          input.deliveryPostalCode !== undefined ? input.deliveryPostalCode : undefined,
        expectedDeliveryDate:
          input.expectedDeliveryDate !== undefined
            ? input.expectedDeliveryDate
              ? new Date(input.expectedDeliveryDate)
              : null
            : undefined,
        priority: input.priority,
        status: input.status,
        customerId: input.customerId,
      },
      include: {
        customer: {
          select: {
            id: true,
            customerCode: true,
            companyName: true,
            email: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        trips: {
          select: {
            id: true,
            tripNumber: true,
            status: true,
          },
        },
      },
    });

    return updatedShipment;
  }

  /**
   * Hard deletes a Shipment by ID after verifying tenant isolation.
   *
   * @param id Shipment UUID to delete
   * @param companyId Optional company tenant isolation filter
   * @returns Deleted Shipment record
   */
  async deleteShipment(id: string, companyId?: string): Promise<Shipment> {
    const existingShipment = await this.getShipmentById(id, companyId);

    return await prisma.shipment.delete({
      where: { id: existingShipment.id },
    });
  }
}

export const shipmentService = new ShipmentService();
