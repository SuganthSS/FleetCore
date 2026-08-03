import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Info } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  variant?: 'default' | 'danger' | 'warning' | 'success' | 'info';
  onClick?: () => void;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  icon: Icon,
  subtitle,
  trend,
  variant = 'default',
  onClick,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          border: 'border-[#ffdad6]',
          iconColor: 'text-[#ba1a1a]',
          titleColor: 'text-[#ba1a1a]',
          accentBg: 'bg-[#ffdad6]',
        };
      case 'warning':
        return {
          border: 'border-amber-200',
          iconColor: 'text-amber-600',
          titleColor: 'text-amber-800',
          accentBg: 'bg-amber-100',
        };
      case 'success':
        return {
          border: 'border-emerald-200',
          iconColor: 'text-emerald-600',
          titleColor: 'text-emerald-800',
          accentBg: 'bg-emerald-100',
        };
      case 'info':
        return {
          border: 'border-sky-200',
          iconColor: 'text-sky-600',
          titleColor: 'text-sky-800',
          accentBg: 'bg-sky-100',
        };
      default:
        return {
          border: 'border-[#c3c6d7]',
          iconColor: 'text-[#737686]',
          titleColor: 'text-[#434655]',
          accentBg: 'bg-[#f8f9ff]',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div
      onClick={onClick}
      className={`bg-white border ${styles.border} rounded-2xl p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] hover:translate-y-[-2px] hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[140px] ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div>
        <div className="flex justify-between items-start mb-3">
          <p className={`font-['Inter'] text-xs font-semibold ${styles.titleColor} tracking-wider uppercase`}>
            {title}
          </p>
          <div className={styles.iconColor}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <p className="font-['Plus_Jakarta_Sans'] text-3xl font-extrabold text-[#0b1c30]">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
      </div>

      {(trend || subtitle) && (
        <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold font-['Inter']">
          {trend && (
            <span
              className={`flex items-center gap-1 ${
                trend.isPositive ? 'text-[#004ac6]' : 'text-[#ba1a1a]'
              }`}
            >
              {trend.isPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              {trend.value}
            </span>
          )}
          {subtitle && (
            <span className="text-[#434655] flex items-center gap-1">
              {!trend && <Info className="h-3.5 w-3.5 text-[#737686]" />}
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
