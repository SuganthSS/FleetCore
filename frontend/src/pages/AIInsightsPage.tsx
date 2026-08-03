import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import {
  aiCopilotService,
  ChatMessageItem,
} from '@/services/aiCopilot.service';
import {
  AICopilotHeader,
  ExecutiveSummaryCard,
  PredictiveMaintenanceCard,
  RouteAndFuelInsightsCard,
  RecommendationsCard,
  AICopilotDrawer,
  AISkeleton,
  AIErrorState,
} from '@/components/ai';

export const AIInsightsPage: React.FC = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Chat message state
  const [chatMessages, setChatMessages] = useState<ChatMessageItem[]>([
    {
      role: 'assistant',
      content:
        "Hello! I've analyzed your fleet data for this week. I noticed a 12% increase in idling time across East Coast routes. Would you like me to generate a detailed report?",
    },
  ]);

  // TanStack Query for AI Insights
  const { data: insightsData, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['aiInsights'],
    queryFn: async () => {
      const res = await aiCopilotService.getInsights();
      return res.data;
    },
  });

  // Chat Mutation
  const chatMutation = useMutation({
    mutationFn: async (updatedMessages: ChatMessageItem[]) => {
      const res = await aiCopilotService.sendChatMessage(updatedMessages);
      return res.data;
    },
    onSuccess: (data) => {
      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.content },
      ]);
    },
  });

  const clearAlertLater = () => {
    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);
  };

  const handleSendMessage = (content: string) => {
    const userMsg: ChatMessageItem = { role: 'user', content };
    const updated = [...chatMessages, userMsg];
    setChatMessages(updated);
    chatMutation.mutate(updated);
  };

  const handleSelectVehicle = (vehicleId: string) => {
    navigate(`/vehicles/${vehicleId}`);
  };

  const handleApplyRecommendation = (recId: string) => {
    setSuccessMessage(`Recommendation ${recId} successfully applied to fleet operations rules.`);
    clearAlertLater();
  };

  if (isLoading && !insightsData) {
    return <AISkeleton />;
  }

  if (error) {
    return (
      <AIErrorState
        title="Failed to Load AI Operational Insights"
        description={error instanceof Error ? error.message : 'Error reaching Groq AI LPU service.'}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <AICopilotHeader
        onRefresh={() => refetch()}
        isRefreshing={isFetching}
        onOpenChat={() => setDrawerOpen(true)}
      />

      {/* Notifications */}
      {successMessage && (
        <div className="flex items-center gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-600 dark:text-emerald-400 animate-scale-up">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span className="font-semibold">{successMessage}</span>
        </div>
      )}

      {/* Executive Summary Card */}
      {insightsData?.executiveSummary && (
        <ExecutiveSummaryCard summary={insightsData.executiveSummary} />
      )}

      {/* Predictive Maintenance */}
      {insightsData?.predictiveMaintenance && (
        <PredictiveMaintenanceCard
          maintenance={insightsData.predictiveMaintenance}
          onSelectVehicle={handleSelectVehicle}
        />
      )}

      {/* Route & Fuel Insights Grid */}
      {insightsData?.routeOptimization && insightsData?.fuelForecast && (
        <RouteAndFuelInsightsCard
          route={insightsData.routeOptimization}
          fuel={insightsData.fuelForecast}
        />
      )}

      {/* Recommendations */}
      {insightsData?.recommendations && (
        <RecommendationsCard
          recommendations={insightsData.recommendations}
          onApply={handleApplyRecommendation}
        />
      )}

      {/* Copilot Drawer */}
      <AICopilotDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        messages={chatMessages}
        onSendMessage={handleSendMessage}
        isLoading={chatMutation.isPending}
        suggestedQuestions={insightsData?.suggestedQuestions || []}
      />
    </div>
  );
};

export default AIInsightsPage;
