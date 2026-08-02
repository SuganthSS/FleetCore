# FleetCore Database Schema Documentation

This document describes the database schema, models, field definitions, indexes, and relationships for FleetCore.

---

## 🏢 Company Model

The `Company` model represents the core organization entity that owns and manages all fleet resources (Vehicles, Drivers, Shipments, Users, Customers, Routes, Trips, etc.) within FleetCore.

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

  users     User[]
  drivers   Driver[]
  vehicles  Vehicle[]
  customers Customer[]
  shipments Shipment[]
  routes    Route[]
  trips     Trip[]

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
  trips   Trip[]

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

---

## 🚛 Vehicle Model

The `Vehicle` model represents a physical fleet asset owned by a `Company`.

### Architectural Note: Driver Assignment via Trip

> [!IMPORTANT]
> **Why `driverId` is NOT on `Vehicle`**: In enterprise fleet management, a vehicle is a physical asset that is dynamically operated by different drivers over time depending on shifts, rotations, maintenance schedules, and dispatch assignments. Storing a static `driverId` directly on the `Vehicle` model would create data redundancy, invalid concurrency assumptions, and force historical overwrite issues. Instead, driver-to-vehicle assignments are modeled dynamically through temporal `Trip` records (`Trip -> Vehicle`, `Trip -> Driver`).

### Schema Definition

```prisma
enum VehicleStatus {
  AVAILABLE
  ON_TRIP
  MAINTENANCE
  OUT_OF_SERVICE
  DECOMMISSIONED
}

enum VehicleType {
  TRUCK
  VAN
  TRAILER
  BUS
  CAR
  SPECIALIZED
}

enum FuelType {
  DIESEL
  PETROL
  ELECTRIC
  HYBRID
  CNG
  LPG
}

/// --------------------------------------------
/// Vehicle
/// Represents a physical fleet asset.
/// Belongs to a Company.
/// Driver assignment is handled dynamically via Trip.
/// --------------------------------------------
model Vehicle {
  id                 String        @id @default(uuid())
  registrationNumber String        @unique
  vin                String        @unique
  make               String
  model              String
  manufacturingYear  Int
  vehicleType        VehicleType   @default(TRUCK)
  fuelType           FuelType      @default(DIESEL)
  capacity           Float?
  status             VehicleStatus @default(AVAILABLE)
  companyId          String
  createdAt          DateTime      @default(now())
  updatedAt          DateTime      @updatedAt

  company Company @relation(fields: [companyId], references: [id], onDelete: Cascade)
  trips   Trip[]

  @@index([companyId])
  @@index([vehicleType])
  @@index([fuelType])
  @@index([status])
  @@index([manufacturingYear])
  @@index([createdAt])
}
```

### Fields

| Field Name | Type | Modifiers | Description |
| :--- | :--- | :--- | :--- |
| `id` | `String` | `@id @default(uuid())` | Primary key (UUID v4) |
| `registrationNumber` | `String` | Required, `@unique` | Official vehicle license plate registration number |
| `vin` | `String` | Required, `@unique` | Unique Vehicle Identification Number (VIN) |
| `make` | `String` | Required | Vehicle manufacturer (e.g. Volvo, Scania, Ford) |
| `model` | `String` | Required | Vehicle model series |
| `manufacturingYear` | `Int` | Required | Manufacturing year (e.g. 2024) |
| `vehicleType` | `VehicleType` | `@default(TRUCK)` | Asset classification (`TRUCK`, `VAN`, `TRAILER`, `BUS`, `CAR`, `SPECIALIZED`) |
| `fuelType` | `FuelType` | `@default(DIESEL)` | Fuel / energy type (`DIESEL`, `PETROL`, `ELECTRIC`, `HYBRID`, `CNG`, `LPG`) |
| `capacity` | `Float` | Optional | Cargo payload / passenger capacity |
| `status` | `VehicleStatus` | `@default(AVAILABLE)` | Operational state (`AVAILABLE`, `ON_TRIP`, `MAINTENANCE`, `OUT_OF_SERVICE`, `DECOMMISSIONED`) |
| `companyId` | `String` | Foreign Key | Parent company link to `Company.id` |
| `createdAt` | `DateTime` | `@default(now())` | Creation timestamp |
| `updatedAt` | `DateTime` | `@updatedAt` | Modification timestamp |

### Indexes

