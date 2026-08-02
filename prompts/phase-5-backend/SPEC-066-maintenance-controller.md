# SPEC-066 — Maintenance Controller Layer

## Objective

Implement the HTTP Controller layer for the Maintenance module.

---

## Files Created

backend/src/modules/maintenance/controllers/maintenance.controller.ts
backend/src/modules/maintenance/controllers/index.ts

## Files Updated

backend/src/modules/maintenance/index.ts
docs/backend/maintenance-module.md
docs/AI-DEVELOPMENT-LOG.md

---

## Controller Methods Implemented

1. `createMaintenance(req, res)`
   - Validate body using `createMaintenanceSchema`
   - Delegate to `maintenanceService.createMaintenance()`
   - Return 201 Created `{ success: true, message, data }`

2. `getMaintenance(req, res)`
   - Validate params using `maintenanceIdParamSchema`
   - Extract authenticated user's `companyId`
   - Delegate to `maintenanceService.getMaintenanceById(id, companyId)`
   - Return 200 OK `{ success: true, data }`

3. `getMaintenances(req, res)`
   - Validate query using `maintenanceQuerySchema`
   - Extract authenticated user's `companyId`
   - Delegate to `maintenanceService.getMaintenances(query, companyId)`
   - Return 200 OK `{ success: true, data: { items, total, page, limit, totalPages } }`

4. `updateMaintenance(req, res)`
   - Validate params and body
   - Extract `companyId`
   - Delegate to `maintenanceService.updateMaintenance(id, input, companyId)`
   - Return 200 OK `{ success: true, message, data }`

5. `deleteMaintenance(req, res)`
   - Validate params
   - Extract `companyId`
   - Delegate to `maintenanceService.deleteMaintenance(id, companyId)`
   - Return 200 OK `{ success: true, message }`

---

## Error Handling & Mapping

- 400 Bad Request on Zod validation failure
- 404 Not Found on missing maintenance record/vehicle/driver/company/cross-tenant access
- 500 Internal Server Error (Sanitized error message without stack traces or SQL details)

---

## Git

git commit -m "feat(maintenance): add controller layer"
git push origin main
