# SPEC-092: Fuel Management Page Prompt Documentation

## Context
This document logs the development actions for SPEC-092, introducing the Fuel Management Module.

## Goals & Objectives
- Build a fully integrated Fuel Management module.
- Manage CRUD calls with the backend: `/api/v1/fuel`.
- Support status logs, refueling quantities, pricing, and odometer readings.
- Integrate relational selects for vehicle assets and trip dispatches.
- Enforce clean multi-tenant isolation through automatic companyId binding.

## Implementation Details
1. **Frontend Service**: Created `fuel.service.ts` managing endpoints.
2. **Badge Mapping**: Developed `FuelTable` listing complete refuel metrics.
3. **Form Formatting**: Formatted inputs to use timezone-offset datetime-local strings and parse them back to clean ISO formats before mutation.
4. **Auto Calculations**: Implemented auto-calculating total cost based on quantity and price per unit to improve UX.
5. **UX Assets**: Added `FuelSkeleton` loading bars and side drawer inspection logs.
