import React from 'react';
import { cn } from '@/utils/cn';

interface OperationsItem {
  label: string;
  value: string | number;
  badge?: string;
  badgeVariant?: 'success' | 'warning' | 'info' | 'error' | 'neutral';
}

interface OperationsCardProps {
  title: string;
  mainLabel: string;
  mainValue: string | number;
  items: OperationsItem[];
  loading?: boolean;
}

const badgeStyles = {
  success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  warning: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  info: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  error: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
  neutral: 'bg-muted text-muted-foreground',
};

export const OperationsCard: React.FC<OperationsCardProps> = ({
  title,
  mainLabel,
  mainValue,
  items,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm animate-pulse space-y-4">
        <div className="h-4 w-28 rounded bg-muted" />
        <div className="space-y-1">
          <div className="h-3 w-16 rounded bg-muted" />
          <div className="h-6 w-20 rounded bg-muted" />
        </div>
        <div className="space-y-2 pt-2 border-t border-border">
          <div className="flex justify-between"><div className="h-3 w-16 bg-muted rounded" /><div className="h-3 w-8 bg-muted rounded" /></div>
          <div className="flex justify-between"><div className="h-3 w-20 bg-muted rounded" /><div className="h-3 w-8 bg-muted rounded" /></div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
      <div>
        <h3 className="text-sm font-bold tracking-tight text-foreground">
          {title}
        </h3>
      </div>

      <div className="pb-3 border-b border-border/60">
        <span className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
          {mainLabel}
        </span>
        <span className="block text-2xl font-extrabold text-foreground mt-0.5 tracking-tight">
          {mainValue}
        </span>
      </div>

      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground font-medium">{item.label}</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-foreground">{item.value}</span>
              {item.badge && (
                <span className={cn(
                  "rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                  item.badgeVariant ? badgeStyles[item.badgeVariant] : badgeStyles.neutral
                )}>
                  {item.badge}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
