# FleetCore Authentication Foundation Architecture

**SPEC ID**: SPEC-019  
**Phase**: Phase 5 - Backend Foundation  
**Module**: Authentication  
**Title**: Authentication Foundation Documentation  
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
│   └── index.ts             # Password hashing and token generation helpers (Future SPECs)
├── validators/
│   └── index.ts             # Request payload Zod validation schemas (Future SPECs)
└── index.ts                 # Master barrel export for the auth module
```

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

The authentication roadmap is broken down into clean, sequential specification specifications:

1. **SPEC-019 (Completed)**: Authentication Foundation (Directory structure, env validation, types, contracts, and constants).
2. **SPEC-020 (Next)**: Password Hashing & JWT Utility Services (`bcryptjs` hashing and `jsonwebtoken` sign/verify wrappers).
3. **SPEC-021**: Authentication Middleware & Guards (JWT verification middleware, `req.user` context binding, multi-tenancy `companyId` validation).
4. **SPEC-022**: User Registration & Login API endpoints (`/api/v1/auth/register`, `/api/v1/auth/login`).
5. **SPEC-023**: Token Refresh & Logout API endpoints (`/api/v1/auth/refresh`, `/api/v1/auth/logout`).
6. **SPEC-024**: RBAC Permission Guard Middleware (`requireRole`, `requirePermission`).
