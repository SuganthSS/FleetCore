import React from 'react';

export const RoleSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 font-['Inter'] animate-pulse">
      {/* Header Skeleton */}
      <div className="h-10 bg-slate-200 rounded-xl w-64" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-slate-200 rounded-2xl" />
        ))}
      </div>

      {/* Toolbar Skeleton */}
      <div className="h-14 bg-slate-200 rounded-2xl" />

      {/* Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-64 bg-slate-200 rounded-2xl" />
        ))}
      </div>
    </div>
  );
};
