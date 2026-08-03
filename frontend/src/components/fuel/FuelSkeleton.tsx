import React from 'react';

export const FuelSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 animate-pulse">
      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-24 rounded-2xl bg-muted/60 border border-border" />
        ))}
      </div>

      {/* Analytics Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-36 rounded-2xl bg-muted/50 border border-border" />
        ))}
      </div>

      {/* Toolbar Skeleton */}
      <div className="h-14 rounded-2xl bg-muted/40 border border-border" />

      {/* Table Skeleton */}
      <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
        <div className="h-8 bg-muted/60 rounded-xl" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 bg-muted/30 rounded-xl" />
        ))}
      </div>
    </div>
  );
};

export default FuelSkeleton;
