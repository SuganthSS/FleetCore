import React from 'react';
import type { RouteType } from '@/types/route';

interface RouteTypeBadgeProps {
  type: RouteType | 'LOCAL' | 'INTERNATIONAL';
}

export const RouteTypeBadge: React.FC<RouteTypeBadgeProps> = ({ type }) => {
  const getStyles = () => {
    switch (type) {
      case 'URBAN':
      case 'LAST_MILE':
      case 'LOCAL':
        return 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/20';
      case 'REGIONAL':
      case 'HIGHWAY':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20';
      case 'INTERSTATE':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20';
      case 'CROSS_BORDER':
      case 'INTERNATIONAL':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20';
      default:
        return 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/20';
    }
  };

  const getLabel = () => {
    switch (type) {
      case 'URBAN':
        return 'Urban';
      case 'LAST_MILE':
        return 'Last Mile';
      case 'LOCAL':
        return 'Local';
      case 'REGIONAL':
        return 'Regional';
      case 'HIGHWAY':
        return 'Highway';
      case 'INTERSTATE':
        return 'Interstate';
      case 'CROSS_BORDER':
        return 'Cross Border';
      case 'INTERNATIONAL':
        return 'International';
      default:
        return type;
    }
  };

  return (
    <span className={`inline-flex items-center rounded-lg px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase select-none transition-colors duration-150 ${getStyles()}`}>
      {getLabel()}
    </span>
  );
};
export default RouteTypeBadge;
