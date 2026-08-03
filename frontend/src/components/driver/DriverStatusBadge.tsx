import React from 'react';
import type { DriverAvailability } from '@/types/driver';

interface DriverStatusBadgeProps {
  status: DriverAvailability;
  size?: 'sm' | 'md';
}

const STATUS_CONFIG: Record<DriverAvailability, { label: string; dot: string; badge: string }> = {
  AVAILABLE: {
    label: 'Available',
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
  },
  ON_TRIP: {
    label: 'On Trip',
    dot: 'bg-blue-500',
    badge: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
  },
  OFF_DUTY: {
    label: 'Off Duty',
    dot: 'bg-amber-500',
    badge: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
  },
  ON_LEAVE: {
    label: 'On Leave',
    dot: 'bg-purple-500',
    badge: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
  },
  SUSPENDED: {
    label: 'Suspended',
    dot: 'bg-red-500',
    badge: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
  },
};

export const DriverStatusBadge: React.FC<DriverStatusBadgeProps> = ({ status, size = 'md' }) => {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    dot: 'bg-zinc-500',
    badge: 'bg-zinc-500/10 text-zinc-600 border-zinc-500/20',
  };

  const textSize = size === 'sm' ? 'text-[10px]' : 'text-xs';
  const dotSize = size === 'sm' ? 'h-1.5 w-1.5' : 'h-2 w-2';
  const px = size === 'sm' ? 'px-1.5 py-0.5' : 'px-2.5 py-0.5';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-semibold ${px} ${textSize} ${config.badge}`}>
      <span className={`rounded-full ${dotSize} ${config.dot} shrink-0`} />
      {config.label}
    </span>
  );
};

export default DriverStatusBadge;
