import { Notification, Prisma } from '@prisma/client';
import { prisma } from '../../../config/database';
import {
  CreateNotificationInput,
  UpdateNotificationInput,
  NotificationQueryInput,
} from '../validators/notification.validator';

export interface PaginatedNotificationResult {
  items: Notification[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const defaultNotificationInclude = {
  user: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      department: true,
    },
  },
  company: {
    select: {
      id: true,
      name: true,
    },
  },
};

export class NotificationService {
  /**
   * Creates a new Notification history record after validating Company and User existence & tenant scoping.
   *
   * @param input Data for creating Notification
   * @returns Created Notification with relations
   */
  async createNotification(
    input: CreateNotificationInput
  ): Promise<Notification> {
    const company = await prisma.company.findUnique({
      where: { id: input.companyId },
    });
    if (!company) {
      throw new Error(`Company with ID '${input.companyId}' does not exist.`);
    }

    const user = await prisma.user.findUnique({
      where: { id: input.userId },
    });
    if (!user) {
      throw new Error(`User with ID '${input.userId}' does not exist.`);
    }
    if (user.companyId !== input.companyId) {
      throw new Error(
        `User with ID '${input.userId}' does not belong to the specified company.`
      );
    }

    const notification = await prisma.notification.create({
      data: {
        title: input.title,
        message: input.message,
        type: input.type,
        priority: input.priority,
        isRead: input.isRead ?? false,
        readAt: input.readAt ? new Date(input.readAt) : null,
        companyId: input.companyId,
        userId: input.userId,
      },
      include: defaultNotificationInclude,
    });

    return notification;
  }

  /**
   * Retrieves a single Notification record by UUID with optional companyId tenant isolation.
   *
   * @param id Notification UUID
   * @param companyId Optional company tenant isolation filter
   * @returns Found Notification entry
   */
  async getNotificationById(
    id: string,
    companyId?: string
  ): Promise<Notification> {
    const where: Prisma.NotificationWhereInput = { id };
    if (companyId) {
      where.companyId = companyId;
    }

    const notification = await prisma.notification.findFirst({
      where,
      include: defaultNotificationInclude,
    });

    if (!notification) {
      throw new Error(`Notification record with ID '${id}' not found.`);
    }

    return notification;
  }

  /**
   * Retrieves a paginated list of notifications with filter, search, and sorting options.
   *
   * @param query Query filters, pagination & sorting options
   * @param companyId Optional company tenant isolation filter
   * @returns Paginated notification result with metadata
   */
  async getNotifications(
    query: NotificationQueryInput,
    companyId?: string
  ): Promise<PaginatedNotificationResult> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.NotificationWhereInput = {};

    const activeCompanyId = companyId || query.companyId;
    if (activeCompanyId) {
      where.companyId = activeCompanyId;
    }

    if (query.userId) {
      where.userId = query.userId;
    }

    if (query.type) {
      where.type = query.type;
    }

    if (query.priority) {
      where.priority = query.priority;
    }

    if (query.isRead !== undefined) {
      where.isRead = query.isRead;
    }

    if (query.search) {
      const searchTerm = query.search;
      where.OR = [
        {
          title: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        {
          message: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
      ];
    }

    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder || 'desc';

    const [items, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
        include: defaultNotificationInclude,
      }),
      prisma.notification.count({ where }),
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
   * Updates an existing Notification record by ID, verifying tenant isolation and user relations.
   *
   * @param id Notification UUID to update
   * @param input Data fields to update
   * @param companyId Optional company tenant isolation filter
   * @returns Updated Notification entry
   */
  async updateNotification(
    id: string,
    input: UpdateNotificationInput,
    companyId?: string
  ): Promise<Notification> {
    const existingRecord = await this.getNotificationById(id, companyId);
    const activeCompanyId = companyId || existingRecord.companyId;

    if (input.userId && input.userId !== existingRecord.userId) {
      const user = await prisma.user.findUnique({
        where: { id: input.userId },
      });
      if (!user) {
        throw new Error(`User with ID '${input.userId}' does not exist.`);
      }
      if (user.companyId !== activeCompanyId) {
        throw new Error(
          `User with ID '${input.userId}' does not belong to the specified company.`
        );
      }
    }

    let isReadValue = input.isRead;
    let readAtValue: Date | null | undefined = undefined;

    if (input.readAt !== undefined) {
      readAtValue = input.readAt ? new Date(input.readAt) : null;
      if (input.readAt) {
        isReadValue = true;
      }
    } else if (input.isRead === true && !existingRecord.isRead) {
      readAtValue = new Date();
    } else if (input.isRead === false) {
      readAtValue = null;
    }

    const updatedRecord = await prisma.notification.update({
      where: { id: existingRecord.id },
      data: {
        title: input.title,
        message: input.message,
        type: input.type,
        priority: input.priority,
        isRead: isReadValue,
        readAt: readAtValue,
        userId: input.userId,
      },
      include: defaultNotificationInclude,
    });

    return updatedRecord;
  }

  /**
   * Hard deletes a Notification record by ID after verifying tenant isolation.
   *
   * @param id Notification UUID to delete
   * @param companyId Optional company tenant isolation filter
   * @returns Deleted Notification entry
   */
  async deleteNotification(
    id: string,
    companyId?: string
  ): Promise<Notification> {
    const existingRecord = await this.getNotificationById(id, companyId);

    return await prisma.notification.delete({
      where: { id: existingRecord.id },
    });
  }
}

export const notificationService = new NotificationService();
