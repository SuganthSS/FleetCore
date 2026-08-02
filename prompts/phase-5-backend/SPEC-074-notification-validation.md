# SPEC-074 — Notification Validation Layer

## Objective

Implement the validation layer for the Notification module using Zod.

---

## Schemas Implemented

### createNotificationSchema
Fields: companyId (required UUID), userId (required UUID), title (required max 150), message (required max 1000), type (Prisma NotificationType enum, default SYSTEM), priority (Prisma NotificationPriority enum, default MEDIUM), isRead (optional boolean), readAt (optional ISO datetime), metadata (optional record).

### updateNotificationSchema
Derived using createNotificationSchema.partial()

### notificationIdParamSchema
id — UUID

### notificationQuerySchema
page (default 1), limit (default 10, max 100), search, userId, companyId, type, priority, isRead, sortBy (createdAt|readAt|priority), sortOrder (asc|desc)

---

## Inferred Types

CreateNotificationInput, UpdateNotificationInput, NotificationIdInput, NotificationQueryInput

---

## Git

git commit -m "feat(notification): add validation layer"
git push origin main
