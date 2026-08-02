# FleetCore Authentication Foundation Architecture

**SPEC ID**: SPEC-019, SPEC-020, SPEC-021, SPEC-022, SPEC-023, SPEC-024  
**Phase**: Phase 5 - Backend Foundation  
**Module**: Authentication  
**Title**: Authentication Foundation, Security Utilities, Middleware & Validation Documentation  
**Date**: 2026-08-02  

---

## 🏗️ Architecture Overview

The `auth` module provides the architectural blueprint and foundational layer for all identity, authentication, session management, and RBAC operations within FleetCore. It adheres to modular domain design principles, isolating authentication configuration, contracts, interfaces, utilities, middlewares, and validation schemas.

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
│   └── index.ts             # Authentication business logic services (Future SPECs)
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

## 📐 Authentication Validation Schemas (`SPEC-024`)

The validation schemas (`backend/src/modules/auth/validators/auth.validator.ts`) provide centralized Zod request payloads validation:

### Schemas & Inferred Types
- **`loginSchema` / `LoginInput`**: Validates email format and non-empty password.
- **`refreshTokenSchema` / `RefreshTokenInput`**: Validates non-empty `refreshToken` string.
- **`changePasswordSchema` / `ChangePasswordInput`**: Validates current password, applies `passwordSchema` strength refinement to `newPassword`, and confirms `confirmPassword` equality.
- **`forgotPasswordSchema` / `ForgotPasswordInput`**: Validates user email address format.
- **`resetPasswordSchema` / `ResetPasswordInput`**: Validates reset token, applies `passwordSchema` refinement to `newPassword`, and enforces equality with `confirmPassword`.

### Reused Security Refinement
- **`passwordSchema`**: Integrates directly with `validatePasswordStrength(password)` from `password.util.ts`, ensuring 8-128 char length, uppercase, lowercase, digit, and special character requirements without duplicating validation logic.

---

## 🔄 Middleware Execution Lifecycle

FleetCore enforces a strict security middleware execution order:

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
       │ Route Controller  │ ---> Validates body payload via Zod schemas & executes business logic.
       └───────────────────┘
```

---

## 👑 Role-Based Access Control (RBAC) Middleware (`SPEC-023`)

The RBAC middleware (`backend/src/modules/auth/middlewares/rbac.middleware.ts`) exposes `authorize(...allowedRoles)`:
- Compares `req.authenticatedUser.roleName` against allowed roles.
- Returns HTTP `403 Forbidden` (`INSUFFICIENT_PERMISSIONS`) when unauthorized.

---

## 🛡️ Authentication Middleware (`SPEC-022`)

The authentication middleware (`backend/src/modules/auth/middlewares/auth.middleware.ts`) exposes `authenticate`:
- Reads `Authorization` header (`Bearer <token>`).
- Verifies signature & expiration via `verifyAccessToken(token)`.
- Attaches user claims to `req.authenticatedUser`.

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
7. **SPEC-025**: User Registration & Login API endpoints (`/api/v1/auth/register`, `/api/v1/auth/login`).
8. **SPEC-026**: Token Refresh & Logout API endpoints (`/api/v1/auth/refresh`, `/api/v1/auth/logout`).
