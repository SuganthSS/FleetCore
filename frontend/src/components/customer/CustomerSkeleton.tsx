import React from 'react';

export const CustomerSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-56 bg-muted rounded-xl" />
          <div className="h-4 w-96 bg-muted/60 rounded-lg" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-24 bg-muted rounded-xl" />
          <div className="h-9 w-32 bg-muted rounded-xl" />
        </div>
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-28 bg-muted/40 border border-border rounded-2xl p-4 space-y-3">
            <div className="h-3 w-20 bg-muted rounded" />
            <div className="h-8 w-16 bg-muted rounded-lg" />
          </div>
        ))}
      </div>

      {/* Toolbar Skeleton */}
      <div className="h-14 bg-muted/30 border border-border rounded-2xl" />

      {/* Table Skeleton */}
      <div className="border border-border rounded-2xl bg-card p-4 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-muted/30 rounded-xl" />
        ))}
      </div>
    </div>
  );
};

export default CustomerSkeleton;
