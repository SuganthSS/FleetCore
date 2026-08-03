import React from 'react';
import { Activity, ShieldAlert, DollarSign, Zap } from 'lucide-react';
import { AIInsightsData } from '@/services/aiCopilot.service';

interface ExecutiveSummaryCardProps {
  summary: AIInsightsData['executiveSummary'];
}

export const ExecutiveSummaryCard: React.FC<ExecutiveSummaryCardProps> = ({ summary }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
              <Zap className="h-3.5 w-3.5" /> Live Operational Summary
            </span>
            <span className="text-xs text-muted-foreground font-semibold">
              Updated just now
            </span>
          </div>

          <p className="text-sm md:text-base font-medium text-foreground leading-relaxed">
            "{summary.summaryText}"
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground pt-2">
            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
              <ShieldAlert className="h-4 w-4" /> Top Risk: {summary.topRiskFactor}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 shrink-0 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
          <div className="rounded-xl border border-border bg-card p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-xs font-medium text-muted-foreground mb-1">
              <Activity className="h-3.5 w-3.5 text-primary" /> Health Score
            </div>
            <span className="text-xl font-extrabold text-foreground">{summary.healthScore}%</span>
          </div>

          <div className="rounded-xl border border-border bg-card p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-xs font-medium text-muted-foreground mb-1">
              <ShieldAlert className="h-3.5 w-3.5 text-rose-500" /> Active Alerts
            </div>
            <span className="text-xl font-extrabold text-rose-600 dark:text-rose-400">
              {summary.activeAlertsCount}
            </span>
          </div>

          <div className="col-span-2 md:col-span-1 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-1">
              <DollarSign className="h-3.5 w-3.5" /> Savings Target
            </div>
            <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
              {summary.projectedCostSavings}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
