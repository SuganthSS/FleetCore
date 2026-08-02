# SPEC-081 — Dashboard Routes Layer

## Objective

Implement the Express routing layer for the Dashboard module.

---

## Files Created

backend/src/modules/dashboard/routes/dashboard.routes.ts
backend/src/modules/dashboard/routes/index.ts

## Files Updated

backend/src/modules/dashboard/index.ts
backend/src/index.ts
docs/backend/dashboard-module.md
docs/AI-DEVELOPMENT-LOG.md

---

## Base Route

Mounted under: `/api/v1/dashboard`

---

## Middleware Execution Order

```text
HTTP Request → authenticate() → authorize(...allowedRoles) → DashboardController handler
```

---

## Endpoint & RBAC Matrix

| HTTP Method | Path | Controller | Allowed Roles |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/dashboard` | `getDashboardOverview` | Super Admin, Company Admin, Fleet Manager, Dispatcher |

### Query Parameter & Scope Behavior
- **Super Admin**: `companyId` optional (omitted → global statistics; supplied → company specific statistics).
- **Company Admin / Fleet Manager / Dispatcher**: `companyId` strictly forced to `req.authenticatedUser.companyId` regardless of query parameter.

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
- `/api/v1/tracking`
- `/api/v1/notifications`
- `/api/v1/dashboard` ← **NEW**

---

## Git

git commit -m "feat(dashboard): add routes"
git push origin main
