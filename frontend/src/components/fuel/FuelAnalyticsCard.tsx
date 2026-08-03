import React from 'react';
import { Fuel, TrendingUp, DollarSign, Award, ArrowUpRight } from 'lucide-react';

interface FuelAnalyticsCardProps {
  totalConsumed: number;
  monthlyCost: number;
  avgMileage: number;
}

export const FuelAnalyticsCard: React.FC<FuelAnalyticsCardProps> = ({
  totalConsumed,
  monthlyCost,
  avgMileage,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Monthly Expenditure Trend */}
      <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <DollarSign className="h-4 w-4" />
            </div>
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Fuel Cost Analytics
            </h3>
          </div>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
            -4.2% Cost Savings
          </span>
        </div>

        <div className="space-y-1">
          <div className="text-2xl font-black text-foreground font-mono">
            ${monthlyCost.toLocaleString()}
          </div>
          <p className="text-[11px] text-muted-foreground">
            Total operational expenditure logged across all active fleet refuelings.
          </p>
        </div>

        {/* Visual Progress Bar */}
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-[11px] font-bold font-mono">
            <span className="text-muted-foreground">Budget Target ($450k)</span>
            <span className="text-foreground">92% Utilized</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div className="bg-indigo-600 h-2 rounded-full w-[92%]" />
          </div>
        </div>
      </div>

      {/* Mileage Efficiency Benchmark */}
      <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-4 w-4" />
            </div>
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Mileage Benchmark
            </h3>
          </div>
          <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
            Optimal Range
          </span>
        </div>

        <div className="space-y-1">
          <div className="text-2xl font-black text-foreground font-mono">
            {avgMileage.toFixed(1)} <span className="text-sm font-bold text-muted-foreground">MPG</span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Average fuel efficiency across long-haul freight and local delivery vehicles.
          </p>
        </div>

        {/* Efficiency Sparkline visual */}
        <div className="flex items-center gap-2 pt-2 text-xs font-semibold text-muted-foreground">
          <Award className="h-4 w-4 text-amber-500 shrink-0" />
          <span>Top performing vehicle: <strong>UNIT-901 (8.4 MPG)</strong></span>
        </div>
      </div>

      {/* Fuel Consumption Anomaly Monitor */}
      <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Fuel className="h-4 w-4" />
            </div>
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Consumption Audit
            </h3>
          </div>
          <span className="text-[10px] font-bold text-muted-foreground font-mono">
            {totalConsumed.toLocaleString()} Gal Total
          </span>
        </div>

        <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-foreground">Standard Fuel Type</span>
            <span className="font-mono font-bold text-primary">Ultra-Low Sulfur Diesel</span>
          </div>
          <div className="flex items-center justify-between border-t border-border/40 pt-1.5">
            <span className="font-semibold text-foreground">Fuel Theft / Leakage Alerts</span>
            <span className="font-bold text-emerald-600 font-mono">0 Detected</span>
          </div>
        </div>

        <button className="w-full flex items-center justify-center gap-1.5 text-xs font-bold text-primary hover:underline pt-1">
          <span>View Detailed Fuel Audit Log</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

export default FuelAnalyticsCard;
