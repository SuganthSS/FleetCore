import React from 'react';
import { Shield, Truck, Compass, Wrench, DollarSign, User } from 'lucide-react';
import type { UserRoleName } from '@/types/user';

interface RoleBadgeProps {
  roleName: UserRoleName | string;
  size?: 'sm' | 'md';
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ roleName, size = 'md' }) => {
  const getBadgeStyle = (name: string) => {
    switch (name) {
      case 'Administrator':
        return {
          bg: 'bg-[#eff4ff] text-[#004ac6] border-[#b4c5ff]',
          icon: Shield,
        };
      case 'Fleet Manager':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: Truck,
        };
      case 'Dispatcher':
        return {
          bg: 'bg-purple-50 text-purple-700 border-purple-200',
          icon: Compass,
        };
      case 'Maintenance Manager':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          icon: Wrench,
        };
      case 'Accountant':
        return {
          bg: 'bg-teal-50 text-teal-800 border-teal-200',
          icon: DollarSign,
        };
      case 'Driver':
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          icon: User,
        };
      default:
        return {
          bg: 'bg-gray-100 text-gray-700 border-gray-200',
          icon: User,
        };
    }
  };

  const style = getBadgeStyle(roleName);
  const Icon = style.icon;

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-['Inter'] font-semibold rounded-full border ${style.bg} ${sizeClasses}`}
    >
      <Icon className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
      {roleName}
    </span>
  );
};
