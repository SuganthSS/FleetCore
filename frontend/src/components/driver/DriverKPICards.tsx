import React from 'react';
import { Users, CheckCircle2, Route, Clock, AlertTriangle, ShieldAlert } from 'lucide-react';

interface DriverKPIData {
  total: number;
  available: number;
  onTrip: number;
  offDuty: number;
  expiringLicense: number;
  suspended: number;
}

interface DriverKPICardsProps {
  data: DriverKPIData;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export const DriverKPICards: React.FC<DriverKPICardsProps> = ({
  data,
  activeFilter,
  onFilterChange,
}) => {
  const cards = [
    {
      id: '',
      title: 'Total Fleet Drivers',
      count: data.total,
      pct: '100%',
      icon: Users,
      color: 'text-primary bg-primary/10 border-primary/20',
      barColor: 'bg-primary',
    },
    {
      id: 'AVAILABLE',
      title: 'Available / Ready',
      count: data.available,
      pct: data.total ? `${Math.round((data.available / data.total) * 100)}%` : '0%',
      icon: CheckCircle2,
      color: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20',
      barColor: 'bg-emerald-500',
    },
    {
      id: 'ON_TRIP',
      title: 'Active On Trip',
      count: data.onTrip,
      pct: data.total ? `${Math.round((data.onTrip / data.total) * 100)}%` : '0%',
      icon: Route,
      color: 'text-blue-600 bg-blue-500/10 border-blue-500/20',
      barColor: 'bg-blue-500',
    },
    {
      id: 'OFF_DUTY',
      title: 'Off Duty / Leave',
      count: data.offDuty,
      pct: data.total ? `${Math.round((data.offDuty / data.total) * 100)}%` : '0%',
      icon: Clock,
      color: 'text-amber-600 bg-amber-500/10 border-amber-500/20',
      barColor: 'bg-amber-500',
    },
    {
      id: 'EXPIRING',
      title: 'Expiring License',
      count: data.expiringLicense,
      pct: data.total ? `${Math.round((data.expiringLicense / data.total) * 100)}%` : '0%',
      icon: AlertTriangle,
      color: 'text-orange-600 bg-orange-500/10 border-orange-500/20',
      barColor: 'bg-orange-500',
    },
    {
      id: 'SUSPENDED',
      title: 'Suspended',
      count: data.suspended,
      pct: data.total ? `${Math.round((data.suspended / data.total) * 100)}%` : '0%',
      icon: ShieldAlert,
      color: 'text-red-600 bg-red-500/10 border-red-500/20',
      barColor: 'bg-red-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = activeFilter === card.id;

        return (
          <button
            key={card.id || 'all'}
            onClick={() => onFilterChange(card.id)}
            className={`flex flex-col justify-between rounded-xl border p-4 text-left transition-all ${
              isActive
                ? 'border-primary ring-2 ring-primary/20 bg-card shadow-sm'
                : 'border-border bg-card hover:border-border/80 hover:shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`p-2 rounded-lg border ${card.color}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-foreground tracking-tight">
                  {card.count}
                </span>
                <span className="text-[11px] font-semibold text-muted-foreground">
                  {card.pct}
                </span>
              </div>

              {/* Progress bar */}
              <div className="mt-2.5 h-1 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${card.barColor}`}
                  style={{ width: card.pct }}
                />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default DriverKPICards;
