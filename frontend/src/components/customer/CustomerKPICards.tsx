import React from 'react';
import { Users, CheckCircle2, UserX, Crown, Building2, User } from 'lucide-react';

interface CustomerKPIData {
  total: number;
  active: number;
  inactive: number;
  vip: number;
  corporate: number;
  individual: number;
}

interface CustomerKPICardsProps {
  data: CustomerKPIData;
  activeStatusFilter?: string;
  activeTypeFilter?: string;
  onStatusFilterChange?: (status: string) => void;
  onTypeFilterChange?: (type: string) => void;
}

export const CustomerKPICards: React.FC<CustomerKPICardsProps> = ({
  data,
  activeStatusFilter,
  activeTypeFilter,
  onStatusFilterChange,
  onTypeFilterChange,
}) => {
  const cards = [
    {
      id: 'TOTAL',
      label: 'Total Customers',
      value: data.total,
      subtitle: 'Registered Accounts',
      icon: Users,
      color: 'text-primary',
      bg: 'bg-primary/10',
      progressBg: 'bg-primary',
      percent: 100,
      active: !activeStatusFilter && !activeTypeFilter,
      onClick: () => {
        onStatusFilterChange?.('');
        onTypeFilterChange?.('');
      },
    },
    {
      id: 'ACTIVE',
      label: 'Active Accounts',
      value: data.active,
      subtitle: `${data.total > 0 ? Math.round((data.active / data.total) * 100) : 0}% Active Client Base`,
      icon: CheckCircle2,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-500/10',
      progressBg: 'bg-emerald-500',
      percent: data.total > 0 ? (data.active / data.total) * 100 : 0,
      active: activeStatusFilter === 'ACTIVE',
      onClick: () => onStatusFilterChange?.(activeStatusFilter === 'ACTIVE' ? '' : 'ACTIVE'),
    },
    {
      id: 'INACTIVE',
      label: 'Inactive / Pending',
      value: data.inactive,
      subtitle: 'Dormant Accounts',
      icon: UserX,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-500/10',
      progressBg: 'bg-amber-500',
      percent: data.total > 0 ? (data.inactive / data.total) * 100 : 0,
      active: activeStatusFilter === 'INACTIVE',
      onClick: () => onStatusFilterChange?.(activeStatusFilter === 'INACTIVE' ? '' : 'INACTIVE'),
    },
    {
      id: 'VIP',
      label: 'VIP Enterprise',
      value: data.vip,
      subtitle: 'High Volume Key Clients',
      icon: Crown,
      color: 'text-yellow-600 dark:text-yellow-400',
      bg: 'bg-yellow-500/10',
      progressBg: 'bg-yellow-500',
      percent: data.total > 0 ? (data.vip / data.total) * 100 : 0,
      active: activeTypeFilter === 'VIP',
      onClick: () => onTypeFilterChange?.(activeTypeFilter === 'VIP' ? '' : 'VIP'),
    },
    {
      id: 'CORPORATE',
      label: 'Corporate',
      value: data.corporate,
      subtitle: 'B2B Logistics Accounts',
      icon: Building2,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-500/10',
      progressBg: 'bg-indigo-500',
      percent: data.total > 0 ? (data.corporate / data.total) * 100 : 0,
      active: activeTypeFilter === 'CORPORATE',
      onClick: () => onTypeFilterChange?.(activeTypeFilter === 'CORPORATE' ? '' : 'CORPORATE'),
    },
    {
      id: 'INDIVIDUAL',
      label: 'Individual',
      value: data.individual,
      subtitle: 'Direct Shipper Accounts',
      icon: User,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-500/10',
      progressBg: 'bg-purple-500',
      percent: data.total > 0 ? (data.individual / data.total) * 100 : 0,
      active: activeTypeFilter === 'INDIVIDUAL',
      onClick: () => onTypeFilterChange?.(activeTypeFilter === 'INDIVIDUAL' ? '' : 'INDIVIDUAL'),
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            onClick={card.onClick}
            className={`rounded-2xl border bg-card p-4 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
              card.active
                ? 'border-primary ring-2 ring-primary/20 shadow-md'
                : 'border-border hover:border-primary/40 hover:shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider truncate">
                {card.label}
              </span>
              <div className={`p-1.5 rounded-lg shrink-0 ${card.bg} ${card.color}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-3 space-y-1">
              <div className="text-2xl font-black text-foreground tracking-tight">
                {card.value}
              </div>
              <p className="text-[10px] text-muted-foreground font-medium truncate">
                {card.subtitle}
              </p>
            </div>

            <div className="mt-3 w-full bg-muted/40 rounded-full h-1 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${card.progressBg}`}
                style={{ width: `${Math.min(100, Math.max(5, card.percent))}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CustomerKPICards;
