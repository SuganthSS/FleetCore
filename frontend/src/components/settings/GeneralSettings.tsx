import React from 'react';
import { Sliders, Wrench } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';

export const GeneralSettings: React.FC = () => {
  return (
    <div className="rounded-xl border border-border bg-card p-6 text-left space-y-4 shadow-sm">
      <div className="flex items-center gap-2 border-b border-border pb-4 mb-4">
        <Sliders className="h-4.5 w-4.5 text-primary" />
        <h3 className="text-sm font-bold text-foreground tracking-tight">
          General System Settings
        </h3>
      </div>

      <EmptyState
        title="General Settings coming soon"
        description="Application-wide metrics preferences (Timezone, Distance, Weight, Fuel unit formatting) will be customizable once the system-wide configuration controller endpoints are implemented."
        icon={<Wrench className="h-8 w-8 text-muted-foreground" />}
      />
    </div>
  );
};
export default GeneralSettings;
