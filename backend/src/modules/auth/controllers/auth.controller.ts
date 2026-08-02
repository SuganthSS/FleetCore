import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  refreshTokenSchema,
  resetPasswordSchema,
} from '../validators/auth.validator';

export class AuthController {
  /**
   * Handles user authentication login requests.
   * Validates payload with `loginSchema` and delegates authentication to `authService.login()`.
   */
  async login(req: Request, res: Response): Promise<void> {
    const parseResult = loginSchema.safeParse(req.body);

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
      const loginData = await authService.login(parseResult.data);
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: loginData,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Authentication failed';
      res.status(401).json({
        success: false,
        message,
      });
    }
  }

  /**
   * Handles refresh token requests.
   */
  async refreshToken(req: Request, res: Response): Promise<void> {
    const parseResult = refreshTokenSchema.safeParse(req.body);

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
      const tokenPair = await authService.refreshToken();
      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: tokenPair,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Token refresh failed';
      res.status(401).json({
        success: false,
        message,
      });
    }
  }

  /**
   * Handles user logout requests.
   */
  async logout(_req: Request, res: Response): Promise<void> {
    try {
      await authService.logout();
      res.status(200).json({
        success: true,
        message: 'Logout successful',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Logout failed';
      res.status(400).json({
        success: false,
        message,
      });
    }
  }

  /**
   * Handles forgot password requests.
   */
  async forgotPassword(req: Request, res: Response): Promise<void> {
    const parseResult = forgotPasswordSchema.safeParse(req.body);

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
      await authService.forgotPassword();
      res.status(200).json({
        success: true,
        message: 'Password reset instructions sent to email',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Forgot password request failed';
      res.status(400).json({
        success: false,
        message,
      });
    }
  }

  /**
   * Handles reset password requests.
   */
  async resetPassword(req: Request, res: Response): Promise<void> {
    const parseResult = resetPasswordSchema.safeParse(req.body);

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
      await authService.resetPassword();
      res.status(200).json({
        success: true,
        message: 'Password has been reset successfully',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Reset password failed';
      res.status(400).json({
        success: false,
        message,
      });
    }
  }

  /**
   * Handles change password requests.
   */
  async changePassword(req: Request, res: Response): Promise<void> {
    const parseResult = changePasswordSchema.safeParse(req.body);

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
      await authService.changePassword();
      res.status(200).json({
        success: true,
        message: 'Password changed successfully',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Change password failed';
      res.status(400).json({
        success: false,
        message,
      });
    }
  }
}

export const authController = new AuthController();
