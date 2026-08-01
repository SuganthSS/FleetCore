# FleetCore

## SPEC-004: Role Model

- **Title**: Role Model Implementation
- **Version**: 1.0.0
- **Date**: 2026-08-02
- **Phase**: Phase 1 - Foundation / Database Foundation
- **Objective**: Implement the `Role` model in Prisma with docstring comments, UUID primary key, JSON permissions policy support, system role flag, performance indexes, database schema documentation, and AI log tracking.

---

## 📝 Complete Implementation Prompt

```text
# FleetCore — SPEC-004
## Role Model

You are continuing development of the existing FleetCore repository.

Project foundation, Prisma configuration, CI pipeline, and Company model are already complete.

Maintain the existing architecture.

Do NOT recreate the project.

====================================================
OBJECTIVE
====================================================

Implement ONLY the Role model.

This model defines the Role-Based Access Control (RBAC) foundation.

Do NOT implement authentication.

Do NOT implement users.

Do NOT implement permissions middleware.

Do NOT implement APIs.

Do NOT create migrations.

Do NOT create seed data.

====================================================
SOURCE OF TRUTH
====================================================

Use the FleetCore documentation.

Follow the existing schema conventions already established.

Reuse naming conventions.

====================================================
TASK 1
CREATE ROLE MODEL
====================================================

Implement the Role model.

Include documentation comments (///).

Field order

1. Primary Key

2. Business Fields

3. Relations

4. Metadata

Suggested business fields

- id (UUID)

- name

- description

- permissions

- isSystem

- createdAt

- updatedAt

Permissions should use Prisma Json type.

This allows flexible RBAC policies without schema changes.

====================================================
TASK 2
RELATIONS
====================================================

Prepare future relation

Role

↓

Users

Do NOT implement User model yet.

Only prepare the relation.

====================================================
TASK 3
INDEXES
====================================================

Create indexes

Unique

- name

Indexes

- isSystem

- createdAt

====================================================
TASK 4
DOCUMENTATION
====================================================

Update

docs/database/database-schema.md

Document

Role model

Fields

Indexes

Future User relationship

====================================================
TASK 5
AI DEVELOPMENT LOG
====================================================

Append

SPEC-004

Status

Date

Commit

to

docs/AI-DEVELOPMENT-LOG.md

====================================================
TASK 6
PROMPT DOCUMENTATION
====================================================

Create

prompts/phase-1-foundation/SPEC-004-role-model.md

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

Everything must succeed.

No migrations.

No seed.

====================================================
ARCHITECTURE RULE
====================================================

If a better RBAC structure is discovered,

DO NOT implement it automatically.

Document it in

docs/architecture/future-improvements.md

Include

Title

Reason

Benefits

Risks

Recommended Future SPEC

====================================================
GIT
====================================================

Commit

feat(database): add role model

Push to GitHub.

====================================================
FINAL SUMMARY
====================================================

Provide

Fields Added

Indexes

Relations Prepared

Files Modified

Validation Results

Commit Hash

Push Status
```

---

## 🎯 Expected Deliverables

- **Prisma Model**: `Role` model added to `backend/prisma/schema.prisma` with triple-slash (`///`) docstrings.
- **Client Generation**: Prisma Client regenerated with `Role` types.
- **Documentation**: Model schema documented in `docs/database/database-schema.md` and SPEC history updated in `docs/AI-DEVELOPMENT-LOG.md`.
- **Prompt Documentation**: Stored prompt specification in `prompts/phase-1-foundation/SPEC-004-role-model.md`.

---

## 📌 Notes

- SPEC-004 establishes the RBAC `Role` foundation using Prisma's `Json` type for zero-downtime policy flexibility without requiring schema migrations on policy changes.
