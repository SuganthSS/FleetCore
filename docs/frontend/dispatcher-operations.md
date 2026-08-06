# FleetCore – Dispatcher Operational Modules Documentation (SPEC-302)

## 📌 Executive Summary
The Dispatcher Operational Modules (SPEC-302) expand the foundational **Dispatcher Portal** into a fully functioning, dispatch-first control room. Built to adhere strictly to the **Stitch design system** (Enterprise Blue `#2563eb`, Plus Jakarta Sans, rounded card containers, micro-interactions, high-density status badges), this workspace provides real-time fleet dispatching, conflict management, and operational execution without compromising RBAC boundaries.

---

## 🛠️ Implemented Operational Modules

### 1. Dispatch Center (`/dispatcher/dispatch-center`)
- **File**: `frontend/src/pages/dispatcher/DispatcherDispatchCenterPage.tsx`
- **Layout**: Three-Column Active Dispatch Board.
  - **Left Column (Unassigned & Pending Trips)**: Prioritized queue of trips requiring driver/vehicle assignment or dispatch authorization. Features priority chips (`High`, `Normal`), corridor origin-destination preview, cargo specs, and scheduled start times.
  - **Center Column (Available Drivers Roster)**: Filterable roster displaying driver availability status (`AVAILABLE`, `ON_TRIP`), experience level, remaining Hours of Service (HOS), and license credentials with quick-assign triggers.
  - **Right Column (Available Fleet Readiness)**: Filterable fleet grid displaying vehicle availability (`AVAILABLE`, `MAINTENANCE`), fuel level telemetry gauge %, payload capacity (kg), and maintenance status with quick-assign triggers.
- **Assignment Drawer & Confirmation**:
  - Side drawer displaying selected trip, assigned driver, and assigned vehicle.
- **Safety Conflict Detection Engine**:
  - 🔴 Driver unavailable warning (if driver is on trip / off duty)
  - 🔴 License expired alert (if driver license is past expiration)
  - 🔴 Vehicle under maintenance / out of service alert
  - 🟡 Low fuel level warning (<20% fuel remaining)
  - 🟡 License renewal warning (<30 days left)
- **Quick Dispatch Actions**:
  - Assign Driver, Assign Vehicle, Authorize & Dispatch Trip, Reassign Selections, Cancel Assignment.

---

### 2. Trips Management (`/dispatcher/trips`)
- **File**: `frontend/src/pages/dispatcher/DispatcherTripsPage.tsx`
- **Dispatcher Operational KPIs**:
  - Trips Awaiting Assignment
  - Dispatched
  - In Progress (`IN_TRANSIT`)
  - Delayed (Schedule lag)
  - Completed Today
- **Permissions & Security**: Full creation, editing, status updating, and dispatching capabilities. **Delete permissions explicitly restricted** per RBAC guidelines.

---

### 3. Shipments & Cargo Logistics (`/dispatcher/shipments`)
- **File**: `frontend/src/pages/dispatcher/DispatcherShipmentsPage.tsx`
- **Operational Features**:
  - Filterable cargo shipment cards (Status: `PENDING`, `DISPATCHED`, `IN_TRANSIT`, `DELIVERED`).
  - **Proof of Delivery (POD)**: Digital signature modal with cryptographic verification hash preview.
  - **Status Management**: Quick update modal for real-time cargo lifecycle transitions.
  - **Driver Communication**: Direct dispatch contact link and GPS tracking integration.
  - **RBAC**: Financial controls, invoicing, and rate management omitted for Dispatcher role.

---

### 4. Routes & Corridor Optimization (`/dispatcher/routes`)
- **File**: `frontend/src/pages/dispatcher/DispatcherRoutesPage.tsx`
- **Operational Features**:
  - Active corridor list displaying origin/destination cities, distance (km), and estimated travel time.
  - **AI Route Optimization Modal**: Computes distance reduction (-24.5 km), transit time saved (-32 mins), and fuel savings (-8.4L).
  - **Traffic Delay Simulation**: Interactive toggle overlay displaying live congestion warnings and delay estimates (+22 mins).
  - **Corridor Map Graphics**: SVG vector map layer representing route waypoints.

---

### 5. Driver Roster (`/dispatcher/drivers`)
- **File**: `frontend/src/pages/dispatcher/DispatcherDriversPage.tsx`
- **Operational Features**:
  - Roster cards displaying driver photo initials, availability badge, experience level, license details, and HOS remaining (e.g., 6.5 / 11.0 hours).
  - **Contact Driver Modal**: Voice call trigger and direct dispatch message link.
  - **RBAC**: User creation, role assignment, and driver account deletion disabled.

---

### 6. Vehicle Fleet Readiness (`/dispatcher/vehicles`)
- **File**: `frontend/src/pages/dispatcher/DispatcherVehiclesPage.tsx`
- **Operational Features**:
  - Fleet cards showing registration number, make/model, fuel gauge %, payload capacity (kg), and maintenance warnings.
  - Quick assignment to active dispatches.
  - **RBAC**: Vehicle deletion disabled.

---

## 🔒 Role-Based Access Control (RBAC) Summary
| Capability / Feature | Administrator | Fleet Manager | Dispatcher |
| :--- | :---: | :---: | :---: |
| Assign Driver & Vehicle to Trip | ✅ | ✅ | ✅ |
| Authorize & Dispatch Trips | ✅ | ✅ | ✅ |
| Update Shipment Status & View POD | ✅ | ✅ | ✅ |
| Optimize Routes & Corridor Traffic | ✅ | ✅ | ✅ |
| Contact Drivers & Monitor HOS | ✅ | ✅ | ✅ |
| Delete Trips / Vehicles / Drivers | ✅ | ✅ | ❌ |
| Create / Edit Users & Roles | ✅ | ❌ | ❌ |
| Financial & Invoicing Controls | ✅ | ✅ | ❌ |
