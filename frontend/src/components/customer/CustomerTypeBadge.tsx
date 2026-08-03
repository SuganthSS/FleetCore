import React from 'react';
import { CustomerType } from '@/types/customer';
import { Building2, User, Crown, Handshake } from 'lucide-react';

interface CustomerTypeBadgeProps {
  type: CustomerType | 'VIP';
  size?: 'sm' | 'md';
}

const typeConfig: Record<
  CustomerType | 'VIP',
  { label: string; bg: string; text: string; icon: React.FC<{ className?: string }> }
> = {
  CORPORATE: {
    label: 'Corporate',
    bg: 'bg-blue-500/10 border-blue-500/20',
    text: 'text-blue-700 dark:text-blue-400',
    icon: Building2,
  },
  INDIVIDUAL: {
    label: 'Individual',
    bg: 'bg-purple-500/10 border-purple-500/20',
    text: 'text-purple-700 dark:text-purple-400',
    icon: User,
  },
  PARTNER: {
    label: 'Partner',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    text: 'text-emerald-700 dark:text-emerald-400',
    icon: Handshake,
  },
  VIP: {
    label: 'VIP Enterprise',
    bg: 'bg-amber-500/10 border-amber-500/20',
    text: 'text-amber-700 dark:text-amber-400',
    icon: Crown,
  },
};

export const CustomerTypeBadge: React.FC<CustomerTypeBadgeProps> = ({
  type,
  size = 'md',
}) => {
  const config = typeConfig[type] || {
    label: type,
    bg: 'bg-muted border-border',
    text: 'text-muted-foreground',
    icon: Building2,
  };

  const Icon = config.icon;
  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-[10px] gap-1'
      : 'px-2.5 py-1 text-xs gap-1.5';

  return (
    <span
      className={`inline-flex items-center rounded-md font-semibold border ${config.bg} ${config.text} ${sizeClasses}`}
    >
      <Icon className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
      {config.label}
    </span>
  );
};

export default CustomerTypeBadge;
