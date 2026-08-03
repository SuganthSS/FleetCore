# Enterprise Analytics Dashboard (Stitch MCP Rebuild)

## Overview
The Enterprise Analytics Dashboard provides operational intelligence, fleet availability metrics, driver safety scores, maintenance downtime diagnostics, fuel spend efficiency, and delivery SLA compliance tracking across FleetCore.

## Key Features
- **Header & Controls**: Title header featuring live telemetry indicator, preset date range selector (*7D, 30D, 90D, YTD*), multi-format export buttons (*CSV, Excel, PDF*), and refresh trigger.
- **12 Stitch Telemetry KPI Cards**:
  - Fleet Availability
  - Vehicle Utilization
  - Average Trip Duration
  - Delivery SLA Compliance
  - Driver Safety Score
  - Fuel Efficiency ($/Gal & total Gal)
  - Maintenance Cost
  - Monthly Revenue
  - Completed Cargo / Shipments
  - Active Dispatches
  - Fleet Health Index
  - Organization Health Score
- **Toolbar & Filtering Controls**:
  - Date Range Presets (*7D, 30D, 90D, YTD*)
  - Comparison Period Selector (*vs Prev Period, vs Prev Year, None*)
  - Department Selector (*Logistics, Cold Chain, Hazmat, Last Mile*)
  - Vehicle & Driver Filter Dropdowns
- **Executive AI Summary Card**: Automated operational summary powered by AI diagnostics.
- **Charts & Category Performance Cards**:
  - Fleet Utilization & Availability Status bar chart
  - Driver Safety & Productivity Index card
  - Fuel Consumption & Spend Telemetry card
  - Maintenance & Work Order Audit card
  - Shipment Logistics SLA card
  - Trip Operations card
- **Analytics Drill-Down Inspector Drawer**: Side drawer to inspect raw telemetry audit metrics.

## Technical Architecture
- **Frontend Components**: Located under `frontend/src/components/analytics/`.
- **Data Integration**: Powered by `@tanstack/react-query` consuming `dashboardService.getOverview()`, `vehicleService.getVehicles()`, and `driverService.getDrivers()`.
