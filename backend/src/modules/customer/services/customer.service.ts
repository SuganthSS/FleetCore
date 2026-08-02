import { Customer, Prisma } from '@prisma/client';
import { prisma } from '../../../config/database';
import {
  CreateCustomerInput,
  UpdateCustomerInput,
  CustomerQueryInput,
} from '../validators/customer.validator';

export interface PaginatedCustomerResult {
  items: Customer[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class CustomerService {
  /**
   * Creates a new Customer record after verifying parent company and unique constraints.
   *
   * @param input Data for creating customer
   * @returns Created Customer record
   */
  async createCustomer(input: CreateCustomerInput): Promise<Customer> {
    const company = await prisma.company.findUnique({
      where: { id: input.companyId },
    });
    if (!company) {
      throw new Error(`Company with ID '${input.companyId}' does not exist.`);
    }

    const existingCode = await prisma.customer.findFirst({
      where: {
        customerCode: input.customerCode,
      },
    });
    if (existingCode) {
      throw new Error(`Customer with code '${input.customerCode}' already exists.`);
    }

    const existingEmail = await prisma.customer.findFirst({
      where: {
        companyId: input.companyId,
        email: input.email,
      },
    });
    if (existingEmail) {
      throw new Error(
        `Customer with email '${input.email}' already exists within this company.`
      );
    }

    const customer = await prisma.customer.create({
      data: {
        customerCode: input.customerCode,
        companyName: input.companyName,
        contactPerson: input.contactPerson ?? null,
        email: input.email,
        phone: input.phone ?? null,
        address: input.address ?? null,
        city: input.city ?? null,
        state: input.state ?? null,
        country: input.country ?? null,
        postalCode: input.postalCode ?? null,
        status: input.status,
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

    return customer;
  }

  /**
   * Retrieves a single Customer profile by UUID and optional companyId for multi-tenant isolation.
   *
   * @param id Customer UUID
   * @param companyId Optional company tenant isolation filter
   * @returns Found Customer record
   */
  async getCustomerById(id: string, companyId?: string): Promise<Customer> {
    const where: Prisma.CustomerWhereInput = { id };
    if (companyId) {
      where.companyId = companyId;
    }

    const customer = await prisma.customer.findFirst({
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

    if (!customer) {
      throw new Error(`Customer with ID '${id}' not found.`);
    }

    return customer;
  }

  /**
   * Retrieves a paginated list of customers matching search, filter, and sorting parameters.
   *
   * @param query Query filters, search string, pagination & sorting options
   * @param companyId Optional company tenant isolation filter
   * @returns Paginated customer result with metadata
   */
  async getCustomers(
    query: CustomerQueryInput,
    companyId?: string
  ): Promise<PaginatedCustomerResult> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.CustomerWhereInput = {};

    const activeCompanyId = companyId || query.companyId;
    if (activeCompanyId) {
      where.companyId = activeCompanyId;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.search && query.search.trim() !== '') {
      const searchTerm = query.search.trim();
      where.OR = [
        { customerCode: { contains: searchTerm, mode: 'insensitive' } },
        { companyName: { contains: searchTerm, mode: 'insensitive' } },
        { contactPerson: { contains: searchTerm, mode: 'insensitive' } },
        { email: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder || 'desc';

    const [items, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
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
      prisma.customer.count({ where }),
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
   * Updates an existing customer record by ID.
   *
   * @param id Customer UUID to update
   * @param input Data fields to update
   * @param companyId Optional company tenant isolation filter
   * @returns Updated Customer record
   */
  async updateCustomer(
    id: string,
    input: UpdateCustomerInput,
    companyId?: string
  ): Promise<Customer> {
    const existingCustomer = await this.getCustomerById(id, companyId);

    if (input.customerCode && input.customerCode !== existingCustomer.customerCode) {
      const duplicateCode = await prisma.customer.findFirst({
        where: { customerCode: input.customerCode },
      });
      if (duplicateCode) {
        throw new Error(`Customer with code '${input.customerCode}' already exists.`);
      }
    }

    const activeCompanyId = companyId || existingCustomer.companyId;

    if (input.email && input.email !== existingCustomer.email) {
      const duplicateEmail = await prisma.customer.findFirst({
        where: {
          companyId: activeCompanyId,
          email: input.email,
        },
      });
      if (duplicateEmail) {
        throw new Error(
          `Customer with email '${input.email}' already exists within this company.`
        );
      }
    }

    const updatedCustomer = await prisma.customer.update({
      where: { id: existingCustomer.id },
      data: {
        customerCode: input.customerCode,
        companyName: input.companyName,
        contactPerson:
          input.contactPerson !== undefined ? input.contactPerson : undefined,
        email: input.email,
        phone: input.phone !== undefined ? input.phone : undefined,
        address: input.address !== undefined ? input.address : undefined,
        city: input.city !== undefined ? input.city : undefined,
        state: input.state !== undefined ? input.state : undefined,
        country: input.country !== undefined ? input.country : undefined,
        postalCode: input.postalCode !== undefined ? input.postalCode : undefined,
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

    return updatedCustomer;
  }

  /**
   * Hard deletes a customer record by ID.
   *
   * @param id Customer UUID to delete
   * @param companyId Optional company tenant isolation filter
   * @returns Deleted Customer record
   */
  async deleteCustomer(id: string, companyId?: string): Promise<Customer> {
    const existingCustomer = await this.getCustomerById(id, companyId);

    return await prisma.customer.delete({
      where: { id: existingCustomer.id },
    });
  }
}

export const customerService = new CustomerService();
