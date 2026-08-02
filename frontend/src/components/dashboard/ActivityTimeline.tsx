import React from 'react';
import { History } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';

export const ActivityTimeline: React.FC = () => {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h2 className="text-base font-bold tracking-tight text-foreground">
          Recent Activity
        </h2>
      </div>

      <EmptyState
        title="No recent activity"
        description="Your operations logs are completely clean. New activities will appear as trips are scheduled and dispatched."
        icon={<History className="h-6 w-6" />}
        className="py-10 border-0 bg-transparent"
      />
    </div>
  );
};
