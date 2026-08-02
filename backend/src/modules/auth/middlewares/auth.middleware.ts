import { Request, Response, NextFunction } from 'express';
import { AUTH_CONSTANTS } from '../constants/auth.constants';
import { AuthenticatedUser } from '../interfaces/auth.interface';
import { verifyAccessToken } from '../utils/jwt.util';

/**
 * Express middleware to authenticate incoming HTTP requests via Bearer JWT tokens.
 *
 * Verification Lifecycle:
 * 1. Inspects the `Authorization` header.
 * 2. Validates `Bearer <token>` string prefix format.
 * 3. Verifies token signature and expiration via `verifyAccessToken`.
 * 4. Extracts payload claims and binds `authenticatedUser` to Express `req`.
 * 5. Passes control to `next()` on success, or returns standard HTTP 401 response on failure.
 */
export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers[AUTH_CONSTANTS.HEADERS.AUTHORIZATION];

  if (!authHeader || typeof authHeader !== 'string') {
    res.status(401).json({
      success: false,
      message: 'Authorization header is missing',
      code: 'MISSING_AUTHORIZATION_HEADER',
    });
    return;
  }

  if (!authHeader.startsWith(AUTH_CONSTANTS.HEADERS.BEARER_PREFIX)) {
    res.status(401).json({
      success: false,
      message: 'Authorization header format must be Bearer <token>',
      code: 'INVALID_BEARER_FORMAT',
    });
    return;
  }

  const token = authHeader.substring(AUTH_CONSTANTS.HEADERS.BEARER_PREFIX.length).trim();

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Authentication token is empty',
      code: 'EMPTY_TOKEN',
    });
    return;
  }

  const verification = verifyAccessToken(token);

  if (!verification.success || !verification.payload) {
    if (verification.error === 'EXPIRED') {
      res.status(401).json({
        success: false,
        message: AUTH_CONSTANTS.STRINGS.TOKEN_EXPIRED,
        code: 'TOKEN_EXPIRED',
      });
      return;
    }

    if (verification.error === 'MALFORMED') {
      res.status(401).json({
        success: false,
        message: 'Authentication token is malformed',
        code: 'TOKEN_MALFORMED',
      });
      return;
    }

    res.status(401).json({
      success: false,
      message: AUTH_CONSTANTS.STRINGS.INVALID_TOKEN,
      code: 'INVALID_TOKEN',
    });
    return;
  }

  const payload = verification.payload;

  const authenticatedUser: AuthenticatedUser = {
    id: payload.sub,
    email: payload.email,
    firstName: '', // Populated downstream if needed
    lastName: '',
    companyId: payload.companyId,
    roleId: payload.roleId,
    roleName: payload.roleName || '',
  };


  req.authenticatedUser = authenticatedUser;

  next();
}
