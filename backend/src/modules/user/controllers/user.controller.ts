import { Request, Response } from 'express';
import { userService } from '../services/user.service';
import {
  createUserSchema,
  updateUserSchema,
  userIdParamSchema,
  userQuerySchema,
  userStatusBodySchema,
  userResetPasswordBodySchema,
} from '../validators/user.validator';

export class UserController {
  /**
   * Handles user creation.
   */
  async createUser(req: Request, res: Response): Promise<void> {
    const parseResult = createUserSchema.safeParse(req.body);

    if (!parseResult.success) {
      const formattedErrors = parseResult.error.issues.map((issue) => issue.message);
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: formattedErrors,
      });
      return;
    }

    const isActorAdmin = req.authenticatedUser?.roleName === 'Administrator';

    // Tenant isolation: Default companyId if not provided
    if (!isActorAdmin) {
      parseResult.data.companyId = req.authenticatedUser?.companyId || '';
    }

    try {
      const user = await userService.createUser(parseResult.data);
      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: user,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create user';
      let statusCode = 500;
      if (message.includes('already registered')) {
        statusCode = 409;
      } else if (message.includes('does not exist')) {
        statusCode = 404;
      }

      res.status(statusCode).json({
        success: false,
        message,
      });
    }
  }

  /**
   * Handles retrieving a single user.
   */
  async getUser(req: Request, res: Response): Promise<void> {
    const paramResult = userIdParamSchema.safeParse(req.params);

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
      const isActorAdmin = req.authenticatedUser?.roleName === 'Administrator';
      const companyId = isActorAdmin ? undefined : req.authenticatedUser?.companyId;

      const user = await userService.getUserById(paramResult.data.id, companyId);
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to retrieve user';
      const statusCode = message.includes('not found') ? 404 : 500;

      res.status(statusCode).json({
        success: false,
        message,
      });
    }
  }

  /**
   * Handles listing users with filtering.
   */
  async getUsers(req: Request, res: Response): Promise<void> {
    const queryResult = userQuerySchema.safeParse(req.query);

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
      const isActorAdmin = req.authenticatedUser?.roleName === 'Administrator';
      const companyId = isActorAdmin ? undefined : req.authenticatedUser?.companyId;

      const paginatedResult = await userService.getUsers(queryResult.data, companyId);

      res.status(200).json({
        success: true,
        data: paginatedResult,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to retrieve users';
      res.status(500).json({
        success: false,
        message,
      });
    }
  }

  /**
   * Handles updating user fields.
   */
  async updateUser(req: Request, res: Response): Promise<void> {
    const paramResult = userIdParamSchema.safeParse(req.params);

    if (!paramResult.success) {
      const formattedErrors = paramResult.error.issues.map((issue) => issue.message);
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: formattedErrors,
      });
      return;
    }

    const bodyResult = updateUserSchema.safeParse(req.body);

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
      const isActorAdmin = req.authenticatedUser?.roleName === 'Administrator';
      const companyId = isActorAdmin ? undefined : req.authenticatedUser?.companyId;

      const updatedUser = await userService.updateUser(
        paramResult.data.id,
        bodyResult.data,
        companyId,
        isActorAdmin
      );

      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: updatedUser,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update user';
      let statusCode = 500;
      if (message.includes('already in use')) {
        statusCode = 409;
      } else if (message.includes('not found') || message.includes('does not exist')) {
        statusCode = 404;
      } else if (message.includes('Unauthorized') || message.includes('Only an Administrator')) {
        statusCode = 403;
      }

      res.status(statusCode).json({
        success: false,
        message,
      });
    }
  }

  /**
   * Handles soft deleting a user.
   */
  async deleteUser(req: Request, res: Response): Promise<void> {
    const paramResult = userIdParamSchema.safeParse(req.params);

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
      const isActorAdmin = req.authenticatedUser?.roleName === 'Administrator';
      const companyId = isActorAdmin ? undefined : req.authenticatedUser?.companyId;

      await userService.deleteUser(paramResult.data.id, companyId, isActorAdmin);

      res.status(200).json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete user';
      let statusCode = 500;
      if (message.includes('not found')) {
        statusCode = 404;
      } else if (message.includes('Unauthorized')) {
        statusCode = 403;
      }

      res.status(statusCode).json({
        success: false,
        message,
      });
    }
  }

  /**
   * Handles modifying user status.
   */
  async updateUserStatus(req: Request, res: Response): Promise<void> {
    const paramResult = userIdParamSchema.safeParse(req.params);

    if (!paramResult.success) {
      const formattedErrors = paramResult.error.issues.map((issue) => issue.message);
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: formattedErrors,
      });
      return;
    }

    const bodyResult = userStatusBodySchema.safeParse(req.body);

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
      const isActorAdmin = req.authenticatedUser?.roleName === 'Administrator';
      const companyId = isActorAdmin ? undefined : req.authenticatedUser?.companyId;

      const updatedUser = await userService.updateUserStatus(
        paramResult.data.id,
        bodyResult.data.status,
        companyId,
        isActorAdmin
      );

      res.status(200).json({
        success: true,
        message: 'User status updated successfully',
        data: updatedUser,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update user status';
      let statusCode = 500;
      if (message.includes('not found')) {
        statusCode = 404;
      } else if (message.includes('Unauthorized')) {
        statusCode = 403;
      }

      res.status(statusCode).json({
        success: false,
        message,
      });
    }
  }

  /**
   * Handles resetting user password.
   */
  async resetUserPassword(req: Request, res: Response): Promise<void> {
    const paramResult = userIdParamSchema.safeParse(req.params);

    if (!paramResult.success) {
      const formattedErrors = paramResult.error.issues.map((issue) => issue.message);
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: formattedErrors,
      });
      return;
    }

    const bodyResult = userResetPasswordBodySchema.safeParse(req.body);

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
      const isActorAdmin = req.authenticatedUser?.roleName === 'Administrator';
      const companyId = isActorAdmin ? undefined : req.authenticatedUser?.companyId;

      await userService.resetUserPassword(
        paramResult.data.id,
        bodyResult.data.password,
        companyId,
        isActorAdmin
      );

      res.status(200).json({
        success: true,
        message: 'User password reset successfully',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to reset user password';
      let statusCode = 500;
      if (message.includes('not found')) {
        statusCode = 404;
      } else if (message.includes('Unauthorized')) {
        statusCode = 403;
      }

      res.status(statusCode).json({
        success: false,
        message,
      });
    }
  }
}

export const userController = new UserController();
