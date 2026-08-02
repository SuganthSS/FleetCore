# ====================================================
# FleetCore
# SPEC-029
# Vehicle Validation Layer
# ====================================================

METADATA
----------------------------------------------------

SPEC ID:
SPEC-029

Phase:
Backend - Fleet Management

Module:
Vehicle

Title:
Vehicle Validation Schemas

Dependencies:

- Prisma Vehicle Model
- Authentication Module
- Zod
- Existing Project Structure

Outputs:

- Vehicle Validation Schemas
- Inferred Types
- Documentation
- Prompt Documentation

Forbidden:

- Controllers
- Services
- Routes
- Repository Logic
- Database Changes
- Business Logic

# ====================================================
# CONTEXT
# ====================================================

The Vehicle database model has already been implemented.

This specification creates only the validation layer.

All business logic will be implemented in later specifications.

# ====================================================
# TASK 1
# CREATE VALIDATORS
# ====================================================

Create:

backend/src/modules/vehicle/

if it does not already exist.

Create:

validators/

Inside it create:

vehicle.validator.ts

Export through index.ts.

# ====================================================
# TASK 2
# CREATE SCHEMAS
# ====================================================

Implement Zod schemas for:

CreateVehicleSchema

UpdateVehicleSchema

VehicleIdParamSchema

VehicleQuerySchema

# ====================================================
# CREATE VEHICLE SCHEMA
# ====================================================

Validate:

registrationNumber

vin

make

model

manufacturingYear

vehicleType

fuelType

capacity

status

companyId

Rules:

registrationNumber

required

trimmed

maximum length 30

VIN

required

17 characters maximum

make

required

maximum 100

model

required

maximum 100

manufacturingYear

integer

reasonable range

vehicleType

must match Prisma enum

fuelType

must match Prisma enum

capacity

positive number

status

optional

companyId

UUID

# ====================================================
# UPDATE SCHEMA
# ====================================================

All fields optional.

Reuse Create schema where possible.

# ====================================================
# PARAM SCHEMA
# ====================================================

Validate:

id

UUID

# ====================================================
# QUERY SCHEMA
# ====================================================

Validate optional filters:

page

limit

search

status

vehicleType

fuelType

sortBy

sortOrder

Rules:

page >=1

limit <=100

sortOrder:

asc

desc

# ====================================================
# TASK 3
# TYPES
# ====================================================

Export inferred types:

CreateVehicleInput

UpdateVehicleInput

VehicleQueryInput

VehicleIdInput

# ====================================================
# TASK 4
# DOCUMENTATION
# ====================================================

Update:

docs/backend/vehicle-module.md

Document:

Schemas

Validation Rules

Exported Types

# ====================================================
# TASK 5
# AI LOG
# ====================================================

Append:

SPEC-029

to:

docs/AI-DEVELOPMENT-LOG.md

# ====================================================
# TASK 6
# PROMPT STORAGE
# ====================================================

Create:

prompts/phase-5-backend/

SPEC-029-vehicle-validation.md

Store this COMPLETE prompt.

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

feat(vehicle): add validation layer

Push to GitHub.

# ====================================================
# FINAL SUMMARY
# ====================================================

Provide:

Schemas Created

Types Exported

Files Created

Files Modified

Validation Results

Commit Hash

Push Status
