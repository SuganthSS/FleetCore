import { Request, Response } from 'express';
import { routeService } from '../services/route.service';
import {
  createRouteSchema,
  updateRouteSchema,
  routeIdParamSchema,
  routeQuerySchema,
} from '../validators/route.validator';

export class RouteController {
  /**
   * Handles creation of a new Route record.
   * Validates body with `createRouteSchema` and delegates to `routeService.createRoute()`.
   */
  async createRoute(req: Request, res: Response): Promise<void> {
    const parseResult = createRouteSchema.safeParse(req.body);

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
      const route = await routeService.createRoute(parseResult.data);
      res.status(201).json({
        success: true,
        message: 'Route created successfully',
        data: route,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create route';

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
   * Handles retrieving a single Route by UUID path parameter.
   * Scopes request to authenticated user's company tenant.
   */
  async getRoute(req: Request, res: Response): Promise<void> {
    const paramResult = routeIdParamSchema.safeParse(req.params);

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
      const route = await routeService.getRouteById(paramResult.data.id, companyId);
      res.status(200).json({
        success: true,
        data: route,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to retrieve route';
      const statusCode = message.includes('not found') ? 404 : 500;

      res.status(statusCode).json({
        success: false,
        message,
      });
    }
  }

  /**
   * Handles listing routes with query filtering, searching, sorting, and pagination.
   * Scopes query to authenticated user's company tenant.
   */
  async getRoutes(req: Request, res: Response): Promise<void> {
    const queryResult = routeQuerySchema.safeParse(req.query);

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
      const paginatedResult = await routeService.getRoutes(queryResult.data, companyId);

      res.status(200).json({
        success: true,
        data: paginatedResult,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to retrieve routes';
      res.status(500).json({
        success: false,
        message,
      });
    }
  }

  /**
   * Handles updating an existing Route by path parameter and request body.
   * Scopes request to authenticated user's company tenant.
   */
  async updateRoute(req: Request, res: Response): Promise<void> {
    const paramResult = routeIdParamSchema.safeParse(req.params);

    if (!paramResult.success) {
      const formattedErrors = paramResult.error.issues.map((issue) => issue.message);
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: formattedErrors,
      });
      return;
    }

    const bodyResult = updateRouteSchema.safeParse(req.body);

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
      const updatedRoute = await routeService.updateRoute(
        paramResult.data.id,
        bodyResult.data,
        companyId
      );

      res.status(200).json({
        success: true,
        message: 'Route updated successfully',
        data: updatedRoute,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update route';

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
   * Handles deleting a Route by UUID path parameter.
   * Scopes request to authenticated user's company tenant.
   */
  async deleteRoute(req: Request, res: Response): Promise<void> {
    const paramResult = routeIdParamSchema.safeParse(req.params);

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
      await routeService.deleteRoute(paramResult.data.id, companyId);
      res.status(200).json({
        success: true,
        message: 'Route deleted successfully',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete route';
      const statusCode = message.includes('not found') ? 404 : 500;

      res.status(statusCode).json({
        success: false,
        message,
      });
    }
  }
}

export const routeController = new RouteController();
