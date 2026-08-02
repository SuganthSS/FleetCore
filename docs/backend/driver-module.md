# FleetCore Driver Module Documentation

**Module**: Driver Management (`backend/src/modules/driver`)  
**Phase**: Phase 5 - Backend Fleet Management  
**Status**: Full Module Implemented (Validation, Service, Controller & Routes)  

---

## 🛣️ Driver REST API Endpoints (`/api/v1/drivers`)

All Driver endpoints require a valid Bearer JWT access token via `authenticate()` middleware.

| HTTP Method | Endpoint Path | Description | Allowed Roles (`authorize`) |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/drivers` | List drivers (Paginated, Search, Filter, Sort) | `Super Admin`, `Company Admin`, `Fleet Manager`, `Dispatcher` |
| `GET` | `/api/v1/drivers/:id` | Get single driver profile by UUID | `Super Admin`, `Company Admin`, `Fleet Manager`, `Dispatcher` |
| `POST` | `/api/v1/drivers` | Create a new driver profile | `Super Admin`, `Company Admin`, `Fleet Manager` |
| `PUT` | `/api/v1/drivers/:id` | Update an existing driver profile by UUID | `Super Admin`, `Company Admin`, `Fleet Manager` |
| `DELETE` | `/api/v1/drivers/:id` | Delete a driver profile by UUID | `Super Admin`, `Company Admin` |

---

## 📐 Validation Schemas (`validators/driver.validator.ts`)

The Driver validation layer utilizes **Zod** to validate incoming HTTP request payloads, path parameters, and query parameters before reaching controllers or services.

### 1. `createDriverSchema`
Validates requests for creating/registering a new operational driver profile.

| Field | Type | Validation Rules | Error / Notes |
| :--- | :--- | :--- | :--- |
| `employeeId` | String | Required, trimmed, max 50 chars | Internal company employee code (unique) |
| `userId` | String | Required, valid UUID | 1-to-1 extension link to `User` account |
| `companyId` | String | Required, valid UUID | Parent company reference |
| `experienceLevel` | Enum | Optional, `ExperienceLevel` (JUNIOR, MID, SENIOR, EXPERT) | Native Prisma Enum |
| `availability` | Enum | Optional, `DriverAvailability` (AVAILABLE, ON_TRIP, OFF_DUTY, ON_LEAVE, SUSPENDED) | Native Prisma Enum |
| `licenseNumber` | String | Required, trimmed, max 50 chars | Commercial driver license number (unique) |
| `licenseExpiry` | DateTime | Required date/datetime format | License expiry date |
| `joiningDate` | DateTime | Optional date/datetime format | Company joining date |
| `emergencyContactName` | String | Optional, trimmed, max 100 chars | Emergency contact name |
| `emergencyContactPhone` | String | Optional, trimmed, max 20 chars | Emergency contact phone number |

### 2. `updateDriverSchema`
Validates requests for updating an existing driver profile. All fields from `createDriverSchema` are marked optional via `.partial()`.

### 3. `driverIdParamSchema`
Validates path parameters for single-driver operations (e.g., `GET /api/v1/drivers/:id`).
- `id`: Required valid UUID string.

### 4. `driverQuerySchema`
Validates query params for filtering, searching, sorting, and paginating driver listings.
- `page`: Optional integer $\ge 1$ (default: `1`).
- `limit`: Optional integer $1 \le limit \le 100$ (default: `10`).
- `search`: Optional search string (searches `employeeId`, `licenseNumber`, `User.firstName`, `User.lastName`, `User.email`).
- `availability`: Optional `DriverAvailability` enum filter.
- `experienceLevel`: Optional `ExperienceLevel` enum filter.
- `companyId`: Optional valid UUID filter.
- `sortBy`: Optional enum field name (`createdAt`, `employeeId`, `licenseExpiry`, `joiningDate`). Default: `createdAt`.
- `sortOrder`: Optional `asc` or `desc` (default: `desc`).

---

## ⚙️ Driver Service Layer (`services/driver.service.ts`)

The `DriverService` class provides framework-independent CRUD operations and business rules.

### Business Rules & Tenant Isolation
1. **`createDriver(input: CreateDriverInput)`**:
   - Validates existence of parent `Company` and target `User`.
   - Ensures `User` belongs to the specified `Company`.
   - Prevents duplicate `employeeId`, `licenseNumber`, or double-assignment of `userId`.
2. **`getDriverById(id: string, companyId?: string)`**:
   - Retrieves driver record by UUID, including associated `User` profile and `Company` metadata.
   - Enforces multi-tenant isolation by scoping queries with `companyId`.
3. **`getDrivers(query: DriverQueryInput, companyId?: string)`**:
   - Supports paginated listing with total counts and total pages.
   - Enforces company isolation via `companyId`.
   - Performs case-insensitive search across `employeeId`, `licenseNumber`, `User.firstName`, `User.lastName`, and `User.email`.
4. **`updateDriver(id: string, input: UpdateDriverInput, companyId?: string)`**:
   - Verifies driver exists and enforces multi-tenant boundary.
   - Checks uniqueness of updated `employeeId`, `licenseNumber`, and `userId`.
5. **`deleteDriver(id: string, companyId?: string)`**:
   - Verifies driver exists within company tenant boundary before hard deletion.

---

## 🎮 Driver Controller Layer (`controllers/driver.controller.ts`)

The `DriverController` provides thin Express request handlers that validate input via Zod schemas, extract authenticated tenant `companyId` context, delegate business logic to `DriverService`, and return standardized JSON HTTP responses.

### Request Lifecycle
```text
HTTP Request ➔ Express Router (/api/v1/drivers) ➔ Auth/RBAC Middleware ➔ DriverController ➔ Zod Validation ➔ DriverService ➔ Prisma Client ➔ Standardized HTTP Response
```

### Standardized Response Formats

#### Success Response
```json
{
  "success": true,
  "message": "Driver created successfully",
  "data": { ... }
}
```

#### Validation Error (HTTP 400)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Employee ID is required",
    "Invalid User ID UUID format"
  ]
}
```

#### Conflict Error (HTTP 409)
```json
{
  "success": false,
  "message": "Driver with employee ID 'EMP-001' already exists."
}
```

---

## 🏷️ Exported TypeScript Types & Functions

```typescript
import {
  driverRoutes,
  driverController,
  driverService,
  CreateDriverInput,
  UpdateDriverInput,
  DriverIdInput,
  DriverQueryInput,
  PaginatedDriverResult,
} from './modules/driver';
```
