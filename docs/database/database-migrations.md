# FleetCore Database Migrations & Seed Documentation

This document logs all production Prisma database migrations, seed data configurations, created schema objects, and execution considerations for FleetCore.

---

## 📜 Migration History

### 1. Migration: `20260802043500_init`

**SPEC ID**: SPEC-017  
**Title**: Initial Prisma Migration  
**Date**: 2026-08-02  
**Status**: GENERATED (`prisma/migrations/20260802043500_init/migration.sql`)  

#### Summary
Initial DDL schema migration establishing the core database structure for FleetCore. Translates the audited Prisma schema (`backend/prisma/schema.prisma`) into production-ready PostgreSQL DDL script containing all enums, tables, unique constraints, foreign keys, and indexes.

---

### 📊 Schema Objects Created

#### Created Enums (13 Enums)
1. `CompanyStatus` (`ACTIVE`, `INACTIVE`, `SUSPENDED`, `PENDING_VERIFICATION`)
2. `UserStatus` (`ACTIVE`, `INACTIVE`, `SUSPENDED`, `PENDING_VERIFICATION`)
3. `DriverAvailability` (`AVAILABLE`, `ON_TRIP`, `OFF_DUTY`, `ON_LEAVE`, `SUSPENDED`)
4. `ExperienceLevel` (`JUNIOR`, `MID`, `SENIOR`, `EXPERT`)
5. `VehicleStatus` (`AVAILABLE`, `ON_TRIP`, `MAINTENANCE`, `OUT_OF_SERVICE`, `DECOMMISSIONED`)
6. `VehicleType` (`TRUCK`, `VAN`, `TRAILER`, `BUS`, `CAR`, `SPECIALIZED`)
7. `FuelType` (`DIESEL`, `PETROL`, `ELECTRIC`, `HYBRID`, `CNG`, `LPG`)
8. `CustomerStatus` (`ACTIVE`, `INACTIVE`, `SUSPENDED`, `PENDING_VERIFICATION`)
9. `ShipmentPriority` (`LOW`, `MEDIUM`, `HIGH`, `URGENT`)
10. `ShipmentStatus` (`PENDING`, `DISPATCHED`, `IN_TRANSIT`, `DELIVERED`, `CANCELLED`, `FAILED`)
11. `RouteType` (`HIGHWAY`, `URBAN`, `INTERSTATE`, `CROSS_BORDER`, `REGIONAL`, `LAST_MILE`)
12. `RouteStatus` (`PLANNED`, `ACTIVE`, `OPTIMIZED`, `COMPLETED`, `CANCELLED`)
13. `TripStatus` (`SCHEDULED`, `DISPATCHED`, `IN_TRANSIT`, `PAUSED`, `COMPLETED`, `CANCELLED`, `FAILED`)
14. `MaintenanceType` (`PREVENTIVE`, `CORRECTIVE`, `INSPECTION`, `EMERGENCY`, `TIRE_SERVICE`, `OIL_CHANGE`, `BRAKE_SERVICE`, `OTHER`)
15. `MaintenanceStatus` (`SCHEDULED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`, `OVERDUE`)
16. `NotificationType` (`SYSTEM`, `TRIP_UPDATE`, `SHIPMENT_STATUS`, `MAINTENANCE_ALERT`, `FUEL_ALERT`, `SECURITY`, `CUSTOM`)
17. `NotificationPriority` (`LOW`, `MEDIUM`, `HIGH`, `URGENT`)

#### Created Tables (14 Tables)
1. `SystemHealthAnchor` (Health check anchor table)
2. `Company` (Tenant organization model)
3. `Role` (RBAC role model)
4. `User` (User identity model)
5. `Driver` (Operational driver profile model)
6. `Vehicle` (Physical fleet asset model)
7. `Customer` (Client entity model)
8. `Shipment` (Business shipment request model)
9. `Route` (Planned transport path model)
10. `Trip` (Operational shipment execution model)
11. `FuelRecord` (Vehicle refueling log model)
12. `MaintenanceRecord` (Vehicle service work order model)
13. `VehicleLocationHistory` (GPS breadcrumb log model)
14. `Notification` (Persistent user notification message model)

---

## 🛠️ Initial Database Seed (`SPEC-018`)

The initial database seed script is implemented at `backend/prisma/seed.ts` and configured in `package.json` under `"prisma": { "seed": "npx ts-node prisma/seed.ts" }`.

### Idempotency Strategy
The seed script uses Prisma `upsert` queries (`where` unique constraints) for all seeded entities. Executing `npx prisma db seed` repeatedly updates existing records without creating duplicate rows.

### Seeded Foundational Data

#### 1. System Health Anchor
- **ID**: `00000000-0000-0000-0000-000000000001`

#### 2. Default System Roles (5 Roles)
- **`Super Admin`**: System administrator with unrestricted global access (`isSystem: true`).
- **`Company Admin`**: Tenant administrator with full company-level management rights (`isSystem: true`).
- **`Fleet Manager`**: Operations manager for vehicles, drivers, fuel, and maintenance (`isSystem: true`).
- **`Dispatcher`**: Logistics operator managing shipments, routes, and trip dispatches (`isSystem: true`).
- **`Driver`**: Operational driver executing trips and submitting fuel/location logs (`isSystem: true`).

#### 3. Default Tenant Company (1 Company)
- **Name**: `FleetCore Demo Company`
- **Registration Number**: `DEMO-FC-2026`
- **Email**: `admin@fleetcore.demo`
- **Status**: `ACTIVE`

#### 4. Default Super Administrator User (1 User)
- **Email**: `admin@fleetcore.demo`
- **Name**: FleetCore Administrator
- **Role**: Super Admin
- **Company**: FleetCore Demo Company
- **Password**: `Admin@FleetCore2026!` (Stored as a secure `bcrypt` hash with cost factor 10)
- **Email Verified**: `true`

---

### 💡 Execution Considerations & Remote Environments

> [!NOTE]
> - **Migration Command**: Run `npx prisma migrate deploy` in production environments.
> - **Seed Command**: Run `npx prisma db seed` to initialize or update foundational roles, demo company, and super admin account.
