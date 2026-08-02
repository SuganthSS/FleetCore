import React from 'react';

interface NotificationTypeBadgeProps {
  type: 'SYSTEM' | 'VEHICLE' | 'DRIVER' | 'TRIP' | 'FUEL' | 'MAINTENANCE';
}

export const NotificationTypeBadge: React.FC<NotificationTypeBadgeProps> = ({ type }) => {
  const styles = {
    SYSTEM: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200/60',
    VEHICLE: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200/60',
    DRIVER: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200/60',
    TRIP: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200/60',
    FUEL: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200/60',
    MAINTENANCE: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 border-rose-200/60',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${styles[type] || styles.SYSTEM}`}>
      {type}
    </span>
  );
};
export default NotificationTypeBadge;
