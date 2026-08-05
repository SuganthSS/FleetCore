# Fleet Manager Intelligence & Utilities Documentation (SPEC-204)

## Overview
**SPEC-204** delivers the operational intelligence, reporting, AI copilot, notifications, document repository, profile management, and global search modules for the **Fleet Manager Workspace**. All views maintain 100% Stitch design system fidelity and enforce strict role-based access control (RBAC), hiding organization-level administration while empowering operational decision-making.

---

## 1. Module Overview & Routes

| Module | Route Path | Page Component | Key Features & RBAC Boundaries |
| :--- | :--- | :--- | :--- |
| **Analytics** | `/fleet-manager/analytics` | `FleetManagerAnalyticsPage.tsx` | Fleet utilization, vehicle availability, trip completion rates, driver productivity, fuel efficiency. Removes company-wide executive financial metrics. |
| **Reports** | `/fleet-manager/reports` | `FleetManagerReportsPage.tsx` | Generate, preview, download, and schedule operational reports (CSV, Excel, PDF). Restricts modifying company template settings. |
| **AI Copilot** | `/fleet-manager/ai` | `FleetManagerAIPage.tsx` | Groq AI operational copilot for vehicle recommendations, dispatch optimization, fuel forecasts, and predictive maintenance. Restricts Admin model configuration. |
| **Notifications**| `/fleet-manager/notifications` | `FleetManagerNotificationsPage.tsx` | Operational alert feed, trip alerts, maintenance notifications, fuel warnings. Mark read & search capabilities. Excludes admin audit alerts. |
| **Documents** | `/fleet-manager/documents` | `FleetManagerDocumentsPage.tsx` | Upload, preview, download, and categorize vehicle permits, driver licenses, insurance, waybills, and fuel receipts. |
| **Profile** | `/fleet-manager/profile` | `FleetManagerProfilePage.tsx` | Profile editing, avatar upload, password changes, notification preferences, and active operational session history. |
| **Global Search**| `/fleet-manager/search` | `FleetManagerSearchPage.tsx` | Operational search overlay filtering Vehicles, Drivers, Trips, Fuel Logs, Maintenance Work Orders, GPS Telemetry, Documents, and Reports. Excludes Users, Roles, Audit Logs, and Organization Settings. |

---

## 2. Shared Component & API Reuse

All 7 modules leverage shared services, components, and TanStack Query hooks:
- **Services Reused**: `dashboardService`, `reportService`, `aiCopilotService`, `notificationService`, `documentService`, `userService`, `vehicleService`, `driverService`.
- **UI Components Reused**: `AnalyticsHeader`, `AnalyticsKPICards`, `AnalyticsToolbar`, `FleetPerformanceChart`, `DriverPerformanceChart`, `ReportsHeader`, `ReportsKPICards`, `ReportBuilder`, `ReportPreview`, `AICopilotHeader`, `AICopilotDrawer`, `NotificationHeader`, `NotificationCards`, `DocumentsHeader`, `DocumentCards`, `DocumentUploader`, `ProfileHeader`, `PersonalInformationCard`, `SecurityCard`, `GlobalSearchOverlay`.

---

## 3. Build & Quality Audit Results

- **Frontend Build**: Passed (`tsc -b && vite build` -> 0 errors).
- **Frontend Lint**: Passed (`oxlint` -> 0 errors, 0 warnings).
- **Backend Build**: Passed (`tsc` -> 0 errors).
- **Backend Lint**: Passed (`eslint` -> 0 errors).