- `@unique` on `registrationNumber`: Ensures unique license plates across the fleet system.
- `@unique` on `vin`: Prevents duplicate vehicle identification numbers.
- `@@index([companyId])`: Multi-tenant fleet filtering.
- `@@index([vehicleType])`: Filtering fleet by asset type.
- `@@index([fuelType])`: Fuel efficiency and emissions reporting queries.
- `@@index([status])`: Operational dispatch filtering (e.g., retrieving `AVAILABLE` vehicles).
- `@@index([manufacturingYear])`: Asset lifecycle & depreciation analytics.
- `@@index([createdAt])`: Chronological asset registration tracking.

---

## 🏬 Customer Model

The `Customer` model represents a business or individual client that requests shipments within FleetCore. Customers belong to a parent `Company`.

### Schema Definition

```prisma
enum CustomerStatus {
  ACTIVE
  INACTIVE
  SUSPENDED
  PENDING_VERIFICATION
}

/// --------------------------------------------
/// Customer
/// Represents a business or individual client.
/// Customers request shipments and belong to a Company.
/// --------------------------------------------
model Customer {
  id            String         @id @default(uuid())
  customerCode  String         @unique
  companyName   String
  contactPerson String?
  email         String
  phone         String?
  address       String?
  city          String?
  state         String?
  country       String?
  postalCode    String?
  status        CustomerStatus @default(ACTIVE)
  companyId     String
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt

  company   Company    @relation(fields: [companyId], references: [id], onDelete: Cascade)
  shipments Shipment[]

  @@index([companyId])
  @@index([customerCode])
  @@index([companyName])
  @@index([status])
  @@index([createdAt])
}
```

### Fields

| Field Name | Type | Modifiers | Description |
| :--- | :--- | :--- | :--- |
| `id` | `String` | `@id @default(uuid())` | Primary key (UUID v4) |
| `customerCode` | `String` | Required, `@unique` | Unique client reference code (e.g., `CUST-10024`) |
| `companyName` | `String` | Required | Registered client company or individual business name |
| `contactPerson` | `String` | Optional | Primary client contact representative name |
| `email` | `String` | Required | Primary client contact email address |
| `phone` | `String` | Optional | Primary client phone number |
| `address` | `String` | Optional | Street address |
| `city` | `String` | Optional | City location |
| `state` | `String` | Optional | State / Province |
| `country` | `String` | Optional | Country location |
| `postalCode` | `String` | Optional | ZIP / Postal code |
| `status` | `CustomerStatus` | `@default(ACTIVE)` | Account operational status (`ACTIVE`, `INACTIVE`, `SUSPENDED`, `PENDING_VERIFICATION`) |
| `companyId` | `String` | Foreign Key | References parent `Company.id` |
| `createdAt` | `DateTime` | `@default(now())` | Creation timestamp |
| `updatedAt` | `DateTime` | `@updatedAt` | Modification timestamp |

### Indexes

- `@unique` on `customerCode`: Ensures unique client reference codes across FleetCore.
- `@@index([companyId])`: Multi-tenant filtering for company client listings.
- `@@index([customerCode])`: Fast client code lookup during shipment creation.
- `@@index([companyName])`: Search and lookup by client business name.
- `@@index([status])`: Filtering active vs inactive customer accounts.
- `@@index([createdAt])`: Chronological customer registration tracking.

---

## 📦 Shipment Model

The `Shipment` model represents a business request to transport goods. It belongs to a requesting `Customer` and parent `Company`, existing independently of vehicle and driver assignment (which is handled dynamically via `Trip`).

### Schema Definition

```prisma
enum ShipmentPriority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

enum ShipmentStatus {
  PENDING
  DISPATCHED
  IN_TRANSIT
  DELIVERED
  CANCELLED
  FAILED
}

/// --------------------------------------------
/// Shipment
/// Represents a business request to transport goods.
/// Belongs to a Customer and a Company.
/// Vehicle and driver assignment is handled dynamically via Trip.
/// --------------------------------------------
model Shipment {
  id                   String           @id @default(uuid())
  shipmentNumber       String           @unique
  title                String
  description          String?
  cargoType            String?
  weight               Float?
  volume               Float?
  quantity             Int?
  pickupAddress        String
  pickupCity           String
  pickupState          String?
  pickupCountry        String
  pickupPostalCode     String?
  pickupDate           DateTime?
  deliveryAddress      String
  deliveryCity         String
  deliveryState        String?
  deliveryCountry      String
  deliveryPostalCode   String?
  expectedDeliveryDate DateTime?
  priority             ShipmentPriority @default(MEDIUM)
  status               ShipmentStatus   @default(PENDING)
  customerId           String
  companyId            String
  createdAt            DateTime         @default(now())
  updatedAt            DateTime         @updatedAt

  customer Customer @relation(fields: [customerId], references: [id], onDelete: Cascade)
  company  Company  @relation(fields: [companyId], references: [id], onDelete: Cascade)
  routes   Route[]
  trips    Trip[]

  @@index([companyId])
  @@index([customerId])
  @@index([shipmentNumber])
  @@index([status])
  @@index([priority])
  @@index([pickupDate])
  @@index([expectedDeliveryDate])
  @@index([createdAt])
}
```

