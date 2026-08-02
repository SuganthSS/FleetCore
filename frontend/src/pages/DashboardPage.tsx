import React from 'react';
import { LayoutDashboard } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-20 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <LayoutDashboard className="h-10 w-10" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Dashboard Coming Soon
        </h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          The analytics dashboard is being built. Full KPI widgets and charts
          will be available in the next specification.
        </p>
      </div>
    </div>
  );
};
