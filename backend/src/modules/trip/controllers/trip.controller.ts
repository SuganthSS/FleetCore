import { Request, Response } from 'express';
import { tripService } from '../services/trip.service';
import {
  createTripSchema,
  updateTripSchema,
  tripIdParamSchema,
  tripQuerySchema,
} from '../validators/trip.validator';

export class TripController {
  /**
   * Handles creation of a new Trip record.
   * Validates body with `createTripSchema` and delegates to `tripService.createTrip()`.
   */
  async createTrip(req: Request, res: Response): Promise<void> {
    const parseResult = createTripSchema.safeParse(req.body);

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
      const trip = await tripService.createTrip(parseResult.data);
      res.status(201).json({
        success: true,
        message: 'Trip created successfully',
        data: trip,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create trip';

      let statusCode = 500;
      if (message.includes('already exists')) {
        statusCode = 409;
      } else if (
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
   * Handles retrieving a single Trip by UUID path parameter.
   * Scopes request to authenticated user's company tenant.
   */
  async getTrip(req: Request, res: Response): Promise<void> {
    const paramResult = tripIdParamSchema.safeParse(req.params);

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
      const trip = await tripService.getTripById(paramResult.data.id, companyId);
      res.status(200).json({
        success: true,
        data: trip,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to retrieve trip';
      const statusCode = message.includes('not found') ? 404 : 500;

      res.status(statusCode).json({
        success: false,
        message,
      });
    }
  }

  /**
   * Handles listing trips with query filtering, searching, sorting, and pagination.
   * Scopes query to authenticated user's company tenant.
   */
  async getTrips(req: Request, res: Response): Promise<void> {
    const queryResult = tripQuerySchema.safeParse(req.query);

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
      const paginatedResult = await tripService.getTrips(queryResult.data, companyId);

      res.status(200).json({
        success: true,
        data: paginatedResult,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to retrieve trips';
      res.status(500).json({
        success: false,
        message,
      });
    }
  }

  /**
   * Handles updating an existing Trip by path parameter and request body.
   * Scopes request to authenticated user's company tenant.
   */
  async updateTrip(req: Request, res: Response): Promise<void> {
    const paramResult = tripIdParamSchema.safeParse(req.params);

    if (!paramResult.success) {
      const formattedErrors = paramResult.error.issues.map((issue) => issue.message);
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: formattedErrors,
      });
      return;
    }

    const bodyResult = updateTripSchema.safeParse(req.body);

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
      const updatedTrip = await tripService.updateTrip(
        paramResult.data.id,
        bodyResult.data,
        companyId
      );

      res.status(200).json({
        success: true,
        message: 'Trip updated successfully',
        data: updatedTrip,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update trip';

      let statusCode = 500;
      if (message.includes('already exists')) {
        statusCode = 409;
      } else if (
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
   * Handles deleting a Trip by UUID path parameter.
   * Scopes request to authenticated user's company tenant.
   */
  async deleteTrip(req: Request, res: Response): Promise<void> {
    const paramResult = tripIdParamSchema.safeParse(req.params);

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
      await tripService.deleteTrip(paramResult.data.id, companyId);
      res.status(200).json({
        success: true,
        message: 'Trip deleted successfully',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete trip';
      const statusCode = message.includes('not found') ? 404 : 500;

      res.status(statusCode).json({
        success: false,
        message,
      });
    }
  }
}

export const tripController = new TripController();
