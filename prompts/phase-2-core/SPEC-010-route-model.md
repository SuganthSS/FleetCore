# FleetCore

## SPEC-010: Route Model

- **Title**: Route Model Implementation
- **Version**: 1.0.0
- **Date**: 2026-08-02
- **Phase**: Phase 2 - Core / Planning Entities
- **Objective**: Implement the `Route` model, `RouteType`, and `RouteStatus` enums in Prisma. Establish transportation path planning metrics, unique route codes, shipment and company relations, indexing, database documentation, and AI prompt history tracking.

---

## 📝 Complete Implementation Prompt

```text
# FleetCore — SPEC-010
## Route Model

====================================================
CONTEXT
====================================================

You are continuing development of the existing FleetCore repository.

Already implemented:

- Company
- Role
- User
- Driver
- Vehicle
- Customer
- Shipment

The project architecture, folder structure, Prisma conventions, documentation style, and coding standards are already established.

Do NOT recreate existing models.

Do NOT modify existing approved architecture.

====================================================
OBJECTIVE
====================================================

Implement ONLY the Route model.

A Route represents the planned transportation path for a Shipment.

A Route is NOT a Trip.

A Route contains planning information only.

Vehicle assignment will occur through Trip.

Driver assignment will occur through Trip.

Do NOT implement Trip.

Do NOT implement Tracking.

Do NOT implement optimization algorithms.

====================================================
DEPENDENCIES
====================================================

Existing models

✓ Company

✓ Shipment

Route must reference Shipment.

====================================================
TASK 1
CREATE ROUTE MODEL
====================================================

Implement Route.

Suggested fields (only if supported by FleetCore documentation)

Identity

- id

- routeCode

Planning

- originAddress

- originCity

- originState

- originCountry

- destinationAddress

- destinationCity

- destinationState

- destinationCountry

Metrics

- plannedDistance

- estimatedDuration

Business

- routeType

- status

Foreign Keys

- shipmentId

- companyId

Audit

- createdAt

- updatedAt

====================================================
TASK 2
RELATIONSHIPS
====================================================

Route

belongs to

Shipment

Route

belongs to

Company

Prepare future relations

Trip

Waypoints

Do NOT implement those models.

====================================================
TASK 3
ENUMS
====================================================

Create only required enums.

Examples

RouteType

RouteStatus

Reuse existing enums whenever possible.

====================================================
TASK 4
CONSTRAINTS
====================================================

Implement

Unique routeCode

Required Shipment

Required Company

====================================================
TASK 5
INDEXES
====================================================

Create indexes

CompanyId

ShipmentId

Status

RouteType

CreatedAt

====================================================
TASK 6
DOCUMENTATION
====================================================

Update

docs/database/database-schema.md

Document

Route model

Fields

Relationships

Indexes

Enums

====================================================
TASK 7
AI DEVELOPMENT LOG
====================================================

Append

SPEC-010

Status

Date

Commit

====================================================
TASK 8
PROMPT DOCUMENTATION
====================================================

Create

prompts/phase-2-core/

SPEC-010-route-model.md

Store this COMPLETE specification.

====================================================
SCHEMA QUALITY CHECK
====================================================

Before finishing verify

✓ Naming consistency

✓ Enum reuse

✓ Relation naming consistency

✓ Cascade behavior

✓ Nullable fields

✓ Documentation comments

Fix consistency issues if they do not alter the approved architecture.

====================================================
VALIDATION
====================================================

Run

Prisma Format

Prisma Validate

Prisma Generate

Backend Build

Frontend Build

Type Check

Lint

Everything must succeed.

Do NOT create migrations.

Do NOT create seed data.

====================================================
DO NOT IMPLEMENT
====================================================

Trip

Tracking

Vehicle Assignment

Driver Assignment

Optimization

Maps

GPS

Frontend

REST APIs

====================================================
GIT
====================================================

Commit

feat(database): add route model

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

- **Prisma Schema**: `Route` model and `RouteType`, `RouteStatus` enums added in `backend/prisma/schema.prisma` with `Shipment` and `Company` relations.
- **Client Generation**: Prisma Client regenerated with `Route` types.
- **Documentation**: Model schema documented in `docs/database/database-schema.md` and SPEC history updated in `docs/AI-DEVELOPMENT-LOG.md`.
- **Prompt Specification**: Stored complete specification in `prompts/phase-2-core/SPEC-010-route-model.md`.

---

## 📌 Notes

- Route contains route planning metrics (origin, destination, distance, estimated duration) and does NOT contain vehicle or driver assignments (which belong to `Trip`).
