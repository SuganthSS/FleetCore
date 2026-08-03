import apiClient from './api';

export interface AIInsightsData {
  executiveSummary: {
    healthScore: number;
    summaryText: string;
    activeAlertsCount: number;
    topRiskFactor: string;
    projectedCostSavings: string;
    fleetEfficiencyIndex: string;
  };
  predictiveMaintenance: {
    highPriorityCount: number;
    predictedFailures: Array<{
      vehicleId: string;
      unitName: string;
      component: string;
      riskProbability: number;
      timeToFailureHours: number;
      recommendedAction: string;
    }>;
  };
  routeOptimization: {
    reroutedDeliveriesCount: number;
    estimatedTimeSavedHours: number;
    estimatedFuelSavedLiters: number;
    bottlenecks: Array<{
      sector: string;
      impactSeverity: 'HIGH' | 'MEDIUM' | 'LOW';
      suggestion: string;
    }>;
  };
  fuelForecast: {
    projectedWeeklySpikePercent: number;
    suggestedRefuelStrategy: string;
    highConsumptionVehicles: Array<{
      vehicleId: string;
      unitName: string;
      avgMpgOrLp100km: string;
      excessIdleHours: number;
    }>;
  };
  recommendations: Array<{
    id: string;
    category: 'MAINTENANCE' | 'FUEL' | 'SAFETY' | 'ROUTE' | 'COST';
    title: string;
    impact: 'HIGH' | 'MEDIUM' | 'LOW';
    description: string;
    potentialSavings: string;
  }>;
  suggestedQuestions: string[];
}

export interface ChatMessageItem {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export const aiCopilotService = {
  async getInsights(companyId?: string) {
    const response = await apiClient.get<{ success: boolean; data: AIInsightsData }>('/ai/insights', {
      params: { companyId },
    });
    return response.data;
  },

  async sendChatMessage(messages: ChatMessageItem[]) {
    const response = await apiClient.post<{
      success: boolean;
      data: { content: string; usage?: Record<string, number> };
    }>('/ai/chat', { messages });
    return response.data;
  },
};
