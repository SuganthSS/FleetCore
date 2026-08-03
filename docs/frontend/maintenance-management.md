# Maintenance Management Module (Stitch MCP Rebuild)

## Overview
The Maintenance Management module provides work order scheduling, service bay tracking, predictive failure diagnostics, technician assignment, and repair cost accounting across the fleet.

## Key Features
- **Work Order Management**: Create, edit, inspect, and complete maintenance work orders with full service sign-off.
- **Service Schedule & Telemetry**: Track scheduled dates, overdue servicing, completed repairs, and technician vendor assignments.
- **KPICards Telemetry**: 6 interactive KPI cards (*Total Work Orders, Scheduled, In Progress, Completed, Overdue, Critical/Emergency*) with list filtering.
- **Maintenance Details Page**: Deep-dive view including vehicle details, technician info, parts replacement log, cost accounting, and activity timeline.
- **Dual Presentation Views**: Seamlessly toggle between compact data tables and visual cards.
- **Export Capabilities**: CSV export for work order schedules and maintenance audit logs.

## Technical Architecture
- **Frontend Components**: Located under `frontend/src/components/maintenance/`.
- **State Management**: Powered by `@tanstack/react-query` for query fetching, mutations, optimistic state updates, and cache invalidation.
- **Validation**: Strict schema validation using `zod` and `react-hook-form`.