### Fields

| Field Name | Type | Modifiers | Description |
| :--- | :--- | :--- | :--- |
| `id` | `String` | `@id @default(uuid())` | Primary key (UUID v4) |
| `shipmentNumber` | `String` | Required, `@unique` | Unique shipment tracking reference number |
| `title` | `String` | Required | Short title or cargo request summary |
| `description` | `String` | Optional | Detailed cargo description or instructions |
| `cargoType` | `String` | Optional | Cargo category classification |
| `weight` | `Float` | Optional | Total weight of cargo (e.g. kg) |
| `volume` | `Float` | Optional | Total volume of cargo (e.g. m³) |
| `quantity` | `Int` | Optional | Package item count |
| `pickupAddress` | `String` | Required | Origin pickup street address |
| `pickupCity` | `String` | Required | Origin pickup city |
| `pickupState` | `String` | Optional | Origin pickup state / province |
| `pickupCountry` | `String` | Required | Origin pickup country |
| `pickupPostalCode` | `String` | Optional | Origin pickup ZIP / postal code |
| `pickupDate` | `DateTime` | Optional | Scheduled pickup date |
| `deliveryAddress` | `String` | Required | Destination delivery street address |
| `deliveryCity` | `String` | Required | Destination delivery city |
| `deliveryState` | `String` | Optional | Destination delivery state / province |
| `deliveryCountry` | `String` | Required | Destination delivery country |
| `deliveryPostalCode` | `String` | Optional | Destination delivery ZIP / postal code |
| `expectedDeliveryDate` | `DateTime` | Optional | Expected delivery date |
| `priority` | `ShipmentPriority` | `@default(MEDIUM)` | Dispatch priority (`LOW`, `MEDIUM`, `HIGH`, `URGENT`) |
| `status` | `ShipmentStatus` | `@default(PENDING)` | Lifecycle state (`PENDING`, `DISPATCHED`, `IN_TRANSIT`, `DELIVERED`, `CANCELLED`, `FAILED`) |
| `customerId` | `String` | Foreign Key | References `Customer.id` |
| `companyId` | `String` | Foreign Key | References `Company.id` |
| `createdAt` | `DateTime` | `@default(now())` | Creation timestamp |
| `updatedAt` | `DateTime` | `@updatedAt` | Modification timestamp |

### Indexes

- `@unique` on `shipmentNumber`: Ensures unique tracking numbers across FleetCore.
- `@@index([companyId])`: Multi-tenant shipment filtering.
- `@@index([customerId])`: Fast filtering for client order portals.
- `@@index([shipmentNumber])`: Search and tracking lookups.
- `@@index([status])`: Dispatch planning and status monitoring.
- `@@index([priority])`: Urgent shipment queue filtering.
- `@@index([pickupDate])`: Dispatch scheduling queries.
- `@@index([expectedDeliveryDate])`: SLA tracking and delivery deadline alerts.
- `@@index([createdAt])`: Chronological shipment analytics.

### Relationships

- `customer`: `Shipment N -> 1 Customer` (`onDelete: Cascade`)
- `company`: `Shipment N -> 1 Company` (`onDelete: Cascade`)
- `routes`: `Shipment 1 -> N Route`
- `trips`: `Shipment 1 -> N Trip`

---

## 🗺️ Route Model

The `Route` model represents the planned transportation path and metrics for a `Shipment`. A `Route` contains planning information only (origin, destination, distance, estimated duration) and belongs to a parent `Shipment` and `Company`. Vehicle and driver assignments are handled dynamically through `Trip`.

### Schema Definition

