# ====================================================
# FleetCore
# SPEC-025
# Authentication Service
# ====================================================

METADATA
----------------------------------------------------

SPEC ID:
SPEC-025

Phase:
Backend Authentication

Module:
Authentication

Title:
Authentication Service

Dependencies:

- Authentication Foundation
- Password Utility
- JWT Utility
- Prisma Client
- Validation Schemas

Outputs:

- Authentication Service
- Service Interfaces
- Documentation
- AI Development Log
- Prompt Documentation

Forbidden:

- Express Controllers
- Routes
- Middleware Changes
- Swagger

# ====================================================
# CONTEXT
# ====================================================

Continue the FleetCore authentication module.

Implement ONLY the authentication service.

The service contains business logic.

It must remain framework-independent.

Do not use Express Request or Response objects.

# ====================================================
# OBJECTIVE
# ====================================================

Create a reusable authentication service responsible for:

- User lookup
- Password verification
- Account status validation
- Token generation
- Login workflow

Controllers will only call this service.

# ====================================================
# TASK 1
# CREATE SERVICE
# ====================================================

Create:

backend/src/modules/auth/services/auth.service.ts

Implement a class or service object.

Responsibilities:

- login()

Prepare placeholders (throw "Not Implemented" if necessary):

- refreshToken()
- logout()
- forgotPassword()
- resetPassword()
- changePassword()

Only implement login() fully.

# ====================================================
# TASK 2
# LOGIN WORKFLOW
# ====================================================

Implement:

login(credentials)

Workflow:

1. Find user by email using Prisma.

2. Include:

- Company
- Role

3. Verify:

- User exists

- Password matches

- User status is ACTIVE

- Company status is ACTIVE

4. Generate:

Access Token

Refresh Token

5. Update:

lastLogin timestamp

6. Return:

Authenticated user

Token pair

Role

Company

Do not return passwordHash.

# ====================================================
# TASK 3
# STANDARDIZED ERRORS
# ====================================================

Return consistent service errors for:

- User not found
- Invalid password
- Inactive account
- Suspended account
- Inactive company

Avoid leaking sensitive authentication details.

# ====================================================
# TASK 4
# EXPORTS
# ====================================================

Update service barrel exports.

# ====================================================
# TASK 5
# DOCUMENTATION
# ====================================================

Update:

docs/backend/authentication-foundation.md

Document:

- Service responsibilities
- Login flow
- Separation from controllers

# ====================================================
# TASK 6
# AI LOG
# ====================================================

Append:

SPEC-025

to:

docs/AI-DEVELOPMENT-LOG.md

# ====================================================
# TASK 7
# PROMPT DOCUMENTATION
# ====================================================

Create:

prompts/phase-5-backend/

SPEC-025-auth-service.md

Store this COMPLETE specification.

# ====================================================
# QUALITY CHECK
# ====================================================

Verify:

✓ Prisma integration

✓ Password utility reuse

✓ JWT utility reuse

✓ No Express dependency

✓ Service compiles

✓ Backend Build

✓ Backend Lint

# ====================================================
# ACCEPTANCE CRITERIA
# ====================================================

Run:

Prisma Generate

Backend Build

Backend Lint

Frontend Build

Frontend Lint

Zero errors.

# ====================================================
# DO NOT IMPLEMENT
# ====================================================

Controllers

Routes

Swagger

Frontend

# ====================================================
# GIT
# ====================================================

Commit:

feat(auth): add authentication service

Push to GitHub.

# ====================================================
# FINAL SUMMARY
# ====================================================

Provide:

Service Methods

Login Workflow

Prisma Queries

Utilities Reused

Files Modified

Validation Results

Commit Hash

Push Status
