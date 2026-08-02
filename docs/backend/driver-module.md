# FleetCore Driver Module Documentation

**Module**: Driver Management (`backend/src/modules/driver`)  
**Phase**: Phase 5 - Backend Fleet Management  
**Status**: Validation Layer Implemented  

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
- `search`: Optional search string (searches `employeeId` and `licenseNumber`).
- `availability`: Optional `DriverAvailability` enum filter.
- `experienceLevel`: Optional `ExperienceLevel` enum filter.
- `companyId`: Optional valid UUID filter.
- `sortBy`: Optional enum field name (`createdAt`, `employeeId`, `licenseExpiry`, `joiningDate`). Default: `createdAt`.
- `sortOrder`: Optional `asc` or `desc` (default: `desc`).

---

## 🏷️ Exported TypeScript Types

```typescript
import {
  CreateDriverInput,
  UpdateDriverInput,
  DriverIdInput,
  DriverQueryInput,
} from './modules/driver';
```
