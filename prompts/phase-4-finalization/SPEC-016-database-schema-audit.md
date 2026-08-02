# ====================================================
# FleetCore
# SPEC-016
# Database Schema Audit
# ====================================================

METADATA
----------------------------------------------------

SPEC ID:
SPEC-016

Phase:
Database Finalization

Module:
Quality Assurance

Title:
Database Schema Audit

Objective:
Audit the completed Prisma schema for consistency and quality before generating the initial migration.

IMPORTANT

This specification is a REVIEW.

It must NOT redesign the architecture.

It must NOT introduce new features.

It must NOT modify approved models unless a clear inconsistency or implementation defect is found.

====================================================
TASKS
====================================================

Review the entire Prisma schema.

Verify:

1. Naming consistency
   - Models
   - Fields
   - Relations
   - Enums

2. Timestamp consistency
   - createdAt
   - updatedAt

3. Foreign key consistency

4. Cascade rule consistency

5. Nullable field consistency

6. Enum reuse

7. Duplicate indexes

8. Missing indexes

9. Relation naming consistency

10. Documentation completeness

11. Prisma formatting

12. Schema validation

====================================================
OUTPUT
====================================================

Produce a report containing:

✓ Items reviewed

✓ Issues found

✓ Severity

- Critical

- Warning

- Suggestion

For each issue include

- Description

- Recommendation

- Whether approval is required before changing

====================================================
IMPLEMENTATION RULE
====================================================

If NO issues are found

DO NOT modify the schema.

Instead report

Database Schema Audit Passed

====================================================
DOCUMENTATION
====================================================

Create

docs/database/database-schema-audit.md

Update

docs/AI-DEVELOPMENT-LOG.md

Create

prompts/phase-4-finalization/SPEC-016-database-schema-audit.md

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

====================================================
GIT
====================================================

Commit

docs(database): complete schema audit

Push to GitHub.

====================================================
FINAL SUMMARY
====================================================

Provide

Audit Results

Issues Found

Files Modified

Validation Results

Commit Hash

Push Status
