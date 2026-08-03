import React from 'react';

export const AuditSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 font-['Inter'] animate-pulse">
      <div className="h-10 bg-slate-200 rounded-xl w-64" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-slate-200 rounded-2xl" />
        ))}
      </div>
      <div className="h-14 bg-slate-200 rounded-2xl" />
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-28 bg-slate-200 rounded-2xl" />
        ))}
      </div>
    </div>
  );
};
