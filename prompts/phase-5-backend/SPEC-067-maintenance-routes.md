# SPEC-067 — Maintenance Routes Layer

## Objective

Implement the Express routing layer for the Maintenance module following the exact architecture established across FleetCore.

---

## Files Created

backend/src/modules/maintenance/routes/maintenance.routes.ts
backend/src/modules/maintenance/routes/index.ts

## Files Updated

backend/src/modules/maintenance/index.ts
backend/src/index.ts
docs/backend/maintenance-module.md
docs/AI-DEVELOPMENT-LOG.md

---

## Base Route

Mounted under: `/api/v1/maintenance`

---

## Middleware Execution Order

```text
HTTP Request → authenticate() → authorize(...allowedRoles) → MaintenanceController handler
```

---

## RBAC Matrix

| HTTP Method | Path | Controller | Allowed Roles |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/maintenance` | `getMaintenances` | Super Admin, Company Admin, Fleet Manager, Dispatcher |
| `GET` | `/api/v1/maintenance/:id` | `getMaintenance` | Super Admin, Company Admin, Fleet Manager, Dispatcher |
| `POST` | `/api/v1/maintenance` | `createMaintenance` | Super Admin, Company Admin, Fleet Manager |
| `PUT` | `/api/v1/maintenance/:id` | `updateMaintenance` | Super Admin, Company Admin, Fleet Manager |
| `DELETE` | `/api/v1/maintenance/:id` | `deleteMaintenance` | Super Admin, Company Admin |

---

## Application Route Hierarchy

- `/api/v1`
- `/api/v1/auth`
- `/api/v1/vehicles`
- `/api/v1/drivers`
- `/api/v1/customers`
- `/api/v1/shipments`
- `/api/v1/routes`
- `/api/v1/trips`
- `/api/v1/fuel`
- `/api/v1/maintenance` ← **NEW**

---

## Git

git commit -m "feat(maintenance): add routes"
git push origin main
