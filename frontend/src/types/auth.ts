export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  companyId: string;
  roleId: string;
  roleName: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: AuthUser;
    tokens: AuthTokens;
  };
}

export interface RefreshTokenResponse {
  success: boolean;
  data: {
    tokens: AuthTokens;
  };
}
