import React from 'react';
import type { ShipmentPriority } from '@/types/shipment';

interface ShipmentPriorityBadgeProps {
  priority: ShipmentPriority;
}

export const ShipmentPriorityBadge: React.FC<ShipmentPriorityBadgeProps> = ({ priority }) => {
  const getStyles = () => {
    switch (priority) {
      case 'LOW':
        return 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/20';
      case 'MEDIUM':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20';
      case 'HIGH':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20';
      case 'URGENT':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20';
      default:
        return 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/20';
    }
  };

  const getLabel = () => {
    switch (priority) {
      case 'LOW':
        return 'Low';
      case 'MEDIUM':
        return 'Medium';
      case 'HIGH':
        return 'High';
      case 'URGENT':
        return 'Urgent';
      default:
        return priority;
    }
  };

  return (
    <span className={`inline-flex items-center rounded-lg px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase select-none transition-colors duration-150 ${getStyles()}`}>
      {getLabel()}
    </span>
  );
};
export default ShipmentPriorityBadge;
