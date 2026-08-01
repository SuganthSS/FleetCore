# FleetCore

## SPEC-002A: GitHub Actions CI Investigation & Repair

- **Title**: GitHub Actions CI Investigation & Repair
- **Version**: 1.0.0
- **Date**: 2026-08-02
- **Phase**: Phase 1 - Foundation
- **Objective**: Investigate, identify, and resolve the failing GitHub Actions CI pipeline step caused by invalid `cache-dependency-path` references (`package-json.lock` instead of `package-lock.json`).

---

## 📝 Complete Implementation Prompt

```text
# FleetCore — SPEC-002A
## GitHub Actions CI Investigation & Repair

You are continuing development of the existing FleetCore repository.

Do NOT implement any new features.

Do NOT modify the database schema.

Do NOT modify frontend or backend business logic.

Your ONLY responsibility is to restore a healthy CI pipeline.

====================================================
OBJECTIVE
====================================================

The latest GitHub commit shows a failed GitHub Actions workflow.

Investigate the failure.

Identify the root cause.

Apply the minimum required fix.

Verify the workflow passes successfully.

Do NOT make unrelated code changes.

====================================================
TASK 1
INVESTIGATE
====================================================

Inspect the GitHub Actions workflow.

Determine exactly which job failed.

Examples

- Install
- Build
- Lint
- Type Check
- Prisma Generate
- Tests

Do NOT guess.

Identify the actual failing step.

====================================================
TASK 2
ROOT CAUSE
====================================================

Determine the exact reason.

Possible examples

- Wrong working directory

- Missing environment variables

- Prisma Client not generated

- Incorrect package manager command

- Missing dependency

- Build configuration issue

- Lint configuration issue

- TypeScript configuration issue

- GitHub Actions configuration issue

Only fix the real cause.

====================================================
TASK 3
FIX
====================================================

Apply the smallest possible fix.

Do NOT refactor.

Do NOT improve unrelated code.

Do NOT modify architecture.

Only resolve the CI failure.

====================================================
TASK 4
VERIFY
====================================================

Verify locally

- Frontend Build

- Backend Build

- Prisma Generate

- Type Check

- Lint

If tests exist

Run them.

====================================================
TASK 5
GITHUB ACTIONS
====================================================

Verify the GitHub Actions workflow is now compatible.

Ensure

- Correct working directories

- Correct Node versions

- Correct install commands

- Correct build commands

- Correct Prisma generation order

- Correct caching (if configured)

====================================================
TASK 6
DOCUMENTATION
====================================================

Update

docs/AI-DEVELOPMENT-LOG.md

Append

SPEC-002A

Title

Status

Commit

Date

====================================================
TASK 7
PROMPT DOCUMENTATION
====================================================

Create

prompts/phase-1-foundation/SPEC-002A-ci-repair.md

Store this COMPLETE specification.

Do not summarize.

====================================================
QUALITY
====================================================

No unnecessary code changes.

No feature implementation.

No architecture changes.

Only CI repair.

====================================================
VALIDATION
====================================================

Run

Build

Lint

Type Check

Prisma Generate

Confirm everything succeeds.

====================================================
GIT
====================================================

Commit

fix(ci): repair GitHub Actions pipeline

Push to GitHub.

====================================================
FINAL SUMMARY
====================================================

Provide

Root Cause

Files Modified

Why the failure occurred

How it was fixed

Validation Results

Commit Hash

Push Status

State whether the GitHub Actions workflow is now expected to pass.
```

---

## 🎯 Expected Deliverables

- **Workflow Fix**: Fixed `cache-dependency-path` typos in `.github/workflows/ci.yml`.
- **Documentation**: Appended SPEC-002A to `docs/AI-DEVELOPMENT-LOG.md`.
- **Prompt Documentation**: Stored `prompts/phase-1-foundation/SPEC-002A-ci-repair.md`.

---

## 📌 Notes

- SPEC-002A is an infrastructure repair specification focused solely on restoring GitHub Actions workflow health without altering any project dependencies or application code.
