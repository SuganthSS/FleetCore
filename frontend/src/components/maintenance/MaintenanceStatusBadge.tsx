import React from 'react';
import type { MaintenanceStatus } from '@/types/maintenance';

interface MaintenanceStatusBadgeProps {
  status: MaintenanceStatus;
}

export const MaintenanceStatusBadge: React.FC<MaintenanceStatusBadgeProps> = ({ status }) => {
  const getStyles = () => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30';
      case 'IN_PROGRESS':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/30';
      case 'COMPLETED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/30';
      case 'OVERDUE':
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800/30';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800/30 dark:text-gray-400 dark:border-gray-700/40';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const getLabel = () => {
    return status.replace('_', ' ');
  };

  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-bold border ${getStyles()}`}
    >
      {getLabel()}
    </span>
  );
};
export default MaintenanceStatusBadge;
