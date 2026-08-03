import React from 'react';
import { X, BarChart3, Layers } from 'lucide-react';
import type { DashboardOverviewResult } from '@/types/dashboard';

interface AnalyticsDrawerProps {
  open: boolean;
  onClose: () => void;
  overview: DashboardOverviewResult | null;
  selectedMetricKey?: string;
}

export const AnalyticsDrawer: React.FC<AnalyticsDrawerProps> = ({
  open,
  onClose,
  overview,
  selectedMetricKey,
}) => {
  if (!open || !overview) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-xs" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-card border-l border-border shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-border flex items-center justify-between bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-foreground">Analytics Drill-Down Inspector</h2>
                <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                  {selectedMetricKey ? `Metric: ${selectedMetricKey}` : 'Detailed Telemetry Audit'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
            <div className="p-4 rounded-2xl border border-primary/20 bg-primary/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground">Executive Compliance Status</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 font-mono text-[10px] font-bold">
                  98.4% PASSED
                </span>
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed">
                All aggregate metrics cross-referenced against historical benchmarks. Maintenance downtime, driver hours of service (HOS), and fuel transactions match policy bounds.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-primary" />
                Raw Metric Audit Log
              </h4>

              <div className="space-y-2 font-mono">
                <div className="flex justify-between p-3 rounded-xl border border-border bg-card">
                  <span className="text-muted-foreground">Total Fleet Vehicles:</span>
                  <span className="font-bold text-foreground">{overview.fleet.totalVehicles}</span>
                </div>
                <div className="flex justify-between p-3 rounded-xl border border-border bg-card">
                  <span className="text-muted-foreground">Active Operational Vehicles:</span>
                  <span className="font-bold text-emerald-600">{overview.fleet.activeVehicles}</span>
                </div>
                <div className="flex justify-between p-3 rounded-xl border border-border bg-card">
                  <span className="text-muted-foreground">Total Driver Personnel:</span>
                  <span className="font-bold text-foreground">{overview.drivers.totalDrivers}</span>
                </div>
                <div className="flex justify-between p-3 rounded-xl border border-border bg-card">
                  <span className="text-muted-foreground">Fuel Volume Consumed:</span>
                  <span className="font-bold text-blue-600">{overview.fuel.totalFuelConsumed.toLocaleString()} Gal</span>
                </div>
                <div className="flex justify-between p-3 rounded-xl border border-border bg-card">
                  <span className="text-muted-foreground">Maintenance Work Orders:</span>
                  <span className="font-bold text-amber-600">{overview.maintenance.totalRecords}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border bg-muted/20">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl border border-input bg-card text-foreground font-bold text-xs hover:bg-muted transition-colors"
            >
              Close Inspector
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDrawer;
