# FleetCore – Dispatcher Live Operations & Intelligence Documentation (SPEC-303)

## 1. Overview
SPEC-303 completes the Dispatcher Live Operations & Intelligence suite for FleetCore, extending operational capabilities with real-time GPS telemetry, scoped notifications, document vault management, Groq-powered AI dispatch assistance, scoped global search, and dispatcher profile administration.

---

## 2. Implemented Modules & Features

### 2.1 Live GPS Telemetry (`DispatcherTrackingPage.tsx`)
- **Route**: `/dispatcher/tracking`
- **Features**:
  - Real-time vehicle telemetry list with active speeds, driver assignments, and coordinates.
  - Interactive vector dispatch map with spatial breadcrumbs and geofence boundary warnings.
  - Telemetry KPI metrics bar (Total Units, En Route, Engine Idle, Geofence Alerts, Emergency Alerts).
  - Side drawer for full telemetry inspection.

### 2.2 Operational Notifications (`DispatcherNotificationsPage.tsx`)
- **Route**: `/dispatcher/notifications`
- **Features**:
  - Scoped operational alerts: `TRIP_ASSIGNED`, `DRIVER_ACCEPTED`, `DRIVER_DELAYED`, `VEHICLE_BREAKDOWN`, `GEOFENCE_ALERT`, `SHIPMENT_DELIVERED`, `TRIP_COMPLETED`, `EMERGENCY_ALERT`.
  - Filter by event type and read status.
  - Batch "Mark All Operational Read" and individual archiving.
  - Strictly excludes System Administration, User Management, and Maintenance Planning alerts.

### 2.3 Document Library (`DispatcherDocumentsPage.tsx`)
- **Route**: `/dispatcher/documents`
- **Features**:
  - Secure vault for Waybills, Delivery Notes, Proof of Delivery (POD) signatures, Driver CDL documents, and Vehicle Registrations.
  - Interactive preview drawer and direct file downloads.
  - Document upload tool.
  - **RBAC Enforced**: Deletion of company documents is disabled and locked for Dispatchers.

### 2.4 AI Dispatch Assistant (`DispatcherAIPage.tsx`)
- **Route**: `/dispatcher/ai`
- **Features**:
  - Integrated Groq AI Chat assistant (`aiCopilot.service.ts`).
  - 8 Dispatcher Quick Prompts:
    1. *Recommend Best Driver*
    2. *Optimize Dispatch Queue*
    3. *Predict Route Delays*
    4. *Suggest Reroute*
    5. *Identify Bottlenecks*
    6. *Find Idle Vehicles*
    7. *Suggest Reassignment*
    8. *Summarize Dispatch Queue*

### 2.5 Scoped Search (`DispatcherSearchPage.tsx`)
- **Route**: `/dispatcher/search`
- **Features**:
  - Scoped global search restricted to operational entities: Trips, Shipments, Drivers, Vehicles, Routes, Documents, Notifications.
  - Excludes Administrator entities: Users, Roles, Audit Logs, Organization Settings.

### 2.6 Dispatcher Profile (`DispatcherProfilePage.tsx`)
- **Route**: `/dispatcher/profile`
- **Features**:
  - Personal profile & shift updates.
  - Avatar image upload.
  - Password change modal.
  - Operational notification channel preferences.
  - Audit activity log & active terminal session management.

---

## 3. RBAC Enforcement Summary

| Feature / Resource | Dispatcher Access | Notes |
| :--- | :--- | :--- |
| **Live Tracking** | Read-Only View | Can view active telemetry and map breadcrumbs. |
| **Notifications** | Operational Scope | Can view, mark read, and archive operational alerts. Cannot view admin alerts. |
| **Documents** | Upload, Preview, Download | Deletion disabled/locked. |
| **AI Assistant** | Full Access | Groq AI dispatch optimization queries enabled. |
| **Search** | Scoped | Restricted to operational data models. |
| **Users / Roles / Audit** | BLOCKED | 403 / Redirected by `ProtectedRoute`. |
