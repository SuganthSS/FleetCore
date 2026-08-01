# FleetCore Database Schema Documentation

This document describes the database schema, models, field definitions, indexes, and relationships for FleetCore.

---

## 🏢 Company Model

The `Company` model represents the core organization entity that owns and manages all fleet resources (Vehicles, Drivers, Shipments, Users, Customers, etc.) within FleetCore.

### Schema Definition

```prisma
enum CompanyStatus {
  ACTIVE
  INACTIVE
  SUSPENDED
  PENDING_VERIFICATION
}

model Company {
  id                 String        @id @default(uuid())
  name               String
  legalName          String?
  registrationNumber String?       @unique
  taxNumber          String?
  email              String
  phone              String?
  address            String?
  city               String?
  state              String?
  country            String?
  postalCode         String?
  logoUrl            String?
  website            String?
  status             CompanyStatus @default(ACTIVE)
  createdAt          DateTime      @default(now())
  updatedAt          DateTime      @updatedAt

  @@index([name])
  @@index([registrationNumber])
  @@index([status])
  @@index([createdAt])
}
```

### Fields

| Field Name | Type | Modifiers | Description |
| :--- | :--- | :--- | :--- |
| `id` | `String` | `@id @default(uuid())` | Primary key (UUID v4) |
| `name` | `String` | Required | Operating company display name |
| `legalName` | `String` | Optional | Registered legal entity name |
| `registrationNumber` | `String` | Optional, `@unique` | Government business registration / EIN |
| `taxNumber` | `String` | Optional | Corporate tax identification number |
| `email` | `String` | Required | Primary corporate contact email |
| `phone` | `String` | Optional | Contact phone number |
| `address` | `String` | Optional | Physical street address |
| `city` | `String` | Optional | City location |
| `state` | `String` | Optional | State / Province |
| `country` | `String` | Optional | Country location |
| `postalCode` | `String` | Optional | ZIP / Postal code |
| `logoUrl` | `String` | Optional | CDN image URL for company logo |
| `website` | `String` | Optional | Official company website URL |
| `status` | `CompanyStatus` | `@default(ACTIVE)` | Account status (`ACTIVE`, `INACTIVE`, `SUSPENDED`, `PENDING_VERIFICATION`) |
| `createdAt` | `DateTime` | `@default(now())` | Creation timestamp |
| `updatedAt` | `DateTime` | `@updatedAt` | Last modification timestamp |

### Indexes

- `@@index([name])`: Fast lookup by company name.
- `@@index([registrationNumber])`: Fast querying by business registration ID.
- `@@index([status])`: Filtering active/inactive companies.
- `@@index([createdAt])`: Chronological indexing and reporting queries.

### Relationships (Upcoming)

The `Company` model acts as the root parent model for all tenant-scoped resources:
- `users`: Array of `User` records belonging to this company.
- `vehicles`: Array of `Vehicle` assets managed by this company.
- `drivers`: Array of `Driver` profiles employed by this company.
- `customers`: Array of `Customer` client records.
- `shipments`: Array of `Shipment` dispatch orders.
- `fuelRecords`: Array of `FuelRecord` logs.
- `maintenanceRecords`: Array of `MaintenanceRecord` logs.
- `notifications`: Array of `Notification` events.
