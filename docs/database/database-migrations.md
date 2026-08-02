# FleetCore Database Migrations Documentation

This document logs all production Prisma database migrations, their objectives, created schema objects, and execution considerations for FleetCore.

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

### 🛡️ Index & Constraint Summary

- **Primary Keys**: UUID PKs assigned to all 14 tables.
- **Unique Constraints**:
  - `Company.registrationNumber`
  - `Role.name`
  - `User.email`
  - `Driver.employeeId`, `Driver.licenseNumber`, `Driver.userId`
  - `Vehicle.registrationNumber`, `Vehicle.vin`
  - `Customer.customerCode`
  - `Shipment.shipmentNumber`
  - `Route.routeCode`
  - `Trip.tripNumber`
  - `FuelRecord.fuelRecordNumber`
  - `MaintenanceRecord.maintenanceRecordNumber`
- **Foreign Keys**: 23 foreign key constraint relations configured (`ON DELETE CASCADE` for tenant entities, `ON DELETE RESTRICT` for `User -> Role`).
- **Indexes**: 70+ performance indexes generated across tenant IDs, foreign keys, operational status fields, and timestamp ranges.

---

### 💡 Execution Considerations & Remote Environments

> [!NOTE]
> The migration script `prisma/migrations/20260802043500_init/migration.sql` was compiled directly from the declarative Prisma schema using `prisma migrate diff`. When connecting to a live remote PostgreSQL instance (e.g. Neon PostgreSQL), execute `npx prisma migrate deploy` in production or `npx prisma migrate dev` in local environments to apply the migration SQL.
