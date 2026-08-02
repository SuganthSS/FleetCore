import { Request, Response } from 'express';
import { trackingService } from '../services/tracking.service';
import {
  createTrackingSchema,
  updateTrackingSchema,
  trackingIdParamSchema,
  trackingQuerySchema,
} from '../validators/tracking.validator';

export class TrackingController {
  /**
   * Handles creation of a new VehicleLocationHistory tracking record.
   * Validates body with `createTrackingSchema` and delegates to `trackingService.createTracking()`.
   */
  async createTracking(req: Request, res: Response): Promise<void> {
    const parseResult = createTrackingSchema.safeParse(req.body);

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
      const tracking = await trackingService.createTracking(parseResult.data);
      res.status(201).json({
        success: true,
        message: 'Tracking record created successfully',
        data: tracking,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create tracking record';

      let statusCode = 500;
      if (
        message.includes('does not exist') ||
        message.includes('not found') ||
        message.includes('does not belong') ||
        message.includes('does not match')
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
   * Handles retrieving a single VehicleLocationHistory tracking record by UUID path parameter.
   * Scopes request to authenticated user's company tenant.
   */
  async getTracking(req: Request, res: Response): Promise<void> {
    const paramResult = trackingIdParamSchema.safeParse(req.params);

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
      const tracking = await trackingService.getTrackingById(paramResult.data.id, companyId);
      res.status(200).json({
        success: true,
        data: tracking,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to retrieve tracking record';
      const statusCode = message.includes('not found') ? 404 : 500;

      res.status(statusCode).json({
        success: false,
        message,
      });
    }
  }

  /**
   * Handles listing tracking records with query filtering, sorting, and pagination.
   * Scopes query to authenticated user's company tenant.
   */
  async getTrackingHistory(req: Request, res: Response): Promise<void> {
    const queryResult = trackingQuerySchema.safeParse(req.query);

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
      const paginatedResult = await trackingService.getTrackingHistory(queryResult.data, companyId);

      res.status(200).json({
        success: true,
        data: paginatedResult,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to retrieve tracking history';
      res.status(500).json({
        success: false,
        message,
      });
    }
  }

  /**
   * Handles updating an existing VehicleLocationHistory tracking record by path parameter and request body.
   * Scopes request to authenticated user's company tenant.
   */
  async updateTracking(req: Request, res: Response): Promise<void> {
    const paramResult = trackingIdParamSchema.safeParse(req.params);

    if (!paramResult.success) {
      const formattedErrors = paramResult.error.issues.map((issue) => issue.message);
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: formattedErrors,
      });
      return;
    }

    const bodyResult = updateTrackingSchema.safeParse(req.body);

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
      const updatedRecord = await trackingService.updateTracking(
        paramResult.data.id,
        bodyResult.data,
        companyId
      );

      res.status(200).json({
        success: true,
        message: 'Tracking record updated successfully',
        data: updatedRecord,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update tracking record';

      let statusCode = 500;
      if (
        message.includes('not found') ||
        message.includes('does not exist') ||
        message.includes('does not belong') ||
        message.includes('does not match')
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
   * Handles deleting a VehicleLocationHistory tracking record by UUID path parameter.
   * Scopes request to authenticated user's company tenant.
   */
  async deleteTracking(req: Request, res: Response): Promise<void> {
    const paramResult = trackingIdParamSchema.safeParse(req.params);

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
      await trackingService.deleteTracking(paramResult.data.id, companyId);
      res.status(200).json({
        success: true,
        message: 'Tracking record deleted successfully',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete tracking record';
      const statusCode = message.includes('not found') ? 404 : 500;

      res.status(statusCode).json({
        success: false,
        message,
      });
    }
  }
}

export const trackingController = new TrackingController();
