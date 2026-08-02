# ====================================================
# FleetCore
# SPEC-013
# Maintenance Record Model
# ====================================================

METADATA
----------------------------------------------------

SPEC ID:
SPEC-013

Phase:
Core Database

Module:
Operations

Title:
Maintenance Record Model

Dependencies:

- Company
- Vehicle
- Driver

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

Maintain all existing architecture.

Maintain Prisma naming conventions.

Maintain documentation style.

Do not recreate existing models.

Modify existing models only when relationships are required.

# ====================================================
# OBJECTIVE
# ====================================================

Implement ONLY the MaintenanceRecord model.

A MaintenanceRecord represents a completed or scheduled maintenance event for a vehicle.

It belongs to operational history.

It is NOT part of Vehicle.

Vehicle only references Maintenance Records.

# ====================================================
# EXISTING DEPENDENCIES
# ====================================================

MaintenanceRecord belongs to

✓ Company

✓ Vehicle

✓ Driver (technician or responsible driver)

# ====================================================
# TASK 1
# CREATE MODEL
# ====================================================

Implement MaintenanceRecord.

Typical fields (only if supported by FleetCore documentation)

Identity

- id
- maintenanceRecordNumber

Maintenance

- maintenanceType
- status
- scheduledDate
- completedDate
- serviceProvider
- description
- cost
- odometerReading
- nextMaintenanceDate
- notes

Foreign Keys

- companyId
- vehicleId
- driverId

Audit

- createdAt
- updatedAt

# ====================================================
# TASK 2
# RELATIONSHIPS
# ====================================================

MaintenanceRecord belongs to

Company

Vehicle

Driver

Do not implement additional models.

# ====================================================
# TASK 3
# ENUMS
# ====================================================

Create only required enums.

Examples

MaintenanceType

MaintenanceStatus

Reuse existing enums whenever possible.

# ====================================================
# TASK 4
# CONSTRAINTS
# ====================================================

Implement

Unique maintenanceRecordNumber

Required

companyId

vehicleId

driverId

# ====================================================
# TASK 5
# INDEXES
# ====================================================

Create indexes

companyId

vehicleId

driverId

maintenanceType

status

scheduledDate

completedDate

createdAt

# ====================================================
# TASK 6
# DOCUMENTATION
# ====================================================

Update

docs/database/database-schema.md

Document

MaintenanceRecord

Fields

Relationships

Indexes

Enums

# ====================================================
# TASK 7
# AI LOG
# ====================================================

Append

SPEC-013

to

docs/AI-DEVELOPMENT-LOG.md

# ====================================================
# TASK 8
# PROMPT DOCUMENTATION
# ====================================================

Create

prompts/phase-3-operations/SPEC-013-maintenance-record-model.md

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

Location History

Notifications

REST APIs

Authentication

Frontend

# ====================================================
# GIT
# ====================================================

Commit

feat(database): add maintenance record model

Push to GitHub.

# ====================================================
# FINAL SUMMARY
# ====================================================

Provide

Fields Added

Relationships

Enums

Indexes

Constraints

Files Modified

Validation Results

Commit Hash

Push Status
