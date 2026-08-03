# Enterprise Reports Center Documentation (SPEC-118)

## 📌 Executive Summary
The Enterprise Reports Center and Interactive Report Builder (`SPEC-118`) provides a data-dense operational reporting engine for FleetCore. Designed strictly to match the visual layout and specifications of the Stitch design system (`Report Builder - FleetCore`), this module enables fleet managers to generate, customize, preview, schedule, and export reporting data across all operational domains.

---

## 🛠 Component Architecture & Structure
The module is located in `frontend/src/components/reports/` and consumed by `frontend/src/pages/ReportsPage.tsx`.

### 1. `ReportsHeader`
- **Purpose**: Page title, FleetCore AI badge, date range indicator, data refresh trigger, export all action, and "New Report Builder" button.
- **Key Props**: `onBuildReport`, `onRefresh`, `isRefreshing`, `onExportAll`, `dateRangeLabel`.

### 2. `ReportsKPICards`
- **Purpose**: Displays 6 executive operational reporting summary cards with interactive selection ring highlighting.
- **Metrics Covered**: Available Templates, Scheduled Audits, Exports This Month, Compliance Index, Maintenance Audit Spend, Custom Queries.

### 3. `ReportsToolbar`
- **Purpose**: Live search filter, category filter dropdown, date range toggle (7D, 30D, 90D), format selector (CSV, EXCEL, PDF), and reset action.

### 4. `ReportCategoryGrid`
- **Purpose**: Interactive 10-category grid displaying template counts, descriptions, and direct template filtering capabilities.
- **Categories**: Fleet, Driver, Vehicle, Trip, Route, Shipment, Fuel, Maintenance, Customer, Audit.

### 5. `ReportTemplateCard`
- **Purpose**: Cards representing pre-configured standard report templates, complete with estimated generation time, popularity badge, live preview modal trigger, and instant download generator.

### 6. `ReportBuilder`
- **Purpose**: High-fidelity custom report builder form powered by `react-hook-form` and `zod`.
- **Features**: Custom title input, target category selection, time horizon picker, format selection, grouping parameters, sorting options, and live preview.

### 7. `ReportHistoryTable`
- **Purpose**: Data table displaying all recently generated report files with instant re-download, audit drawer view, and deletion actions.

### 8. `ScheduledReportsCard`
- **Purpose**: Management card for automated recurring email dispatches (daily/weekly), active/paused toggles, and schedule creation workflows.

### 9. `ReportPreview` & `ReportDrawer`
- **Purpose**: Modal and slide-over inspector for live data sample inspection, executive baseline summary review, printing, and signature verification.

---

## 🔒 Engineering & Data Integrity Standards
- **State Management**: Integrated with `@tanstack/react-query` via `dashboardService.getOverview()`.
- **Client-Side File Generation**: Direct CSV data bundle compilation and instant browser file downloads.
- **Type Safety**: Strictly typed interfaces and zero TypeScript compilation errors (`npm run build` verified).
