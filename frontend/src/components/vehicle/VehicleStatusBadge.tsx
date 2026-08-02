import React from 'react';
import type { VehicleStatus } from '@/types/vehicle';
import { cn } from '@/utils/cn';

interface VehicleStatusBadgeProps {
  status: VehicleStatus;
  className?: string;
}

const statusStyles = {
  AVAILABLE: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  ON_TRIP: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  MAINTENANCE: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
  OUT_OF_SERVICE: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
  DECOMMISSIONED: 'bg-zinc-500/15 text-zinc-600 dark:text-zinc-400 border-zinc-500/20',
};

export const VehicleStatusBadge: React.FC<VehicleStatusBadgeProps> = ({
  status,
  className,
}) => {
  const displayLabel = status.replace(/_/g, ' ');

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider',
        statusStyles[status] || 'bg-muted text-muted-foreground border-border',
        className
      )}
    >
      {displayLabel}
    </span>
  );
};