```prisma
enum RouteType {
  HIGHWAY
  URBAN
  INTERSTATE
  CROSS_BORDER
  REGIONAL
  LAST_MILE
}

enum RouteStatus {
  PLANNED
  ACTIVE
  OPTIMIZED
  COMPLETED
  CANCELLED
}

/// --------------------------------------------
/// Route
/// Represents the planned transportation path for a Shipment.
/// Route contains planning metrics only.
/// Belongs to a Shipment and a Company.
/// Vehicle and driver assignment occurs through Trip.
/// --------------------------------------------
model Route {
  id                 String      @id @default(uuid())
  routeCode          String      @unique
  originAddress      String
  originCity         String
  originState        String?
  originCountry      String
  destinationAddress String
  destinationCity    String
  destinationState   String?
  destinationCountry String
  plannedDistance    Float?
  estimatedDuration  Float?
  routeType          RouteType   @default(HIGHWAY)
  status             RouteStatus @default(PLANNED)
  shipmentId         String
  companyId          String
  createdAt          DateTime    @default(now())
  updatedAt          DateTime    @updatedAt

  shipment Shipment @relation(fields: [shipmentId], references: [id], onDelete: Cascade)
  company  Company  @relation(fields: [companyId], references: [id], onDelete: Cascade)
  trips    Trip[]

  @@index([companyId])
  @@index([shipmentId])
  @@index([status])
  @@index([routeType])
  @@index([createdAt])
}
```

### Fields

| Field Name | Type | Modifiers | Description |
| :--- | :--- | :--- | :--- |
| `id` | `String` | `@id @default(uuid())` | Primary key (UUID v4) |
| `routeCode` | `String` | Required, `@unique` | Unique route identification code |
| `originAddress` | `String` | Required | Planned origin street address |
| `originCity` | `String` | Required | Planned origin city |
| `originState` | `String` | Optional | Planned origin state / province |
| `originCountry` | `String` | Required | Planned origin country |
| `destinationAddress` | `String` | Required | Planned destination street address |
| `destinationCity` | `String` | Required | Planned destination city |
| `destinationState` | `String` | Optional | Planned destination state / province |
| `destinationCountry` | `String` | Required | Planned destination country |
| `plannedDistance` | `Float` | Optional | Total planned route distance (e.g. km) |
| `estimatedDuration` | `Float` | Optional | Total estimated travel duration (e.g. minutes/hours) |
| `routeType` | `RouteType` | `@default(HIGHWAY)` | Route classification category (`HIGHWAY`, `URBAN`, `INTERSTATE`, `CROSS_BORDER`, `REGIONAL`, `LAST_MILE`) |
| `status` | `RouteStatus` | `@default(PLANNED)` | Planning status (`PLANNED`, `ACTIVE`, `OPTIMIZED`, `COMPLETED`, `CANCELLED`) |
| `shipmentId` | `String` | Foreign Key | References parent `Shipment.id` |
| `companyId` | `String` | Foreign Key | References parent `Company.id` |
| `createdAt` | `DateTime` | `@default(now())` | Creation timestamp |
| `updatedAt` | `DateTime` | `@updatedAt` | Modification timestamp |

### Indexes

- `@unique` on `routeCode`: Ensures unique route identification codes.
- `@@index([companyId])`: Multi-tenant route query filtering.
- `@@index([shipmentId])`: Fast lookup of planned routes for a shipment.
- `@@index([status])`: Filtering routes by operational planning status.
- `@@index([routeType])`: Route classification analysis and dispatch optimization.
- `@@index([createdAt])`: Chronological route creation auditing.

### Relationships

- `shipment`: `Route N -> 1 Shipment` (`onDelete: Cascade`)
- `company`: `Route N -> 1 Company` (`onDelete: Cascade`)
- `trips`: `Route 1 -> N Trip`

---

## 🚦 Trip Model

The `Trip` model represents the operational **execution** of a planned shipment. It dynamically binds together five core platform entities: `Company`, `Driver`, `Vehicle`, `Shipment`, and `Route`.

### Architectural Responsibility & Separation

> [!IMPORTANT]
> **Architectural Separation (Route vs Trip)**:
> - **`Route` = Planning**: `Route` defines the static, planned path, estimated distance, and projected duration before dispatch occurs.
> - **`Trip` = Execution**: `Trip` represents what actually occurred during real-world execution, tracking actual start/end timestamps, actual distance traveled, actual duration, driver performance, and operational remarks.

### Schema Definition

