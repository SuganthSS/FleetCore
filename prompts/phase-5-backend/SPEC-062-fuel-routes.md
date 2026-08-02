# SPEC-062 — Fuel Routes Layer

## Objective

Implement the Express routing layer for the Fuel module following the exact architecture established across FleetCore.

---

## Files Created

backend/src/modules/fuel/routes/fuel.routes.ts
backend/src/modules/fuel/routes/index.ts

## Files Updated

backend/src/modules/fuel/index.ts
backend/src/index.ts
docs/backend/fuel-module.md
docs/AI-DEVELOPMENT-LOG.md

---

## Base Route

Mounted under: `/api/v1/fuel`

---

## Middleware Execution Order

```text
HTTP Request → authenticate() → authorize(...allowedRoles) → FuelController handler
```

---

## RBAC Matrix

| HTTP Method | Path | Controller | Allowed Roles |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/fuel` | `getFuelRecords` | Super Admin, Company Admin, Fleet Manager, Dispatcher |
| `GET` | `/api/v1/fuel/:id` | `getFuelRecord` | Super Admin, Company Admin, Fleet Manager, Dispatcher |
| `POST` | `/api/v1/fuel` | `createFuelRecord` | Super Admin, Company Admin, Fleet Manager |
| `PUT` | `/api/v1/fuel/:id` | `updateFuelRecord` | Super Admin, Company Admin, Fleet Manager |
| `DELETE` | `/api/v1/fuel/:id` | `deleteFuelRecord` | Super Admin, Company Admin |

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
- `/api/v1/fuel` ← **NEW**

---

## Git

git commit -m "feat(fuel): add routes"
git push origin main
