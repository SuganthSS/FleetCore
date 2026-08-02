# FleetCore Authentication Foundation Architecture

**SPEC ID**: SPEC-019, SPEC-020, SPEC-021, SPEC-022, SPEC-023, SPEC-024, SPEC-025  
**Phase**: Phase 5 - Backend Authentication  
**Module**: Authentication  
**Title**: Authentication Foundation, Security Utilities, Middleware, Validation & Service Documentation  
**Date**: 2026-08-02  

---

## 🏗️ Architecture Overview

The `auth` module provides the architectural blueprint and foundational layer for all identity, authentication, session management, and RBAC operations within FleetCore. It adheres to modular domain design principles, isolating authentication configuration, contracts, interfaces, utilities, middlewares, validation schemas, and business services.

---

## 📁 Directory Structure & Folder Responsibilities

The module is structured under `backend/src/modules/auth/` as follows:

```text
backend/src/modules/auth/
├── constants/
│   ├── auth.constants.ts    # Reusable constants (Token types, cookie names, header keys)
│   └── index.ts             # Barrel export
├── controllers/
│   └── index.ts             # Controller exports (HTTP request handling - Future SPECs)
├── interfaces/
│   ├── auth.interface.ts    # Interface contracts (AuthenticatedUser, JwtPayload, TokenPair, etc.)
│   └── index.ts             # Barrel export
├── middlewares/
│   ├── auth.middleware.ts   # Express authentication middleware (Bearer token verification & req context binding)
│   ├── rbac.middleware.ts   # Role-based access control middleware (Permission evaluation)
│   └── index.ts             # Barrel export
├── routes/
│   └── index.ts             # Express router definitions (Future SPECs)
├── services/
│   ├── auth.service.ts      # Domain business logic for authentication & user identity
│   └── index.ts             # Barrel export
├── types/
│   ├── auth.types.ts        # Foundational TypeScript type aliases (AuthTokenType, UserRoleName)
│   └── index.ts             # Barrel export
├── utils/
│   ├── password.util.ts     # Password hashing, comparison & strength validation
│   ├── jwt.util.ts          # Access/Refresh JWT generation, verification & decoding
│   └── index.ts             # Barrel export
├── validators/
│   ├── auth.validator.ts    # Zod schemas for login, refresh, change/forgot/reset password
│   └── index.ts             # Barrel export
└── index.ts                 # Master barrel export for the auth module
```

---

## ⚙️ Authentication Service (`SPEC-025`)

The authentication service (`backend/src/modules/auth/services/auth.service.ts`) encapsulates all core business logic for user authentication, isolated from HTTP layer concerns (Express `req`/`res`).

### Core Methods & Workflows
- **`login(credentials: LoginRequest): Promise<LoginResponse>`**:
  1. Queries Prisma `User` table by `email`, retrieving attached `company` and `role` relations.
  2. Verifies user exists & compares plaintext password against stored `passwordHash` via `comparePassword`.
  3. Validates `user.status === 'ACTIVE'` and parent `company.status === 'ACTIVE'`.
  4. Generates Access and Refresh JWT token pair via `generateAccessToken` and `generateRefreshToken`.
  5. Updates `lastLogin` timestamp in PostgreSQL.
  6. Returns structured `LoginResponse` (`AuthenticatedUser` + `TokenPair`), excluding `passwordHash`.
- **Placeholders**: `refreshToken()`, `logout()`, `forgotPassword()`, `resetPassword()`, `changePassword()`.

---

## 📐 Authentication Validation Schemas (`SPEC-024`)

The validation schemas (`backend/src/modules/auth/validators/auth.validator.ts`) provide centralized Zod request payload validation (`loginSchema`, `refreshTokenSchema`, `changePasswordSchema`, `forgotPasswordSchema`, `resetPasswordSchema`).

---

## 🔄 Middleware Execution Lifecycle

```text
       Incoming HTTP Request
                 │
                 ▼
       ┌───────────────────┐
       │   authenticate()  │  ---> Verifies Bearer JWT signature & expiration.
       └─────────┬─────────┘       Attaches req.authenticatedUser context.
                 │
                 ▼
       ┌───────────────────┐
       │ authorize(...roles)│ ---> Evaluates req.authenticatedUser.roleName.
       └─────────┬─────────┘       Enforces RBAC permissions without re-verifying JWT.
                 │
                 ▼
       ┌───────────────────┐
       │ Route Controller  │ ---> Validates body via Zod schemas & delegates to AuthService.
       └───────────────────┘
```

---

## 👑 RBAC Middleware (`SPEC-023`) & 🛡️ Auth Middleware (`SPEC-022`)

- **`authorize(...allowedRoles)`**: Evaluates user role permissions.
- **`authenticate`**: Verifies Bearer JWTs and binds identity context.

---

## 🔒 Password Utility (`SPEC-020`) & 🎟️ JWT Utility (`SPEC-021`)

- **Password Utilities**: `hashPassword`, `comparePassword`, `validatePasswordStrength`.
- **JWT Utilities**: `generateAccessToken`, `generateRefreshToken`, `verifyAccessToken`, `verifyRefreshToken`, `decodeToken`.

---

## 🔑 Environment Variables

| Variable Name | Required | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `JWT_SECRET` | Yes | N/A | HMAC secret key used to sign Access JWTs |
| `JWT_REFRESH_SECRET` | Yes | N/A | HMAC secret key used to sign Refresh Tokens |
| `JWT_EXPIRES_IN` | No | `1d` | Access token lifespan duration (e.g. `15m`, `1d`) |
| `JWT_REFRESH_EXPIRES_IN` | No | `7d` | Refresh token lifespan duration (e.g. `7d`, `30d`) |
| `BCRYPT_ROUNDS` | No | `10` | Salt round iterations for bcrypt password hashing |

---

## 🗺️ Authentication Implementation Roadmap

1. **SPEC-019 (Completed)**: Authentication Foundation.
2. **SPEC-020 (Completed)**: Password Hashing & Strength Utility.
3. **SPEC-021 (Completed)**: JWT Utilities.
4. **SPEC-022 (Completed)**: Authentication Middleware (`authenticate`).
5. **SPEC-023 (Completed)**: RBAC Middleware (`authorize`).
6. **SPEC-024 (Completed)**: Authentication Validation Schemas (`auth.validator.ts`).
7. **SPEC-025 (Completed)**: Authentication Service (`auth.service.ts`).
8. **SPEC-026**: User Registration & Login API endpoints (`/api/v1/auth/register`, `/api/v1/auth/login`).
9. **SPEC-027**: Token Refresh & Logout API endpoints (`/api/v1/auth/refresh`, `/api/v1/auth/logout`).
