# FleetCore Authentication Foundation Architecture

**SPEC ID**: SPEC-019, SPEC-020, SPEC-021, SPEC-022, SPEC-023  
**Phase**: Phase 5 - Backend Foundation  
**Module**: Authentication  
**Title**: Authentication Foundation, Utilities & RBAC Middleware Documentation  
**Date**: 2026-08-02  

---

## 🏗️ Architecture Overview

The `auth` module provides the architectural blueprint and foundational layer for all identity, authentication, session management, and RBAC operations within FleetCore. It adheres to modular domain design principles, isolating authentication configuration, contracts, interfaces, utilities, and middlewares.

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
│   └── index.ts             # Request payload Zod validation schemas (Future SPECs)
└── index.ts                 # Master barrel export for the auth module
```

---

## 🔄 Middleware Execution Lifecycle

FleetCore enforces a strict two-stage security middleware execution order:

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
       │ Route Controller  │ ---> Executes business logic for authorized requests.
       └───────────────────┘
```

---

## 👑 Role-Based Access Control (RBAC) Middleware (`SPEC-023`)

The RBAC middleware (`backend/src/modules/auth/middlewares/rbac.middleware.ts`) exposes the `authorize(...allowedRoles)` higher-order function:

### Flow & Responsibilities
1. **Context Inspection**: Checks for `req.authenticatedUser` created by `authenticate()`.
   - If missing, responds HTTP `401 Unauthorized` (`UNAUTHENTICATED_CONTEXT_MISSING`).
2. **Role Comparison**: Compares `req.authenticatedUser.roleName` (or `roleId`) against the array of `allowedRoles`.
   - Reuses `UserRoleName` type (`'Super Admin'`, `'Company Admin'`, `'Fleet Manager'`, `'Dispatcher'`, `'Driver'`).
   - If role is not allowed, responds HTTP `403 Forbidden` (`INSUFFICIENT_PERMISSIONS`).
3. **Dispatch**: Calls `next()` if user has sufficient privileges.

---

## 🛡️ Authentication Middleware (`SPEC-022`)

The authentication middleware (`backend/src/modules/auth/middlewares/auth.middleware.ts`) exposes `authenticate`:
- **Header Inspection**: Reads `Authorization` header (`Bearer <token>`).
- **JWT Verification**: Verifies signature & expiration via `verifyAccessToken(token)`.
- **Request Context**: Attaches user claims to `req.authenticatedUser`.

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
6. **SPEC-024**: User Registration & Login API endpoints (`/api/v1/auth/register`, `/api/v1/auth/login`).
7. **SPEC-025**: Token Refresh & Logout API endpoints (`/api/v1/auth/refresh`, `/api/v1/auth/logout`).
