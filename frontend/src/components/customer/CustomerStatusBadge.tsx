import React from 'react';
import type { CustomerStatus } from '@/types/customer';

interface CustomerStatusBadgeProps {
  status: CustomerStatus;
}

export const CustomerStatusBadge: React.FC<CustomerStatusBadgeProps> = ({ status }) => {
  const getStyles = () => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20';
      case 'INACTIVE':
        return 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/20';
      case 'SUSPENDED':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20';
      case 'PENDING_VERIFICATION':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20';
      default:
        return 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/20';
    }
  };

  const getLabel = () => {
    switch (status) {
      case 'ACTIVE':
        return 'Active';
      case 'INACTIVE':
        return 'Inactive';
      case 'SUSPENDED':
        return 'Suspended';
      case 'PENDING_VERIFICATION':
        return 'Pending';
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
export default CustomerStatusBadge;
