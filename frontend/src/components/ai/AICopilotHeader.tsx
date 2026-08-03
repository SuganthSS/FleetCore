import React from 'react';
import { Sparkles, RefreshCw, Cpu } from 'lucide-react';

interface AICopilotHeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
  onOpenChat: () => void;
}

export const AICopilotHeader: React.FC<AICopilotHeaderProps> = ({
  onRefresh,
  isRefreshing,
  onOpenChat,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-5">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-indigo-600 to-purple-600 text-white shadow-lg shadow-primary/25 animate-pulse">
          <Sparkles className="h-6 w-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              AI Insights & Operations Copilot
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Cpu className="h-3 w-3" /> Groq LPU Engine
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Actionable intelligence generated from your live fleet data. Real-time predictive analytics.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-semibold text-foreground shadow-sm hover:bg-muted transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh Intelligence
        </button>

        <button
          onClick={onOpenChat}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary via-indigo-600 to-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-primary/25 hover:opacity-95 transition-all"
        >
          <Sparkles className="h-4 w-4" />
          Launch Fleet Copilot
        </button>
      </div>
    </div>
  );
};
