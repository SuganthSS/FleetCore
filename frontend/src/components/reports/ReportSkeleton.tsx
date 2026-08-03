import React from 'react';

export const ReportSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="h-20 rounded-2xl bg-muted/60 border border-border" />

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-24 rounded-2xl bg-muted/60 border border-border" />
        ))}
      </div>

      {/* Toolbar Skeleton */}
      <div className="h-14 rounded-2xl bg-muted/60 border border-border" />

      {/* Categories Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="h-32 rounded-2xl bg-muted/60 border border-border" />
        ))}
      </div>

      {/* Builder Skeleton */}
      <div className="h-72 rounded-2xl bg-muted/60 border border-border" />
    </div>
  );
};

export default ReportSkeleton;
