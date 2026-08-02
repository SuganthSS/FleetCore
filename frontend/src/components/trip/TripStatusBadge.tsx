import React from 'react';
import type { TripStatus } from '@/types/trip';

interface TripStatusBadgeProps {
  status: TripStatus;
}

export const TripStatusBadge: React.FC<TripStatusBadgeProps> = ({ status }) => {
  const getStyles = () => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20';
      case 'DISPATCHED':
        return 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20';
      case 'IN_TRANSIT':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20';
      case 'PAUSED':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20';
      case 'COMPLETED':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20';
      case 'CANCELLED':
        return 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/20';
      case 'FAILED':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20';
      default:
        return 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/20';
    }
  };

  const getLabel = () => {
    switch (status) {
      case 'SCHEDULED':
        return 'Scheduled';
      case 'DISPATCHED':
        return 'Dispatched';
      case 'IN_TRANSIT':
        return 'In Transit';
      case 'PAUSED':
        return 'Paused';
      case 'COMPLETED':
        return 'Completed';
      case 'CANCELLED':
        return 'Cancelled';
      case 'FAILED':
        return 'Failed';
      default:
        return status;
    }
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase select-none transition-colors duration-150 ${getStyles()}`}>
      <span className="mr-1 h-1 w-1 rounded-full bg-current" />
      {getLabel()}
    </span>
  );
};
export default TripStatusBadge;
