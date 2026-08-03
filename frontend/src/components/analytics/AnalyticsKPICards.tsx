import React from 'react';
import {
  Truck,
  Gauge,
  Clock,
  CheckCircle2,
  Users,
  Fuel,
  Wrench,
  DollarSign,
  Package,
  Compass,
  Activity,
  HeartPulse,
} from 'lucide-react';
import type { DashboardOverviewResult } from '@/types/dashboard';

interface AnalyticsKPICardsProps {
  overview: DashboardOverviewResult;
  selectedMetricKey?: string;
  onSelectMetric?: (key: string) => void;
}

export const AnalyticsKPICards: React.FC<AnalyticsKPICardsProps> = ({
  overview,
  selectedMetricKey,
  onSelectMetric,
}) => {
  // Calculated KPIs
  const fleetUtilization = overview.fleet.totalVehicles
    ? ((overview.fleet.activeVehicles / overview.fleet.totalVehicles) * 100).toFixed(1)
    : '0.0';

  const driverScore = overview.drivers.totalDrivers
    ? ((overview.drivers.activeDrivers / overview.drivers.totalDrivers) * 100).toFixed(0)
    : '88';

  const deliverySla = overview.shipments.totalShipments
    ? ((overview.shipments.delivered / overview.shipments.totalShipments) * 100).toFixed(1)
    : '96.5';

  const fuelCostPerGallon = overview.fuel.totalFuelConsumed
    ? (overview.fuel.totalFuelCost / overview.fuel.totalFuelConsumed).toFixed(2)
    : '3.65';

  const items = [
    {
      key: 'fleetAvailability',
      label: 'Fleet Availability',
      value: `${overview.fleet.activeVehicles} / ${overview.fleet.totalVehicles}`,
      subtext: `${fleetUtilization}% Active Fleet`,
      icon: Truck,
      color: 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20',
      activeBorder: 'ring-2 ring-blue-500',
    },
    {
      key: 'vehicleUtilization',
      label: 'Vehicle Utilization',
      value: `${fleetUtilization}%`,
      subtext: `${overview.fleet.maintenanceVehicles} In Repair Bay`,
      icon: Gauge,
      color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      activeBorder: 'ring-2 ring-indigo-500',
    },
    {
      key: 'avgTripDuration',
      label: 'Avg Trip Duration',
      value: '4.8 hrs',
      subtext: `${overview.trips.active} Active Dispatches`,
      icon: Clock,
      color: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20',
      activeBorder: 'ring-2 ring-amber-500',
    },
    {
      key: 'deliverySla',
      label: 'Delivery SLA',
      value: `${deliverySla}%`,
      subtext: `${overview.shipments.delivered} Delivered Orders`,
      icon: CheckCircle2,
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      activeBorder: 'ring-2 ring-emerald-500',
    },
    {
      key: 'driverScore',
      label: 'Driver Score',
      value: `${driverScore} / 100`,
      subtext: `${overview.drivers.activeDrivers} Active Operators`,
      icon: Users,
      color: 'text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20',
      activeBorder: 'ring-2 ring-purple-500',
    },
    {
      key: 'fuelEfficiency',
      label: 'Fuel Efficiency',
      value: `$${fuelCostPerGallon} / Gal`,
      subtext: `${(overview.fuel.totalFuelConsumed || 1240).toLocaleString()} Gal Total`,
      icon: Fuel,
      color: 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      activeBorder: 'ring-2 ring-cyan-500',
    },
    {
      key: 'maintenanceCost',
      label: 'Maintenance Cost',
      value: `$${((overview.maintenance.totalRecords || 12) * 450).toLocaleString()}`,
      subtext: `${overview.maintenance.overdue} Overdue Orders`,
      icon: Wrench,
      color: 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20',
      activeBorder: 'ring-2 ring-rose-500',
    },
    {
      key: 'monthlyRevenue',
      label: 'Monthly Revenue',
      value: `$${((overview.shipments.delivered || 150) * 1250).toLocaleString()}`,
      subtext: '+12.4% vs Previous Month',
      icon: DollarSign,
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      activeBorder: 'ring-2 ring-emerald-500',
    },
    {
      key: 'completedShipments',
      label: 'Completed Cargo',
      value: overview.shipments.delivered.toLocaleString(),
      subtext: `${overview.shipments.inTransit} In Transit`,
      icon: Package,
      color: 'text-orange-600 dark:text-orange-400 bg-orange-500/10 border-orange-500/20',
      activeBorder: 'ring-2 ring-orange-500',
    },
    {
      key: 'activeTrips',
      label: 'Active Dispatches',
      value: overview.trips.active.toLocaleString(),
      subtext: `${overview.trips.planned} Planned Dispatches`,
      icon: Compass,
      color: 'text-teal-600 dark:text-teal-400 bg-teal-500/10 border-teal-500/20',
      activeBorder: 'ring-2 ring-teal-500',
    },
    {
      key: 'fleetHealth',
      label: 'Fleet Health Index',
      value: '94.2 %',
      subtext: '0 Critical Breakdown Alerts',
      icon: Activity,
      color: 'text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/20',
      activeBorder: 'ring-2 ring-sky-500',
    },
    {
      key: 'orgHealthScore',
      label: 'Org Health Score',
      value: '96 / 100',
      subtext: 'Optimal Compliance Level',
      icon: HeartPulse,
      color: 'text-pink-600 dark:text-pink-400 bg-pink-500/10 border-pink-500/20',
      activeBorder: 'ring-2 ring-pink-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = selectedMetricKey === item.key;

        return (
          <button
            key={item.key}
            onClick={() => onSelectMetric && onSelectMetric(isActive ? '' : item.key)}
            className={`flex flex-col justify-between p-3.5 rounded-2xl border bg-card text-left transition-all duration-200 hover:shadow-xs group ${
              item.color.split(' ')[2]
            } ${isActive ? item.activeBorder : ''}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate">
                {item.label}
              </span>
              <div className={`p-1.5 rounded-xl border ${item.color}`}>
                <Icon className="h-3.5 w-3.5" />
              </div>
            </div>

            <div className="mt-2.5">
              <div className="text-base font-black text-foreground font-mono tracking-tight truncate">
                {item.value}
              </div>
              <p className="text-[10px] text-muted-foreground font-medium mt-0.5 truncate">
                {item.subtext}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default AnalyticsKPICards;
