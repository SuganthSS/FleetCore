import React from 'react';
import { Truck, AlertTriangle, ShieldCheck } from 'lucide-react';

interface FleetOverviewCardProps {
  total: number;
  active: number;
  inactive: number;
  maintenance: number;
  loading?: boolean;
}

export const FleetOverviewCard: React.FC<FleetOverviewCardProps> = ({
  total,
  active,
  inactive,
  maintenance,
  loading = false,
}) => {
  const utilization = total > 0 ? Math.round((active / total) * 100) : 0;

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm animate-pulse space-y-4">
        <div className="h-5 w-40 rounded bg-muted" />
        <div className="flex flex-col sm:flex-row gap-6 items-center">
          <div className="h-20 w-20 rounded-full bg-muted" />
          <div className="flex-1 space-y-2 w-full">
            <div className="h-4 w-3/4 rounded bg-muted" />
            <div className="h-3 w-1/2 rounded bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  // Calculate percentages for the distribution bar
  const activePercent = total > 0 ? (active / total) * 100 : 0;
  const maintenancePercent = total > 0 ? (maintenance / total) * 100 : 0;
  const inactivePercent = total > 0 ? (inactive / total) * 100 : 0;

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h2 className="text-base font-bold tracking-tight text-foreground">
          Fleet Overview
        </h2>
        <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          <ShieldCheck className="h-3.5 w-3.5" />
          System Active
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Utilization circular KPI display */}
        <div className="md:col-span-4 flex flex-col items-center justify-center border-r border-border/60 pr-0 md:pr-6">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Utilization Rate
          </span>
          <span className="text-5xl font-extrabold tracking-tighter text-primary mt-2">
            {utilization}%
          </span>
          <span className="text-xs text-muted-foreground mt-1">
            {active} of {total} vehicles on road
          </span>
        </div>

        {/* Breakdown details */}
        <div className="md:col-span-8 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <span>Status distribution</span>
              <span>{total} total vehicles</span>
            </div>
            {/* Multi-segment progress bar */}
            <div className="h-3 w-full rounded-full bg-muted overflow-hidden flex">
              <div
                style={{ width: `${activePercent}%` }}
                className="bg-emerald-500 transition-all duration-500"
                title={`Active: ${active}`}
              />
              <div
                style={{ width: `${maintenancePercent}%` }}
                className="bg-orange-500 transition-all duration-500"
                title={`Maintenance: ${maintenance}`}
              />
              <div
                style={{ width: `${inactivePercent}%` }}
                className="bg-zinc-400 transition-all duration-500"
                title={`Inactive: ${inactive}`}
              />
            </div>
          </div>

          {/* Cards grid representing different statuses */}
          <div className="grid grid-cols-3 gap-3">
            {/* Active */}
            <div className="rounded-lg bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/10 p-3 text-center">
              <div className="flex justify-center text-emerald-500 mb-1">
                <Truck className="h-4 w-4" />
              </div>
              <span className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Active
              </span>
              <span className="block text-lg font-bold text-foreground mt-0.5">
                {active}
              </span>
            </div>

            {/* Maintenance */}
            <div className="rounded-lg bg-orange-500/5 dark:bg-orange-500/10 border border-orange-500/10 p-3 text-center">
              <div className="flex justify-center text-orange-500 mb-1">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <span className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Service
              </span>
              <span className="block text-lg font-bold text-foreground mt-0.5">
                {maintenance}
              </span>
            </div>

            {/* Inactive */}
            <div className="rounded-lg bg-zinc-500/5 dark:bg-zinc-500/10 border border-zinc-500/10 p-3 text-center">
              <div className="flex justify-center text-zinc-500 mb-1">
                <Truck className="h-4 w-4 opacity-50" />
              </div>
              <span className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Inactive
              </span>
              <span className="block text-lg font-bold text-foreground mt-0.5">
                {inactive}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
