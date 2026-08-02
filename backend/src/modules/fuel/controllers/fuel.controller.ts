import { Request, Response } from 'express';
import { fuelService } from '../services/fuel.service';
import {
  createFuelRecordSchema,
  updateFuelRecordSchema,
  fuelRecordIdParamSchema,
  fuelRecordQuerySchema,
} from '../validators/fuel.validator';

export class FuelController {
  /**
   * Handles creation of a new FuelRecord entry.
   * Validates body with `createFuelRecordSchema` and delegates to `fuelService.createFuelRecord()`.
   */
  async createFuelRecord(req: Request, res: Response): Promise<void> {
    const parseResult = createFuelRecordSchema.safeParse(req.body);

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
      const fuelRecord = await fuelService.createFuelRecord(parseResult.data);
      res.status(201).json({
        success: true,
        message: 'Fuel record created successfully',
        data: fuelRecord,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create fuel record';

      let statusCode = 500;
      if (message.includes('already exists')) {
        statusCode = 409;
      } else if (
        message.includes('does not exist') ||
        message.includes('not found') ||
        message.includes('does not belong') ||
        message.includes('not associated')
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
   * Handles retrieving a single FuelRecord by UUID path parameter.
   * Scopes request to authenticated user's company tenant.
   */
  async getFuelRecord(req: Request, res: Response): Promise<void> {
    const paramResult = fuelRecordIdParamSchema.safeParse(req.params);

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
      const fuelRecord = await fuelService.getFuelRecordById(paramResult.data.id, companyId);
      res.status(200).json({
        success: true,
        data: fuelRecord,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to retrieve fuel record';
      const statusCode = message.includes('not found') ? 404 : 500;

      res.status(statusCode).json({
        success: false,
        message,
      });
    }
  }

  /**
   * Handles listing fuel records with query filtering, searching, sorting, and pagination.
   * Scopes query to authenticated user's company tenant.
   */
  async getFuelRecords(req: Request, res: Response): Promise<void> {
    const queryResult = fuelRecordQuerySchema.safeParse(req.query);

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
      const paginatedResult = await fuelService.getFuelRecords(queryResult.data, companyId);

      res.status(200).json({
        success: true,
        data: paginatedResult,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to retrieve fuel records';
      res.status(500).json({
        success: false,
        message,
      });
    }
  }

  /**
   * Handles updating an existing FuelRecord by path parameter and request body.
   * Scopes request to authenticated user's company tenant.
   */
  async updateFuelRecord(req: Request, res: Response): Promise<void> {
    const paramResult = fuelRecordIdParamSchema.safeParse(req.params);

    if (!paramResult.success) {
      const formattedErrors = paramResult.error.issues.map((issue) => issue.message);
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: formattedErrors,
      });
      return;
    }

    const bodyResult = updateFuelRecordSchema.safeParse(req.body);

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
      const updatedRecord = await fuelService.updateFuelRecord(
        paramResult.data.id,
        bodyResult.data,
        companyId
      );

      res.status(200).json({
        success: true,
        message: 'Fuel record updated successfully',
        data: updatedRecord,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update fuel record';

      let statusCode = 500;
      if (message.includes('already exists')) {
        statusCode = 409;
      } else if (
        message.includes('not found') ||
        message.includes('does not exist') ||
        message.includes('does not belong') ||
        message.includes('not associated')
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
   * Handles deleting a FuelRecord by UUID path parameter.
   * Scopes request to authenticated user's company tenant.
   */
  async deleteFuelRecord(req: Request, res: Response): Promise<void> {
    const paramResult = fuelRecordIdParamSchema.safeParse(req.params);

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
      await fuelService.deleteFuelRecord(paramResult.data.id, companyId);
      res.status(200).json({
        success: true,
        message: 'Fuel record deleted successfully',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete fuel record';
      const statusCode = message.includes('not found') ? 404 : 500;

      res.status(statusCode).json({
        success: false,
        message,
      });
    }
  }
}

export const fuelController = new FuelController();
