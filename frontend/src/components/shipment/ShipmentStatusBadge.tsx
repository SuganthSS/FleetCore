import React from 'react';
import { ShipmentStatus } from '@/types/shipment';

interface ShipmentStatusBadgeProps {
  status: ShipmentStatus;
  size?: 'sm' | 'md';
}

const statusConfig: Record<
  ShipmentStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  PENDING: {
    label: 'Pending Dispatch',
    bg: 'bg-amber-500/10 border-amber-500/20',
    text: 'text-amber-700 dark:text-amber-400',
    dot: 'bg-amber-500',
  },
  DISPATCHED: {
    label: 'Dispatched',
    bg: 'bg-blue-500/10 border-blue-500/20',
    text: 'text-blue-700 dark:text-blue-400',
    dot: 'bg-blue-500',
  },
  IN_TRANSIT: {
    label: 'In Transit',
    bg: 'bg-indigo-500/10 border-indigo-500/20',
    text: 'text-indigo-700 dark:text-indigo-400',
    dot: 'bg-indigo-500 animate-pulse',
  },
  DELIVERED: {
    label: 'Delivered',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    text: 'text-emerald-700 dark:text-emerald-400',
    dot: 'bg-emerald-500',
  },
  CANCELLED: {
    label: 'Cancelled',
    bg: 'bg-muted border-border',
    text: 'text-muted-foreground',
    dot: 'bg-muted-foreground',
  },
  FAILED: {
    label: 'Failed Delivery',
    bg: 'bg-destructive/10 border-destructive/20',
    text: 'text-destructive',
    dot: 'bg-destructive',
  },
};

export const ShipmentStatusBadge: React.FC<ShipmentStatusBadgeProps> = ({
  status,
  size = 'md',
}) => {
  const config = statusConfig[status] || {
    label: status,
    bg: 'bg-muted border-border',
    text: 'text-muted-foreground',
    dot: 'bg-muted-foreground',
  };

  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-[10px] gap-1'
      : 'px-2.5 py-1 text-xs gap-1.5';

  return (
    <span
      className={`inline-flex items-center rounded-full font-bold border ${config.bg} ${config.text} ${sizeClasses}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};

export default ShipmentStatusBadge;
