import React from 'react';

export const ReportsSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-muted rounded-lg" />
          <div className="h-4 w-72 bg-muted rounded" />
        </div>
        <div className="h-10 w-36 bg-muted rounded-lg" />
      </div>

      {/* Categories Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5 space-y-4">
            <div className="h-10 w-10 bg-muted rounded-lg" />
            <div className="space-y-2">
              <div className="h-4 w-28 bg-muted rounded" />
              <div className="h-3 w-full bg-muted rounded" />
              <div className="h-3 w-5/6 bg-muted rounded" />
            </div>
            <div className="h-9 w-full bg-muted rounded-lg mt-2" />
          </div>
        ))}
      </div>

      {/* Export & Recent Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-card p-6 h-[260px] bg-muted/20" />
        <div className="rounded-xl border border-border bg-card p-6 h-[260px] bg-muted/20" />
      </div>
    </div>
  );
};
export default ReportsSkeleton;
