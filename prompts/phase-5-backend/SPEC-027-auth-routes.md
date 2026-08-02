# ====================================================
# FleetCore
# SPEC-027
# Authentication Routes
# ====================================================

METADATA
----------------------------------------------------

SPEC ID:
SPEC-027

Phase:
Backend Authentication

Module:
Authentication

Title:
Authentication Routes

Dependencies:

- Authentication Controller
- Authentication Middleware
- RBAC Middleware

Outputs:

- Authentication Routes
- Module Registration
- Documentation
- AI Development Log
- Prompt Documentation

Forbidden:

- Swagger
- Business Logic
- Database Queries
- JWT Logic

# ====================================================
# CONTEXT
# ====================================================

Continue the FleetCore authentication module.

Implement ONLY Express route definitions.

Routes must only wire HTTP endpoints to controllers and middleware.

Business logic remains in the Authentication Service.

# ====================================================
# OBJECTIVE
# ====================================================

Create the authentication routing layer.

Expose authentication endpoints while applying middleware where appropriate.

# ====================================================
# TASK 1
# CREATE ROUTES
# ====================================================

Create:

backend/src/modules/auth/routes/auth.routes.ts

Register endpoints:

POST /login

POST /refresh

POST /logout

POST /forgot-password

POST /reset-password

POST /change-password

# ====================================================
# TASK 2
# APPLY MIDDLEWARE
# ====================================================

Public routes:

POST /login

POST /refresh

POST /forgot-password

POST /reset-password

Protected routes:

POST /logout

POST /change-password

Protected routes must use:

authenticate()

Do NOT apply RBAC yet.

# ====================================================
# TASK 3
# ROUTE EXPORTS
# ====================================================

Update:

backend/src/modules/auth/routes/index.ts

Export router cleanly.

Avoid circular dependencies.

# ====================================================
# TASK 4
# MODULE REGISTRATION
# ====================================================

Register the authentication router in the main Express application.

Use:

/api/v1/auth

Do not modify unrelated routes.

If API versioning infrastructure does not yet exist, create the minimum routing structure required to support `/api/v1/auth`.

# ====================================================
# TASK 5
# DOCUMENTATION
# ====================================================

Update:

docs/backend/authentication-foundation.md

Document:

Available endpoints

HTTP methods

Authentication requirements

Routing hierarchy

# ====================================================
# TASK 6
# AI LOG
# ====================================================

Append:

SPEC-027

to:

docs/AI-DEVELOPMENT-LOG.md

# ====================================================
# TASK 7
# PROMPT DOCUMENTATION
# ====================================================

Create:

prompts/phase-5-backend/

SPEC-027-auth-routes.md

Store this COMPLETE specification.

# ====================================================
# QUALITY CHECK
# ====================================================

Verify:

✓ Route registration

✓ Controller integration

✓ Middleware usage

✓ API versioning

✓ Backend Build

✓ Backend Lint

✓ Frontend Build

✓ Frontend Lint

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

Swagger

RBAC on routes

Database

Business Logic

JWT

# ====================================================
# GIT
# ====================================================

Commit:

feat(auth): add authentication routes

Push to GitHub.

# ====================================================
# FINAL SUMMARY
# ====================================================

Provide:

Routes Created

Middleware Applied

Route Registration

Files Modified

Validation Results

Commit Hash

Push Status
