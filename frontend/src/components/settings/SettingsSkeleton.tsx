import React from 'react';

export const SettingsSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="border-b border-border pb-5 space-y-2">
        <div className="h-7 w-48 bg-muted rounded-lg" />
        <div className="h-4 w-72 bg-muted rounded" />
      </div>

      {/* Main Grid Skeleton */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-64 shrink-0 rounded-xl border border-border bg-card p-3 h-[300px] bg-muted/20" />
        <div className="flex-1 rounded-xl border border-border bg-card p-6 h-[400px] bg-muted/20" />
      </div>
    </div>
  );
};
export default SettingsSkeleton;
