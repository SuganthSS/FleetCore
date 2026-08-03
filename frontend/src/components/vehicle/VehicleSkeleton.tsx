import React from 'react';

export const VehicleSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 animate-pulse">
      {/* KPI Skeleton */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-4 space-y-3">
            <div className="h-9 w-9 rounded-lg bg-muted" />
            <div className="space-y-1.5">
              <div className="h-6 w-16 rounded bg-muted" />
              <div className="h-3 w-20 rounded bg-muted" />
            </div>
            <div className="h-1 w-full rounded-full bg-muted" />
          </div>
        ))}
      </div>

      {/* Toolbar Skeleton */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <div className="flex gap-3">
          <div className="h-9 flex-1 max-w-sm rounded-lg bg-muted" />
        </div>
        <div className="flex gap-2.5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-9 w-28 rounded-lg bg-muted" />
          ))}
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-4 p-4 border-b border-border bg-muted/20">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="h-3 w-16 rounded bg-muted" />
          ))}
        </div>
        {/* Rows */}
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3.5 border-b border-border/50 last:border-0">
            <div className="h-10 w-10 rounded-xl bg-muted shrink-0" />
            <div className="h-4 w-24 rounded bg-muted" />
            <div className="flex flex-col gap-1 flex-1">
              <div className="h-3.5 w-28 rounded bg-muted" />
              <div className="h-2.5 w-20 rounded bg-muted" />
            </div>
            <div className="h-5 w-14 rounded-md bg-muted" />
            <div className="h-3 w-12 rounded bg-muted" />
            <div className="h-3.5 w-10 rounded bg-muted" />
            <div className="h-3 w-14 rounded bg-muted" />
            <div className="h-5 w-20 rounded-full bg-muted" />
            <div className="h-7 w-16 rounded-lg bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VehicleSkeleton;
