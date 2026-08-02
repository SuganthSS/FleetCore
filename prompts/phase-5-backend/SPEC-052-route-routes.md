# SPEC-052 — Route Routes Layer

## Objective

Implement the Express routing layer for the Route module following the exact architecture and conventions used by the Vehicle, Driver, Customer, and Shipment modules.

---

## Files Created

backend/src/modules/route/routes/route.routes.ts
backend/src/modules/route/routes/index.ts

## Files Updated

backend/src/modules/route/index.ts
backend/src/index.ts
docs/backend/route-module.md
docs/AI-DEVELOPMENT-LOG.md

---

## Base Route

Mounted under: `/api/v1/routes`

---

## Middleware Execution Order

```text
HTTP Request → authenticate() → authorize(...allowedRoles) → RouteController handler
```

---

## RBAC Matrix

| HTTP Method | Path | Controller | Allowed Roles |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/routes` | `getRoutes` | Super Admin, Company Admin, Fleet Manager, Dispatcher |
| `GET` | `/api/v1/routes/:id` | `getRoute` | Super Admin, Company Admin, Fleet Manager, Dispatcher |
| `POST` | `/api/v1/routes` | `createRoute` | Super Admin, Company Admin, Fleet Manager |
| `PUT` | `/api/v1/routes/:id` | `updateRoute` | Super Admin, Company Admin, Fleet Manager |
| `DELETE` | `/api/v1/routes/:id` | `deleteRoute` | Super Admin, Company Admin |

---

## Application Route Hierarchy

- `/api/v1`
- `/api/v1/auth`
- `/api/v1/vehicles`
- `/api/v1/drivers`
- `/api/v1/customers`
- `/api/v1/shipments`
- `/api/v1/routes` ← **NEW**

---

## Git

git commit -m "feat(route): add routes"
git push origin main
