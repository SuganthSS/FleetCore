import React from 'react';
import type { RouteStatus } from '@/types/route';

interface RouteStatusBadgeProps {
  status: RouteStatus | 'INACTIVE' | 'ARCHIVED';
}

export const RouteStatusBadge: React.FC<RouteStatusBadgeProps> = ({ status }) => {
  const getStyles = () => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20';
      case 'PLANNED':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20';
      case 'OPTIMIZED':
        return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20';
      case 'COMPLETED':
        return 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20';
      case 'CANCELLED':
      case 'INACTIVE':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20';
      case 'ARCHIVED':
        return 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/20';
      default:
        return 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/20';
    }
  };

  const getLabel = () => {
    switch (status) {
      case 'ACTIVE':
        return 'Active';
      case 'PLANNED':
        return 'Planned';
      case 'OPTIMIZED':
        return 'Optimized';
      case 'COMPLETED':
        return 'Completed';
      case 'CANCELLED':
        return 'Cancelled';
      case 'INACTIVE':
        return 'Inactive';
      case 'ARCHIVED':
        return 'Archived';
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
export default RouteStatusBadge;
