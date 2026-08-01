# FleetCore

## SPEC-009: Shipment Model

- **Title**: Shipment Model Implementation
- **Version**: 1.0.0
- **Date**: 2026-08-02
- **Phase**: Phase 2 - Core / Order & Logistics Entities
- **Objective**: Implement the `Shipment` model, `ShipmentPriority`, and `ShipmentStatus` enums in Prisma. Establish cargo transport requests, unique shipment numbers, customer and company relations, indexing, database schema documentation, and AI prompt history tracking.

---

## 📝 Complete Implementation Prompt

```text
# FleetCore — SPEC-009
## Shipment Model

You are continuing development of the existing FleetCore repository.

Completed specifications include:

- Project Foundation
- Prisma Configuration
- Company
- Role
- User
- Driver
- Vehicle
- Customer

Maintain the existing architecture, Prisma conventions, documentation style, and coding standards.

Do NOT recreate existing models.

====================================================
OBJECTIVE
====================================================

Implement ONLY the Shipment model.

A Shipment represents the business request to transport goods.

A Shipment exists independently of vehicle assignment.

Vehicle assignment will happen through Trip.

Do NOT implement Route.

Do NOT implement Trip.

Do NOT implement APIs.

Do NOT create migrations.

Do NOT create seed data.

====================================================
SOURCE OF TRUTH
====================================================

Use the FleetCore documentation.

Only include fields defined there.

Do not invent unnecessary business fields.

====================================================
MODEL DOCUMENTATION
====================================================

Document the Shipment model using Prisma documentation comments.

Follow the same documentation style used throughout the schema.

====================================================
FIELD ORDER
====================================================

1. Primary Key

2. Shipment Identity

3. Shipment Details

4. Pickup Information

5. Delivery Information

6. Business Information

7. Foreign Keys

8. Relations

9. Audit Fields

10. Indexes

====================================================
TASK 1
CREATE SHIPMENT MODEL
====================================================

Implement the Shipment model.

Typical fields include

Identity

- id

- shipmentNumber

Details

- title

- description

- cargoType

- weight

- volume

- quantity

Pickup

- pickupAddress

- pickupCity

- pickupState

- pickupCountry

- pickupPostalCode

- pickupDate

Delivery

- deliveryAddress

- deliveryCity

- deliveryState

- deliveryCountry

- deliveryPostalCode

- expectedDeliveryDate

Business

- priority

- status

Foreign Keys

- customerId

- companyId

Audit

- createdAt

- updatedAt

Only include fields supported by the FleetCore documentation.

====================================================
TASK 2
RELATIONSHIPS
====================================================

Shipment

belongs to

Customer

Shipment

belongs to

Company

Prepare future relations for

Route

Trip

Notifications

Documents

Do NOT implement dependent models.

====================================================
TASK 3
ENUMS
====================================================

Create only required enums.

Examples

ShipmentPriority

ShipmentStatus

Reuse existing enums where possible.

====================================================
TASK 4
CONSTRAINTS
====================================================

Implement

Unique shipmentNumber

Required Customer

Required Company

====================================================
TASK 5
INDEXES
====================================================

Create indexes

CompanyId

CustomerId

ShipmentNumber

Status

Priority

PickupDate

ExpectedDeliveryDate

CreatedAt

====================================================
TASK 6
DOCUMENTATION
====================================================

Update

docs/database/database-schema.md

Document

Shipment model

Fields

Relationships

Indexes

Enums

====================================================
TASK 7
AI DEVELOPMENT LOG
====================================================

Append

SPEC-009

Status

Date

Commit

====================================================
TASK 8
PROMPT DOCUMENTATION
====================================================

Create

prompts/phase-2-core/

SPEC-009-shipment-model.md

Store this COMPLETE specification.

Do not summarize.

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

Route

Trip

Vehicle Assignment

Driver Assignment

Fuel

Maintenance

REST APIs

Authentication

Frontend

====================================================
ARCHITECTURE RULE
====================================================

If implementation reveals a better shipment design,

DO NOT modify the schema automatically.

Document it in

docs/architecture/future-improvements.md

using

- Title
- Reason
- Benefits
- Risks
- Recommended Future SPEC

====================================================
GIT
====================================================

Commit

feat(database): add shipment model

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

- **Prisma Schema**: `Shipment` model and `ShipmentPriority`, `ShipmentStatus` enums added in `backend/prisma/schema.prisma` with `Customer` and `Company` relations.
- **Client Generation**: Prisma Client regenerated with `Shipment` types.
- **Documentation**: Model schema documented in `docs/database/database-schema.md` and SPEC history updated in `docs/AI-DEVELOPMENT-LOG.md`.
- **Prompt Specification**: Stored complete specification in `prompts/phase-2-core/SPEC-009-shipment-model.md`.

---

## 📌 Notes

- Vehicle and driver assignments exist independently of `Shipment` and will be dynamically attached via `Trip`.
