# ====================================================
# FleetCore
# SPEC-012
# Fuel Record Model
# ====================================================

METADATA
----------------------------------------------------

SPEC ID:
SPEC-012

Phase:
Core Database

Module:
Operations

Title:
Fuel Record Model

Dependencies:

- Company
- Driver
- Vehicle
- Trip

Outputs:

- Prisma Schema
- Database Documentation
- AI Development Log
- Prompt Documentation

Forbidden:

- APIs
- Controllers
- Services
- Frontend
- Migrations
- Seed Data

# ====================================================
# CONTEXT
# ====================================================

Continue the existing FleetCore repository.

Existing database models are already implemented.

Maintain the established architecture.

Maintain naming conventions.

Maintain Prisma documentation style.

Do not recreate existing models.

Modify existing models only where relations are required.

# ====================================================
# OBJECTIVE
# ====================================================

Implement ONLY the FuelRecord model.

FuelRecord stores every vehicle refueling event.

Fuel consumption belongs to operational history.

It is NOT part of Vehicle.

It is NOT part of Trip.

Trip only references Fuel Records.

# ====================================================
# EXISTING DEPENDENCIES
# ====================================================

FuelRecord belongs to

✓ Company

✓ Driver

✓ Vehicle

✓ Trip

# ====================================================
# TASK 1
# CREATE MODEL
# ====================================================

Implement FuelRecord.

Suggested fields (only if supported by FleetCore documentation)

Identity

- id

Business

- fuelRecordNumber

Fuel

- fuelType

- quantity

- pricePerUnit

- totalCost

Vehicle

- odometerReading

Station

- stationName

- stationLocation

Operational

- refueledAt

- notes

Foreign Keys

- companyId

- vehicleId

- driverId

- tripId

Audit

- createdAt

- updatedAt

# ====================================================
# TASK 2
# RELATIONSHIPS
# ====================================================

FuelRecord belongs to

Company

Driver

Vehicle

Trip

Do not implement any additional models.

# ====================================================
# TASK 3
# ENUMS
# ====================================================

Reuse FuelType if already available.

Create new enums only if absolutely required.

Do not duplicate enums.

# ====================================================
# TASK 4
# CONSTRAINTS
# ====================================================

Implement

Unique fuelRecordNumber

Required

companyId

vehicleId

driverId

tripId

# ====================================================
# TASK 5
# INDEXES
# ====================================================

Create indexes

companyId

vehicleId

driverId

tripId

fuelType

refueledAt

createdAt

# ====================================================
# TASK 6
# DOCUMENTATION
# ====================================================

Update

docs/database/database-schema.md

Document

FuelRecord

Fields

Relationships

Indexes

Enum usage

# ====================================================
# TASK 7
# AI LOG
# ====================================================

Append

SPEC-012

to

docs/AI-DEVELOPMENT-LOG.md

# ====================================================
# TASK 8
# PROMPT DOCUMENTATION
# ====================================================

Create

prompts/phase-3-operations/SPEC-012-fuel-record-model.md

Store this COMPLETE specification.

# ====================================================
# SCHEMA QUALITY CHECK
# ====================================================

Verify

✓ Enum reuse

✓ Naming consistency

✓ Cascade rules

✓ Nullable fields

✓ Relation naming

✓ Documentation

✓ Index quality

# ====================================================
# ACCEPTANCE CRITERIA
# ====================================================

Must pass

✓ Prisma Format

✓ Prisma Validate

✓ Prisma Generate

✓ Backend Build

✓ Frontend Build

✓ Type Check

✓ Lint

✓ No duplicated enums

✓ No duplicated indexes

✓ All Prisma relations compile

# ====================================================
# DO NOT IMPLEMENT
# ====================================================

Maintenance

Notifications

GPS

Location History

REST APIs

Authentication

Frontend

# ====================================================
# GIT
# ====================================================

Commit

feat(database): add fuel record model

Push to GitHub.

# ====================================================
# FINAL SUMMARY
# ====================================================

Provide

Fields Added

Relationships

Indexes

Constraints

Files Modified

Validation Results

Commit Hash

Push Status
