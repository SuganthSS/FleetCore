# ====================================================
# FleetCore
# SPEC-019
# Authentication Foundation
# ====================================================

METADATA
----------------------------------------------------

SPEC ID:
SPEC-019

Phase:
Backend Foundation

Module:
Authentication

Title:
Authentication Foundation

Dependencies:

- Completed Database Foundation
- Prisma Client
- Express Project Structure

Outputs:

- Authentication Module Structure
- Configuration
- Environment Validation
- Documentation
- AI Development Log
- Prompt Documentation

Forbidden:

- Login API
- JWT Generation
- Password Verification
- Middleware
- Controllers
- Routes
- Business Logic

# ====================================================
# CONTEXT
# ====================================================

Continue the existing FleetCore backend.

Authentication development begins here.

This specification creates ONLY the authentication foundation.

No authentication logic should be implemented.

Only architecture.

Maintain the existing project structure.

# ====================================================
# OBJECTIVE
# ====================================================

Prepare the backend for authentication.

Create a scalable authentication module that future specifications will extend.

The implementation should establish folder structure, configuration, constants, interfaces, and environment validation without implementing login or authorization behavior.

# ====================================================
# TASK 1
# DIRECTORY STRUCTURE
# ====================================================

Create the following directories if they do not already exist:

backend/src/modules/auth/

backend/src/modules/auth/controllers/

backend/src/modules/auth/services/

backend/src/modules/auth/routes/

backend/src/modules/auth/middlewares/

backend/src/modules/auth/utils/

backend/src/modules/auth/types/

backend/src/modules/auth/interfaces/

backend/src/modules/auth/constants/

backend/src/modules/auth/validators/

Each folder should contain an index.ts export where appropriate.

Do not duplicate existing shared folders.

# ====================================================
# TASK 2
# ENVIRONMENT CONFIGURATION
# ====================================================

Extend backend environment validation.

Prepare variables such as:

JWT_SECRET

JWT_REFRESH_SECRET

JWT_EXPIRES_IN

JWT_REFRESH_EXPIRES_IN

BCRYPT_ROUNDS

Validate all required variables.

Do not generate secrets automatically.

Update:

backend/.env.example

backend/src/config/env.ts

# ====================================================
# TASK 3
# AUTH CONSTANTS
# ====================================================

Create reusable authentication constants.

Examples:

Token types

Cookie names

Header names

Authentication-related string constants

Keep them centralized.

# ====================================================
# TASK 4
# TYPES & INTERFACES
# ====================================================

Create foundational TypeScript types/interfaces only.

Examples:

AuthenticatedUser

JwtPayload

LoginRequest

LoginResponse

TokenPair

RefreshTokenPayload

These are definitions only.

No implementation.

# ====================================================
# TASK 5
# DOCUMENTATION
# ====================================================

Create:

docs/backend/authentication-foundation.md

Document:

Module architecture

Folder responsibilities

Environment variables

Authentication roadmap

# ====================================================
# TASK 6
# AI LOG
# ====================================================

Append

SPEC-019

to

docs/AI-DEVELOPMENT-LOG.md

# ====================================================
# TASK 7
# PROMPT DOCUMENTATION
# ====================================================

Create:

prompts/phase-5-backend/

SPEC-019-authentication-foundation.md

Store this COMPLETE specification.

# ====================================================
# QUALITY CHECK
# ====================================================

Verify:

✓ TypeScript compiles

✓ No circular dependencies

✓ Environment validation works

✓ Folder structure matches architecture

✓ Barrel exports compile

# ====================================================
# ACCEPTANCE CRITERIA
# ====================================================

Run:

npm run build

npm run lint

Prisma Generate

Backend TypeScript compilation

Frontend Build

Frontend Lint

Zero errors.

No authentication logic should exist after this specification.

# ====================================================
# DO NOT IMPLEMENT
# ====================================================

Login

Logout

JWT

bcrypt

Middleware

RBAC

Routes

Controllers

Business Logic

Database Changes

# ====================================================
# GIT
# ====================================================

Commit:

feat(auth): create authentication foundation

Push to GitHub.

# ====================================================
# FINAL SUMMARY
# ====================================================

Provide:

Folders Created

Environment Variables

Types Created

Interfaces Created

Documentation Added

Validation Results

Commit Hash

Push Status
