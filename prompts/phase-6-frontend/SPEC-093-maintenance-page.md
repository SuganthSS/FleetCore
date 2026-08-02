# SPEC-093: Maintenance Management Page Prompt Documentation

## Context
This document logs the development actions for SPEC-093, introducing the Maintenance Management Module.

## Goals & Objectives
- Build a fully integrated Maintenance Management module.
- Manage CRUD calls with the backend: `/api/v1/maintenance`.
- Support status badges, maintenance type badges, cost mappings, and timeline records.
- Integrate relational selects for vehicle assets and drivers/technicians.
- Enforce clean multi-tenant isolation through automatic companyId binding.

## Implementation Details
1. **Frontend Service**: Created `maintenance.service.ts` managing endpoints.
2. **Badge Mapping**: Developed `MaintenanceStatusBadge` and `MaintenanceTypeBadge` to render clean state metrics.
3. **Form Formatting**: Formatted inputs to use timezone-offset datetime-local strings and parse them back to clean ISO formats before mutation.
4. **UX Assets**: Added `MaintenanceSkeleton` loading bars and side drawer inspection logs.
