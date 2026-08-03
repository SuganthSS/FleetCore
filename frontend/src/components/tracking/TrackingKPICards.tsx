import React from 'react';
import { Radio, Wifi, WifiOff, Activity, Clock, ShieldAlert, ArrowUpRight } from 'lucide-react';

interface TrackingKPIData {
  total: number;
  online: number;
  offline: number;
  moving: number;
  idle: number;
  stopped: number;
  alerts: number;
}

interface TrackingKPICardsProps {
  data: TrackingKPIData;
  activeFilter: string;
  onFilterChange: (status: string) => void;
}

export const TrackingKPICards: React.FC<TrackingKPICardsProps> = ({
  data,
  activeFilter,
  onFilterChange,
}) => {
  const cards = [
    {
      id: 'total',
      filterKey: '',
      label: 'Fleet Monitored',
      count: data.total,
      icon: Radio,
      accentColor: 'text-foreground border-primary/20',
      bgHover: 'hover:border-primary/40',
    },
    {
      id: 'online',
      filterKey: 'online',
      label: 'Vehicles Online',
      count: data.online,
      icon: Wifi,
      accentColor: 'text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      bgHover: 'hover:border-emerald-500/40',
    },
    {
      id: 'moving',
      filterKey: 'moving',
      label: 'In Transit / Moving',
      count: data.moving,
      icon: Activity,
      accentColor: 'text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
      bgHover: 'hover:border-indigo-500/40',
    },
    {
      id: 'idle',
      filterKey: 'idle',
      label: 'Engine Idle',
      count: data.idle,
      icon: Clock,
      accentColor: 'text-amber-600 dark:text-amber-400 border-amber-500/20',
      bgHover: 'hover:border-amber-500/40',
    },
    {
      id: 'offline',
      filterKey: 'offline',
      label: 'Signal Offline',
      count: data.offline,
      icon: WifiOff,
      accentColor: 'text-slate-600 dark:text-slate-400 border-slate-500/20',
      bgHover: 'hover:border-slate-500/40',
    },
    {
      id: 'alerts',
      filterKey: 'alerts',
      label: 'Geofence Alerts',
      count: data.alerts,
      icon: ShieldAlert,
      accentColor: 'text-rose-600 dark:text-rose-400 border-rose-500/20',
      bgHover: 'hover:border-rose-500/40',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = activeFilter === card.filterKey;

        return (
          <button
            key={card.id}
            onClick={() => onFilterChange(isActive ? '' : card.filterKey)}
            className={`flex flex-col justify-between p-4 rounded-2xl border bg-card text-left transition-all duration-200 shadow-2xs ${
              card.bgHover
            } ${
              isActive
                ? 'ring-2 ring-primary border-primary bg-primary/5 shadow-md'
                : 'border-border'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                {card.label}
              </span>
              <div className={`p-1.5 rounded-xl bg-muted/60 ${card.accentColor}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-black text-foreground tracking-tight font-mono">
                {card.count}
              </span>
              <ArrowUpRight
                className={`h-4 w-4 transition-transform ${
                  isActive ? 'text-primary translate-x-0.5 -translate-y-0.5' : 'text-muted-foreground/40'
                }`}
              />
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default TrackingKPICards;
