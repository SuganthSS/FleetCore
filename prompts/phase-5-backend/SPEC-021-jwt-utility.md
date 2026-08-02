# ====================================================
# FleetCore
# SPEC-021
# JWT Utility Module
# ====================================================

METADATA
----------------------------------------------------

SPEC ID:
SPEC-021

Phase:
Backend Foundation

Module:
Authentication

Title:
JWT Utility Module

Dependencies:

- Authentication Foundation
- Password Utility
- jsonwebtoken
- Environment Validation

Outputs:

- JWT Utility
- Documentation
- AI Development Log
- Prompt Documentation

Forbidden:

- Login API
- Controllers
- Routes
- Middleware
- Database Queries
- RBAC

# ====================================================
# CONTEXT
# ====================================================

Continue the FleetCore authentication module.

Implement ONLY reusable JWT utilities.

Do not implement authentication flow.

Do not query the database.

Do not verify users.

# ====================================================
# OBJECTIVE
# ====================================================

Create a centralized JWT utility responsible for:

- Access token generation
- Refresh token generation
- Token verification
- Token decoding

The utility must use validated environment variables and reusable TypeScript interfaces created in previous specifications.

# ====================================================
# TASK 1
# JWT UTILITY
# ====================================================

Create:

backend/src/modules/auth/utils/jwt.util.ts

Implement:

- generateAccessToken()
- generateRefreshToken()
- verifyAccessToken()
- verifyRefreshToken()
- decodeToken()

Read:

JWT_SECRET

JWT_REFRESH_SECRET

JWT_EXPIRES_IN

JWT_REFRESH_EXPIRES_IN

from validated configuration.

Never hardcode secrets.

# ====================================================
# TASK 2
# TYPE SAFETY
# ====================================================

Use existing interfaces:

- JwtPayload
- RefreshTokenPayload
- TokenPair

Do not duplicate interfaces.

# ====================================================
# TASK 3
# ERROR HANDLING
# ====================================================

Provide reusable JWT error handling.

Return typed results.

Do not expose internal JWT library errors.

Prepare for future middleware integration.

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

- JWT architecture
- Access tokens
- Refresh tokens
- Expiration strategy
- Utility responsibilities

# ====================================================
# TASK 6
# AI LOG
# ====================================================

Append

SPEC-021

to

docs/AI-DEVELOPMENT-LOG.md

# ====================================================
# TASK 7
# PROMPT DOCUMENTATION
# ====================================================

Create:

prompts/phase-5-backend/

SPEC-021-jwt-utility.md

Store this COMPLETE specification.

# ====================================================
# QUALITY CHECK
# ====================================================

Verify:

✓ TypeScript compilation

✓ Token generation

✓ Token verification

✓ Environment integration

✓ Existing interfaces reused

✓ No duplicated logic

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

Middleware

RBAC

Routes

Controllers

Database Queries

# ====================================================
# GIT
# ====================================================

Commit:

feat(auth): add jwt utility

Push to GitHub.

# ====================================================
# FINAL SUMMARY
# ====================================================

Provide:

Utilities Created

Functions Implemented

Interfaces Reused

Files Modified

Validation Results

Commit Hash

Push Status
