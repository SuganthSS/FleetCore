import React from 'react';
import { Navigation, Fuel } from 'lucide-react';
import { AIInsightsData } from '@/services/aiCopilot.service';

interface RouteAndFuelInsightsCardProps {
  route: AIInsightsData['routeOptimization'];
  fuel: AIInsightsData['fuelForecast'];
}

export const RouteAndFuelInsightsCard: React.FC<RouteAndFuelInsightsCardProps> = ({
  route,
  fuel,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Route Optimization */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Navigation className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">Route Optimization</h2>
            <p className="text-xs text-muted-foreground">Traffic bypass & ETA telemetry</p>
          </div>
        </div>

        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 text-xs font-semibold text-blue-600 dark:text-blue-400">
          Re-routing {route.reroutedDeliveriesCount} deliveries avoids traffic delays, saving an estimated {route.estimatedTimeSavedHours} hrs total.
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Active Bottlenecks
          </span>
          {route.bottlenecks.map((item, idx) => (
            <div key={idx} className="rounded-xl border border-border bg-background p-3 space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-foreground">
                <span>{item.sector}</span>
                <span className="text-amber-500 font-extrabold">{item.impactSeverity}</span>
              </div>
              <p className="text-xs text-muted-foreground">{item.suggestion}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Fuel Cost Forecast */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Fuel className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">Cost & Fuel Forecast</h2>
            <p className="text-xs text-muted-foreground">Refuel telemetry & market spikes</p>
          </div>
        </div>

        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs font-semibold text-amber-600 dark:text-amber-400">
          Fuel costs projected to spike by {fuel.projectedWeeklySpikePercent}%. {fuel.suggestedRefuelStrategy}
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            High Consumption Assets
          </span>
          {fuel.highConsumptionVehicles.map((item) => (
            <div key={item.vehicleId} className="flex items-center justify-between rounded-xl border border-border bg-background p-3">
              <div>
                <span className="text-xs font-bold text-foreground block">{item.unitName}</span>
                <span className="text-[11px] text-muted-foreground">
                  Idle: {item.excessIdleHours} hrs excess
                </span>
              </div>
              <div className="text-right text-xs font-extrabold text-amber-600 dark:text-amber-400">
                {item.avgMpgOrLp100km}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
