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

  users   User[]
  drivers Driver[]

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

  users User[]

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

---

## 👤 User Model

The `User` model represents application identity, authentication credentials storage, corporate structure assignment, and account status within FleetCore.

### Schema Definition

```prisma
enum UserStatus {
  ACTIVE
  INACTIVE
  SUSPENDED
  PENDING_VERIFICATION
}

/// --------------------------------------------
/// User
/// Represents an application user.
/// Users belong to a Company
/// and are assigned a Role.
/// --------------------------------------------
model User {
  id            String     @id @default(uuid())
  firstName     String
  lastName      String
  email         String     @unique
  phone         String?
  passwordHash  String
  companyId     String
  roleId        String
  department    String?
  designation   String?
  avatarUrl     String?
  status        UserStatus @default(ACTIVE)
  emailVerified Boolean    @default(false)
  lastLogin     DateTime?
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt

  company       Company @relation(fields: [companyId], references: [id], onDelete: Cascade)
  role          Role    @relation(fields: [roleId], references: [id], onDelete: Restrict)
  driverProfile Driver?

  @@index([companyId])
  @@index([roleId])
  @@index([status])
  @@index([department])
  @@index([createdAt])
  @@index([lastLogin])
}
```

### Fields

| Field Name | Type | Modifiers | Description |
| :--- | :--- | :--- | :--- |
| `id` | `String` | `@id @default(uuid())` | Primary key (UUID v4) |
| `firstName` | `String` | Required | User given name |
| `lastName` | `String` | Required | User surname |
| `email` | `String` | Required, `@unique` | Contact & authentication email address |
| `phone` | `String` | Optional | Contact phone number |
| `passwordHash` | `String` | Required | Encrypted password storage string |
| `companyId` | `String` | Foreign Key | References `Company.id` |
| `roleId` | `String` | Foreign Key | References `Role.id` |
| `department` | `String` | Optional | Corporate department (e.g., Operations) |
| `designation` | `String` | Optional | Job title / position |
| `avatarUrl` | `String` | Optional | Profile avatar image URL |
| `status` | `UserStatus` | `@default(ACTIVE)` | Operational account state (`ACTIVE`, `INACTIVE`, `SUSPENDED`, `PENDING_VERIFICATION`) |
| `emailVerified` | `Boolean` | `@default(false)` | Flag indicating verified email address |
| `lastLogin` | `DateTime` | Optional | Timestamp of last user sign-in |
| `createdAt` | `DateTime` | `@default(now())` | Account creation timestamp |
| `updatedAt` | `DateTime` | `@updatedAt` | Account modification timestamp |

### Indexes

- `@unique` on `email`: Guarantees global uniqueness for login emails.
- `@@index([companyId])`: Multi-tenant filtering and organization queries.
- `@@index([roleId])`: RBAC permission checks and role assignment filtering.
- `@@index([status])`: Quick retrieval of active/suspended users.
- `@@index([department])`: Filtering users by corporate department.
- `@@index([createdAt])`: Chronological account registration auditing.
- `@@index([lastLogin])`: Security monitoring & inactive user identifying queries.

---

## 🚚 Driver Model

The `Driver` model extends a `User` account with operational driving credentials, commercial license tracking, duty availability state, and company organization.

### Schema Definition

```prisma
enum DriverAvailability {
  AVAILABLE
  ON_TRIP
  OFF_DUTY
  ON_LEAVE
  SUSPENDED
}

enum ExperienceLevel {
  JUNIOR
  MID
  SENIOR
  EXPERT
}

/// --------------------------------------------
/// Driver
/// Represents an operational driver profile.
/// Extends a User account and belongs to a Company.
/// --------------------------------------------
model Driver {
  id                    String             @id @default(uuid())
  employeeId            String             @unique
  experienceLevel       ExperienceLevel    @default(MID)
  availability          DriverAvailability @default(AVAILABLE)
  licenseNumber         String             @unique
  licenseExpiry         DateTime
  joiningDate           DateTime?
  emergencyContactName  String?
  emergencyContactPhone String?
  userId                String             @unique
  companyId             String
  createdAt             DateTime           @default(now())
  updatedAt             DateTime           @updatedAt

  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  company Company @relation(fields: [companyId], references: [id], onDelete: Cascade)

  @@index([companyId])
  @@index([availability])
  @@index([experienceLevel])
  @@index([licenseExpiry])
  @@index([createdAt])
}
```

### Fields

| Field Name | Type | Modifiers | Description |
| :--- | :--- | :--- | :--- |
| `id` | `String` | `@id @default(uuid())` | Primary key (UUID v4) |
| `employeeId` | `String` | Required, `@unique` | Internal company driver employee code |
| `experienceLevel` | `ExperienceLevel` | `@default(MID)` | Driver experience rating (`JUNIOR`, `MID`, `SENIOR`, `EXPERT`) |
| `availability` | `DriverAvailability` | `@default(AVAILABLE)` | Operational duty availability state (`AVAILABLE`, `ON_TRIP`, `OFF_DUTY`, `ON_LEAVE`, `SUSPENDED`) |
| `licenseNumber` | `String` | Required, `@unique` | Government commercial driving license ID |
| `licenseExpiry` | `DateTime` | Required | Commercial driver license expiration date |
| `joiningDate` | `DateTime` | Optional | Date driver joined company employment |
| `emergencyContactName` | `String` | Optional | Emergency contact person name |
| `emergencyContactPhone` | `String` | Optional | Emergency contact person phone number |
| `userId` | `String` | Foreign Key, `@unique` | 1-to-1 extension link to `User.id` |
| `companyId` | `String` | Foreign Key | Parent company link to `Company.id` |
| `createdAt` | `DateTime` | `@default(now())` | Creation timestamp |
| `updatedAt` | `DateTime` | `@updatedAt` | Modification timestamp |

### Indexes

- `@unique` on `employeeId`: Prevents duplicate employee IDs across companies.
- `@unique` on `licenseNumber`: Prevents duplicate driver license numbers.
- `@unique` on `userId`: Enforces strict 1-to-1 extension of a User account.
- `@@index([companyId])`: Fast filtering for company driver rosters.
- `@@index([availability])`: Real-time driver dispatch availability queries.
- `@@index([experienceLevel])`: Filtering drivers by experience tier for complex assignments.
- `@@index([licenseExpiry])`: Automated license renewal alerts and compliance monitoring.
- `@@index([createdAt])`: Driver onboarding analytics and chronological tracking.

### Relationships

- `user`: `Driver 1 <-> 1 User` (`onDelete: Cascade`)
- `company`: `Driver N -> 1 Company` (`onDelete: Cascade`)
- **Future Relations**: Prepared for `Vehicles`, `Trips`, `FuelRecords`, and `MaintenanceRecords`.
