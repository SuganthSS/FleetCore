# FleetCore AI Copilot Backend Documentation (SPEC-119)

## 📌 Executive Overview
The backend AI infrastructure for `SPEC-119` reuses and extends FleetCore's dedicated Groq LPU service (`backend/src/services/groq.service.ts`). It avoids duplicate model initialization or non-Groq model dependencies, delivering sub-second structured JSON predictions and multi-turn chat interaction.

---

## 🛠 API Endpoints & Service Architecture
Located in `backend/src/modules/ai/`:

### 1. `GET /api/v1/ai/insights`
- **Controller**: `aiCopilotController.getInsights`
- **Service**: `aiCopilotService.getInsights`
- **Function**: Aggregates real-time tenant telemetry via `dashboardService.getDashboardOverview()`, prompts Groq SDK with structured JSON enforcement, and returns executive health scores, predictive maintenance failures, route bottleneck recommendations, and fuel forecasts.

### 2. `POST /api/v1/ai/chat`
- **Controller**: `aiCopilotController.chat`
- **Service**: `aiCopilotService.chat`
- **Validation**: Enforced via `zod` (`chatSchema`).
- **Function**: Executes multi-turn operational conversations with Groq `llama-3.3-70b-versatile` utilizing `groqService.chat()`.

---

## 💡 Prompt Engineering (`backend/src/config/groq.prompts.ts`)
Standardized structured prompts enforcing strict JSON output schemas:
- `SYSTEM_COPILOT`
- `FLEET_EXECUTIVE_SUMMARY`
- `PREDICTIVE_MAINTENANCE`
- `ROUTE_OPTIMIZATION`
- `FUEL_COST_FORECAST`
- `OPERATIONAL_RECOMMENDATIONS`

---

## 🔒 Build & Lint Verification
- Backend TypeScript compilation (`npm run build`) passed with 0 errors.
- ESLint checks (`npm run lint`) passed.
