import React from 'react';
import type { DriverAvailability } from '@/types/driver';
import { cn } from '@/utils/cn';

interface DriverStatusBadgeProps {
  status: DriverAvailability;
  className?: string;
}

const statusStyles = {
  AVAILABLE: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  ON_TRIP: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  OFF_DUTY: 'bg-zinc-500/15 text-zinc-600 dark:text-zinc-400 border-zinc-500/20',
  ON_LEAVE: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  SUSPENDED: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
};

export const DriverStatusBadge: React.FC<DriverStatusBadgeProps> = ({
  status,
  className,
}) => {
  const displayLabel = status.replace(/_/g, ' ');

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider',
        statusStyles[status] || 'bg-muted text-muted-foreground border-border',
        className
      )}
    >
      {displayLabel}
    </span>
  );
};
export default DriverStatusBadge;
