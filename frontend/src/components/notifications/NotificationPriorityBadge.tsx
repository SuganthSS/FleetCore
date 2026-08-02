import React from 'react';

interface NotificationPriorityBadgeProps {
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export const NotificationPriorityBadge: React.FC<NotificationPriorityBadgeProps> = ({ priority }) => {
  const styles = {
    LOW: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    MEDIUM: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    HIGH: 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    CRITICAL: 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 animate-pulse',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${styles[priority] || styles.MEDIUM}`}>
      {priority}
    </span>
  );
};
export default NotificationPriorityBadge;
