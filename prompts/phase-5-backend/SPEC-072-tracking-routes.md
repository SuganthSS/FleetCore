# SPEC-072 — Tracking Routes Layer

## Objective

Implement the Express routing layer for the Tracking module following the exact architecture established across FleetCore.

---

## Files Created

backend/src/modules/tracking/routes/tracking.routes.ts
backend/src/modules/tracking/routes/index.ts

## Files Updated

backend/src/modules/tracking/index.ts
backend/src/index.ts
docs/backend/tracking-module.md
docs/AI-DEVELOPMENT-LOG.md

---

## Base Route

Mounted under: `/api/v1/tracking`

---

## Middleware Execution Order

```text
HTTP Request → authenticate() → authorize(...allowedRoles) → TrackingController handler
```

---

## RBAC Matrix

| HTTP Method | Path | Controller | Allowed Roles |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/tracking` | `getTrackingHistory` | Super Admin, Company Admin, Fleet Manager, Dispatcher |
| `GET` | `/api/v1/tracking/:id` | `getTracking` | Super Admin, Company Admin, Fleet Manager, Dispatcher |
| `POST` | `/api/v1/tracking` | `createTracking` | Super Admin, Company Admin, Fleet Manager |
| `PUT` | `/api/v1/tracking/:id` | `updateTracking` | Super Admin, Company Admin, Fleet Manager |
| `DELETE` | `/api/v1/tracking/:id` | `deleteTracking` | Super Admin, Company Admin |

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
- `/api/v1/maintenance`
- `/api/v1/tracking` ← **NEW**

---

## Git

git commit -m "feat(tracking): add routes"
git push origin main
