import { Navigation, Clock, Send, CheckCircle2, AlertTriangle, ArrowUpRight } from 'lucide-react';
import type { TripStatus } from '@/types/trip';

interface TripKPIData {
  total: number;
  scheduled: number;
  dispatched: number;
  inTransit: number;
  paused: number;
  completed: number;
  issues: number;
}

interface TripKPICardsProps {
  data: TripKPIData;
  activeStatusFilter: string;
  onStatusFilterChange: (status: string) => void;
}

export const TripKPICards: React.FC<TripKPICardsProps> = ({
  data,
  activeStatusFilter,
  onStatusFilterChange,
}) => {
  const cards: Array<{
    id: string;
    statusKey: TripStatus | '';
    label: string;
    count: number;
    icon: React.FC<{ className?: string }>;
    accentColor: string;
    bgHover: string;
  }> = [
    {
      id: 'total',
      statusKey: '',
      label: 'Total Trips',
      count: data.total,
      icon: Navigation,
      accentColor: 'text-foreground border-primary/20',
      bgHover: 'hover:border-primary/40',
    },
    {
      id: 'scheduled',
      statusKey: 'SCHEDULED',
      label: 'Scheduled',
      count: data.scheduled,
      icon: Clock,
      accentColor: 'text-slate-600 dark:text-slate-400 border-slate-500/20',
      bgHover: 'hover:border-slate-500/40',
    },
    {
      id: 'dispatched',
      statusKey: 'DISPATCHED',
      label: 'Dispatched',
      count: data.dispatched,
      icon: Send,
      accentColor: 'text-blue-600 dark:text-blue-400 border-blue-500/20',
      bgHover: 'hover:border-blue-500/40',
    },
    {
      id: 'in_transit',
      statusKey: 'IN_TRANSIT',
      label: 'In Transit',
      count: data.inTransit,
      icon: Navigation,
      accentColor: 'text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
      bgHover: 'hover:border-indigo-500/40',
    },
    {
      id: 'completed',
      statusKey: 'COMPLETED',
      label: 'Completed',
      count: data.completed,
      icon: CheckCircle2,
      accentColor: 'text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      bgHover: 'hover:border-emerald-500/40',
    },
    {
      id: 'issues',
      statusKey: 'FAILED',
      label: 'Delayed / Failed',
      count: data.issues,
      icon: AlertTriangle,
      accentColor: 'text-rose-600 dark:text-rose-400 border-rose-500/20',
      bgHover: 'hover:border-rose-500/40',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = activeStatusFilter === card.statusKey;

        return (
          <button
            key={card.id}
            onClick={() => onStatusFilterChange(isActive ? '' : (card.statusKey as string))}
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

export default TripKPICards;
