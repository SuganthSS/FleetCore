import React from 'react';
import type { ShipmentStatus } from '@/types/shipment';

interface ShipmentStatusBadgeProps {
  status: ShipmentStatus | 'ASSIGNED';
}

export const ShipmentStatusBadge: React.FC<ShipmentStatusBadgeProps> = ({ status }) => {
  const getStyles = () => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20';
      case 'ASSIGNED':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20';
      case 'DISPATCHED':
        return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20';
      case 'IN_TRANSIT':
        return 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20';
      case 'DELIVERED':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20';
      case 'FAILED':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20';
      case 'CANCELLED':
        return 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/20';
      default:
        return 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/20';
    }
  };

  const getLabel = () => {
    switch (status) {
      case 'PENDING':
        return 'Pending';
      case 'ASSIGNED':
        return 'Assigned';
      case 'DISPATCHED':
        return 'Dispatched';
      case 'IN_TRANSIT':
        return 'In Transit';
      case 'DELIVERED':
        return 'Delivered';
      case 'FAILED':
        return 'Failed';
      case 'CANCELLED':
        return 'Cancelled';
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
export default ShipmentStatusBadge;
