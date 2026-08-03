import React from 'react';
import { ShipmentPriority } from '@/types/shipment';
import { AlertCircle, ArrowUp, Minus, AlertTriangle } from 'lucide-react';

interface ShipmentPriorityBadgeProps {
  priority: ShipmentPriority;
  size?: 'sm' | 'md';
}

const priorityConfig: Record<
  ShipmentPriority,
  { label: string; bg: string; text: string; icon: React.FC<{ className?: string }> }
> = {
  LOW: {
    label: 'Low Priority',
    bg: 'bg-muted border-border',
    text: 'text-muted-foreground',
    icon: Minus,
  },
  MEDIUM: {
    label: 'Medium',
    bg: 'bg-blue-500/10 border-blue-500/20',
    text: 'text-blue-700 dark:text-blue-400',
    icon: ArrowUp,
  },
  HIGH: {
    label: 'High Priority',
    bg: 'bg-amber-500/10 border-amber-500/20',
    text: 'text-amber-700 dark:text-amber-400',
    icon: AlertTriangle,
  },
  URGENT: {
    label: 'URGENT FREIGHT',
    bg: 'bg-destructive/10 border-destructive/20',
    text: 'text-destructive font-black',
    icon: AlertCircle,
  },
};

export const ShipmentPriorityBadge: React.FC<ShipmentPriorityBadgeProps> = ({
  priority,
  size = 'md',
}) => {
  const config = priorityConfig[priority] || {
    label: priority,
    bg: 'bg-muted border-border',
    text: 'text-muted-foreground',
    icon: Minus,
  };

  const Icon = config.icon;
  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-[10px] gap-1'
      : 'px-2.5 py-1 text-xs gap-1.5';

  return (
    <span
      className={`inline-flex items-center rounded-md font-semibold border ${config.bg} ${config.text} ${sizeClasses}`}
    >
      <Icon className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
      {config.label}
    </span>
  );
};

export default ShipmentPriorityBadge;
