# ====================================================
# FleetCore
# SPEC-018
# Initial Seed Data
# ====================================================

METADATA
----------------------------------------------------

SPEC ID:
SPEC-018

Phase:
Database Finalization

Module:
Database

Title:
Initial Seed Data

Dependencies:

- Initial Migration
- Prisma Client

Outputs:

- Prisma Seed Script
- Documentation
- AI Development Log
- Prompt Documentation

Forbidden:

- APIs
- Frontend
- Business CRUD
- Demo logistics data

====================================================
OBJECTIVE
====================================================

Create the initial database seed.

The seed must be idempotent.

Running it multiple times must not create duplicate records.

====================================================
TASK 1
CREATE SEED SCRIPT
====================================================

Implement Prisma seed support.

Create:

backend/prisma/seed.ts

Configure package.json so Prisma can execute the seed.

====================================================
TASK 2
SEED SYSTEM DATA
====================================================

Seed only foundational data.

Create default Roles:

- Super Admin
- Company Admin
- Fleet Manager
- Dispatcher
- Driver

Create one Company:

FleetCore Demo Company

Create one administrator User:

- Linked to the seeded Company
- Assigned the Super Admin role
- Password stored as a bcrypt hash
- Email verified

Seed the SystemHealthAnchor if required.

Do NOT create:

Vehicles

Drivers

Customers

Shipments

Trips

Fuel Records

Maintenance Records

Notifications

====================================================
TASK 3
DOCUMENTATION
====================================================

Update:

docs/database/database-migrations.md

Document:

- Seed process
- Seeded entities
- Default credentials (development only)

====================================================
TASK 4
PROMPT DOCUMENTATION
====================================================

Create:

prompts/phase-4-finalization/SPEC-018-seed-data.md

Store this COMPLETE specification.

====================================================
VALIDATION
====================================================

Run:

prisma db seed

Verify:

- No duplicate records
- Foreign keys valid
- Seed completes successfully

Run:

Backend build

Frontend build

Backend lint

Frontend lint

====================================================
ACCEPTANCE CRITERIA
====================================================

✓ Seed runs successfully

✓ Seed is idempotent

✓ Password is hashed

✓ Roles are created

✓ Company is created

✓ Administrator user is created

✓ Prisma Client works

====================================================
GIT
====================================================

Commit:

feat(database): add initial seed data

Push to GitHub.

====================================================
FINAL SUMMARY
====================================================

Provide:

Seeded Records

Validation Results

Files Modified

Commit Hash

Push Status
