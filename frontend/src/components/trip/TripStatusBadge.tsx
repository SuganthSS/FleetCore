import {
  Navigation,
  Clock,
  Send,
  PauseCircle,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from 'lucide-react';
import type { TripStatus } from '@/types/trip';

interface TripStatusBadgeProps {
  status: TripStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const TripStatusBadge: React.FC<TripStatusBadgeProps> = ({
  status,
  size = 'md',
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'SCHEDULED':
        return {
          label: 'Scheduled',
          icon: Clock,
          className:
            'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
        };
      case 'DISPATCHED':
        return {
          label: 'Dispatched',
          icon: Send,
          className:
            'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
        };
      case 'IN_TRANSIT':
        return {
          label: 'In Transit',
          icon: Navigation,
          className:
            'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
        };
      case 'PAUSED':
        return {
          label: 'Paused',
          icon: PauseCircle,
          className:
            'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
        };
      case 'COMPLETED':
        return {
          label: 'Completed',
          icon: CheckCircle2,
          className:
            'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        };
      case 'CANCELLED':
        return {
          label: 'Cancelled',
          icon: XCircle,
          className:
            'bg-gray-500/10 text-gray-500 dark:text-gray-400 border-gray-500/20',
        };
      case 'FAILED':
        return {
          label: 'Failed',
          icon: AlertTriangle,
          className:
            'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
        };
      default:
        return {
          label: status,
          icon: Navigation,
          className:
            'bg-muted text-muted-foreground border-border',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3 py-1.5 text-sm gap-2',
  };

  return (
    <span
      className={`inline-flex items-center font-bold rounded-full border shadow-2xs ${
        config.className
      } ${sizeClasses[size]}`}
    >
      <Icon className={size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-4 w-4' : 'h-3.5 w-3.5'} />
      {config.label}
    </span>
  );
};

export default TripStatusBadge;
