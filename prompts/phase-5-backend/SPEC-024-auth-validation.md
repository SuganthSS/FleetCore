# ====================================================
# FleetCore
# SPEC-024
# Authentication Validation Schemas
# ====================================================

METADATA
----------------------------------------------------

SPEC ID:
SPEC-024

Phase:
Backend Foundation

Module:
Authentication

Title:
Authentication Validation Schemas

Dependencies:

- Authentication Foundation
- Zod
- Existing Auth Types

Outputs:

- Validation Schemas
- Shared Validation Types
- Documentation
- AI Development Log
- Prompt Documentation

Forbidden:

- Controllers
- Routes
- Services
- JWT Logic
- Database Queries

# ====================================================
# CONTEXT
# ====================================================

Continue the FleetCore authentication module.

Implement ONLY reusable validation schemas.

These schemas will be reused by controllers and services.

No business logic.

No authentication flow.

# ====================================================
# OBJECTIVE
# ====================================================

Create centralized Zod validation schemas for authentication-related requests.

Validation must remain independent of controllers and services.

# ====================================================
# TASK 1
# VALIDATION SCHEMAS
# ====================================================

Create:

backend/src/modules/auth/validators/auth.validator.ts

Implement Zod schemas for:

- LoginRequest
- RefreshTokenRequest
- ChangePasswordRequest
- ForgotPasswordRequest
- ResetPasswordRequest

Reuse password validation rules where appropriate.

Do not duplicate validation logic.

# ====================================================
# TASK 2
# TYPE INFERENCE
# ====================================================

Infer TypeScript types directly from Zod schemas where practical.

Reuse existing authentication interfaces when appropriate.

Avoid duplicate type definitions.

# ====================================================
# TASK 3
# EXPORTS
# ====================================================

Update validator barrel exports.

Avoid circular dependencies.

# ====================================================
# TASK 4
# DOCUMENTATION
# ====================================================

Update:

docs/backend/authentication-foundation.md

Document:

- Validation architecture
- Supported request schemas
- Relationship between validation and controllers

# ====================================================
# TASK 5
# AI LOG
# ====================================================

Append:

SPEC-024

to:

docs/AI-DEVELOPMENT-LOG.md

# ====================================================
# TASK 6
# PROMPT DOCUMENTATION
# ====================================================

Create:

prompts/phase-5-backend/

SPEC-024-auth-validation.md

Store this COMPLETE specification.

# ====================================================
# QUALITY CHECK
# ====================================================

Verify:

✓ Zod schemas compile

✓ Type inference works

✓ Existing utilities reused

✓ No duplicated password validation logic

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

Services

JWT

Database

RBAC

Authentication Flow

# ====================================================
# GIT
# ====================================================

Commit:

feat(auth): add authentication validators

Push to GitHub.

# ====================================================
# FINAL SUMMARY
# ====================================================

Provide:

Schemas Created

Types Inferred

Utilities Reused

Files Modified

Validation Results

Commit Hash

Push Status
