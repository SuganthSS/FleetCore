# ====================================================
# FleetCore
# SPEC-030
# Vehicle Service Layer
# ====================================================

METADATA
----------------------------------------------------

SPEC ID:
SPEC-030

Phase:
Backend - Fleet Management

Module:
Vehicle

Title:
Vehicle Service Layer

Dependencies:

- Vehicle Validation Layer
- Prisma
- Authentication Module

Outputs:

- Vehicle Service
- CRUD Business Logic
- Documentation
- Prompt Documentation

Forbidden:

- Controllers
- Routes
- Express Request/Response
- Database Schema Changes

# ====================================================
# CONTEXT
# ====================================================

Implement the Vehicle business logic.

The service must remain framework-independent.

No Express imports.

No HTTP handling.

Pure business logic only.

# ====================================================
# TASK 1
# CREATE SERVICE
# ====================================================

Create:

backend/src/modules/vehicle/services/

vehicle.service.ts

Export via index.ts.

# ====================================================
# TASK 2
# IMPLEMENT METHODS
# ====================================================

Implement:

createVehicle()

getVehicleById()

getVehicles()

updateVehicle()

deleteVehicle()

# ====================================================
# createVehicle()
# ====================================================

Requirements:

Check duplicate:

- registrationNumber

Check duplicate:

- vin

Verify company exists.

Create vehicle.

Return created vehicle.

Never expose internal Prisma metadata.

# ====================================================
# getVehicleById()
# ====================================================

Retrieve vehicle by UUID.

Throw standard error if not found.

# ====================================================
# getVehicles()
# ====================================================

Support:

Pagination

Search

Filtering

Sorting

Filters:

status

vehicleType

fuelType

companyId

Return:

items

total

page

limit

totalPages

# ====================================================
# updateVehicle()
# ====================================================

Update permitted fields only.

Reject duplicate VIN.

Reject duplicate registrationNumber.

Return updated record.

# ====================================================
# deleteVehicle()
# ====================================================

Soft-delete is NOT implemented.

Perform normal delete.

Throw standard error if record is missing.

# ====================================================
# TASK 3
# CODE QUALITY
# ====================================================

Use Prisma efficiently.

Avoid duplicate queries.

Reuse shared logic where appropriate.

No controller logic.

No response formatting.

# ====================================================
# TASK 4
# DOCUMENTATION
# ====================================================

Update:

docs/backend/vehicle-module.md

Document:

Service methods

Business rules

Pagination

Filtering

# ====================================================
# TASK 5
# AI LOG
# ====================================================

Append:

SPEC-030

to:

docs/AI-DEVELOPMENT-LOG.md

# ====================================================
# TASK 6
# PROMPT STORAGE
# ====================================================

Create:

prompts/phase-5-backend/

SPEC-030-vehicle-service.md

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

Everything must pass.

# ====================================================
# GIT
# ====================================================

Commit:

feat(vehicle): add service layer

Push to GitHub.

# ====================================================
# FINAL SUMMARY
# ====================================================

Provide:

Methods Implemented

Business Rules

Files Created

Files Modified

Validation Results

Commit Hash

Push Status
