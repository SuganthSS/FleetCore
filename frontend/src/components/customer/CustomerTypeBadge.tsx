import React from 'react';
import type { CustomerType } from '@/types/customer';

interface CustomerTypeBadgeProps {
  type: CustomerType;
}

export const CustomerTypeBadge: React.FC<CustomerTypeBadgeProps> = ({ type }) => {
  const getStyles = () => {
    switch (type) {
      case 'CORPORATE':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20';
      case 'INDIVIDUAL':
        return 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20';
      case 'PARTNER':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20';
      default:
        return 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/20';
    }
  };

  const getLabel = () => {
    switch (type) {
      case 'CORPORATE':
        return 'Corporate';
      case 'INDIVIDUAL':
        return 'Individual';
      case 'PARTNER':
        return 'Partner';
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
export default CustomerTypeBadge;
