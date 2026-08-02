import React from 'react';

export const AnalyticsSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-muted rounded-lg" />
          <div className="h-4 w-72 bg-muted rounded" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-44 bg-muted rounded-lg" />
          <div className="h-10 w-10 bg-muted rounded-lg" />
        </div>
      </div>

      {/* KPI Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
            <div className="h-12 w-12 rounded-xl bg-muted shrink-0" />
            <div className="space-y-2">
              <div className="h-3 w-16 bg-muted rounded" />
              <div className="h-6 w-24 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5 h-[340px] flex flex-col justify-between">
            <div className="space-y-2 pb-4 border-b border-border">
              <div className="h-4 w-36 bg-muted rounded" />
              <div className="h-3 w-24 bg-muted rounded" />
            </div>
            <div className="h-[240px] bg-muted/40 rounded-lg flex items-center justify-center">
              <div className="h-16 w-16 bg-muted rounded-full animate-spin" />
            </div>
          </div>
        ))}
      </div>

      {/* Insights Cards Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-muted rounded-lg" />
              <div className="h-4 w-28 bg-muted rounded" />
            </div>
            <div className="h-7 w-16 bg-muted rounded" />
            <div className="h-3 w-full bg-muted rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};
export default AnalyticsSkeleton;
