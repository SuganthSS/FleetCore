import React from 'react';

export const RouteSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse p-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-muted rounded-xl" />
          <div className="h-4 w-72 bg-muted rounded-lg" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-24 bg-muted rounded-xl" />
          <div className="h-9 w-28 bg-muted rounded-xl" />
        </div>
      </div>

      {/* KPI skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-muted/60" />
        ))}
      </div>

      {/* Toolbar skeleton */}
      <div className="h-14 rounded-2xl bg-muted/40" />

      {/* Table skeleton */}
      <div className="h-96 rounded-2xl bg-muted/40" />
    </div>
  );
};

export default RouteSkeleton;
