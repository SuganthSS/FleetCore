export const AUTH_CONSTANTS = {
  TOKEN_TYPES: {
    ACCESS: 'ACCESS',
    REFRESH: 'REFRESH',
    PASSWORD_RESET: 'PASSWORD_RESET',
    EMAIL_VERIFICATION: 'EMAIL_VERIFICATION',
  },
  COOKIES: {
    ACCESS_TOKEN: 'fleetcore_access_token',
    REFRESH_TOKEN: 'fleetcore_refresh_token',
  },
  HEADERS: {
    AUTHORIZATION: 'authorization',
    BEARER_PREFIX: 'Bearer ',
    COMPANY_ID: 'x-company-id',
  },
  STRINGS: {
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Access forbidden',
    TOKEN_EXPIRED: 'Authentication token has expired',
    INVALID_TOKEN: 'Invalid authentication token',
  },
} as const;
