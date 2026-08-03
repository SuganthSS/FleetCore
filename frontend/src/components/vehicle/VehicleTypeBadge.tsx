import React from 'react';
import type { VehicleType } from '@/types/vehicle';

interface VehicleTypeBadgeProps {
  type: VehicleType;
}

const TYPE_CONFIG: Record<VehicleType, { label: string; cls: string }> = {
  TRUCK: { label: 'Truck', cls: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20' },
  VAN: { label: 'Van', cls: 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20' },
  TRAILER: { label: 'Trailer', cls: 'bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20' },
  BUS: { label: 'Bus', cls: 'bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-500/20' },
  CAR: { label: 'Car', cls: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20' },
  SPECIALIZED: { label: 'Specialized', cls: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20' },
};

export const VehicleTypeBadge: React.FC<VehicleTypeBadgeProps> = ({ type }) => {
  const config = TYPE_CONFIG[type] ?? { label: type, cls: 'bg-zinc-500/10 text-zinc-600 border-zinc-500/20' };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-wide ${config.cls}`}>
      {config.label}
    </span>
  );
};

export default VehicleTypeBadge;
