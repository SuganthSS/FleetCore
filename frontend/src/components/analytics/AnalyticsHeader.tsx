import React from 'react';
import { RefreshCw, Calendar } from 'lucide-react';

interface AnalyticsHeaderProps {
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({
  onRefresh,
  isRefreshing = false,
}) => {
  const currentDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Fleet Analytics
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Business intelligence and operational insights.
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Date Display */}
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-semibold text-muted-foreground shadow-xs">
          <Calendar className="h-4 w-4 text-primary" />
          <span>{currentDateStr}</span>
        </div>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition-all duration-150 disabled:opacity-50 hover:shadow-xs active:scale-95"
          title="Refresh analytics data"
          aria-label="Refresh analytics data"
        >
          <RefreshCw className={`h-4.5 w-4.5 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>
  );
};
export default AnalyticsHeader;
