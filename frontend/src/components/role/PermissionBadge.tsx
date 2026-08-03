import React from 'react';
import type { PermissionAction } from '@/types/role';

interface PermissionBadgeProps {
  action: PermissionAction | string;
}

export const PermissionBadge: React.FC<PermissionBadgeProps> = ({ action }) => {
  const getBadgeStyle = (act: string) => {
    switch (act) {
      case 'View':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Create':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Edit':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Delete':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Export':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Approve':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'Assign':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Manage':
        return 'bg-slate-900 text-white border-slate-900';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[11px] font-medium font-['Inter'] ${getBadgeStyle(
        action
      )}`}
    >
      {action}
    </span>
  );
};
