# FleetCore

## SPEC-002: Prisma Configuration & Database Connection

- **Title**: Prisma Configuration & Database Connection
- **Version**: 1.0.0
- **Date**: 2026-08-02
- **Phase**: Phase 1 - Foundation
- **Objective**: Configure the Neon PostgreSQL database foundation, Prisma ORM schema direct/pooled connection strings, database logging utility, singleton client instance, health check module, and database documentation without business logic, models, or migrations.

---

## 📝 Complete Implementation Prompt

```text
# FleetCore — SPEC-002
## Prisma Configuration & Database Connection

You are continuing development of the existing FleetCore project.

The project foundation has already been completed.

Do NOT recreate the project.

Maintain the existing architecture, coding standards, and technology stack.

====================================================
OBJECTIVE
====================================================

Configure the database foundation for FleetCore.

This specification is ONLY responsible for:

- Prisma configuration
- PostgreSQL connection
- Database utilities
- Environment configuration

Do NOT create database models.

Do NOT create migrations.

Do NOT create seed files.

Do NOT create APIs.

Do NOT create authentication.

====================================================
TECH STACK
====================================================

Database

- Neon PostgreSQL

ORM

- Prisma

Language

- TypeScript

====================================================
TASK 1
ENVIRONMENT
====================================================

Configure backend environment variables.

Create or update

.env.example

Include

DATABASE_URL

DATABASE_DIRECT_URL

Use placeholders only.

Do not expose secrets.

====================================================
TASK 2
PRISMA CONFIGURATION
====================================================

Configure Prisma.

Verify

schema.prisma

Datasource

Generator

Correct provider

Correct environment variables

Generate Prisma Client.

====================================================
TASK 3
DATABASE CONNECTION
====================================================

Create a reusable Prisma singleton.

Prevent multiple Prisma instances during development.

Use Prisma best practices.

====================================================
TASK 4
DATABASE MODULE
====================================================

Create

backend/src/config/database.ts

Responsibilities

- Initialize Prisma
- Export singleton
- Handle graceful shutdown
- Log successful connection
- Log failures

====================================================
TASK 5
HEALTH CHECK
====================================================

Create

backend/src/utils/database-health.ts

Provide a reusable function that verifies database connectivity using Prisma.

No API endpoint yet.

====================================================
TASK 6
DATABASE LOGGER
====================================================

Create reusable database logging utility.

Log

- Connected

- Disconnected

- Retry

- Failure

Follow existing Winston configuration.

====================================================
TASK 7
DOCUMENTATION
====================================================

Create

docs/database/

Create

database-configuration.md

Include

Database architecture

Connection flow

Environment variables

Prisma structure

Future migration strategy

====================================================
TASK 8
AI DEVELOPMENT LOG
====================================================

Create (if it does not exist)

docs/AI-DEVELOPMENT-LOG.md

Append

SPEC-002

Title

Status

Date

Commit

====================================================
TASK 9
PROMPT DOCUMENTATION
====================================================

Create

prompts/phase-1-foundation/SPEC-002-prisma-configuration.md

Store this COMPLETE specification.

Do not summarize.

====================================================
QUALITY
====================================================

Everything must compile.

Prisma Client must generate successfully.

Zero TypeScript errors.

Zero ESLint errors.

No warnings.

====================================================
DO NOT
====================================================

Do NOT create

Models

Enums

Relations

Migrations

Seed

REST APIs

Controllers

Business Logic

====================================================
VALIDATION
====================================================

Run

Prisma Generate

Type Check

Lint

Build

Fix every issue.

====================================================
GIT
====================================================

Commit

feat(database): configure prisma foundation

Push to GitHub.

====================================================
FINAL SUMMARY
====================================================

Provide

Files Created

Files Modified

Prisma Status

Database Connection Status

Validation Results

Commit Hash

Push Status
```

---

## 🎯 Expected Deliverables

- **Prisma Datasource**: Updated `schema.prisma` with `url` and `directUrl`.
- **Database Singleton**: `backend/src/config/database.ts` exporting a reusable `prisma` instance, process signal handlers (`SIGINT`/`SIGTERM`), and log triggers.
- **Health Check Utility**: `backend/src/utils/database-health.ts` exposing `checkDatabaseHealth()`.
- **Logger Utility**: `logDatabaseEvent` function in `backend/src/utils/logger.ts`.
- **Documentation**: Architectural overview in `docs/database/database-configuration.md` and SPEC history in `docs/AI-DEVELOPMENT-LOG.md`.

---

## 📌 Notes

- SPEC-002 configures the complete database connectivity foundation without creating any business domain models, seeds, migrations, or REST controllers.
