import React from 'react';
import type { MaintenanceType } from '@/types/maintenance';

interface MaintenanceTypeBadgeProps {
  type: MaintenanceType;
}

export const MaintenanceTypeBadge: React.FC<MaintenanceTypeBadgeProps> = ({ type }) => {
  const getStyles = () => {
    switch (type) {
      case 'PREVENTIVE':
        return 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/20 dark:text-teal-400 dark:border-teal-800/30';
      case 'CORRECTIVE':
        return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800/30';
      case 'INSPECTION':
        return 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-900/20 dark:text-sky-400 dark:border-sky-800/30';
      case 'EMERGENCY':
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800/30';
      case 'OIL_CHANGE':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800/30';
      case 'BRAKE_SERVICE':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/30';
      case 'TIRE_SERVICE':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/30 dark:text-slate-400 dark:border-slate-700/40';
    }
  };

  const getLabel = () => {
    return type.replace('_', ' ');
  };

  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold border uppercase tracking-wider ${getStyles()}`}
    >
      {getLabel()}
    </span>
  );
};
export default MaintenanceTypeBadge;
