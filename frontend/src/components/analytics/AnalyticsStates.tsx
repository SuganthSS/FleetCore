import React from 'react';
import { BarChart3, RefreshCw } from 'lucide-react';

export const AnalyticsEmptyState: React.FC<{
  title?: string;
  description?: string;
  action?: React.ReactNode;
}> = ({
  title = 'No Analytics Telemetry Found',
  description = 'Add vehicles, drivers, fuel logs, or shipment dispatches to generate real-time operational reports.',
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border bg-card/50 my-6">
      <div className="p-4 rounded-full bg-primary/10 text-primary mb-4">
        <BarChart3 className="h-8 w-8" />
      </div>
      <h3 className="text-base font-bold text-foreground">{title}</h3>
      <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-4">{description}</p>
      {action}
    </div>
  );
};

export const AnalyticsErrorState: React.FC<{
  title?: string;
  description?: string;
  onRetry?: () => void;
}> = ({
  title = 'Failed to Load Fleet Analytics',
  description = 'An error occurred while compiling aggregated operational telemetry metrics.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-rose-500/20 bg-rose-500/5 my-6">
      <div className="p-4 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 mb-4">
        <BarChart3 className="h-8 w-8" />
      </div>
      <h3 className="text-base font-bold text-foreground">{title}</h3>
      <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-4">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-md hover:bg-primary/90 transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Retry Request
        </button>
      )}
    </div>
  );
};
