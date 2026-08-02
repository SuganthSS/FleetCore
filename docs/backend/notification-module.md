# FleetCore Notification Module Documentation

**Module**: Notifications (`backend/src/modules/notification`)  
**Phase**: Phase 5 - Backend Fleet Management  
**Status**: Fully Implemented (Validation, Service, Controller & Routes)  

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

## ⚙️ Notification Service Layer (`services/notification.service.ts`)

The `NotificationService` class manages system notifications, user delivery history, tenant isolation, and read status synchronization.

### Business Rules & Tenant Isolation
1. **`createNotification(input: CreateNotificationInput)`**:
   - Verifies existence of `Company` and `User`.
   - **Tenant Scoping**: Verifies `User.companyId === input.companyId`.
   - Includes `user` and `company` relations in response.
2. **`getNotificationById(id: string, companyId?: string)`**:
   - Retrieves notification record by UUID with full relations.
   - Enforces multi-tenant isolation when `companyId` is provided (cross-tenant access returns Not Found).
3. **`getNotifications(query: NotificationQueryInput, companyId?: string)`**:
   - Supports paginated listing with `total`, `page`, `limit`, `totalPages` metadata.
   - Enforces company isolation via `companyId`.
   - Performs case-insensitive search across `title` and `message`.
   - Supports filters: `userId`, `companyId`, `type`, `priority`, `isRead`.
   - Supports sorting by: `createdAt`, `readAt`, `priority`.
4. **`updateNotification(id: string, input: UpdateNotificationInput, companyId?: string)`**:
   - Verifies record exists within company tenant boundary.
   - Re-verifies user company alignment if `userId` is modified.
   - Synchronizes `isRead` and `readAt` timestamps automatically.
5. **`deleteNotification(id: string, companyId?: string)`**:
   - Verifies record exists within company tenant boundary before hard deletion.

---

## 🎮 Notification Controller Layer (`controllers/notification.controller.ts`)

The `NotificationController` layer processes HTTP requests, validates inputs using Zod, extracts authenticated tenant context (`companyId`), and maps service outputs/errors into standardized JSON responses.

### HTTP Status Code Mapping

| Status Code | Description | Scenario |
| :--- | :--- | :--- |
| **200 OK** | Success | Querying, updating, or deleting notification history entries |
| **201 Created** | Created | Successfully creating a notification history entry |
| **400 Bad Request** | Validation Error | Payload/Query/Params validation failure |
| **404 Not Found** | Resource Not Found | Notification/User/Company not found, or cross-tenant access attempt |
| **500 Error** | Internal Server Error | Unhandled server error |

### Request Lifecycle

```text
HTTP Request
  → Zod safeParse (params/query/body)
  → Extract req.authenticatedUser.companyId
  → notificationService method()
  → Standardized JSON response
```

---

## 🛣️ Routes & RBAC Matrix (`routes/notification.routes.ts`)

Base Route: `/api/v1/notifications`

### Middleware Execution Chain
```text
HTTP Request ➔ authenticate() ➔ authorize(...roles) ➔ NotificationController handler
```

### Endpoints Table & Allowed Roles

| HTTP Method | Path | Description | Allowed Roles (`authorize`) |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/notifications` | List notification history entries (Paginated, Filter, Sort) | `Super Admin`, `Company Admin`, `Fleet Manager`, `Dispatcher` |
| `GET` | `/api/v1/notifications/:id` | Retrieve single notification history entry by UUID | `Super Admin`, `Company Admin`, `Fleet Manager`, `Dispatcher` |
| `POST` | `/api/v1/notifications` | Create a new notification history entry | `Super Admin`, `Company Admin`, `Fleet Manager` |
| `PUT` | `/api/v1/notifications/:id` | Update an existing notification history entry by UUID | `Super Admin`, `Company Admin`, `Fleet Manager` |
| `DELETE` | `/api/v1/notifications/:id` | Delete a notification history entry by UUID | `Super Admin`, `Company Admin` |

---

## 🏷️ Exported TypeScript Types & Functions

```typescript
import {
  notificationRoutes,
  notificationController,
  notificationService,
  createNotificationSchema,
  updateNotificationSchema,
  notificationIdParamSchema,
  notificationQuerySchema,
  CreateNotificationInput,
  UpdateNotificationInput,
  NotificationIdInput,
  NotificationQueryInput,
  PaginatedNotificationResult,
} from './modules/notification';
```


