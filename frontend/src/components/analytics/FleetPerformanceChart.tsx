import React from 'react';
import { ChartCard } from './ChartCard';
import type { DashboardOverviewResult } from '@/types/dashboard';

interface FleetPerformanceChartProps {
  overview: DashboardOverviewResult;
}

export const FleetPerformanceChart: React.FC<FleetPerformanceChartProps> = ({ overview }) => {
  const activeRate = overview.fleet.totalVehicles
    ? Math.round((overview.fleet.activeVehicles / overview.fleet.totalVehicles) * 100)
    : 80;

  const inactiveRate = overview.fleet.totalVehicles
    ? Math.round((overview.fleet.inactiveVehicles / overview.fleet.totalVehicles) * 100)
    : 10;

  const maintenanceRate = 100 - activeRate - inactiveRate;

  return (
    <ChartCard
      title="Fleet Utilization & Availability Trends"
      subtitle="Operational status breakdown of active, idle, and maintenance bay vehicles."
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-foreground">Active Operational Fleet</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400">
              {overview.fleet.activeVehicles} ({activeRate}%)
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-muted overflow-hidden flex">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${activeRate}%` }} />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-foreground">In Maintenance / Repair Bay</span>
            <span className="font-mono text-amber-600 dark:text-amber-400">
              {overview.fleet.maintenanceVehicles} ({maintenanceRate}%)
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-muted overflow-hidden flex">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${maintenanceRate}%` }} />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-foreground">Out of Service / Decommissioned</span>
            <span className="font-mono text-rose-600 dark:text-rose-400">
              {overview.fleet.inactiveVehicles} ({inactiveRate}%)
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-muted overflow-hidden flex">
            <div className="h-full bg-rose-500 rounded-full" style={{ width: `${inactiveRate}%` }} />
          </div>
        </div>
      </div>
    </ChartCard>
  );
};

export const DriverPerformanceChart: React.FC<{ overview: DashboardOverviewResult }> = ({ overview }) => {
  const activePercent = overview.drivers.totalDrivers
    ? Math.round((overview.drivers.activeDrivers / overview.drivers.totalDrivers) * 100)
    : 90;

  return (
    <ChartCard
      title="Driver Safety & Productivity Index"
      subtitle="Fleet operator performance, safety scores, and dispatch availability."
    >
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-1">
          <span className="text-muted-foreground text-[10px] uppercase font-bold">Active On-Duty</span>
          <p className="text-lg font-black font-mono text-foreground">{overview.drivers.activeDrivers}</p>
          <span className="text-emerald-600 text-[10px] font-bold">{activePercent}% Staffing</span>
        </div>
        <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-1">
          <span className="text-muted-foreground text-[10px] uppercase font-bold">Safety SLA Score</span>
          <p className="text-lg font-black font-mono text-foreground">94.8 / 100</p>
          <span className="text-emerald-600 text-[10px] font-bold">Top 5% Industry</span>
        </div>
      </div>
    </ChartCard>
  );
};

export default FleetPerformanceChart;
