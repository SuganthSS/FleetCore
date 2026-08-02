# ====================================================
# FleetCore
# SPEC-014
# Vehicle Location History Model
# ====================================================

METADATA
----------------------------------------------------

SPEC ID:
SPEC-014

Phase:
Core Database

Module:
Operations

Title:
Vehicle Location History Model

Dependencies:

- Company
- Vehicle
- Driver
- Trip

Outputs:

- Prisma Schema
- Database Documentation
- AI Development Log
- Prompt Documentation

Forbidden:

- APIs
- WebSockets
- GPS services
- Maps
- Frontend
- Migrations
- Seed Data

# ====================================================
# CONTEXT
# ====================================================

Continue the existing FleetCore repository.

Maintain existing architecture.

Maintain naming conventions.

Maintain documentation style.

Do not recreate existing models.

Modify existing models only where relations are required.

# ====================================================
# OBJECTIVE
# ====================================================

Implement ONLY the VehicleLocationHistory model.

This model stores historical location points generated during a Trip.

It is a historical log.

It does NOT provide live tracking logic.

Live updates will be implemented later through WebSockets.

# ====================================================
# EXISTING DEPENDENCIES
# ====================================================

VehicleLocationHistory belongs to

✓ Company

✓ Vehicle

✓ Driver

✓ Trip

# ====================================================
# TASK 1
# CREATE MODEL
# ====================================================

Implement VehicleLocationHistory.

Typical fields (only if supported by FleetCore documentation)

Identity

- id

Location

- latitude

- longitude

- speed

- heading

- altitude

Operational

- recordedAt

Foreign Keys

- companyId

- vehicleId

- driverId

- tripId

Audit

- createdAt

# ====================================================
# TASK 2
# RELATIONSHIPS
# ====================================================

VehicleLocationHistory belongs to

Company

Vehicle

Driver

Trip

No additional models.

# ====================================================
# TASK 3
# CONSTRAINTS
# ====================================================

Required

companyId

vehicleId

driverId

tripId

# ====================================================
# TASK 4
# INDEXES
# ====================================================

Create indexes

companyId

vehicleId

driverId

tripId

recordedAt

createdAt

# ====================================================
# TASK 5
# DOCUMENTATION
# ====================================================

Update

docs/database/database-schema.md

Document

VehicleLocationHistory

Fields

Relationships

Indexes

Purpose

Explain that

VehicleLocationHistory stores historical GPS points.

It is NOT responsible for real-time communication.

# ====================================================
# TASK 6
# AI LOG
# ====================================================

Append

SPEC-014

to

docs/AI-DEVELOPMENT-LOG.md

# ====================================================
# TASK 7
# PROMPT DOCUMENTATION
# ====================================================

Create

prompts/phase-3-operations/SPEC-014-vehicle-location-history.md

Store this COMPLETE specification.

# ====================================================
# SCHEMA QUALITY CHECK
# ====================================================

Verify

✓ Relation naming

✓ Index quality

✓ Documentation

✓ Nullable fields

✓ Cascade rules

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

✓ No duplicated indexes

✓ All Prisma relations compile

# ====================================================
# DO NOT IMPLEMENT
# ====================================================

WebSockets

Maps

GPS integrations

REST APIs

Authentication

Frontend

# ====================================================
# GIT
# ====================================================

Commit

feat(database): add vehicle location history model

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
