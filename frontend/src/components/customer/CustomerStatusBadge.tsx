import React from 'react';
import { CustomerStatus } from '@/types/customer';

interface CustomerStatusBadgeProps {
  status: CustomerStatus;
  size?: 'sm' | 'md';
}

const statusConfig: Record<
  CustomerStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  ACTIVE: {
    label: 'Active',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    text: 'text-emerald-700 dark:text-emerald-400',
    dot: 'bg-emerald-500',
  },
  INACTIVE: {
    label: 'Inactive',
    bg: 'bg-muted border-border',
    text: 'text-muted-foreground',
    dot: 'bg-muted-foreground',
  },
  SUSPENDED: {
    label: 'Suspended',
    bg: 'bg-destructive/10 border-destructive/20',
    text: 'text-destructive',
    dot: 'bg-destructive',
  },
  PENDING_VERIFICATION: {
    label: 'Pending Verification',
    bg: 'bg-amber-500/10 border-amber-500/20',
    text: 'text-amber-700 dark:text-amber-400',
    dot: 'bg-amber-500',
  },
};

export const CustomerStatusBadge: React.FC<CustomerStatusBadgeProps> = ({
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

export default CustomerStatusBadge;
