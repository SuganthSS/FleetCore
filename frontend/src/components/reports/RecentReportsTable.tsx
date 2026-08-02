import React from 'react';
import { History, EyeOff } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';

export const RecentReportsTable: React.FC = () => {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm p-6 text-left">
      <div className="flex items-center gap-2 border-b border-border pb-4 mb-4">
        <History className="h-4.5 w-4.5 text-primary" />
        <h3 className="text-sm font-bold text-foreground tracking-tight">
          Recent Generated Reports
        </h3>
      </div>

      <div className="py-6">
        <EmptyState
          title="No generated reports log"
          description="You haven't generated any report exports yet. Use the action triggers above to compile new analytics documents."
          icon={<EyeOff className="h-8 w-8 text-muted-foreground" />}
        />
      </div>
    </div>
  );
};
export default RecentReportsTable;
