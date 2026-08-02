# ====================================================
# FleetCore
# SPEC-023
# Role-Based Access Control (RBAC) Middleware
# ====================================================

METADATA
----------------------------------------------------

SPEC ID:
SPEC-023

Phase:
Backend Foundation

Module:
Authentication

Title:
RBAC Middleware

Dependencies:

- Authentication Middleware
- JWT Utility
- AuthenticatedUser Interface

Outputs:

- RBAC Middleware
- Role Guard
- Documentation
- AI Development Log
- Prompt Documentation

Forbidden:

- Database Queries
- Login API
- Controllers
- Routes
- Business Logic

# ====================================================
# CONTEXT
# ====================================================

Continue the FleetCore authentication module.

Implement ONLY authorization middleware.

Authentication has already attached the authenticated user to the request.

RBAC should ONLY evaluate permissions.

Do not verify JWTs again.

Do not query the database.

# ====================================================
# OBJECTIVE
# ====================================================

Create reusable middleware that authorizes requests based on role information already present in:

req.authenticatedUser

The middleware must remain independent of business logic.

# ====================================================
# TASK 1
# RBAC MIDDLEWARE
# ====================================================

Create:

backend/src/modules/auth/middlewares/rbac.middleware.ts

Implement reusable middleware:

authorize(...roles)

Behavior:

- Read req.authenticatedUser
- Verify authentication context exists
- Compare the user's role against the allowed roles
- Call next() if authorized
- Return HTTP 403 when authorization fails

Do not decode JWTs.

Do not access the database.

# ====================================================
# TASK 2
# ROLE TYPES
# ====================================================

Reuse the existing role-related types.

Do not redefine role names.

Do not hardcode duplicate constants.

# ====================================================
# TASK 3
# STANDARDIZED RESPONSES
# ====================================================

Return consistent responses for:

- Missing authenticated user
- Insufficient permissions

Reuse AUTH_CONSTANTS where appropriate.

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

- Authentication flow
- Authorization flow
- Middleware execution order

Illustrate:

authenticate()

↓

authorize()

↓

Controller

# ====================================================
# TASK 6
# AI LOG
# ====================================================

Append:

SPEC-023

to:

docs/AI-DEVELOPMENT-LOG.md

# ====================================================
# TASK 7
# PROMPT DOCUMENTATION
# ====================================================

Create:

prompts/phase-5-backend/

SPEC-023-rbac-middleware.md

Store this COMPLETE specification.

# ====================================================
# QUALITY CHECK
# ====================================================

Verify:

✓ Middleware composition

✓ Existing role types reused

✓ No database queries

✓ No JWT verification

✓ TypeScript compilation

✓ Lint

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

JWT verification

Controllers

Routes

Database Queries

Permission Database

# ====================================================
# GIT
# ====================================================

Commit:

feat(auth): add rbac middleware

Push to GitHub.

# ====================================================
# FINAL SUMMARY
# ====================================================

Provide:

Middleware Created

Authorization Flow

Responses

Files Modified

Validation Results

Commit Hash

Push Status
