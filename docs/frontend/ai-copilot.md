# FleetCore AI Insights & Operations Copilot Frontend Documentation (SPEC-119)

## 📌 Executive Overview
The FleetCore AI Insights module (`SPEC-119`) provides an Enterprise Operations Copilot powered strictly by Groq LPU High-Speed Inference. Designed in total visual alignment with the Stitch `AI Insights - FleetCore` screen, it supplies predictive telemetry analytics, fleet health scoring, route bottleneck bypasses, fuel spike forecasting, and interactive multi-turn chat capabilities.

---

## 🛠 Component Architecture & Structure
The module components reside in `frontend/src/components/ai/` and are consumed by `frontend/src/pages/AIInsightsPage.tsx`.

### 1. `AICopilotHeader`
- **Purpose**: Page title, Groq LPU engine status badge, live intelligence refresh action, and Copilot drawer trigger.

### 2. `ExecutiveSummaryCard`
- **Purpose**: Visual summary card displaying fleet health score (0-100), active risk factors, active alert counts, and monthly savings targets.

### 3. `PredictiveMaintenanceCard`
- **Purpose**: Predictive maintenance risk cards featuring unit breakdown probabilities, component failure predictions, and countdown timers.

### 4. `RouteAndFuelInsightsCard`
- **Purpose**: Dual operational cards showing traffic delay avoidance, Sector 4 route recommendations, fuel price spike predictions, and high-idle fuel consumption assets.

### 5. `RecommendationsCard`
- **Purpose**: Prioritized AI action items categorized by Fuel, Maintenance, Safety, Route, and Cost with instant rule application handlers.

### 6. `AICopilotDrawer`
- **Purpose**: Slide-over multi-turn chat interface supporting suggested operational queries, Groq reasoning status indicators, and response rendering.

### 7. `AIStates` (`AISkeleton`, `AIEmptyState`, `AIErrorState`)
- **Purpose**: Pulse loading skeletons, empty state placeholders, and error retry handlers.

---

## 🔒 Data & Type Integrity
- **Service Integration**: Managed via `frontend/src/services/aiCopilot.service.ts`.
- **Query & Mutation Handling**: Powered by TanStack Query (`useQuery` and `useMutation`).
- **Validation**: Zero TypeScript compiler or Linter errors (`npm run build && npm run lint` clean).
