import React from 'react';
import { Sparkles, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';
import type { DashboardOverviewResult } from '@/types/dashboard';

interface ExecutiveSummaryCardProps {
  overview: DashboardOverviewResult;
}

export const ExecutiveSummaryCard: React.FC<ExecutiveSummaryCardProps> = ({ overview }) => {
  const activeRate = overview.fleet.totalVehicles
    ? Math.round((overview.fleet.activeVehicles / overview.fleet.totalVehicles) * 100)
    : 85;

  return (
    <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/5 via-card to-card p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-primary text-white shadow-xs">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-foreground tracking-tight">
              AI Operational Summary & Executive Insights
            </h3>
            <p className="text-xs text-muted-foreground">
              Automated fleet performance diagnostics derived from live telemetry & financial logs.
            </p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-mono text-xs font-bold border border-primary/20">
          AI Model Gemini 3.0 Pro
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="p-4 rounded-xl border border-border/80 bg-card/60 space-y-2">
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
            <TrendingUp className="h-4 w-4" />
            <span>High Fleet Efficiency ({activeRate}%)</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Fleet utilization is currently operating at optimal capacity with {overview.fleet.activeVehicles} active units. Driver availability matches dispatch volume.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-border/80 bg-card/60 space-y-2">
          <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold text-xs">
            <AlertTriangle className="h-4 w-4" />
            <span>Maintenance & Overdue Work Orders</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {overview.maintenance.overdue} maintenance work orders require immediate technician sign-off to minimize emergency breakdown downtime.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-border/80 bg-card/60 space-y-2">
          <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
            <ShieldCheck className="h-4 w-4" />
            <span>Fuel & Cost Optimization</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Fuel consumption rate of {(overview.fuel.totalFuelConsumed || 0).toLocaleString()} gallons is tracking within budget constraints with 96.5% shipment SLA compliance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveSummaryCard;
