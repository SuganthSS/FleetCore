import { Request, Response } from 'express';
import { vehicleService } from '../services/vehicle.service';
import {
  createVehicleSchema,
  updateVehicleSchema,
  vehicleIdParamSchema,
  vehicleQuerySchema,
} from '../validators/vehicle.validator';

export class VehicleController {
  /**
   * Handles creation of a new Vehicle.
   * Validates body with `createVehicleSchema` and delegates to `vehicleService.createVehicle()`.
   */
  async createVehicle(req: Request, res: Response): Promise<void> {
    const parseResult = createVehicleSchema.safeParse(req.body);

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
      const vehicle = await vehicleService.createVehicle(parseResult.data);
      res.status(201).json({
        success: true,
        message: 'Vehicle created successfully',
        data: vehicle,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create vehicle';
      
      let statusCode = 500;
      if (message.includes('already exists')) {
        statusCode = 409;
      } else if (message.includes('does not exist') || message.includes('not found')) {
        statusCode = 404;
      }

      res.status(statusCode).json({
        success: false,
        message,
      });
    }
  }

  /**
   * Handles retrieving a single Vehicle by UUID path parameter.
   */
  async getVehicle(req: Request, res: Response): Promise<void> {
    const paramResult = vehicleIdParamSchema.safeParse(req.params);

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
      const vehicle = await vehicleService.getVehicleById(paramResult.data.id);
      res.status(200).json({
        success: true,
        data: vehicle,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to retrieve vehicle';
      const statusCode = message.includes('not found') ? 404 : 500;

      res.status(statusCode).json({
        success: false,
        message,
      });
    }
  }

  /**
   * Handles listing vehicles with query filtering, searching, sorting, and pagination.
   */
  async getVehicles(req: Request, res: Response): Promise<void> {
    const queryResult = vehicleQuerySchema.safeParse(req.query);

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
      const paginatedResult = await vehicleService.getVehicles(queryResult.data, companyId);

      res.status(200).json({
        success: true,
        data: paginatedResult,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to retrieve vehicles';
      res.status(500).json({
        success: false,
        message,
      });
    }
  }

  /**
   * Handles updating an existing Vehicle by path parameter and request body.
   */
  async updateVehicle(req: Request, res: Response): Promise<void> {
    const paramResult = vehicleIdParamSchema.safeParse(req.params);

    if (!paramResult.success) {
      const formattedErrors = paramResult.error.issues.map((issue) => issue.message);
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: formattedErrors,
      });
      return;
    }

    const bodyResult = updateVehicleSchema.safeParse(req.body);

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
      const updatedVehicle = await vehicleService.updateVehicle(
        paramResult.data.id,
        bodyResult.data
      );

      res.status(200).json({
        success: true,
        message: 'Vehicle updated successfully',
        data: updatedVehicle,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update vehicle';

      let statusCode = 500;
      if (message.includes('already exists')) {
        statusCode = 409;
      } else if (message.includes('not found')) {
        statusCode = 404;
      }

      res.status(statusCode).json({
        success: false,
        message,
      });
    }
  }

  /**
   * Handles deleting a Vehicle by UUID path parameter.
   */
  async deleteVehicle(req: Request, res: Response): Promise<void> {
    const paramResult = vehicleIdParamSchema.safeParse(req.params);

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
      await vehicleService.deleteVehicle(paramResult.data.id);
      res.status(200).json({
        success: true,
        message: 'Vehicle deleted successfully',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete vehicle';
      const statusCode = message.includes('not found') ? 404 : 500;

      res.status(statusCode).json({
        success: false,
        message,
      });
    }
  }
}

export const vehicleController = new VehicleController();
