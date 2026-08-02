# FleetCore Authentication Foundation Architecture

**SPEC ID**: SPEC-019, SPEC-020, SPEC-021, SPEC-022  
**Phase**: Phase 5 - Backend Foundation  
**Module**: Authentication  
**Title**: Authentication Foundation, Utilities & Middleware Documentation  
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

## 🛡️ Authentication Middleware (`SPEC-022`)

The authentication middleware (`backend/src/modules/auth/middlewares/auth.middleware.ts`) exposes the `authenticate` middleware function.

### Request Verification Lifecycle & Error Responses
1. **Header Inspection**: Reads `Authorization` header (`AUTH_CONSTANTS.HEADERS.AUTHORIZATION`).
   - If missing, responds HTTP `401 Unauthorized` (`MISSING_AUTHORIZATION_HEADER`).
2. **Format Validation**: Validates `Bearer <token>` string prefix (`AUTH_CONSTANTS.HEADERS.BEARER_PREFIX`).
   - If malformed prefix or empty token string, responds HTTP `401 Unauthorized` (`INVALID_BEARER_FORMAT` or `EMPTY_TOKEN`).
3. **JWT Verification**: Calls `verifyAccessToken(token)` from JWT utility.
   - If expired, responds HTTP `401 Unauthorized` (`TOKEN_EXPIRED`).
   - If malformed, responds HTTP `401 Unauthorized` (`TOKEN_MALFORMED`).
   - If invalid signature/claims, responds HTTP `401 Unauthorized` (`INVALID_TOKEN`).
4. **Request Context Binding**: Extracted claims (`sub`, `email`, `companyId`, `roleId`) are structured into an `AuthenticatedUser` object and attached directly to `req.authenticatedUser`.
5. **Next Dispatch**: Calls `next()` to hand execution over to downstream routers/controllers.

---

## 🔒 Password Utility (`SPEC-020`)

The password utility (`backend/src/modules/auth/utils/password.util.ts`) exposes three core asynchronous functions:
- **`hashPassword(password: string)`**: Hashes plaintext passwords using `bcryptjs` and dynamic salt rounds (`config.bcryptRounds`, default `10`).
- **`comparePassword(password: string, hash: string)`**: Verifies candidate plaintext passwords against stored hashes in constant time.
- **`validatePasswordStrength(password: string)`**: Evaluates password complexity (8-128 chars, uppercase, lowercase, digit, special character).

---

## 🎟️ JWT Utility (`SPEC-021`)

The JWT utility (`backend/src/modules/auth/utils/jwt.util.ts`) manages token generation, verification, and decoding:
- **`generateAccessToken(payload)`**: Signs Access JWTs using `config.jwtSecret`.
- **`generateRefreshToken(payload)`**: Signs Refresh JWTs using `config.jwtRefreshSecret`.
- **`verifyAccessToken(token)`**: Verifies Access JWT signature & claims.
- **`verifyRefreshToken(token)`**: Verifies Refresh JWT signature & claims.
- **`decodeToken<T>(token)`**: Decodes token payload without signature verification.

---

## 🔑 Environment Variables

Environment variables are validated strictly at application startup using Zod in `backend/src/config/env.ts`.

| Variable Name | Required | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `JWT_SECRET` | Yes | N/A | HMAC secret key used to sign Access JWTs |
| `JWT_REFRESH_SECRET` | Yes | N/A | HMAC secret key used to sign Refresh Tokens |
| `JWT_EXPIRES_IN` | No | `1d` | Access token lifespan duration (e.g. `15m`, `1d`) |
| `JWT_REFRESH_EXPIRES_IN` | No | `7d` | Refresh token lifespan duration (e.g. `7d`, `30d`) |
| `BCRYPT_ROUNDS` | No | `10` | Salt round iterations for bcrypt password hashing |

---

## 🗺️ Authentication Implementation Roadmap

The authentication roadmap is broken down into clean, sequential specifications:

1. **SPEC-019 (Completed)**: Authentication Foundation (Directory structure, env validation, types, contracts, and constants).
2. **SPEC-020 (Completed)**: Password Hashing & Strength Utility (`hashPassword`, `comparePassword`, `validatePasswordStrength`).
3. **SPEC-021 (Completed)**: JWT Utilities (`generateAccessToken`, `generateRefreshToken`, `verifyAccessToken`, `verifyRefreshToken`, `decodeToken`).
4. **SPEC-022 (Completed)**: Authentication Middleware & Context Guards (`authenticate` middleware, `req.authenticatedUser` binding).
5. **SPEC-023**: User Registration & Login API endpoints (`/api/v1/auth/register`, `/api/v1/auth/login`).
6. **SPEC-024**: Token Refresh & Logout API endpoints (`/api/v1/auth/refresh`, `/api/v1/auth/logout`).
7. **SPEC-025**: RBAC Permission Guard Middleware (`requireRole`, `requirePermission`).
