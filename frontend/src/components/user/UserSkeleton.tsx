import React from 'react';

export const UserSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-[#c3c6d7] rounded-2xl p-6 shadow-xs space-y-4 animate-pulse">
      <div className="flex justify-between items-center pb-4 border-b border-[#e5eeff]">
        <div className="h-6 w-48 bg-slate-200 rounded-lg" />
        <div className="h-9 w-32 bg-slate-200 rounded-xl" />
      </div>

      <div className="space-y-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 bg-slate-200 rounded-full" />
              <div className="space-y-1.5">
                <div className="h-4 w-36 bg-slate-200 rounded-md" />
                <div className="h-3 w-48 bg-slate-100 rounded-md" />
              </div>
            </div>
            <div className="h-6 w-24 bg-slate-200 rounded-full" />
            <div className="h-6 w-16 bg-slate-200 rounded-full" />
            <div className="h-4 w-28 bg-slate-100 rounded-md" />
            <div className="h-8 w-8 bg-slate-200 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
};
