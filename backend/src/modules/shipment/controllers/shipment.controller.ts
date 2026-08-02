import { Request, Response } from 'express';
import { shipmentService } from '../services/shipment.service';
import {
  createShipmentSchema,
  updateShipmentSchema,
  shipmentIdParamSchema,
  shipmentQuerySchema,
} from '../validators/shipment.validator';

export class ShipmentController {
  /**
   * Handles creation of a new Shipment record.
   * Validates body with `createShipmentSchema` and delegates to `shipmentService.createShipment()`.
   */
  async createShipment(req: Request, res: Response): Promise<void> {
    const parseResult = createShipmentSchema.safeParse(req.body);

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
      const shipment = await shipmentService.createShipment(parseResult.data);
      res.status(201).json({
        success: true,
        message: 'Shipment created successfully',
        data: shipment,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create shipment';

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
   * Handles retrieving a single Shipment by UUID path parameter.
   * Scopes request to authenticated user's company tenant.
   */
  async getShipment(req: Request, res: Response): Promise<void> {
    const paramResult = shipmentIdParamSchema.safeParse(req.params);

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
      const shipment = await shipmentService.getShipmentById(paramResult.data.id, companyId);
      res.status(200).json({
        success: true,
        data: shipment,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to retrieve shipment';
      const statusCode = message.includes('not found') ? 404 : 500;

      res.status(statusCode).json({
        success: false,
        message,
      });
    }
  }

  /**
   * Handles listing shipments with query filtering, searching, sorting, and pagination.
   * Scopes query to authenticated user's company tenant.
   */
  async getShipments(req: Request, res: Response): Promise<void> {
    const queryResult = shipmentQuerySchema.safeParse(req.query);

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
      const paginatedResult = await shipmentService.getShipments(queryResult.data, companyId);

      res.status(200).json({
        success: true,
        data: paginatedResult,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to retrieve shipments';
      res.status(500).json({
        success: false,
        message,
      });
    }
  }

  /**
   * Handles updating an existing Shipment by path parameter and request body.
   * Scopes request to authenticated user's company tenant.
   */
  async updateShipment(req: Request, res: Response): Promise<void> {
    const paramResult = shipmentIdParamSchema.safeParse(req.params);

    if (!paramResult.success) {
      const formattedErrors = paramResult.error.issues.map((issue) => issue.message);
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: formattedErrors,
      });
      return;
    }

    const bodyResult = updateShipmentSchema.safeParse(req.body);

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
      const updatedShipment = await shipmentService.updateShipment(
        paramResult.data.id,
        bodyResult.data,
        companyId
      );

      res.status(200).json({
        success: true,
        message: 'Shipment updated successfully',
        data: updatedShipment,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update shipment';

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
   * Handles deleting a Shipment by UUID path parameter.
   * Scopes request to authenticated user's company tenant.
   */
  async deleteShipment(req: Request, res: Response): Promise<void> {
    const paramResult = shipmentIdParamSchema.safeParse(req.params);

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
      await shipmentService.deleteShipment(paramResult.data.id, companyId);
      res.status(200).json({
        success: true,
        message: 'Shipment deleted successfully',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete shipment';
      const statusCode = message.includes('not found') ? 404 : 500;

      res.status(statusCode).json({
        success: false,
        message,
      });
    }
  }
}

export const shipmentController = new ShipmentController();
