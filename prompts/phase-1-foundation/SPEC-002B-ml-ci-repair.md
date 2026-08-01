# FleetCore

## SPEC-002B: ML Engine CI Repair

- **Title**: ML Engine CI Repair
- **Version**: 1.0.0
- **Date**: 2026-08-02
- **Phase**: Phase 1 - Foundation
- **Objective**: Fix the failing ML Engine GitHub Actions workflow by providing explicit `cache-dependency-path` for Python dependencies and installing `httpx` required by FastAPI's `TestClient`.

---

## 📝 Complete Implementation Prompt

```text
# FleetCore — SPEC-002B
## ML Engine CI Repair

You are continuing development of the FleetCore project.

Do NOT implement any ML features.

Do NOT create APIs.

Do NOT modify backend or frontend code.

Your ONLY responsibility is fixing the failing ML GitHub Actions workflow.

====================================================
OBJECTIVE
====================================================

The Frontend CI passes.

The Backend CI passes.

Only the ML Engine CI is failing.

Investigate the exact root cause.

Fix ONLY the CI configuration or project setup required for the ML service.

Do not implement application features.

====================================================
TASK 1
INVESTIGATE
====================================================

Inspect the failed ML GitHub Actions workflow.

Identify the exact failing step.

Examples

- Python version

- pip install

- requirements.txt

- Working directory

- Missing file

- FastAPI import

- Uvicorn

- Cache

- Build command

Do NOT guess.

Find the actual failure.

====================================================
TASK 2
FIX
====================================================

Apply the minimum fix required.

Examples

Correct workflow path

Correct Python version

Correct requirements installation

Correct cache configuration

Correct working directory

Correct build command

Correct lint command

Only fix the actual issue.

====================================================
TASK 3
VALIDATE
====================================================

Verify locally

Python environment

requirements install

FastAPI imports

Basic startup

If lint exists

Run lint.

====================================================
TASK 4
DOCUMENTATION
====================================================

Update

docs/AI-DEVELOPMENT-LOG.md

Append

SPEC-002B

Title

Status

Commit

Date

====================================================
TASK 5
PROMPT DOCUMENTATION
====================================================

Create

prompts/phase-1-foundation/SPEC-002B-ml-ci-repair.md

Store this COMPLETE specification.

====================================================
QUALITY
====================================================

No feature implementation.

No ML models.

No API endpoints.

No business logic.

Only CI repair.

====================================================
VALIDATION
====================================================

Ensure

Frontend CI passes

Backend CI passes

ML CI passes

Repository status should be completely green.

====================================================
GIT
====================================================

Commit

fix(ci): repair ml engine pipeline

Push to GitHub.

====================================================
FINAL SUMMARY
====================================================

Provide

Root Cause

Files Modified

Why it failed

How it was fixed

Validation Results

Commit Hash

Push Status

State whether all GitHub Actions are now expected to pass.
```

---

## 🎯 Expected Deliverables

- **Workflow Fix**: Updated `ml-ci` job configuration in `.github/workflows/ci.yml`.
- **Documentation**: Appended SPEC-002B entry to `docs/AI-DEVELOPMENT-LOG.md`.
- **Prompt Specification**: Created `prompts/phase-1-foundation/SPEC-002B-ml-ci-repair.md`.

---

## 📌 Notes

- SPEC-002B ensures all 3 microservices (Frontend, Backend, ML Engine) have fully passing GitHub Actions pipelines.