```prisma
enum TripStatus {
  SCHEDULED
  DISPATCHED
  IN_TRANSIT
  PAUSED
  COMPLETED
  CANCELLED
  FAILED
}

/// --------------------------------------------
/// Trip
/// Represents the operational execution of a planned Shipment.
/// Links Driver, Vehicle, Shipment, Route, and Company.
/// Route represents what was planned; Trip represents what actually occurred.
/// --------------------------------------------
model Trip {
  id                 String     @id @default(uuid())
  tripNumber         String     @unique
  scheduledStartTime DateTime?
  actualStartTime    DateTime?
  scheduledEndTime   DateTime?
  actualEndTime      DateTime?
  status             TripStatus @default(SCHEDULED)
  actualDistance     Float?
  actualDuration     Float?
  remarks            String?
  companyId          String
  driverId           String
  vehicleId          String
  shipmentId         String
  routeId            String
  createdAt          DateTime   @default(now())
  updatedAt          DateTime   @updatedAt

  company  Company  @relation(fields: [companyId], references: [id], onDelete: Cascade)
  driver   Driver   @relation(fields: [driverId], references: [id], onDelete: Cascade)
  vehicle  Vehicle  @relation(fields: [vehicleId], references: [id], onDelete: Cascade)
  shipment Shipment @relation(fields: [shipmentId], references: [id], onDelete: Cascade)
  route    Route    @relation(fields: [routeId], references: [id], onDelete: Cascade)

  @@index([companyId])
  @@index([driverId])
  @@index([vehicleId])
  @@index([shipmentId])
  @@index([routeId])
  @@index([status])
  @@index([scheduledStartTime])
  @@index([actualStartTime])
  @@index([createdAt])
}
```

### Fields

| Field Name | Type | Modifiers | Description |
| :--- | :--- | :--- | :--- |
| `id` | `String` | `@id @default(uuid())` | Primary key (UUID v4) |
| `tripNumber` | `String` | Required, `@unique` | Unique operational trip identification number |
| `scheduledStartTime` | `DateTime` | Optional | Planned / scheduled dispatch start timestamp |
| `actualStartTime` | `DateTime` | Optional | Actual timestamp when trip was dispatched |
| `scheduledEndTime` | `DateTime` | Optional | Planned / scheduled trip completion timestamp |
| `actualEndTime` | `DateTime` | Optional | Actual timestamp when trip reached destination |
| `status` | `TripStatus` | `@default(SCHEDULED)` | Operational status (`SCHEDULED`, `DISPATCHED`, `IN_TRANSIT`, `PAUSED`, `COMPLETED`, `CANCELLED`, `FAILED`) |
| `actualDistance` | `Float` | Optional | Total actual distance driven (e.g. km) |
| `actualDuration` | `Float` | Optional | Total actual duration of execution (e.g. minutes/hours) |
| `remarks` | `String` | Optional | Operational notes, driver remarks, or incident logs |
| `companyId` | `String` | Foreign Key | References parent `Company.id` |
| `driverId` | `String` | Foreign Key | References assigned `Driver.id` |
| `vehicleId` | `String` | Foreign Key | References assigned `Vehicle.id` |
| `shipmentId` | `String` | Foreign Key | References executed `Shipment.id` |
| `routeId` | `String` | Foreign Key | References planned `Route.id` |
| `createdAt` | `DateTime` | `@default(now())` | Creation timestamp |
| `updatedAt` | `DateTime` | `@updatedAt` | Modification timestamp |

### Indexes

- `@unique` on `tripNumber`: Guarantees unique trip dispatch numbers.
- `@@index([companyId])`: Multi-tenant trip filtering.
- `@@index([driverId])`: Driver trip history and duty performance queries.
- `@@index([vehicleId])`: Vehicle utilization and operational history.
- `@@index([shipmentId])`: Shipment dispatch tracking and fulfillment status.
- `@@index([routeId])`: Route execution and plan vs actual comparison analytics.
- `@@index([status])`: Filtering active, scheduled, or completed trips.
- `@@index([scheduledStartTime])`: Dispatch calendar and schedule management queries.
- `@@index([actualStartTime])`: Operational timeline analytics.
- `@@index([createdAt])`: Chronological trip auditing.

### Relationships

- `company`: `Trip N -> 1 Company` (`onDelete: Cascade`)
- `driver`: `Trip N -> 1 Driver` (`onDelete: Cascade`)
- `vehicle`: `Trip N -> 1 Vehicle` (`onDelete: Cascade`)
- `shipment`: `Trip N -> 1 Shipment` (`onDelete: Cascade`)
- `route`: `Trip N -> 1 Route` (`onDelete: Cascade`)
- **Future Relations**: Prepared for `LocationHistory`, `FuelRecords`, and `Notifications`.
