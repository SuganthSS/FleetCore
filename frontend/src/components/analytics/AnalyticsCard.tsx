import React from 'react';

interface AnalyticsCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  subtitle,
  children,
  className = '',
}) => {
  return (
    <div className={`rounded-xl border border-border bg-card p-5 shadow-xs transition-all duration-300 hover:shadow-md ${className}`}>
      {/* Header */}
      <div className="border-b border-border pb-4 mb-4 text-left">
        <h3 className="text-sm font-bold text-foreground tracking-tight">
          {title}
        </h3>
        {subtitle && (
          <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">
            {subtitle}
          </p>
        )}
      </div>

      {/* Content */}
      <div className="relative w-full h-[260px] flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};
export default AnalyticsCard;
