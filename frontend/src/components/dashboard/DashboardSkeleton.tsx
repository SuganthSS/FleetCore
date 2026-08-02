import React from 'react';

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-border">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-muted rounded" />
          <div className="h-4 w-32 bg-muted rounded" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-64 bg-muted rounded-lg hidden sm:block" />
          <div className="h-10 w-10 bg-muted rounded-lg" />
          <div className="h-10 w-10 bg-muted rounded-lg" />
          <div className="h-10 w-32 bg-muted rounded-lg" />
        </div>
      </div>

      {/* Stats Cards Skeleton Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, idx) => (
          <div key={idx} className="rounded-xl border border-border bg-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-4 w-20 bg-muted rounded" />
              <div className="h-9 w-9 bg-muted rounded-lg" />
            </div>
            <div className="h-7 w-12 bg-muted rounded" />
          </div>
        ))}
      </div>

      {/* Fleet Overview & Summary Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 rounded-xl border border-border bg-card p-6 space-y-6">
          <div className="h-5 w-32 bg-muted rounded" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex flex-col items-center justify-center p-4">
              <div className="h-3 w-16 bg-muted rounded mb-2" />
              <div className="h-12 w-16 bg-muted rounded" />
            </div>
            <div className="sm:col-span-2 space-y-4">
              <div className="h-3 w-1/4 bg-muted rounded" />
              <div className="h-4 w-full bg-muted rounded-full" />
              <div className="grid grid-cols-3 gap-3">
                <div className="h-12 bg-muted rounded-lg" />
                <div className="h-12 bg-muted rounded-lg" />
                <div className="h-12 bg-muted rounded-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Skeleton */}
        <div className="lg:col-span-4 rounded-xl border border-border bg-card p-6 space-y-6">
          <div className="h-5 w-28 bg-muted rounded" />
          <div className="grid grid-cols-3 gap-3">
            {[...Array(6)].map((_, idx) => (
              <div key={idx} className="h-16 bg-muted rounded-lg" />
            ))}
          </div>
        </div>
      </div>

      {/* Operations Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, idx) => (
          <div key={idx} className="rounded-xl border border-border bg-card p-5 space-y-4">
            <div className="h-4 w-20 bg-muted rounded" />
            <div className="h-8 w-24 bg-muted rounded" />
            <div className="space-y-2 pt-2 border-t border-border">
              <div className="h-3 w-full bg-muted rounded" />
              <div className="h-3 w-5/6 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
