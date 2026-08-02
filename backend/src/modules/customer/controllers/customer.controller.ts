import { Request, Response } from 'express';
import { customerService } from '../services/customer.service';
import {
  createCustomerSchema,
  updateCustomerSchema,
  customerIdParamSchema,
  customerQuerySchema,
} from '../validators/customer.validator';

export class CustomerController {
  /**
   * Handles creation of a new Customer record.
   * Validates body with `createCustomerSchema` and delegates to `customerService.createCustomer()`.
   */
  async createCustomer(req: Request, res: Response): Promise<void> {
    const parseResult = createCustomerSchema.safeParse(req.body);

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
      const customer = await customerService.createCustomer(parseResult.data);
      res.status(201).json({
        success: true,
        message: 'Customer created successfully',
        data: customer,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create customer';

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
   * Handles retrieving a single Customer record by UUID path parameter.
   * Scopes request to authenticated user's company tenant.
   */
  async getCustomer(req: Request, res: Response): Promise<void> {
    const paramResult = customerIdParamSchema.safeParse(req.params);

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
      const customer = await customerService.getCustomerById(paramResult.data.id, companyId);
      res.status(200).json({
        success: true,
        data: customer,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to retrieve customer';
      const statusCode = message.includes('not found') ? 404 : 500;

      res.status(statusCode).json({
        success: false,
        message,
      });
    }
  }

  /**
   * Handles listing customers with query filtering, searching, sorting, and pagination.
   * Scopes query to authenticated user's company tenant.
   */
  async getCustomers(req: Request, res: Response): Promise<void> {
    const queryResult = customerQuerySchema.safeParse(req.query);

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
      const paginatedResult = await customerService.getCustomers(queryResult.data, companyId);

      res.status(200).json({
        success: true,
        data: paginatedResult,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to retrieve customers';
      res.status(500).json({
        success: false,
        message,
      });
    }
  }

  /**
   * Handles updating an existing Customer record by path parameter and request body.
   * Scopes request to authenticated user's company tenant.
   */
  async updateCustomer(req: Request, res: Response): Promise<void> {
    const paramResult = customerIdParamSchema.safeParse(req.params);

    if (!paramResult.success) {
      const formattedErrors = paramResult.error.issues.map((issue) => issue.message);
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: formattedErrors,
      });
      return;
    }

    const bodyResult = updateCustomerSchema.safeParse(req.body);

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
      const updatedCustomer = await customerService.updateCustomer(
        paramResult.data.id,
        bodyResult.data,
        companyId
      );

      res.status(200).json({
        success: true,
        message: 'Customer updated successfully',
        data: updatedCustomer,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update customer';

      let statusCode = 500;
      if (message.includes('already exists')) {
        statusCode = 409;
      } else if (message.includes('not found') || message.includes('does not exist')) {
        statusCode = 404;
      }

      res.status(statusCode).json({
        success: false,
        message,
      });
    }
  }

  /**
   * Handles deleting a Customer record by UUID path parameter.
   * Scopes request to authenticated user's company tenant.
   */
  async deleteCustomer(req: Request, res: Response): Promise<void> {
    const paramResult = customerIdParamSchema.safeParse(req.params);

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
      await customerService.deleteCustomer(paramResult.data.id, companyId);
      res.status(200).json({
        success: true,
        message: 'Customer deleted successfully',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete customer';
      const statusCode = message.includes('not found') ? 404 : 500;

      res.status(statusCode).json({
        success: false,
        message,
      });
    }
  }
}

export const customerController = new CustomerController();
