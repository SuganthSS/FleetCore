# FleetCore

## SPEC-006: Driver Model

- **Title**: Driver Model Implementation
- **Version**: 1.0.0
- **Date**: 2026-08-02
- **Phase**: Phase 2 - Core / Operational Models
- **Objective**: Implement the operational `Driver` profile model, `DriverAvailability` enum, and `ExperienceLevel` enum in Prisma. Establish 1-to-1 extension link to `User` and foreign key reference to `Company`, enforcing unique constraints and indexing.

---

## 📝 Complete Implementation Prompt

```text
# FleetCore — SPEC-006
## Driver Model

You are continuing development of the existing FleetCore repository.

Already completed:

- Project Foundation
- Prisma Configuration
- Company Model
- Role Model
- User Model

Maintain all existing architecture, conventions, and coding standards.

Do NOT recreate existing models.

====================================================
OBJECTIVE
====================================================

Implement ONLY the Driver model.

A Driver represents an operational driver profile that extends a User.

A Driver MUST always be linked to an existing User.

Do NOT implement Vehicle.

Do NOT implement Shipment.

Do NOT implement APIs.

Do NOT create migrations.

Do NOT create seed data.

====================================================
SOURCE OF TRUTH
====================================================

Use the FleetCore project documentation.

Only include fields defined there.

Do not invent unnecessary business fields.

====================================================
MODEL DOCUMENTATION
====================================================

Document the model using Prisma comments.

Use the same documentation style used for Company, Role and User.

====================================================
FIELD ORDER
====================================================

Use this order.

1. Primary Key

2. Driver Information

3. License Information

4. Employment Information

5. Foreign Keys

6. Relations

7. Audit Fields

8. Indexes

====================================================
TASK 1
CREATE DRIVER MODEL
====================================================

Implement Driver.

Typical fields include

Identity

- id

Professional Information

- employeeId

- experienceLevel

- availability

License

- licenseNumber

- licenseExpiry

Employment

- joiningDate

- emergencyContactName

- emergencyContactPhone

Foreign Keys

- userId

- companyId

Audit

- createdAt

- updatedAt

Only include fields supported by the FleetCore documentation.

====================================================
TASK 2
RELATIONSHIPS
====================================================

Driver

belongs to

User

Driver

belongs to

Company

Prepare future relations for

Vehicles

Trips

Fuel Records

Maintenance Records

Do NOT implement dependent models.

====================================================
TASK 3
ENUMS
====================================================

Create only required enums.

Examples

DriverAvailability

ExperienceLevel

Do not duplicate existing enums.

====================================================
TASK 4
CONSTRAINTS
====================================================

Implement

Unique userId

Unique employeeId

Unique licenseNumber

Required Company

Required User

====================================================
TASK 5
INDEXES
====================================================

Create indexes

CompanyId

Availability

ExperienceLevel

LicenseExpiry

CreatedAt

====================================================
TASK 6
DOCUMENTATION
====================================================

Update

docs/database/database-schema.md

Document

Driver model

Fields

Relationships

Indexes

Enums

====================================================
TASK 7
AI DEVELOPMENT LOG
====================================================

Append

SPEC-006

Status

Date

Commit

====================================================
TASK 8
PROMPT DOCUMENTATION
====================================================

Create

prompts/phase-2-core/SPEC-006-driver-model.md

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

Vehicle

Shipment

Trip

Fuel

Maintenance

Authentication

REST APIs

Controllers

Frontend

====================================================
ARCHITECTURE RULE
====================================================

If improvements are identified,

DO NOT implement them automatically.

Document them in

docs/architecture/future-improvements.md

====================================================
GIT
====================================================

Commit

feat(database): add driver model

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

- **Prisma Schema**: `Driver` model, `DriverAvailability`, and `ExperienceLevel` enums added in `backend/prisma/schema.prisma` with 1-to-1 `User` relation and `Company` relation.
- **Client Generation**: Prisma Client regenerated with `Driver` types.
- **Documentation**: Model schema documented in `docs/database/database-schema.md` and SPEC history updated in `docs/AI-DEVELOPMENT-LOG.md`.
- **Prompt Specification**: Created `prompts/phase-2-core/SPEC-006-driver-model.md`.

---

## 📌 Notes

- SPEC-006 establishes operational driver identity as a 1-to-1 extension of a `User` account within a multi-tenant `Company`.
