import React from 'react';

export const SettingsSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 text-left animate-pulse">
      <div className="rounded-xl border border-border bg-card p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-muted" />
            <div className="space-y-2">
              <div className="h-4 w-40 rounded bg-muted" />
              <div className="h-3 w-64 rounded bg-muted" />
            </div>
          </div>
          <div className="h-8 w-24 rounded-lg bg-muted" />
        </div>

        <div className="h-20 w-full rounded-xl bg-muted/40" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-10 rounded-lg bg-muted/50" />
          <div className="h-10 rounded-lg bg-muted/50" />
          <div className="h-10 rounded-lg bg-muted/50" />
          <div className="h-10 rounded-lg bg-muted/50" />
        </div>
      </div>
    </div>
  );
};
export default SettingsSkeleton;
