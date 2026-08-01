# FleetCore

## SPEC-007: Vehicle Core Model

- **Title**: Vehicle Core Model Implementation
- **Version**: 1.0.0
- **Date**: 2026-08-02
- **Phase**: Phase 2 - Core / Physical Fleet Assets
- **Objective**: Implement the `Vehicle` core model, `VehicleStatus`, `VehicleType`, and `FuelType` enums in Prisma. Establish physical fleet asset representation, unique constraints, multi-tenant company association, indexing, database documentation, and prompt history logging.

---

## 📝 Complete Implementation Prompt

```text
# FleetCore — SPEC-007
## Vehicle Core Model

You are continuing development of the existing FleetCore repository.

Already completed:

- Project Foundation
- Prisma Configuration
- Company Model
- Role Model
- User Model
- Driver Model

Maintain all existing architecture, coding standards, Prisma conventions, and documentation style.

Do NOT recreate existing models.

====================================================
OBJECTIVE
====================================================

Implement ONLY the Vehicle Core model.

This model represents the physical fleet asset.

IMPORTANT

Do NOT permanently assign a Driver to a Vehicle.

Driver assignment will be handled by the future Trip model.

Do NOT implement Trip.

Do NOT implement Shipment.

Do NOT implement APIs.

Do NOT create migrations.

Do NOT create seed data.

====================================================
SOURCE OF TRUTH
====================================================

Use the FleetCore documentation.

Follow existing schema conventions.

Reuse enums whenever possible.

====================================================
MODEL DOCUMENTATION
====================================================

Document the Vehicle model using Prisma documentation comments.

Follow the same layout used by previous models.

====================================================
FIELD ORDER
====================================================

1. Primary Key

2. Vehicle Identity

3. Vehicle Specifications

4. Ownership

5. Relations

6. Audit Fields

7. Indexes

====================================================
TASK 1
CREATE VEHICLE MODEL
====================================================

Implement the Vehicle model.

Typical fields include

Identity

- id

- registrationNumber

- vin

- make

- model

- manufacturingYear

Specifications

- vehicleType

- fuelType

- capacity

- status

Ownership

- companyId

Audit

- createdAt

- updatedAt

Only include fields supported by the FleetCore documentation.

====================================================
TASK 2
RELATIONSHIPS
====================================================

Vehicle

belongs to

Company

Prepare future relations for

Trips

Fuel Records

Maintenance Records

Location History

Shipments

DO NOT add

driverId

Driver assignment belongs to Trip.

====================================================
TASK 3
ENUMS
====================================================

Create only required enums.

Examples

VehicleStatus

VehicleType

FuelType

Reuse existing enums whenever applicable.

====================================================
TASK 4
CONSTRAINTS
====================================================

Implement

Unique registrationNumber

Unique VIN

Required Company

====================================================
TASK 5
INDEXES
====================================================

Create indexes

CompanyId

VehicleType

FuelType

Status

ManufacturingYear

CreatedAt

====================================================
TASK 6
DOCUMENTATION
====================================================

Update

docs/database/database-schema.md

Document

Vehicle model

Fields

Relationships

Indexes

Enums

Document why Driver assignment is handled through Trip instead of Vehicle.

====================================================
TASK 7
AI DEVELOPMENT LOG
====================================================

Append

SPEC-007

Status

Date

Commit

====================================================
TASK 8
PROMPT DOCUMENTATION
====================================================

Create

prompts/phase-2-core/

SPEC-007-vehicle-core.md

Store this COMPLETE specification.

====================================================
QUALITY
====================================================

Run

Prisma Format

Prisma Validate

Prisma Generate

Backend Build

Frontend Build

Type Check

Lint

Everything must pass.

Do NOT create migrations.

Do NOT create seed data.

====================================================
DO NOT IMPLEMENT
====================================================

Trip

Shipment

Route

Fuel

Maintenance

Location History

Authentication

REST APIs

Frontend

====================================================
ARCHITECTURE RULE
====================================================

If implementation reveals a better vehicle design,

DO NOT change the architecture automatically.

Document it in

docs/architecture/future-improvements.md

====================================================
GIT
====================================================

Commit

feat(database): add vehicle core model

Push to GitHub.

====================================================
FINAL SUMMARY
====================================================

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
```

---

## 🎯 Expected Deliverables

- **Prisma Schema**: `Vehicle` model and `VehicleStatus`, `VehicleType`, `FuelType` enums added in `backend/prisma/schema.prisma` with parent `Company` relation.
- **Client Generation**: Prisma Client regenerated with `Vehicle` types.
- **Documentation**: Model schema documented in `docs/database/database-schema.md` (including architectural explanation on why driver assignment belongs to `Trip`), and SPEC history updated in `docs/AI-DEVELOPMENT-LOG.md`.
- **Prompt Specification**: Created `prompts/phase-2-core/SPEC-007-vehicle-core.md`.

---

## 📌 Notes

- Driver assignment is explicitly decoupled from `Vehicle` and reserved for dynamic trip-based dispatch modeling in `Trip`.
