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

---

## 🔐 Role Model

The `Role` model defines system-level and custom Role-Based Access Control (RBAC) roles across FleetCore.

### Schema Definition

```prisma
/// Represents system and custom Role-Based Access Control (RBAC) roles
model Role {
  /// Primary key UUID
  id          String   @id @default(uuid())
  /// Unique role name (e.g. Super Admin, Fleet Manager, Driver)
  name        String   @unique
  /// Description of permissions granted by this role
  description String?
  /// JSON structure defining granular RBAC permission policies
  permissions Json
  /// Flag indicating system-defined role that cannot be deleted
  isSystem    Boolean  @default(false)
  /// Creation timestamp
  createdAt   DateTime @default(now())
  /// Last modification timestamp
  updatedAt   DateTime @updatedAt

  @@index([isSystem])
  @@index([createdAt])
}
```

### Fields

| Field Name | Type | Modifiers | Description |
| :--- | :--- | :--- | :--- |
| `id` | `String` | `@id @default(uuid())` | Primary key (UUID v4) |
| `name` | `String` | `@unique` | Unique role name identifier |
| `description` | `String` | Optional | Detailed description of role scope |
| `permissions` | `Json` | Required | Flexible JSON document containing RBAC policies |
| `isSystem` | `Boolean` | `@default(false)` | System role protection flag |
| `createdAt` | `DateTime` | `@default(now())` | Creation timestamp |
| `updatedAt` | `DateTime` | `@updatedAt` | Last modification timestamp |

### Indexes

- `@unique` on `name`: Guarantees unique role names across the system.
- `@@index([isSystem])`: Fast filtering for system vs user-created custom roles.
- `@@index([createdAt])`: Chronological sorting and audit queries.

### Relationships (Upcoming)

- `users`: One-to-many relationship mapping `Role` to assigned `User` accounts (`Role 1 -> N Users`).
