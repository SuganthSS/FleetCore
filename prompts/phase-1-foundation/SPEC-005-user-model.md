# FleetCore

## SPEC-005: User Model

- **Title**: User Model Implementation
- **Version**: 1.0.0
- **Date**: 2026-08-02
- **Phase**: Phase 1 - Foundation / Identity Foundation
- **Objective**: Implement the application `User` identity model and `UserStatus` enum in Prisma with complete field definitions, foreign key relationships (`Company`, `Role`), cascade constraints, indexing, database schema documentation, and AI log tracking.

---

## 📝 Complete Implementation Prompt

```text
# FleetCore — SPEC-005
## User Model

You are continuing development of the existing FleetCore repository.

The following have already been completed:

- Project Foundation
- Prisma Configuration
- Company Model
- Role Model

Maintain the existing architecture, coding standards, Prisma conventions, and documentation style.

Do NOT recreate existing models.

====================================================
OBJECTIVE
====================================================

Implement ONLY the User model.

This specification establishes the application's identity entity.

Do NOT implement authentication.

Do NOT implement JWT.

Do NOT implement login.

Do NOT implement APIs.

Do NOT implement controllers.

Do NOT create migrations.

Do NOT create seed data.

====================================================
SOURCE OF TRUTH
====================================================

Use the FleetCore project documentation as the source of truth.

Follow existing schema conventions.

Reuse existing enums whenever applicable.

====================================================
MODEL DOCUMENTATION
====================================================

Document the model using Prisma documentation comments.

Use this layout.

/// --------------------------------------------
/// User
/// Represents an application user.
/// Users belong to a Company
/// and are assigned a Role.
/// --------------------------------------------

====================================================
FIELD ORDER
====================================================

Use this order.

1. Primary Key

2. Business Fields

3. Authentication Fields (storage only)

4. Foreign Keys

5. Relations

6. Audit Fields

7. Indexes

====================================================
TASK 1
CREATE USER MODEL
====================================================

Implement the User model.

Include all fields defined in the FleetCore documentation.

Typical fields include:

Identity

- id
- firstName
- lastName
- email
- phone

Authentication Storage

- passwordHash

Organization

- companyId
- roleId
- department
- designation

Profile

- avatarUrl

Account

- status
- emailVerified
- lastLogin

Audit

- createdAt
- updatedAt

====================================================
TASK 2
RELATIONSHIPS
====================================================

Implement relations.

User

belongs to

Company

User

belongs to

Role

Prepare future relations for

Driver Profile

Notifications

Created Records

Updated Records

Do NOT implement the dependent models.

====================================================
TASK 3
ENUMS
====================================================

Create only enums required by User.

Example

UserStatus

Reuse enums if already created.

Do not duplicate enums.

====================================================
TASK 4
CONSTRAINTS
====================================================

Implement

Unique email

Required Company

Required Role

Appropriate cascade behavior

====================================================
TASK 5
INDEXES
====================================================

Create indexes for

Unique

Email

Indexes

CompanyId

RoleId

Status

Department

CreatedAt

LastLogin

====================================================
TASK 6
DOCUMENTATION
====================================================

Update

docs/database/database-schema.md

Document

User model

Fields

Relationships

Indexes

Enums

====================================================
TASK 7
AI DEVELOPMENT LOG
====================================================

Append

SPEC-005

Status

Date

Commit

to

docs/AI-DEVELOPMENT-LOG.md

====================================================
TASK 8
PROMPT DOCUMENTATION
====================================================

Create

prompts/phase-1-foundation/SPEC-005-user-model.md

Store this COMPLETE specification.

Never summarize it.

====================================================
ARCHITECTURE RULE
====================================================

If implementation reveals a better identity model,

DO NOT modify the architecture.

Instead document the proposal in

docs/architecture/future-improvements.md

Include

- Title
- Reason
- Benefits
- Risks
- Recommended Future SPEC

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

Authentication

JWT

Refresh Tokens

Login

Password Reset

RBAC Middleware

REST APIs

Controllers

Services

Frontend

====================================================
GIT
====================================================

Commit

feat(database): add user model

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

- **Prisma Schema**: `User` model & `UserStatus` enum added to `backend/prisma/schema.prisma` with `Company` & `Role` relations.
- **Client Generation**: Prisma Client regenerated with `User` types.
- **Documentation**: Model schema documented in `docs/database/database-schema.md` and SPEC history updated in `docs/AI-DEVELOPMENT-LOG.md`.
- **Prompt Documentation**: Stored prompt specification in `prompts/phase-1-foundation/SPEC-005-user-model.md`.

---

## 📌 Notes

- SPEC-005 establishes the core identity entity (`User`) with multi-tenant company association (`companyId`) and RBAC role assignment (`roleId`).
