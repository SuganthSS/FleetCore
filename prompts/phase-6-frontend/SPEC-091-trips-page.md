# SPEC-091: Trips Management Page Prompt Documentation

## Context
This document logs the development actions for SPEC-091, introducing the Trips Management Module.

## Goals & Objectives
- Build a fully integrated Trips Management module.
- Manage CRUD calls with the backend: `/api/v1/trips`.
- Handle statuses: `SCHEDULED`, `DISPATCHED`, `IN_TRANSIT`, `PAUSED`, `COMPLETED`, `CANCELLED`, and `FAILED`.
- Integrate relational selects for vehicle, driver, route, and shipment.
- Enforce clean multi-tenant isolation through automatic companyId binding.

## Implementation Details
1. **Frontend Service**: Created `trip.service.ts` managing endpoints.
2. **Badge Mapping**: Developed `TripStatusBadge` mapped to custom colors.
3. **Form Formatting**: Formatted inputs to use timezone-offset datetime-local strings and parse them back to clean ISO formats before mutation.
4. **UX Assets**: Added `TripSkeleton` loading bars and side drawer inspection logs.
