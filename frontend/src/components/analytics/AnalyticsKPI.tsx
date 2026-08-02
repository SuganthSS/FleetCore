import React, { useEffect, useState } from 'react';
import type { LucideIcon } from 'lucide-react';

interface AnalyticsKPIProps {
  title: string;
  value: number;
  icon: LucideIcon;
  format?: 'number' | 'currency' | 'percent' | 'weight';
  color?: 'primary' | 'orange' | 'blue' | 'emerald' | 'rose' | 'purple' | 'slate';
}

export const AnalyticsKPI: React.FC<AnalyticsKPIProps> = ({
  title,
  value,
  icon: Icon,
  format = 'number',
  color = 'primary',
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (end === 0) {
      setCount(0);
      return;
    }
    const duration = 800; // ms
    const increment = Math.max(1, Math.ceil(end / 40));
    const stepTime = Math.max(10, Math.floor(duration / (end / increment)));

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  const formatValue = (val: number) => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 0,
        }).format(val);
      case 'percent':
        return `${val.toFixed(1)}%`;
      case 'weight':
        return `${val.toLocaleString()} lbs`;
      default:
        return val.toLocaleString();
    }
  };

  const colorStyles = {
    primary: 'text-primary bg-primary/10 border-primary/20',
    orange: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
    blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    emerald: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    rose: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
    purple: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    slate: 'text-slate-500 bg-slate-500/10 border-slate-500/20',
  };

  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-xs transition-all duration-300 hover:shadow-md hover:border-border-hover group">
      {/* Icon Area */}
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${colorStyles[color]} transition-transform duration-300 group-hover:scale-105`}>
        <Icon className="h-5.5 w-5.5" />
      </div>

      {/* Text Area */}
      <div className="space-y-1 text-left">
        <span className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
          {title}
        </span>
        <span className="block text-xl font-extrabold tracking-tight text-foreground transition-all">
          {formatValue(count)}
        </span>
      </div>
    </div>
  );
};
export default AnalyticsKPI;
