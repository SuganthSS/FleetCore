import React from 'react';
import { Bell, ShieldAlert } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';

export const NotificationSettings: React.FC = () => {
  return (
    <div className="rounded-xl border border-border bg-card p-6 text-left space-y-4 shadow-sm">
      <div className="flex items-center gap-2 border-b border-border pb-4 mb-4">
        <Bell className="h-4.5 w-4.5 text-primary" />
        <h3 className="text-sm font-bold text-foreground tracking-tight">
          Notification Preferences
        </h3>
      </div>

      <EmptyState
        title="Notification Rules coming soon"
        description="Preference rules for configuring push notifications, maintenance triggers, trip delays, and fuel threshold alerts will be enabled upon integration of the dispatch worker daemon."
        icon={<ShieldAlert className="h-8 w-8 text-muted-foreground" />}
      />
    </div>
  );
};
export default NotificationSettings;
