# SPEC-075 — Notification Service Layer

## Objective

Implement the framework-independent business logic layer for the Notification module.

---

## Files Created

backend/src/modules/notification/services/notification.service.ts
backend/src/modules/notification/services/index.ts

## Files Updated

backend/src/modules/notification/index.ts
docs/backend/notification-module.md
docs/AI-DEVELOPMENT-LOG.md

---

## Service Methods Implemented

1. `createNotification(input)`
   - Verifies Company and User existence & company scoping (`user.companyId === companyId`).
   - Creates Notification record.
   - Returns created record with `user` and `company` relations included.

2. `getNotificationById(id, companyId?)`
   - Retrieve single `Notification` entry by UUID with full relations.
   - Enforce tenant isolation.

3. `getNotifications(query, companyId?)`
   - Pagination with metadata (`items`, `total`, `page`, `limit`, `totalPages`).
   - Filters: `userId`, `companyId`, `type`, `priority`, `isRead`.
   - Search: `title`, `message`.
   - Sorting: `createdAt`, `readAt`, `priority`.

4. `updateNotification(id, input, companyId?)`
   - Verify existence & tenant isolation.
   - Re-verify User company alignment if `userId` is updated.
   - Handles `isRead` and `readAt` synchronization logic.
   - Return updated record with relations.

5. `deleteNotification(id, companyId?)`
   - Verify existence & tenant isolation.
   - Hard delete.

---

## Git

git commit -m "feat(notification): add service layer"
git push origin main
