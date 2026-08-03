import React from 'react';
import { Wrench, Calendar, AlertTriangle, CheckCircle2, Clock, ShieldAlert } from 'lucide-react';

export interface MaintenanceKPICounts {
  total: number;
  scheduled: number;
  inProgress: number;
  completed: number;
  overdue: number;
  critical: number;
}

interface MaintenanceKPICardsProps {
  counts: MaintenanceKPICounts;
  activeFilter: string;
  onFilterChange: (filterKey: string) => void;
}

export const MaintenanceKPICards: React.FC<MaintenanceKPICardsProps> = ({
  counts,
  activeFilter,
  onFilterChange,
}) => {
  const cards = [
    {
      id: 'total',
      label: 'Total Work Orders',
      value: counts.total,
      subtext: 'Active service logs',
      icon: Wrench,
      color: 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20',
      activeBorder: 'ring-2 ring-blue-500',
    },
    {
      id: 'SCHEDULED',
      label: 'Scheduled',
      value: counts.scheduled,
      subtext: 'Upcoming in 7 days',
      icon: Calendar,
      color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      activeBorder: 'ring-2 ring-indigo-500',
    },
    {
      id: 'IN_PROGRESS',
      label: 'In Progress',
      value: counts.inProgress,
      subtext: 'Active bay repairs',
      icon: Clock,
      color: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20',
      activeBorder: 'ring-2 ring-amber-500',
    },
    {
      id: 'COMPLETED',
      label: 'Completed',
      value: counts.completed,
      subtext: 'Serviced this month',
      icon: CheckCircle2,
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      activeBorder: 'ring-2 ring-emerald-500',
    },
    {
      id: 'OVERDUE',
      label: 'Overdue',
      value: counts.overdue,
      subtext: 'Past target date',
      icon: AlertTriangle,
      color: 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20',
      activeBorder: 'ring-2 ring-rose-500',
    },
    {
      id: 'critical',
      label: 'Critical / Emergency',
      value: counts.critical,
      subtext: 'High priority diagnostics',
      icon: ShieldAlert,
      color: 'text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20',
      activeBorder: 'ring-2 ring-purple-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = activeFilter === card.id;

        return (
          <button
            key={card.id}
            onClick={() => onFilterChange(isActive ? '' : card.id)}
            className={`flex flex-col justify-between p-4 rounded-2xl border bg-card text-left transition-all duration-200 hover:shadow-xs group ${
              card.color.split(' ')[2]
            } ${isActive ? card.activeBorder : ''}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                {card.label}
              </span>
              <div className={`p-2 rounded-xl border ${card.color}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-3">
              <div className="text-xl font-black text-foreground font-mono tracking-tight">
                {card.value}
              </div>
              <p className="text-[10px] text-muted-foreground font-medium mt-0.5">{card.subtext}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default MaintenanceKPICards;
