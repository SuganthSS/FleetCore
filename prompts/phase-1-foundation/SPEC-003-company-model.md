# FleetCore

## SPEC-003: Company Model

- **Title**: Company Model Implementation
- **Version**: 1.0.0
- **Date**: 2026-08-02
- **Phase**: Phase 1 - Foundation / Database Foundation
- **Objective**: Implement the `Company` root model and `CompanyStatus` enum in Prisma with complete field definitions, unique constraints, performance indexes, database schema documentation, and AI log tracking.

---

## 📝 Complete Implementation Prompt

```text
# FleetCore — SPEC-003
## Company Model

You are continuing development of the existing FleetCore repository.

Project foundation, Prisma configuration, and CI pipeline are already complete.

Do NOT recreate the project.

Maintain the existing architecture, coding standards, and technology stack.

====================================================
OBJECTIVE
====================================================

Implement ONLY the Company model in Prisma.

This specification defines the organization that owns all FleetCore resources.

Do NOT implement any other models.

Do NOT create migrations.

Do NOT create seed data.

Do NOT implement APIs.

Do NOT implement business logic.

====================================================
SOURCE OF TRUTH
====================================================

Use the FleetCore project documentation as the source of truth for the Company entity.

Do not invent business fields unless they are technically required.

====================================================
TASK 1
CREATE COMPANY MODEL
====================================================

Implement the Company model inside Prisma.

Requirements

• UUID primary key

• createdAt

• updatedAt

Include business fields defined in the project documentation.

Typical examples include

- Company Name

- Legal Name

- Registration Number

- Tax Number (if present in documentation)

- Email

- Phone

- Address

- City

- State

- Country

- Postal Code

- Logo URL

- Website

- Status

Only include fields supported by the FleetCore documentation.

====================================================
TASK 2
PLACEHOLDER RELATIONS
====================================================

Prepare relation fields for future models.

Do NOT implement those models yet.

Prepare relations for

- Users

- Drivers

- Vehicles

- Customers

- Shipments

- Fuel Records

- Maintenance Records

- Notifications

Only define relation arrays where Prisma requires them.

====================================================
TASK 3
ENUMS
====================================================

Create only the enums required by Company.

Do not create unrelated enums.

====================================================
TASK 4
INDEXES
====================================================

Create indexes for

- Company Name

- Registration Number

- Status

- Created At

Registration Number should be unique if supported by the documentation.

====================================================
TASK 5
DOCUMENTATION
====================================================

Update

docs/database/database-schema.md

Document

Company model

Fields

Indexes

Relationships

====================================================
TASK 6
AI DEVELOPMENT LOG
====================================================

Append

SPEC-003

Status

Date

Commit

to

docs/AI-DEVELOPMENT-LOG.md

====================================================
TASK 7
PROMPT DOCUMENTATION
====================================================

Create

prompts/phase-1-foundation/SPEC-003-company-model.md

Store this COMPLETE specification.

Never summarize it.

====================================================
QUALITY
====================================================

Run

Prisma Format

Prisma Validate

Prisma Generate

Build

Type Check

Lint

Everything must pass.

Do NOT create migrations.

Do NOT create seeds.

====================================================
ARCHITECTURE RULE
====================================================

If you identify a better Company design,

DO NOT implement it automatically.

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

feat(database): add company model

Push to GitHub.

====================================================
FINAL SUMMARY
====================================================

Provide

Fields Added

Indexes

Relations Prepared

Enums Created

Files Modified

Validation Results

Commit Hash

Push Status
```

---

## 🎯 Expected Deliverables

- **Prisma Schema**: `Company` model & `CompanyStatus` enum added to `backend/prisma/schema.prisma`.
- **Generated Client**: Prisma Client regenerated with `Company` types.
- **Documentation**: Model schema documented in `docs/database/database-schema.md` and SPEC history updated in `docs/AI-DEVELOPMENT-LOG.md`.
- **Prompt Documentation**: Stored prompt specification in `prompts/phase-1-foundation/SPEC-003-company-model.md`.

---

## 📌 Notes

- SPEC-003 defines the root organizational model (`Company`) without introducing secondary model structures, migrations, or seeding code.
