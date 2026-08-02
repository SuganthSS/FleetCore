import { Request, Response } from 'express';
import { notificationService } from '../services/notification.service';
import {
  createNotificationSchema,
  updateNotificationSchema,
  notificationIdParamSchema,
  notificationQuerySchema,
} from '../validators/notification.validator';

export class NotificationController {
  /**
   * Handles creation of a new Notification history record.
   * Validates request body using `createNotificationSchema` and delegates to `notificationService.createNotification()`.
   */
  async createNotification(req: Request, res: Response): Promise<void> {
    const parseResult = createNotificationSchema.safeParse(req.body);

    if (!parseResult.success) {
      const formattedErrors = parseResult.error.issues.map((issue) => issue.message);
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: formattedErrors,
      });
      return;
    }

    try {
      const notification = await notificationService.createNotification(parseResult.data);
      res.status(201).json({
        success: true,
        message: 'Notification created successfully',
        data: notification,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create notification';

      let statusCode = 500;
      if (
        message.includes('does not exist') ||
        message.includes('not found') ||
        message.includes('does not belong')
      ) {
        statusCode = 404;
      }

      res.status(statusCode).json({
        success: false,
        message,
      });
    }
  }

  /**
   * Handles retrieving a single Notification record by UUID path parameter.
   * Scopes request to authenticated user's company tenant.
   */
  async getNotification(req: Request, res: Response): Promise<void> {
    const paramResult = notificationIdParamSchema.safeParse(req.params);

    if (!paramResult.success) {
      const formattedErrors = paramResult.error.issues.map((issue) => issue.message);
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: formattedErrors,
      });
      return;
    }

    try {
      const companyId = req.authenticatedUser?.companyId;
      const notification = await notificationService.getNotificationById(paramResult.data.id, companyId);
      res.status(200).json({
        success: true,
        data: notification,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to retrieve notification';
      const statusCode = message.includes('not found') ? 404 : 500;

      res.status(statusCode).json({
        success: false,
        message,
      });
    }
  }

  /**
   * Handles listing notification records with query filtering, sorting, and pagination.
   * Scopes query to authenticated user's company tenant.
   */
  async getNotifications(req: Request, res: Response): Promise<void> {
    const queryResult = notificationQuerySchema.safeParse(req.query);

    if (!queryResult.success) {
      const formattedErrors = queryResult.error.issues.map((issue) => issue.message);
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: formattedErrors,
      });
      return;
    }

    try {
      const companyId = req.authenticatedUser?.companyId;
      const paginatedResult = await notificationService.getNotifications(queryResult.data, companyId);

      res.status(200).json({
        success: true,
        data: paginatedResult,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to retrieve notifications';
      res.status(500).json({
        success: false,
        message,
      });
    }
  }

  /**
   * Handles updating an existing Notification record by path parameter and request body.
   * Scopes request to authenticated user's company tenant.
   */
  async updateNotification(req: Request, res: Response): Promise<void> {
    const paramResult = notificationIdParamSchema.safeParse(req.params);

    if (!paramResult.success) {
      const formattedErrors = paramResult.error.issues.map((issue) => issue.message);
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: formattedErrors,
      });
      return;
    }

    const bodyResult = updateNotificationSchema.safeParse(req.body);

    if (!bodyResult.success) {
      const formattedErrors = bodyResult.error.issues.map((issue) => issue.message);
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: formattedErrors,
      });
      return;
    }

    try {
      const companyId = req.authenticatedUser?.companyId;
      const updatedRecord = await notificationService.updateNotification(
        paramResult.data.id,
        bodyResult.data,
        companyId
      );

      res.status(200).json({
        success: true,
        message: 'Notification updated successfully',
        data: updatedRecord,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update notification';

      let statusCode = 500;
      if (
        message.includes('not found') ||
        message.includes('does not exist') ||
        message.includes('does not belong')
      ) {
        statusCode = 404;
      }

      res.status(statusCode).json({
        success: false,
        message,
      });
    }
  }

  /**
   * Handles deleting a Notification record by UUID path parameter.
   * Scopes request to authenticated user's company tenant.
   */
  async deleteNotification(req: Request, res: Response): Promise<void> {
    const paramResult = notificationIdParamSchema.safeParse(req.params);

    if (!paramResult.success) {
      const formattedErrors = paramResult.error.issues.map((issue) => issue.message);
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: formattedErrors,
      });
      return;
    }

    try {
      const companyId = req.authenticatedUser?.companyId;
      await notificationService.deleteNotification(paramResult.data.id, companyId);
      res.status(200).json({
        success: true,
        message: 'Notification deleted successfully',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete notification';
      const statusCode = message.includes('not found') ? 404 : 500;

      res.status(statusCode).json({
        success: false,
        message,
      });
    }
  }
}

export const notificationController = new NotificationController();
