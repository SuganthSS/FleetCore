import { Request, Response } from 'express';
import { driverService } from '../services/driver.service';
import {
  createDriverSchema,
  updateDriverSchema,
  driverIdParamSchema,
  driverQuerySchema,
} from '../validators/driver.validator';

export class DriverController {
  /**
   * Handles creation of a new Driver profile.
   * Validates body with `createDriverSchema` and delegates to `driverService.createDriver()`.
   */
  async createDriver(req: Request, res: Response): Promise<void> {
    const parseResult = createDriverSchema.safeParse(req.body);

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
      const driver = await driverService.createDriver(parseResult.data);
      res.status(201).json({
        success: true,
        message: 'Driver created successfully',
        data: driver,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create driver';

      let statusCode = 500;
      if (message.includes('already exists') || message.includes('already assigned')) {
        statusCode = 409;
      } else if (
        message.includes('does not exist') ||
        message.includes('not found') ||
        message.includes('belongs to a different company')
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
   * Handles retrieving a single Driver profile by UUID path parameter.
   * Scopes request to authenticated user's company tenant.
   */
  async getDriver(req: Request, res: Response): Promise<void> {
    const paramResult = driverIdParamSchema.safeParse(req.params);

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
      const driver = await driverService.getDriverById(paramResult.data.id, companyId);
      res.status(200).json({
        success: true,
        data: driver,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to retrieve driver';
      const statusCode = message.includes('not found') ? 404 : 500;

      res.status(statusCode).json({
        success: false,
        message,
      });
    }
  }

  /**
   * Handles listing drivers with query filtering, searching, sorting, and pagination.
   * Scopes query to authenticated user's company tenant.
   */
  async getDrivers(req: Request, res: Response): Promise<void> {
    const queryResult = driverQuerySchema.safeParse(req.query);

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
      const paginatedResult = await driverService.getDrivers(queryResult.data, companyId);

      res.status(200).json({
        success: true,
        data: paginatedResult,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to retrieve drivers';
      res.status(500).json({
        success: false,
        message,
      });
    }
  }

  /**
   * Handles updating an existing Driver profile by path parameter and request body.
   * Scopes request to authenticated user's company tenant.
   */
  async updateDriver(req: Request, res: Response): Promise<void> {
    const paramResult = driverIdParamSchema.safeParse(req.params);

    if (!paramResult.success) {
      const formattedErrors = paramResult.error.issues.map((issue) => issue.message);
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: formattedErrors,
      });
      return;
    }

    const bodyResult = updateDriverSchema.safeParse(req.body);

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
      const updatedDriver = await driverService.updateDriver(
        paramResult.data.id,
        bodyResult.data,
        companyId
      );

      res.status(200).json({
        success: true,
        message: 'Driver updated successfully',
        data: updatedDriver,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update driver';

      let statusCode = 500;
      if (message.includes('already exists') || message.includes('already assigned')) {
        statusCode = 409;
      } else if (
        message.includes('not found') ||
        message.includes('does not exist') ||
        message.includes('belongs to a different company')
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
   * Handles deleting a Driver profile by UUID path parameter.
   * Scopes request to authenticated user's company tenant.
   */
  async deleteDriver(req: Request, res: Response): Promise<void> {
    const paramResult = driverIdParamSchema.safeParse(req.params);

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
      await driverService.deleteDriver(paramResult.data.id, companyId);
      res.status(200).json({
        success: true,
        message: 'Driver deleted successfully',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete driver';
      const statusCode = message.includes('not found') ? 404 : 500;

      res.status(statusCode).json({
        success: false,
        message,
      });
    }
  }
}

export const driverController = new DriverController();
