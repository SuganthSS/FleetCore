import React from 'react';
import { Truck, CheckCircle2, Route, Wrench, PowerOff } from 'lucide-react';

interface KPIData {
  total: number;
  available: number;
  onTrip: number;
  maintenance: number;
  inactive: number;
}

interface FleetKPICardsProps {
  data: KPIData;
  activeFilter: string;
  onFilterChange: (status: string) => void;
}

const kpiItems = [
  {
    key: 'total',
    label: 'Total Fleet',
    icon: Truck,
    colorClass: 'text-primary',
    bgClass: 'bg-primary/10',
    borderClass: 'border-primary/20',
    activeClass: 'ring-2 ring-primary ring-offset-1',
    filter: '',
  },
  {
    key: 'available',
    label: 'Available',
    icon: CheckCircle2,
    colorClass: 'text-emerald-600 dark:text-emerald-400',
    bgClass: 'bg-emerald-500/10',
    borderClass: 'border-emerald-500/20',
    activeClass: 'ring-2 ring-emerald-500 ring-offset-1',
    filter: 'AVAILABLE',
  },
  {
    key: 'onTrip',
    label: 'In Trip',
    icon: Route,
    colorClass: 'text-blue-600 dark:text-blue-400',
    bgClass: 'bg-blue-500/10',
    borderClass: 'border-blue-500/20',
    activeClass: 'ring-2 ring-blue-500 ring-offset-1',
    filter: 'ON_TRIP',
  },
  {
    key: 'maintenance',
    label: 'Maintenance',
    icon: Wrench,
    colorClass: 'text-amber-600 dark:text-amber-400',
    bgClass: 'bg-amber-500/10',
    borderClass: 'border-amber-500/20',
    activeClass: 'ring-2 ring-amber-500 ring-offset-1',
    filter: 'MAINTENANCE',
  },
  {
    key: 'inactive',
    label: 'Inactive',
    icon: PowerOff,
    colorClass: 'text-zinc-500 dark:text-zinc-400',
    bgClass: 'bg-zinc-500/10',
    borderClass: 'border-zinc-500/20',
    activeClass: 'ring-2 ring-zinc-400 ring-offset-1',
    filter: 'OUT_OF_SERVICE',
  },
];

export const FleetKPICards: React.FC<FleetKPICardsProps> = ({
  data,
  activeFilter,
  onFilterChange,
}) => {
  const getValue = (key: string): number => {
    switch (key) {
      case 'total': return data.total;
      case 'available': return data.available;
      case 'onTrip': return data.onTrip;
      case 'maintenance': return data.maintenance;
      case 'inactive': return data.inactive;
      default: return 0;
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {kpiItems.map((item) => {
        const Icon = item.icon;
        const value = getValue(item.key);
        const isActive = activeFilter === item.filter;

        return (
          <button
            key={item.key}
            onClick={() => onFilterChange(item.filter)}
            className={`group relative flex flex-col gap-3 rounded-xl border p-4 bg-card text-left transition-all hover:-translate-y-0.5 hover:shadow-md ${
              isActive ? `${item.activeClass} shadow-sm` : 'border-border shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${item.bgClass} border ${item.borderClass}`}>
                <Icon className={`h-4.5 w-4.5 ${item.colorClass}`} />
              </div>
              {isActive && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${item.bgClass} ${item.colorClass}`}>
                  Active
                </span>
              )}
            </div>

            <div>
              <span className="block text-2xl font-bold text-foreground tracking-tight">
                {value.toLocaleString()}
              </span>
              <span className="block text-xs font-medium text-muted-foreground mt-0.5">
                {item.label}
              </span>
            </div>

            {/* Utilization bar */}
            <div className="h-1 w-full rounded-full bg-muted/50 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${item.bgClass.replace('/10', '/60')}`}
                style={{ width: data.total > 0 ? `${Math.round((value / data.total) * 100)}%` : '0%' }}
              />
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default FleetKPICards;
