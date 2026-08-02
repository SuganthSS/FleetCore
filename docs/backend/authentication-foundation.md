# FleetCore Authentication Foundation Architecture

**SPEC ID**: SPEC-019, SPEC-020, SPEC-021  
**Phase**: Phase 5 - Backend Foundation  
**Module**: Authentication  
**Title**: Authentication Foundation & Security Utilities Documentation  
**Date**: 2026-08-02  

---

## 🏗️ Architecture Overview

The `auth` module provides the architectural blueprint and foundational layer for all identity, authentication, session management, and RBAC operations within FleetCore. It adheres to modular domain design principles, isolating authentication configuration, contracts, interfaces, and utilities.

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
│   └── index.ts             # Middleware exports (JWT verification, RBAC guards - Future SPECs)
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

## 🔒 Password Utility (`SPEC-020`)

The password utility (`backend/src/modules/auth/utils/password.util.ts`) exposes three core asynchronous functions:

### 1. `hashPassword(password: string): Promise<string>`
- Asynchronously hashes plaintext passwords using `bcryptjs`.
- Reads salt cost factor dynamically from environment configuration (`config.bcryptRounds`, default `10`).

### 2. `comparePassword(password: string, hash: string): Promise<boolean>`
- Asynchronously compares candidate plaintext passwords against stored bcrypt hashes.
- Mitigates timing attacks via bcrypt's constant-time comparison algorithm.

### 3. `validatePasswordStrength(password: string): PasswordStrengthResult`
- Evaluates password complexity against corporate security rules (8-128 chars, uppercase, lowercase, digit, special character).
- Returns a structured result: `{ isValid: boolean, score: number (0-5), errors: string[] }`.

---

## 🎟️ JWT Utility (`SPEC-021`)

The JWT utility (`backend/src/modules/auth/utils/jwt.util.ts`) manages token generation, verification, and decoding:

### Key Functions
- **`generateAccessToken(payload: Omit<JwtPayload, 'type' | 'iat' | 'exp'>): string`**: Signs short-lived Access JWTs using `config.jwtSecret` and `config.jwtExpiresIn`.
- **`generateRefreshToken(payload: Omit<RefreshTokenPayload, 'type' | 'iat' | 'exp'>): string`**: Signs long-lived Refresh JWTs using `config.jwtRefreshSecret` and `config.jwtRefreshExpiresIn`.
- **`verifyAccessToken(token: string): VerifyJwtResult<JwtPayload>`**: Verifies Access JWT signatures and validates token type. Sanitizes internal library exceptions into `{ success, payload, error }`.
- **`verifyRefreshToken(token: string): VerifyJwtResult<RefreshTokenPayload>`**: Verifies Refresh JWT signatures and validates token type.
- **`decodeToken<T>(token: string): T | null`**: Decodes payload without signature verification for unauthenticated metadata inspection.

### Reused Interfaces
- `JwtPayload` (`sub`, `email`, `companyId`, `roleId`, `type`, `iat`, `exp`)
- `RefreshTokenPayload` (`sub`, `type`, `tokenVersion`, `iat`, `exp`)
- `TokenPair` (`accessToken`, `refreshToken`, `expiresIn`)

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
4. **SPEC-022**: Authentication Middleware & Context Guards (JWT verification middleware, `req.user` context binding).
5. **SPEC-023**: User Registration & Login API endpoints (`/api/v1/auth/register`, `/api/v1/auth/login`).
6. **SPEC-024**: Token Refresh & Logout API endpoints (`/api/v1/auth/refresh`, `/api/v1/auth/logout`).
7. **SPEC-025**: RBAC Permission Guard Middleware (`requireRole`, `requirePermission`).
