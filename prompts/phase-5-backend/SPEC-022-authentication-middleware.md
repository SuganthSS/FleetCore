# ====================================================
# FleetCore
# SPEC-022
# Authentication Middleware
# ====================================================

METADATA
----------------------------------------------------

SPEC ID:
SPEC-022

Phase:
Backend Foundation

Module:
Authentication

Title:
Authentication Middleware

Dependencies:

- Authentication Foundation
- Password Utility
- JWT Utility

Outputs:

- Authentication Middleware
- Express Request Extension
- Documentation
- AI Development Log
- Prompt Documentation

Forbidden:

- Login API
- Controllers
- Routes
- RBAC
- Database Business Logic

# ====================================================
# CONTEXT
# ====================================================

Continue the FleetCore authentication module.

Implement ONLY authentication middleware.

The middleware is responsible only for verifying access tokens and attaching authenticated user information to the Express request.

It must not perform authorization.

Authorization belongs to RBAC.

# ====================================================
# OBJECTIVE
# ====================================================

Create reusable authentication middleware that:

- Reads the Authorization header
- Validates the Bearer format
- Verifies the JWT
- Attaches the authenticated user payload to the request
- Returns standardized authentication errors

No database queries should be performed.

# ====================================================
# TASK 1
# EXPRESS REQUEST EXTENSION
# ====================================================

Extend the Express Request interface to include:

authenticatedUser

Reuse the existing AuthenticatedUser interface.

Do not duplicate types.

# ====================================================
# TASK 2
# AUTH MIDDLEWARE
# ====================================================

Create:

backend/src/modules/auth/middlewares/auth.middleware.ts

Implement middleware:

authenticate()

Responsibilities:

- Read Authorization header
- Validate Bearer token format
- Extract token
- Verify using verifyAccessToken()
- Attach authenticatedUser to request
- Call next() on success

# ====================================================
# TASK 3
# STANDARDIZED ERRORS
# ====================================================

Return consistent responses for:

- Missing Authorization header
- Invalid Bearer format
- Expired token
- Invalid token
- Malformed token

Reuse AUTH_CONSTANTS where appropriate.

Do not expose JWT library exceptions.

# ====================================================
# TASK 4
# EXPORTS
# ====================================================

Update barrel exports.

Avoid circular dependencies.

# ====================================================
# TASK 5
# DOCUMENTATION
# ====================================================

Update:

docs/backend/authentication-foundation.md

Document:

- Middleware responsibilities
- Request lifecycle
- Token validation flow

# ====================================================
# TASK 6
# AI LOG
# ====================================================

Append:

SPEC-022

to:

docs/AI-DEVELOPMENT-LOG.md

# ====================================================
# TASK 7
# PROMPT DOCUMENTATION
# ====================================================

Create:

prompts/phase-5-backend/

SPEC-022-authentication-middleware.md

Store this COMPLETE specification.

# ====================================================
# QUALITY CHECK
# ====================================================

Verify:

✓ Express Request typing

✓ JWT integration

✓ No database access

✓ Middleware exports

✓ Standardized error handling

✓ TypeScript compilation

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

Login

Logout

RBAC

Role Checking

Database Queries

Controllers

Routes

# ====================================================
# GIT
# ====================================================

Commit:

feat(auth): add authentication middleware

Push to GitHub.

# ====================================================
# FINAL SUMMARY
# ====================================================

Provide:

Middleware Created

Request Extensions

Error Responses

Files Modified

Validation Results

Commit Hash

Push Status
