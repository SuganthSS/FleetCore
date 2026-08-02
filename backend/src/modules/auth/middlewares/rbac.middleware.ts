import { Request, Response, NextFunction } from 'express';
import { AUTH_CONSTANTS } from '../constants/auth.constants';
import { UserRoleName } from '../types/auth.types';

/**
 * Higher-order Express middleware function that restricts access to endpoints based on user roles.
 *
 * Authorization Lifecycle:
 * 1. Checks for the presence of `req.authenticatedUser` (attached by `authenticate()` middleware).
 * 2. Evaluates the user's assigned `roleName` or `roleId` against allowed role criteria.
 * 3. Dispatches `next()` if authorized.
 * 4. Responds with HTTP 403 Forbidden or HTTP 401 Unauthorized if check fails.
 *
 * @param allowedRoles List of allowed role names or IDs
 * @returns Express middleware function
 */
export function authorize(...allowedRoles: (UserRoleName | string)[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.authenticatedUser) {
      res.status(401).json({
        success: false,
        message: AUTH_CONSTANTS.STRINGS.UNAUTHORIZED,
        code: 'UNAUTHENTICATED_CONTEXT_MISSING',
      });
      return;
    }

    const userRole = req.authenticatedUser.roleName || req.authenticatedUser.roleId;

    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
      res.status(403).json({
        success: false,
        message: AUTH_CONSTANTS.STRINGS.FORBIDDEN,
        code: 'INSUFFICIENT_PERMISSIONS',
      });
      return;
    }

    next();
  };
}
