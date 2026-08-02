export interface AuthenticatedUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  companyId: string;
  roleId: string;
  roleName: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  companyId: string;
  roleId: string;
  roleName?: string;
  type: string;
  iat?: number;
  exp?: number;
}


export interface RefreshTokenPayload {
  sub: string;
  type: string;
  tokenVersion?: number;
  iat?: number;
  exp?: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: AuthenticatedUser;
  tokens: TokenPair;
}

declare global {
  /* eslint-disable-next-line @typescript-eslint/no-namespace */
  namespace Express {
    interface Request {
      authenticatedUser?: AuthenticatedUser;
    }
  }
}
