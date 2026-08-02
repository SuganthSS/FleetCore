# FleetCore Maintenance Module Documentation

**Module**: Maintenance Management (`backend/src/modules/maintenance`)  
**Phase**: Phase 5 - Backend Fleet Management  
**Status**: Validation, Service & Controller Layers Implemented  

---

## 📐 Validation Schemas (`validators/maintenance.validator.ts`)

The Maintenance validation layer utilizes **Zod** to validate incoming HTTP request payloads, path parameters, and query parameters before reaching controllers or services.

### 1. `createMaintenanceSchema`
Validates requests for creating vehicle maintenance operational work orders.

| Field | Type | Validation Rules | Error / Notes |
| :--- | :--- | :--- | :--- |
| `vehicleId` | String | Required, valid UUID | Serviced Vehicle UUID |
| `companyId` | String | Required, valid UUID | Parent Company UUID |
| `driverId` | String | Optional, valid UUID | Responsible Driver / Technician UUID |
| `maintenanceType` | Enum | Required, `MaintenanceType` (`PREVENTIVE`, `CORRECTIVE`, `INSPECTION`, `EMERGENCY`, `TIRE_SERVICE`, `OIL_CHANGE`, `BRAKE_SERVICE`, `OTHER`) | Category of maintenance |
| `status` | Enum | Optional, `MaintenanceStatus` (`SCHEDULED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`, `OVERDUE`) | Work order status (Default: `SCHEDULED`) |
| `title` | String | Required, trimmed, max 150 chars | Maintenance title / summary |
| `description` | String | Optional, trimmed, max 500 chars | Work description |
| `scheduledDate` | String | Required, ISO datetime string | Scheduled date timestamp |
| `completedDate` | String | Optional, ISO datetime string | Completion timestamp |
| `estimatedCost` | Number | Optional, positive number | Estimated cost |
| `actualCost` | Number | Optional, positive number | Actual final cost |
| `serviceProvider` | String | Optional, trimmed, max 150 chars | Vendor / Service center name |
| `odometerReading` | Number | Optional, positive integer | Odometer reading at service |
| `nextMaintenanceDate` | String | Optional, ISO datetime string | Projected next service date |
| `notes` | String | Optional, trimmed, max 500 chars | Technical notes |

### 2. `updateMaintenanceSchema`
Validates requests for updating an existing maintenance record. All fields from `createMaintenanceSchema` are marked optional via `.partial()`.

### 3. `maintenanceIdParamSchema`
Validates path parameters for single maintenance record operations (e.g., `GET /api/v1/maintenance/:id`).
- `id`: Required valid UUID string.

### 4. `maintenanceQuerySchema`
Validates query params for filtering, searching, sorting, and paginating maintenance listings.
- `page`: Optional integer $\ge 1$ (default: `1`).
- `limit`: Optional integer $1 \le limit \le 100$ (default: `10`).
- `search`: Optional search string (searches `title` / `serviceProvider`).
- `vehicleId`: Optional Vehicle UUID filter.
- `companyId`: Optional Company UUID filter.
- `maintenanceType`: Optional `MaintenanceType` enum filter.
- `status`: Optional `MaintenanceStatus` enum filter.
- `sortBy`: Optional enum field name (`createdAt`, `scheduledDate`, `completedDate`, `estimatedCost`, `actualCost`). Default: `createdAt`.
- `sortOrder`: Optional `asc` or `desc` (default: `desc`).

---

## ⚙️ Maintenance Service Layer (`services/maintenance.service.ts`)

The `MaintenanceService` class manages vehicle maintenance work order lifecycle events, tenant isolation, and vehicle/driver entity scoping.

### Business Rules & Tenant Isolation
1. **`createMaintenance(input: CreateMaintenanceInput)`**:
   - Verifies existence of `Company` and `Vehicle`.
   - **Tenant Scoping**: Verifies `Vehicle` belongs to `companyId` (`vehicle.companyId === input.companyId`).
   - **Driver Association Check**: If `driverId` is provided, verifies `Driver` exists and belongs to `companyId`.
   - Auto-generates unique `MAINT-` work order reference.
   - Includes `vehicle`, `driver`, and `company` relations in response.
2. **`getMaintenanceById(id: string, companyId?: string)`**:
   - Retrieves maintenance work order by UUID with full relations.
   - Enforces multi-tenant isolation when `companyId` is provided (cross-tenant access returns Not Found).
3. **`getMaintenances(query: MaintenanceQueryInput, companyId?: string)`**:
   - Supports paginated listing with `total`, `page`, `limit`, `totalPages` metadata.
   - Enforces company isolation via `companyId`.
   - Performs case-insensitive search across `description`, `serviceProvider`, and work order reference code.
   - Supports filters: `vehicleId`, `companyId`, `maintenanceType`, `status`.
   - Supports sorting by: `createdAt`, `scheduledDate`, `completedDate`, `estimatedCost`, `actualCost`.
4. **`updateMaintenance(id: string, input: UpdateMaintenanceInput, companyId?: string)`**:
   - Verifies record exists within company tenant boundary.
   - Re-verifies vehicle/driver company alignment if modified.
5. **`deleteMaintenance(id: string, companyId?: string)`**:
   - Verifies record exists within company tenant boundary before hard deletion.

---

## 🎮 Maintenance Controller Layer (`controllers/maintenance.controller.ts`)

The `MaintenanceController` layer processes HTTP requests, validates inputs using Zod, extracts authenticated tenant context (`companyId`), and maps service outputs/errors into standardized JSON responses.

### HTTP Status Code Mapping

| Status Code | Description | Scenario |
| :--- | :--- | :--- |
| **200 OK** | Success | Querying, updating, or deleting maintenance work orders |
| **201 Created** | Created | Successfully creating maintenance work order |
| **400 Bad Request** | Validation Error | Payload/Query/Params validation failure |
| **404 Not Found** | Resource Not Found | Maintenance/Vehicle/Driver/Company not found, cross-tenant access |
| **500 Error** | Internal Server Error | Unhandled server error |

### Request Lifecycle

```text
HTTP Request
  → Zod safeParse (params/query/body)
  → Extract req.authenticatedUser.companyId
  → maintenanceService method()
  → Standardized JSON response
```

---

## 🏷️ Exported TypeScript Types & Functions

```typescript
import {
  maintenanceController,
  maintenanceService,
  createMaintenanceSchema,
  updateMaintenanceSchema,
  maintenanceIdParamSchema,
  maintenanceQuerySchema,
  CreateMaintenanceInput,
  UpdateMaintenanceInput,
  MaintenanceIdInput,
  MaintenanceQueryInput,
  PaginatedMaintenanceResult,
} from './modules/maintenance';
```


