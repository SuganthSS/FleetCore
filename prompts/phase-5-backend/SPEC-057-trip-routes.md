# SPEC-057 — Trip Routes Layer

## Objective

Implement the Express routing layer for the Trip module following the exact architecture and conventions established across FleetCore.

---

## Files Created

backend/src/modules/trip/routes/trip.routes.ts
backend/src/modules/trip/routes/index.ts

## Files Updated

backend/src/modules/trip/index.ts
backend/src/index.ts
docs/backend/trip-module.md
docs/AI-DEVELOPMENT-LOG.md

---

## Base Route

Mounted under: `/api/v1/trips`

---

## Middleware Execution Order

```text
HTTP Request → authenticate() → authorize(...allowedRoles) → TripController handler
```

---

## RBAC Matrix

| HTTP Method | Path | Controller | Allowed Roles |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/trips` | `getTrips` | Super Admin, Company Admin, Fleet Manager, Dispatcher |
| `GET` | `/api/v1/trips/:id` | `getTrip` | Super Admin, Company Admin, Fleet Manager, Dispatcher |
| `POST` | `/api/v1/trips` | `createTrip` | Super Admin, Company Admin, Fleet Manager |
| `PUT` | `/api/v1/trips/:id` | `updateTrip` | Super Admin, Company Admin, Fleet Manager |
| `DELETE` | `/api/v1/trips/:id` | `deleteTrip` | Super Admin, Company Admin |

---

## Application Route Hierarchy

- `/api/v1`
- `/api/v1/auth`
- `/api/v1/vehicles`
- `/api/v1/drivers`
- `/api/v1/customers`
- `/api/v1/shipments`
- `/api/v1/routes`
- `/api/v1/trips` ← **NEW**

---

## Git

git commit -m "feat(trip): add routes"
git push origin main
