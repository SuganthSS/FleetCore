# FleetCore

## SPEC-008: Customer Model

- **Title**: Customer Model Implementation
- **Version**: 1.0.0
- **Date**: 2026-08-02
- **Phase**: Phase 2 - Core / Client & Order Entities
- **Objective**: Implement the `Customer` model and `CustomerStatus` enum in Prisma. Establish client business identity, customer code uniqueness, multi-tenant company association, indexing, database documentation, and AI prompt history tracking.

---

## 📝 Complete Implementation Prompt

```text
# FleetCore — SPEC-008
## Customer Model

You are continuing development of the existing FleetCore repository.

Already completed:

- Project Foundation
- Prisma Configuration
- Company Model
- Role Model
- User Model
- Driver Model
- Vehicle Core Model

Maintain all existing architecture, Prisma conventions, coding standards, and documentation style.

Do NOT recreate existing models.

====================================================
OBJECTIVE
====================================================

Implement ONLY the Customer model.

A Customer represents a business or individual who requests shipments.

Customers belong to a Company.

Do NOT implement Shipments.

Do NOT implement Routes.

Do NOT implement Trips.

Do NOT implement APIs.

Do NOT create migrations.

Do NOT create seed data.

====================================================
SOURCE OF TRUTH
====================================================

Use the FleetCore project documentation.

Only include fields defined there.

Reuse existing enums whenever applicable.

====================================================
MODEL DOCUMENTATION
====================================================

Document the Customer model using Prisma documentation comments.

Follow the existing documentation format.

====================================================
FIELD ORDER
====================================================

1. Primary Key

2. Customer Identity

3. Contact Information

4. Business Information

5. Foreign Keys

6. Relations

7. Audit Fields

8. Indexes

====================================================
TASK 1
CREATE CUSTOMER MODEL
====================================================

Implement the Customer model.

Typical fields include

Identity

- id

- customerCode

- companyName

- contactPerson

Contact

- email

- phone

Business

- address

- city

- state

- country

- postalCode

- status

Foreign Keys

- companyId

Audit

- createdAt

- updatedAt

Only include fields supported by the FleetCore documentation.

====================================================
TASK 2
RELATIONSHIPS
====================================================

Customer

belongs to

Company

Prepare future relations for

Shipments

Invoices

Notifications

Do NOT implement dependent models.

====================================================
TASK 3
ENUMS
====================================================

Create only required enums.

Example

CustomerStatus

Reuse existing enums whenever applicable.

====================================================
TASK 4
CONSTRAINTS
====================================================

Implement

Unique customerCode

Required Company

Unique email only if supported by project documentation.

====================================================
TASK 5
INDEXES
====================================================

Create indexes

CompanyId

CustomerCode

CompanyName

Status

CreatedAt

====================================================
TASK 6
DOCUMENTATION
====================================================

Update

docs/database/database-schema.md

Document

Customer model

Fields

Relationships

Indexes

Enums

====================================================
TASK 7
AI DEVELOPMENT LOG
====================================================

Append

SPEC-008

Status

Date

Commit

====================================================
TASK 8
PROMPT DOCUMENTATION
====================================================

Create

prompts/phase-2-core/

SPEC-008-customer-model.md

Store this COMPLETE specification.

Never summarize it.

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

Shipment

Route

Trip

Invoice

Fuel

Maintenance

Authentication

REST APIs

Frontend

====================================================
ARCHITECTURE RULE
====================================================

If implementation reveals a better customer design,

DO NOT modify the schema automatically.

Instead document it in

docs/architecture/future-improvements.md

using

Title

Reason

Benefits

Risks

Recommended Future SPEC

====================================================
GIT
====================================================

Commit

feat(database): add customer model

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

- **Prisma Schema**: `Customer` model and `CustomerStatus` enum added in `backend/prisma/schema.prisma` with parent `Company` relation.
- **Client Generation**: Prisma Client regenerated with `Customer` types.
- **Documentation**: Model schema documented in `docs/database/database-schema.md` and SPEC history updated in `docs/AI-DEVELOPMENT-LOG.md`.
- **Prompt Specification**: Stored complete specification in `prompts/phase-2-core/SPEC-008-customer-model.md`.

---

## 📌 Notes

- SPEC-008 establishes client business accounts that own shipment orders in the FleetCore ecosystem.
