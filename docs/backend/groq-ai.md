# Groq AI Service Documentation (SPEC-100)

This document provides a reference for the Groq AI infrastructure implemented in the FleetCore platform.

---

## ⚙️ Environment Variables

The AI storage layer relies on the following key environment variables configured in `backend/.env`:

```env
GROQ_API_KEY=gsk_your_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
```

If these environment variables are missing, the configuration module logs a warning and disables AI functions gracefully without crashing the application boot cycle.

---

## 🏗️ Reusable Prompt templates

All AI requests use predefined system and user prompt templates located in `src/constants/ai-prompts.ts`:

- `AI_PROMPTS.FLEET_ASSISTANT`: Fleet assistant instructions
- `AI_PROMPTS.TRIP_OPTIMIZATION`: Suggests load distribution, timing, and rest cycles
- `AI_PROMPTS.ROUTE_ANALYSIS`: Route metrics analysis (traffic, distance, performance)
- `AI_PROMPTS.FUEL_ANALYSIS`: Refueling data auditor and anomaly detector
- `AI_PROMPTS.MAINTENANCE_ANALYSIS`: Predictive maintenance analytics
- `AI_PROMPTS.DRIVER_ANALYSIS`: Driver performance score evaluator
- `AI_PROMPTS.SHIPMENT_SUMMARY`: Executive cargo delivery summary
- `AI_PROMPTS.OPERATIONS_SUMMARY`: Operations health highlights
- `AI_PROMPTS.RISK_ANALYSIS`: Hazard detection (weather, fatigue, delay)
- `AI_PROMPTS.EXECUTIVE_DASHBOARD_SUMMARY`: Condenses metrics for executive consumption

---

## 🔌 Reusable Groq AI Service

The service `src/services/groq.service.ts` exports the following asynchronous helpers:

### 1. `generateText(request: AIRequest)`
Generates plaintext completion output using a single user text prompt.

### 2. `generateJSON(request: AIRequest)`
Enforces a structured JSON completion response format (uses `response_format: { type: "json_object" }`).

### 3. `chat(request: AIRequest)`
Supports multi-turn chat messages.

### 4. `healthCheck()`
Performs a lightweight, real-time query to verify that:
- The API Key exists.
- The Groq API is reachable.
- The default model is active and responding.

---

## 🛡️ Reliability & Security
- **Retry Policy**: Up to 3 retries using exponential backoff starting at a 1000ms delay.
- **Sanitized Errors**: Ensures internal trace details and API secrets are never returned in client errors.
- **Timeout Support**: Defaults to a 25-second timeout threshold on API connections.
