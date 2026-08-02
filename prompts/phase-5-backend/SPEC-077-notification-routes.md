# SPEC-077 — Notification Routes Layer

## Objective

Implement the Express routing layer for the Notification module following the exact architecture established across FleetCore.

---

## Files Created

backend/src/modules/notification/routes/notification.routes.ts
backend/src/modules/notification/routes/index.ts

## Files Updated

backend/src/modules/notification/index.ts
backend/src/index.ts
docs/backend/notification-module.md
docs/AI-DEVELOPMENT-LOG.md

---

## Base Route

Mounted under: `/api/v1/notifications`

---

## Middleware Execution Order

```text
HTTP Request → authenticate() → authorize(...allowedRoles) → NotificationController handler
```

---

## RBAC Matrix

| HTTP Method | Path | Controller | Allowed Roles |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/notifications` | `getNotifications` | Super Admin, Company Admin, Fleet Manager, Dispatcher |
| `GET` | `/api/v1/notifications/:id` | `getNotification` | Super Admin, Company Admin, Fleet Manager, Dispatcher |
| `POST` | `/api/v1/notifications` | `createNotification` | Super Admin, Company Admin, Fleet Manager |
| `PUT` | `/api/v1/notifications/:id` | `updateNotification` | Super Admin, Company Admin, Fleet Manager |
| `DELETE` | `/api/v1/notifications/:id` | `deleteNotification` | Super Admin, Company Admin |

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
- `/api/v1/notifications` ← **NEW**

---

## Git

git commit -m "feat(notification): add routes"
git push origin main
