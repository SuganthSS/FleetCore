# ====================================================
# FleetCore
# SPEC-020
# Password Utility Module
# ====================================================

METADATA
----------------------------------------------------

SPEC ID:
SPEC-020

Phase:
Backend Foundation

Module:
Authentication

Title:
Password Utility Module

Dependencies:

- Authentication Foundation
- bcryptjs
- Environment Validation

Outputs:

- Password Utility
- Documentation
- AI Development Log
- Prompt Documentation

Forbidden:

- Login API
- JWT
- Controllers
- Routes
- Middleware
- Database Queries

# ====================================================
# CONTEXT
# ====================================================

Continue the FleetCore authentication module.

Implement ONLY reusable password utilities.

No authentication flow.

No login.

No user lookup.

No JWT.

# ====================================================
# OBJECTIVE
# ====================================================

Create a centralized password utility responsible for:

- Password hashing
- Password verification
- Password strength validation

This utility will be reused by all future authentication features.

# ====================================================
# TASK 1
# PASSWORD UTILITY
# ====================================================

Create:

backend/src/modules/auth/utils/password.util.ts

Implement reusable functions:

- hashPassword()
- comparePassword()
- validatePasswordStrength()

Read bcrypt rounds from the validated environment configuration.

Do not hardcode the cost factor.

# ====================================================
# TASK 2
# PASSWORD STRENGTH
# ====================================================

Implement reusable validation.

Minimum requirements:

- Minimum length
- Uppercase letter
- Lowercase letter
- Number
- Special character

Return structured validation results.

Do not throw unless necessary.

# ====================================================
# TASK 3
# EXPORTS
# ====================================================

Update barrel exports.

Do not introduce circular dependencies.

# ====================================================
# TASK 4
# DOCUMENTATION
# ====================================================

Update:

docs/backend/authentication-foundation.md

Document:

- Password utility
- Hashing approach
- Strength validation
- Security considerations

# ====================================================
# TASK 5
# AI LOG
# ====================================================

Append SPEC-020 to:

docs/AI-DEVELOPMENT-LOG.md

# ====================================================
# TASK 6
# PROMPT DOCUMENTATION
# ====================================================

Create:

prompts/phase-5-backend/

SPEC-020-password-utility.md

Store this COMPLETE specification.

# ====================================================
# QUALITY CHECK
# ====================================================

Verify:

✓ TypeScript compilation

✓ Async bcrypt implementation

✓ Environment integration

✓ Utility exports

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

JWT

Middleware

Routes

Controllers

Database

RBAC

# ====================================================
# GIT
# ====================================================

Commit:

feat(auth): add password utility

Push to GitHub.

# ====================================================
# FINAL SUMMARY
# ====================================================

Provide:

Utilities Created

Functions Implemented

Validation Rules

Files Modified

Validation Results

Commit Hash

Push Status
