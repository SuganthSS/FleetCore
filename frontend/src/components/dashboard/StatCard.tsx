import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  accentColor: 'orange' | 'blue' | 'green' | 'red' | 'purple' | 'amber' | 'cyan' | 'rose';
  loading?: boolean;
}

const colorMap = {
  orange: {
    bg: 'bg-orange-500/10 dark:bg-orange-500/20',
    text: 'text-orange-600 dark:text-orange-400',
    border: 'border-orange-500/10 dark:border-orange-500/20',
  },
  blue: {
    bg: 'bg-blue-500/10 dark:bg-blue-500/20',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-500/10 dark:border-blue-500/20',
  },
  green: {
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-500/10 dark:border-emerald-500/20',
  },
  red: {
    bg: 'bg-red-500/10 dark:bg-red-500/20',
    text: 'text-red-600 dark:text-red-400',
    border: 'border-red-500/10 dark:border-red-500/20',
  },
  purple: {
    bg: 'bg-purple-500/10 dark:bg-purple-500/20',
    text: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-500/10 dark:border-purple-500/20',
  },
  amber: {
    bg: 'bg-amber-500/10 dark:bg-amber-500/20',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-500/10 dark:border-amber-500/20',
  },
  cyan: {
    bg: 'bg-cyan-500/10 dark:bg-cyan-500/20',
    text: 'text-cyan-600 dark:text-cyan-400',
    border: 'border-cyan-500/10 dark:border-cyan-500/20',
  },
  rose: {
    bg: 'bg-rose-500/10 dark:bg-rose-500/20',
    text: 'text-rose-600 dark:text-rose-400',
    border: 'border-rose-500/10 dark:border-rose-500/20',
  },
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  accentColor,
  loading = false,
}) => {
  const colors = colorMap[accentColor];

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm animate-pulse space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 rounded bg-muted" />
          <div className="h-9 w-9 rounded-lg bg-muted" />
        </div>
        <div className="h-7 w-16 rounded bg-muted" />
      </div>
    );
  }

  return (
    <div className={cn(
      "rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-300",
      "hover:-translate-y-1 hover:shadow-soft hover:border-muted-foreground/20"
    )}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {title}
        </span>
        <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", colors.bg, colors.text)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-foreground">
          {value}
        </span>
      </div>
    </div>
  );
};
