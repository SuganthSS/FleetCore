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

export const FleetManagerAIPage: React.FC = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Operational Chat message state initialized for Fleet Manager focus
  const [chatMessages, setChatMessages] = useState<ChatMessageItem[]>([
    {
      role: 'assistant',
      content:
        "Hello Fleet Manager! I've analyzed your active dispatches, driver duty cycles, and maintenance queues. Route 4 fuel consumption is trending 10% higher than average. Would you like dispatch optimization suggestions?",
    },
  ]);

  // Query AI Operational Insights
  const { data: insightsData, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['fleet-manager-aiInsights'],
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
    navigate(`/fleet-manager/vehicles/${vehicleId}`);
  };

  const handleApplyRecommendation = (recId: string) => {
    setSuccessMessage(`Dispatch rule recommendation ${recId} applied to active operational workflow.`);
    clearAlertLater();
  };

  if (isLoading && !insightsData) {
    return <AISkeleton />;
  }

  if (error) {
    return (
      <AIErrorState
        title="Failed to Load Operational AI Copilot"
        description={error instanceof Error ? error.message : 'Error reaching Groq AI operational telemetry service.'}
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
        <div className="flex items-center gap-2.5 rounded-xl border border-[#10b981]/20 bg-[#10b981]/10 p-4 text-xs font-bold text-[#10b981] animate-scale-up">
          <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
          <span>{successMessage}</span>
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
        suggestedQuestions={
          insightsData?.suggestedQuestions || [
            'Which vehicles require urgent maintenance before next trip dispatch?',
            'How can we reduce driver idle time on East Coast routes?',
            'What is the optimal speed threshold to improve fleet fuel MPG?',
          ]
        }
      />
    </div>
  );
};

export default FleetManagerAIPage;
