# FleetCore

## SPEC-002C: Fix ML Package Imports

- **Title**: Fix ML Package Imports
- **Version**: 1.0.0
- **Date**: 2026-08-02
- **Phase**: Phase 1 - Foundation
- **Objective**: Fix Python module import resolution during `pytest` execution in GitHub Actions by initializing `__init__.py` files across all ML package directories and configuring `pytest.ini` with `pythonpath = .`.

---

## 📝 Complete Implementation Prompt

```text
# FleetCore — SPEC-002C
## Fix ML Package Imports

You are continuing development of the existing FleetCore repository.

Do NOT implement ML features.

Do NOT modify FastAPI business logic.

Your ONLY responsibility is fixing the Python package structure so GitHub Actions can execute the ML test suite correctly.

====================================================
OBJECTIVE
====================================================

The ML CI currently fails with

ModuleNotFoundError: No module named 'api'

This is a Python package/import issue.

Fix the package structure properly.

Do NOT use temporary hacks.

Do NOT modify unrelated code.

====================================================
TASK 1
PACKAGE STRUCTURE
====================================================

Inspect the ML project.

Ensure every Python package directory contains

__init__.py

Examples

ml/api/

ml/tests/

Any package directory missing __init__.py should receive one.

====================================================
TASK 2
IMPORT PATHS
====================================================

Use a proper package structure.

Avoid manipulating sys.path inside tests unless absolutely necessary.

Prefer package-based imports.

====================================================
TASK 3
PYTEST CONFIGURATION
====================================================

If required,

configure pytest correctly.

Use one of the following production approaches:

- pyproject.toml

or

- pytest.ini

Configure the project root correctly.

Do not use fragile import hacks.

====================================================
TASK 4
VERIFY
====================================================

Run

pytest

Ensure

tests/test_health.py

passes successfully.

====================================================
TASK 5
DOCUMENTATION
====================================================

Update

docs/AI-DEVELOPMENT-LOG.md

Append

SPEC-002C

====================================================
TASK 6
PROMPT DOCUMENTATION
====================================================

Create

prompts/phase-1-foundation/SPEC-002C-ml-package-import-fix.md

Store this COMPLETE specification.

====================================================
QUALITY
====================================================

No feature implementation.

No API changes.

No ML model changes.

Only package/import fixes.

====================================================
VALIDATION
====================================================

Verify

pytest

passes.

Verify

GitHub Actions

will resolve package imports correctly.

====================================================
GIT
====================================================

Commit

fix(ml): resolve python package imports

Push to GitHub.

====================================================
FINAL SUMMARY
====================================================

Provide

Root Cause

Files Modified

How package imports were fixed

pytest status

GitHub Actions expectation

Commit Hash

Push Status
```

---

## 🎯 Expected Deliverables

- **Package Init Files**: Created `__init__.py` files in `ml/tests/`, `ml/datasets/`, `ml/models/`, `ml/training/`, and `ml/utils/`.
- **Pytest Configuration**: Created `ml/pytest.ini` with `pythonpath = .` to configure root pythonpath for pytest invocations.
- **Documentation**: Appended SPEC-002C entry to `docs/AI-DEVELOPMENT-LOG.md`.
- **Prompt Documentation**: Stored `prompts/phase-1-foundation/SPEC-002C-ml-package-import-fix.md`.

---

## 📌 Notes

- SPEC-002C cleanly resolves Python module resolution without using `sys.path` hacks.
