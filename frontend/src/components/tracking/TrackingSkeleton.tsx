import React from 'react';

export const TrackingSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Toolbar Skeleton */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 bg-card border border-border rounded-xl shadow-sm">
        <div className="h-10 w-full sm:w-72 bg-muted rounded-lg" />
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="h-10 w-32 bg-muted rounded-lg" />
          <div className="h-10 w-32 bg-muted rounded-lg" />
          <div className="h-10 w-32 bg-muted rounded-lg" />
          <div className="h-10 w-10 bg-muted rounded-lg" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border bg-muted/30 flex justify-between">
          <div className="h-4 w-32 bg-muted rounded" />
          <div className="h-4 w-28 bg-muted rounded" />
          <div className="h-4 w-24 bg-muted rounded" />
          <div className="h-4 w-20 bg-muted rounded" />
          <div className="h-4 w-20 bg-muted rounded" />
          <div className="h-4 w-24 bg-muted rounded" />
        </div>
        <div className="divide-y divide-border/60">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-muted rounded-lg" />
                <div className="space-y-1.5">
                  <div className="h-4.5 w-40 bg-muted rounded" />
                  <div className="h-3 w-28 bg-muted rounded" />
                </div>
              </div>
              <div className="h-4.5 w-24 bg-muted rounded" />
              <div className="h-4.5 w-24 bg-muted rounded" />
              <div className="h-4.5 w-20 bg-muted rounded" />
              <div className="h-4.5 w-20 bg-muted rounded" />
              <div className="flex gap-1.5">
                <div className="h-8 w-8 bg-muted rounded-lg" />
                <div className="h-8 w-8 bg-muted rounded-lg" />
                <div className="h-8 w-8 bg-muted rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default TrackingSkeleton;
