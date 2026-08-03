import React from 'react';
import { ChartCard } from './ChartCard';
import type { DashboardOverviewResult } from '@/types/dashboard';

interface OperationalCategoryCardsProps {
  overview: DashboardOverviewResult;
}

export const FuelAnalyticsCard: React.FC<OperationalCategoryCardsProps> = ({ overview }) => {
  const avgCostPerGallon = overview.fuel.totalFuelConsumed
    ? (overview.fuel.totalFuelCost / overview.fuel.totalFuelConsumed).toFixed(2)
    : '3.65';

  return (
    <ChartCard
      title="Fuel Consumption & Spend Telemetry"
      subtitle="Total refueling cost ($) vs fuel volume consumed (Gal)."
    >
      <div className="space-y-3 text-xs">
        <div className="flex justify-between items-center p-3 rounded-xl bg-muted/40 border border-border">
          <span className="text-muted-foreground font-medium">Total Fuel Spend:</span>
          <span className="font-mono font-black text-foreground text-sm">
            ${overview.fuel.totalFuelCost.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 rounded-xl bg-muted/40 border border-border">
          <span className="text-muted-foreground font-medium">Volume Consumed:</span>
          <span className="font-mono font-bold text-foreground">
            {overview.fuel.totalFuelConsumed.toLocaleString()} Gal
          </span>
        </div>
        <div className="flex justify-between items-center p-3 rounded-xl bg-muted/40 border border-border">
          <span className="text-muted-foreground font-medium">Unit Price Efficiency:</span>
          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
            ${avgCostPerGallon} / Gal
          </span>
        </div>
      </div>
    </ChartCard>
  );
};

export const MaintenanceAnalyticsCard: React.FC<OperationalCategoryCardsProps> = ({ overview }) => {
  return (
    <ChartCard
      title="Maintenance & Work Order Audit"
      subtitle="Repair bay status breakdown and work order resolution."
    >
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold space-y-1">
          <span className="text-[10px] text-muted-foreground uppercase">Scheduled</span>
          <p className="text-base font-black font-mono text-foreground">{overview.maintenance.scheduled}</p>
        </div>
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 font-bold space-y-1">
          <span className="text-[10px] text-muted-foreground uppercase">In Progress</span>
          <p className="text-base font-black font-mono text-foreground">{overview.maintenance.inProgress}</p>
        </div>
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold space-y-1">
          <span className="text-[10px] text-muted-foreground uppercase">Completed</span>
          <p className="text-base font-black font-mono text-foreground">{overview.maintenance.completed}</p>
        </div>
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 font-bold space-y-1">
          <span className="text-[10px] text-muted-foreground uppercase">Overdue</span>
          <p className="text-base font-black font-mono text-foreground">{overview.maintenance.overdue}</p>
        </div>
      </div>
    </ChartCard>
  );
};

export const ShipmentAnalyticsCard: React.FC<OperationalCategoryCardsProps> = ({ overview }) => {
  return (
    <ChartCard
      title="Shipment & Cargo Logistics SLA"
      subtitle="Order fulfillment metrics across dispatch, transit, and delivery."
    >
      <div className="space-y-2 text-xs">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Delivered Orders:</span>
          <span className="font-mono font-bold text-emerald-600">{overview.shipments.delivered}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">In Transit:</span>
          <span className="font-mono font-bold text-blue-600">{overview.shipments.inTransit}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Pending Dispatch:</span>
          <span className="font-mono font-bold text-amber-600">{overview.shipments.pending}</span>
        </div>
      </div>
    </ChartCard>
  );
};

export const TripAnalyticsCard: React.FC<OperationalCategoryCardsProps> = ({ overview }) => {
  return (
    <ChartCard
      title="Trip & Dispatch Operations"
      subtitle="Active dispatches, completed routes, and planned schedules."
    >
      <div className="space-y-2 text-xs">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Completed Trips:</span>
          <span className="font-mono font-bold text-foreground">{overview.trips.completed}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Active On Route:</span>
          <span className="font-mono font-bold text-emerald-600">{overview.trips.active}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Scheduled / Planned:</span>
          <span className="font-mono font-bold text-indigo-600">{overview.trips.planned}</span>
        </div>
      </div>
    </ChartCard>
  );
};
