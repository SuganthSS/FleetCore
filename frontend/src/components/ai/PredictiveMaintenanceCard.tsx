import React from 'react';
import { AlertTriangle, Wrench, Clock, ChevronRight } from 'lucide-react';
import { AIInsightsData } from '@/services/aiCopilot.service';

interface PredictiveMaintenanceCardProps {
  maintenance: AIInsightsData['predictiveMaintenance'];
  onSelectVehicle: (vehicleId: string) => void;
}

export const PredictiveMaintenanceCard: React.FC<PredictiveMaintenanceCardProps> = ({
  maintenance,
  onSelectVehicle,
}) => {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <Wrench className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">Predictive Maintenance</h2>
            <p className="text-xs text-muted-foreground">AI component failure probability</p>
          </div>
        </div>
        <span className="rounded-full bg-rose-500/10 px-2.5 py-1 text-xs font-bold text-rose-600 dark:text-rose-400 border border-rose-500/20">
          {maintenance.highPriorityCount} High Priority
        </span>
      </div>

      <div className="space-y-3">
        {maintenance.predictedFailures.map((item) => (
          <div
            key={item.vehicleId}
            onClick={() => onSelectVehicle(item.vehicleId)}
            className="group flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border border-border bg-background p-4 hover:border-primary/50 transition-all cursor-pointer"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                  {item.unitName}
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="h-3 w-3" /> {item.component}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{item.recommendedAction}</p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="text-right">
                <div className="flex items-center gap-1 text-xs font-extrabold text-rose-600 dark:text-rose-400">
                  {item.riskProbability}% Risk
                </div>
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
                  <Clock className="h-3 w-3" /> Within {item.timeToFailureHours}h
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
