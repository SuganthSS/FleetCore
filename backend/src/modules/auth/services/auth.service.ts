import { CompanyStatus, UserStatus } from '@prisma/client';
import { prisma } from '../../../config/database';
import { AuthenticatedUser, LoginRequest, LoginResponse, TokenPair } from '../interfaces/auth.interface';

import { generateAccessToken, generateRefreshToken } from '../utils/jwt.util';
import { comparePassword } from '../utils/password.util';

export class AuthService {
  /**
   * Fully implements user login workflow.
   *
   * Workflow Steps:
   * 1. Looks up User record by email including `company` and `role` relations.
   * 2. Verifies user exists & validates plaintext password against `passwordHash`.
   * 3. Verifies User status is `ACTIVE`.
   * 4. Verifies parent Company status is `ACTIVE`.
   * 5. Generates Access & Refresh JWT token pair.
   * 6. Updates `lastLogin` timestamp on the User record.
   * 7. Returns AuthenticatedUser payload and TokenPair without exposing `passwordHash`.
   *
   * @param credentials User email and plaintext password
   * @returns LoginResponse containing authenticated user identity and token pair
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const user = await prisma.user.findUnique({
      where: { email: credentials.email },
      include: {
        company: true,
        role: true,
      },
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await comparePassword(credentials.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    if (user.status === UserStatus.SUSPENDED) {
      throw new Error('User account is suspended');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new Error('User account is not active');
    }

    if (user.company.status === CompanyStatus.SUSPENDED) {
      throw new Error('Company account is suspended');
    }

    if (user.company.status !== CompanyStatus.ACTIVE) {
      throw new Error('Company account is not active');
    }

    const accessToken = generateAccessToken({
      sub: user.id,
      email: user.email,
      companyId: user.companyId,
      roleId: user.roleId,
      roleName: user.role.name,
    });


    const refreshToken = generateRefreshToken({
      sub: user.id,
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    const authenticatedUser: AuthenticatedUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      companyId: user.companyId,
      roleId: user.roleId,
      roleName: user.role.name,
    };

    const tokens: TokenPair = {
      accessToken,
      refreshToken,
      expiresIn: 86400, // 24 hours (1d) default
    };

    return {
      user: authenticatedUser,
      tokens,
    };
  }

  /**
   * Placeholder for Refresh Token workflow (SPEC-026)
   */
  async refreshToken(): Promise<TokenPair> {
    throw new Error('Method not implemented: refreshToken');
  }

  /**
   * Placeholder for Logout workflow (SPEC-026)
   */
  async logout(): Promise<void> {
    throw new Error('Method not implemented: logout');
  }

  /**
   * Placeholder for Forgot Password workflow
   */
  async forgotPassword(): Promise<void> {
    throw new Error('Method not implemented: forgotPassword');
  }

  /**
   * Placeholder for Reset Password workflow
   */
  async resetPassword(): Promise<void> {
    throw new Error('Method not implemented: resetPassword');
  }

  /**
   * Placeholder for Change Password workflow
   */
  async changePassword(): Promise<void> {
    throw new Error('Method not implemented: changePassword');
  }
}

export const authService = new AuthService();
