# ====================================================
# FleetCore
# SPEC-032
# Vehicle Routes
# ====================================================

METADATA
----------------------------------------------------

SPEC ID:
SPEC-032

Phase:
Backend - Fleet Management

Module:
Vehicle

Title:
Vehicle Routes

Dependencies:

- Vehicle Controller
- Authentication Middleware
- RBAC Middleware

Outputs:

- Vehicle REST API
- Route Registration
- Documentation

Forbidden:

- Business Logic
- Prisma Queries
- Validation Logic
- Database Changes

# ====================================================
# CONTEXT
# ====================================================

The Vehicle Controller has already been implemented.

This specification exposes it through REST endpoints.

All business logic must remain inside the service layer.

# ====================================================
# TASK 1
# CREATE ROUTER
# ====================================================

Create:

backend/src/modules/vehicle/routes/

vehicle.routes.ts

Export via index.ts.

# ====================================================
# TASK 2
# REGISTER ENDPOINTS
# ====================================================

Create REST endpoints:

GET     /vehicles

GET     /vehicles/:id

POST    /vehicles

PUT     /vehicles/:id

DELETE  /vehicles/:id

Delegate directly to VehicleController.

# ====================================================
# TASK 3
# SECURITY
# ====================================================

Every endpoint must require:

authenticate()

RBAC:

GET endpoints

Super Admin
Company Admin
Fleet Manager
Dispatcher

POST

Super Admin
Company Admin
Fleet Manager

PUT

Super Admin
Company Admin
Fleet Manager

DELETE

Super Admin
Company Admin

No anonymous access.

# ====================================================
# TASK 4
# REGISTER MODULE
# ====================================================

Register:

/api/v1/vehicles

inside:

backend/src/index.ts

Follow the same registration pattern used by Authentication.

# ====================================================
# TASK 5
# DOCUMENTATION
# ====================================================

Update:

docs/backend/vehicle-module.md

Include:

- Endpoint table
- HTTP methods
- Required roles
- Authentication flow

# ====================================================
# TASK 6
# AI LOG
# ====================================================

Append:

SPEC-032

to:

docs/AI-DEVELOPMENT-LOG.md

# ====================================================
# TASK 7
# PROMPT STORAGE
# ====================================================

Create:

prompts/phase-5-backend/

SPEC-032-vehicle-routes.md

Store this COMPLETE specification.

# ====================================================
# VALIDATION
# ====================================================

Run:

Prisma Generate

Backend Build

Backend Lint

Frontend Build

Frontend Lint

Verify Express starts successfully.

Everything must pass.

# ====================================================
# GIT
# ====================================================

Commit:

feat(vehicle): add routes

Push to GitHub.

# ====================================================
# FINAL SUMMARY
# ====================================================

Provide:

Endpoints

RBAC Matrix

Files Created

Files Modified

Validation Results

Commit Hash

Push Status
