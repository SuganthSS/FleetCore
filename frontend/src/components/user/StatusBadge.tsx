import React from 'react';
import type { UserStatus } from '@/types/user';

interface StatusBadgeProps {
  status: UserStatus | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getStatusStyle = (s: string) => {
    switch (s.toUpperCase()) {
      case 'ACTIVE':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
          label: 'Active',
        };
      case 'INACTIVE':
        return {
          bg: 'bg-slate-100 text-slate-600 border-slate-200',
          dot: 'bg-slate-400',
          label: 'Inactive',
        };
      case 'SUSPENDED':
        return {
          bg: 'bg-[#ffdad6] text-[#ba1a1a] border-[#ffdad6]',
          dot: 'bg-[#ba1a1a]',
          label: 'Suspended',
        };
      default:
        return {
          bg: 'bg-gray-100 text-gray-600 border-gray-200',
          dot: 'bg-gray-400',
          label: s,
        };
    }
  };

  const style = getStatusStyle(status);
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-['Inter'] font-semibold rounded-full border ${style.bg} ${sizeClasses}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {style.label}
    </span>
  );
};
