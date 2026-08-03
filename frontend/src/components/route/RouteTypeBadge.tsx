import React from 'react';
import { RouteType } from '@/types/route';
import { Navigation, Building2, Globe, MapPin, Milestone, Truck } from 'lucide-react';

interface RouteTypeBadgeProps {
  type: RouteType;
  size?: 'sm' | 'md';
}

const typeConfig: Record<
  RouteType,
  { label: string; bg: string; text: string; icon: React.FC<{ className?: string }> }
> = {
  HIGHWAY: {
    label: 'Highway',
    bg: 'bg-indigo-500/10 border-indigo-500/20',
    text: 'text-indigo-700 dark:text-indigo-400',
    icon: Milestone,
  },
  URBAN: {
    label: 'Urban',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    text: 'text-emerald-700 dark:text-emerald-400',
    icon: Building2,
  },
  INTERSTATE: {
    label: 'Interstate',
    bg: 'bg-blue-500/10 border-blue-500/20',
    text: 'text-blue-700 dark:text-blue-400',
    icon: Navigation,
  },
  CROSS_BORDER: {
    label: 'Cross-Border',
    bg: 'bg-purple-500/10 border-purple-500/20',
    text: 'text-purple-700 dark:text-purple-400',
    icon: Globe,
  },
  REGIONAL: {
    label: 'Regional',
    bg: 'bg-amber-500/10 border-amber-500/20',
    text: 'text-amber-700 dark:text-amber-400',
    icon: MapPin,
  },
  LAST_MILE: {
    label: 'Last Mile',
    bg: 'bg-cyan-500/10 border-cyan-500/20',
    text: 'text-cyan-700 dark:text-cyan-400',
    icon: Truck,
  },
};

export const RouteTypeBadge: React.FC<RouteTypeBadgeProps> = ({
  type,
  size = 'md',
}) => {
  const config = typeConfig[type] || {
    label: type,
    bg: 'bg-muted border-border',
    text: 'text-muted-foreground',
    icon: Navigation,
  };

  const Icon = config.icon;
  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-[10px] gap-1'
      : 'px-2.5 py-1 text-xs gap-1.5';

  return (
    <span
      className={`inline-flex items-center rounded-md font-medium border ${config.bg} ${config.text} ${sizeClasses}`}
    >
      <Icon className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
      {config.label}
    </span>
  );
};

export default RouteTypeBadge;
