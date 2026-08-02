import { Request, Response } from 'express';
import { maintenanceService } from '../services/maintenance.service';
import {
  createMaintenanceSchema,
  updateMaintenanceSchema,
  maintenanceIdParamSchema,
  maintenanceQuerySchema,
} from '../validators/maintenance.validator';

export class MaintenanceController {
  /**
   * Handles creation of a new MaintenanceRecord work order entry.
   * Validates body with `createMaintenanceSchema` and delegates to `maintenanceService.createMaintenance()`.
   */
  async createMaintenance(req: Request, res: Response): Promise<void> {
    const parseResult = createMaintenanceSchema.safeParse(req.body);

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
      const maintenance = await maintenanceService.createMaintenance(parseResult.data);
      res.status(201).json({
        success: true,
        message: 'Maintenance record created successfully',
        data: maintenance,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create maintenance record';

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
   * Handles retrieving a single MaintenanceRecord by UUID path parameter.
   * Scopes request to authenticated user's company tenant.
   */
  async getMaintenance(req: Request, res: Response): Promise<void> {
    const paramResult = maintenanceIdParamSchema.safeParse(req.params);

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
      const maintenance = await maintenanceService.getMaintenanceById(paramResult.data.id, companyId);
      res.status(200).json({
        success: true,
        data: maintenance,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to retrieve maintenance record';
      const statusCode = message.includes('not found') ? 404 : 500;

      res.status(statusCode).json({
        success: false,
        message,
      });
    }
  }

  /**
   * Handles listing maintenance records with query filtering, searching, sorting, and pagination.
   * Scopes query to authenticated user's company tenant.
   */
  async getMaintenances(req: Request, res: Response): Promise<void> {
    const queryResult = maintenanceQuerySchema.safeParse(req.query);

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
      const paginatedResult = await maintenanceService.getMaintenances(queryResult.data, companyId);

      res.status(200).json({
        success: true,
        data: paginatedResult,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to retrieve maintenance records';
      res.status(500).json({
        success: false,
        message,
      });
    }
  }

  /**
   * Handles updating an existing MaintenanceRecord by path parameter and request body.
   * Scopes request to authenticated user's company tenant.
   */
  async updateMaintenance(req: Request, res: Response): Promise<void> {
    const paramResult = maintenanceIdParamSchema.safeParse(req.params);

    if (!paramResult.success) {
      const formattedErrors = paramResult.error.issues.map((issue) => issue.message);
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: formattedErrors,
      });
      return;
    }

    const bodyResult = updateMaintenanceSchema.safeParse(req.body);

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
      const updatedRecord = await maintenanceService.updateMaintenance(
        paramResult.data.id,
        bodyResult.data,
        companyId
      );

      res.status(200).json({
        success: true,
        message: 'Maintenance record updated successfully',
        data: updatedRecord,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update maintenance record';

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
   * Handles deleting a MaintenanceRecord by UUID path parameter.
   * Scopes request to authenticated user's company tenant.
   */
  async deleteMaintenance(req: Request, res: Response): Promise<void> {
    const paramResult = maintenanceIdParamSchema.safeParse(req.params);

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
      await maintenanceService.deleteMaintenance(paramResult.data.id, companyId);
      res.status(200).json({
        success: true,
        message: 'Maintenance record deleted successfully',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete maintenance record';
      const statusCode = message.includes('not found') ? 404 : 500;

      res.status(statusCode).json({
        success: false,
        message,
      });
    }
  }
}

export const maintenanceController = new MaintenanceController();
