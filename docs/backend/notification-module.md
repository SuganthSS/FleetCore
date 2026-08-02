# FleetCore Notification Module Documentation

**Module**: Notifications (`backend/src/modules/notification`)  
**Phase**: Phase 5 - Backend Fleet Management  
**Status**: Validation Layer Implemented  

---

## 📐 Validation Schemas (`validators/notification.validator.ts`)

The Notification validation layer utilizes **Zod** to validate incoming HTTP request payloads, path parameters, and query parameters before reaching controllers or services.

### 1. `createNotificationSchema`
Validates requests for creating a new notification history record.

| Field | Type | Validation Rules | Error / Notes |
| :--- | :--- | :--- | :--- |
| `companyId` | String | Required, valid UUID | Parent Company UUID |
| `userId` | String | Required, valid UUID | Recipient User UUID |
| `title` | String | Required, trimmed, max 150 chars | Notification title / heading |
| `message` | String | Required, trimmed, max 1000 chars | Notification full message text |
| `type` | Enum | Optional, `NotificationType` enum | Default: `SYSTEM` |
| `priority` | Enum | Optional, `NotificationPriority` enum | Default: `MEDIUM` |
| `isRead` | Boolean | Optional boolean | Default: `false` |
| `readAt` | String | Optional, ISO datetime string | Read timestamp |
| `metadata` | Object | Optional key-value record | Extra JSON payload metadata |

### Enums Used
- **`NotificationType`**: `SYSTEM`, `TRIP_UPDATE`, `SHIPMENT_STATUS`, `MAINTENANCE_ALERT`, `FUEL_ALERT`, `SECURITY`, `CUSTOM`
- **`NotificationPriority`**: `LOW`, `MEDIUM`, `HIGH`, `URGENT`

### 2. `updateNotificationSchema`
Validates requests for updating an existing notification record. All fields from `createNotificationSchema` are marked optional via `.partial()`.

### 3. `notificationIdParamSchema`
Validates path parameters for single notification operations (e.g., `GET /api/v1/notifications/:id`).
- `id`: Required valid UUID string.

### 4. `notificationQuerySchema`
Validates query params for filtering, searching, sorting, and paginating notification history listings.
- `page`: Optional integer $\ge 1$ (default: `1`).
- `limit`: Optional integer $1 \le limit \le 100$ (default: `10`).
- `search`: Optional search string (searches across `title` and `message`).
- `userId`: Optional recipient User UUID filter.
- `companyId`: Optional Company UUID filter.
- `type`: Optional `NotificationType` enum filter.
- `priority`: Optional `NotificationPriority` enum filter.
- `isRead`: Optional boolean / string filter.
- `sortBy`: Optional enum field name (`createdAt`, `readAt`, `priority`). Default: `createdAt`.
- `sortOrder`: Optional `asc` or `desc` (default: `desc`).

---

## 🏷️ Exported TypeScript Types & Functions

```typescript
import {
  createNotificationSchema,
  updateNotificationSchema,
  notificationIdParamSchema,
  notificationQuerySchema,
  CreateNotificationInput,
  UpdateNotificationInput,
  NotificationIdInput,
  NotificationQueryInput,
} from './modules/notification';
```
