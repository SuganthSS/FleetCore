/**
 * Groq Prompt Engineering Library for FleetCore AI Operations Copilot
 * Enforces structured JSON output and domain-specific analytical reasoning.
 */

export const GROQ_PROMPTS = {
  SYSTEM_COPILOT: `You are FleetCore AI, an Enterprise Fleet Operations Copilot powered strictly by Groq LPU High-Speed Inference.
Your role is to analyze live telemetry across vehicles, drivers, trips, fuel consumption, maintenance work orders, route bottlenecks, and shipments.
Provide high-precision, data-driven operational intelligence.
NEVER reference non-Groq AI models.
ALWAYS format responses strictly as JSON when structured telemetry analysis is requested.`,

  FLEET_EXECUTIVE_SUMMARY: (telemetryData: Record<string, unknown>) => `
Analyze the following operational fleet telemetry and generate an Executive Summary JSON response:
Telemetry Context: ${JSON.stringify(telemetryData)}

Return ONLY a JSON object with this exact schema:
{
  "healthScore": number, // 0 to 100
  "summaryText": "string",
  "activeAlertsCount": number,
  "topRiskFactor": "string",
  "projectedCostSavings": "string",
  "fleetEfficiencyIndex": "string"
}`,

  PREDICTIVE_MAINTENANCE: (maintenanceData: Record<string, unknown>) => `
Perform predictive maintenance risk scoring on the following vehicle service logs and diagnostic telemetry:
Data: ${JSON.stringify(maintenanceData)}

Return ONLY a JSON object with this exact schema:
{
  "highPriorityCount": number,
  "predictedFailures": [
    {
      "vehicleId": "string",
      "unitName": "string",
      "component": "string",
      "riskProbability": number, // 0 to 100
      "timeToFailureHours": number,
      "recommendedAction": "string"
    }
  ]
}`,

  ROUTE_OPTIMIZATION: (routeData: Record<string, unknown>) => `
Analyze active fleet delivery routes and traffic bottleneck telemetry:
Data: ${JSON.stringify(routeData)}

Return ONLY a JSON object with this exact schema:
{
  "reroutedDeliveriesCount": number,
  "estimatedTimeSavedHours": number,
  "estimatedFuelSavedLiters": number,
  "bottlenecks": [
    {
      "sector": "string",
      "impactSeverity": "HIGH" | "MEDIUM" | "LOW",
      "suggestion": "string"
    }
  ]
}`,

  FUEL_COST_FORECAST: (fuelData: Record<string, unknown>) => `
Evaluate current fuel expenditures, refueling logs, and market trends:
Data: ${JSON.stringify(fuelData)}

Return ONLY a JSON object with this exact schema:
{
  "projectedWeeklySpikePercent": number,
  "suggestedRefuelStrategy": "string",
  "highConsumptionVehicles": [
    {
      "vehicleId": "string",
      "unitName": "string",
      "avgMpgOrLp100km": "string",
      "excessIdleHours": number
    }
  ]
}`,

  OPERATIONAL_RECOMMENDATIONS: (allMetrics: Record<string, unknown>) => `
Generate prioritized operational recommendations based on aggregated fleet data:
Metrics: ${JSON.stringify(allMetrics)}

Return ONLY a JSON object with this exact schema:
{
  "recommendations": [
    {
      "id": "string",
      "category": "MAINTENANCE" | "FUEL" | "SAFETY" | "ROUTE" | "COST",
      "title": "string",
      "impact": "HIGH" | "MEDIUM" | "LOW",
      "description": "string",
      "potentialSavings": "string"
    }
  ]
}`
};
