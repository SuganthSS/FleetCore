import React from 'react';
import { Truck, CheckCircle2, AlertTriangle, TrendingUp, ShieldAlert } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  trend?: string;
  isPositive?: boolean;
  type?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtext,
  trend,
  isPositive = true,
  type = 'default',
}) => {
  const getStyle = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
          icon: CheckCircle2,
        };
      case 'warning':
        return {
          bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
          icon: AlertTriangle,
        };
      case 'danger':
        return {
          bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
          icon: ShieldAlert,
        };
      case 'info':
        return {
          bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
          icon: Truck,
        };
      default:
        return {
          bg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
          icon: TrendingUp,
        };
    }
  };

  const style = getStyle();
  const Icon = style.icon;

  return (
    <div className="rounded-2xl border border-border bg-card p-4 space-y-2 shadow-2xs hover:shadow-xs transition-all">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          {title}
        </span>
        <div className={`p-2 rounded-xl border ${style.bg}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div>
        <div className="text-xl font-black text-foreground font-mono">{value}</div>
        {subtext && <p className="text-[11px] text-muted-foreground mt-0.5">{subtext}</p>}
      </div>
      {trend && (
        <div className="flex items-center gap-1 border-t border-border/40 pt-2 text-[10px] font-bold font-mono">
          <span className={isPositive ? 'text-emerald-600' : 'text-rose-600'}>
            {isPositive ? '▲' : '▼'} {trend}
          </span>
          <span className="text-muted-foreground">vs target baseline</span>
        </div>
      )}
    </div>
  );
};

export const ChartCard: React.FC<{
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, subtitle, action, children }) => {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-2xs">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-foreground">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div>{children}</div>
    </div>
  );
};

export default MetricCard;
