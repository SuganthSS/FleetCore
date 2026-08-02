# FleetCore Authentication Foundation Architecture

**SPEC ID**: SPEC-019, SPEC-020, SPEC-021, SPEC-022, SPEC-023, SPEC-024, SPEC-025, SPEC-026, SPEC-027  
**Phase**: Phase 5 - Backend Authentication  
**Module**: Authentication  
**Title**: Authentication Foundation, Security Utilities, Middleware, Validation, Service, Controller & Routing Documentation  
**Date**: 2026-08-02  

---

## 🏗️ Architecture Overview

The `auth` module provides the architectural blueprint and foundational layer for all identity, authentication, session management, and RBAC operations within FleetCore. It adheres to modular domain design principles, isolating authentication configuration, contracts, interfaces, utilities, middlewares, validation schemas, business services, HTTP controllers, and Express route definitions.

---

## 📁 Directory Structure & Folder Responsibilities

The module is structured under `backend/src/modules/auth/` as follows:

```text
backend/src/modules/auth/
├── constants/
│   ├── auth.constants.ts    # Reusable constants (Token types, cookie names, header keys)
│   └── index.ts             # Barrel export
├── controllers/
│   ├── auth.controller.ts   # Express HTTP controller layer (Request validation & response formatting)
│   └── index.ts             # Barrel export
├── interfaces/
│   ├── auth.interface.ts    # Interface contracts (AuthenticatedUser, JwtPayload, TokenPair, etc.)
│   └── index.ts             # Barrel export
├── middlewares/
│   ├── auth.middleware.ts   # Express authentication middleware (Bearer token verification & req context binding)
│   ├── rbac.middleware.ts   # Role-based access control middleware (Permission evaluation)
│   └── index.ts             # Barrel export
├── routes/
│   ├── auth.routes.ts       # Express router definitions for authentication endpoints
│   └── index.ts             # Barrel export
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

## 🚦 Authentication Routes (`SPEC-027`)

Authentication routes are registered under the `/api/v1/auth` sub-path in `backend/src/index.ts`.

### Endpoint Definitions & Access Policies

| Endpoint Path | HTTP Method | Access Level | Applied Middleware | Controller Method |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/auth/login` | `POST` | Public | None | `authController.login` |
| `/api/v1/auth/refresh` | `POST` | Public | None | `authController.refreshToken` |
| `/api/v1/auth/forgot-password` | `POST` | Public | None | `authController.forgotPassword` |
| `/api/v1/auth/reset-password` | `POST` | Public | None | `authController.resetPassword` |
| `/api/v1/auth/logout` | `POST` | Protected | `authenticate()` | `authController.logout` |
| `/api/v1/auth/change-password` | `POST` | Protected | `authenticate()` | `authController.changePassword` |

---

## 🎮 Authentication Controller (`SPEC-026`)

Acts as a thin HTTP translation layer between Express request pipelines and `AuthService`:
- Validates request payloads using Zod schemas (`loginSchema`, `refreshTokenSchema`, etc.).
- Formats standardized JSON success (`{ success: true, message, data }`) and error responses.

---

## ⚙️ Authentication Service (`SPEC-025`)

Encapsulates core business logic for user authentication (`login`, `refreshToken`, `logout`, `forgotPassword`, `resetPassword`, `changePassword`).

---

## 📐 Authentication Validation Schemas (`SPEC-024`)

Centralized Zod request payload validation schemas (`loginSchema`, `refreshTokenSchema`, `changePasswordSchema`, `forgotPasswordSchema`, `resetPasswordSchema`).

---

## 🔄 Request Execution Lifecycle

```text
       Incoming HTTP Request
                 │
                 ▼
       ┌───────────────────┐
       │   /api/v1/auth    │  ---> Registered in backend/src/index.ts
       └─────────┬─────────┘
                 │
                 ▼
       ┌───────────────────┐
       │   authenticate()  │  ---> (Protected endpoints only) Verifies Bearer JWT.
       └─────────┬─────────┘       Attaches req.authenticatedUser context.
                 │
                 ▼
       ┌───────────────────┐
       │  AuthController   │ ---> Validates body via Zod schemas & delegates to AuthService.
       └─────────┬─────────┘       Formats standardized JSON response.
                 │
                 ▼
       ┌───────────────────┐
       │   AuthService     │ ---> Executes Prisma queries, password checks & JWT creation.
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
8. **SPEC-026 (Completed)**: Authentication Controller (`auth.controller.ts`).
9. **SPEC-027 (Completed)**: Authentication Routes (`auth.routes.ts` under `/api/v1/auth`).
