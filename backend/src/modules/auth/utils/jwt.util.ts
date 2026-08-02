import jwt from 'jsonwebtoken';
import { config } from '../../../config/env';
import { AUTH_CONSTANTS } from '../constants/auth.constants';
import { JwtPayload, RefreshTokenPayload } from '../interfaces/auth.interface';

export interface VerifyJwtResult<T> {
  success: boolean;
  payload?: T;
  error?: 'EXPIRED' | 'INVALID' | 'MALFORMED';
}

/**
 * Generates an Access JWT for an authenticated user.
 *
 * @param payload Payload containing user identity and tenant details
 * @returns Signed access JWT string
 */
export function generateAccessToken(payload: Omit<JwtPayload, 'type' | 'iat' | 'exp'>): string {
  const claims: JwtPayload = {
    ...payload,
    type: AUTH_CONSTANTS.TOKEN_TYPES.ACCESS,
  };

  return jwt.sign(claims, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn as jwt.SignOptions['expiresIn'],
  });
}

/**
 * Generates a Refresh JWT for session renewal.
 *
 * @param payload Refresh payload containing subject and token version
 * @returns Signed refresh JWT string
 */
export function generateRefreshToken(payload: Omit<RefreshTokenPayload, 'type' | 'iat' | 'exp'>): string {
  const claims: RefreshTokenPayload = {
    ...payload,
    type: AUTH_CONSTANTS.TOKEN_TYPES.REFRESH,
  };

  return jwt.sign(claims, config.jwtRefreshSecret, {
    expiresIn: config.jwtRefreshExpiresIn as jwt.SignOptions['expiresIn'],
  });
}

/**
 * Verifies and decodes an Access JWT securely.
 *
 * @param token Signed Access JWT string
 * @returns Typed result containing success flag, decoded payload, or sanitized error status
 */
export function verifyAccessToken(token: string): VerifyJwtResult<JwtPayload> {
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
    if (decoded.type !== AUTH_CONSTANTS.TOKEN_TYPES.ACCESS) {
      return { success: false, error: 'INVALID' };
    }
    return { success: true, payload: decoded };
  } catch (err: unknown) {
    if (err instanceof jwt.TokenExpiredError) {
      return { success: false, error: 'EXPIRED' };
    }
    if (err instanceof jwt.JsonWebTokenError) {
      return { success: false, error: 'INVALID' };
    }
    return { success: false, error: 'MALFORMED' };
  }
}

/**
 * Verifies and decodes a Refresh JWT securely.
 *
 * @param token Signed Refresh JWT string
 * @returns Typed result containing success flag, decoded payload, or sanitized error status
 */
export function verifyRefreshToken(token: string): VerifyJwtResult<RefreshTokenPayload> {
  try {
    const decoded = jwt.verify(token, config.jwtRefreshSecret) as RefreshTokenPayload;
    if (decoded.type !== AUTH_CONSTANTS.TOKEN_TYPES.REFRESH) {
      return { success: false, error: 'INVALID' };
    }
    return { success: true, payload: decoded };
  } catch (err: unknown) {
    if (err instanceof jwt.TokenExpiredError) {
      return { success: false, error: 'EXPIRED' };
    }
    if (err instanceof jwt.JsonWebTokenError) {
      return { success: false, error: 'INVALID' };
    }
    return { success: false, error: 'MALFORMED' };
  }
}

/**
 * Decodes a JWT token without verifying signature (useful for unauthenticated inspection).
 *
 * @param token JWT string to decode
 * @returns Decodes payload object or null if unparseable
 */
export function decodeToken<T = unknown>(token: string): T | null {
  try {
    return jwt.decode(token) as T | null;
  } catch {
    return null;
  }
}
