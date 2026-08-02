import React from 'react';
import { Shield, Lock } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';

export const SecuritySettings: React.FC = () => {
  return (
    <div className="rounded-xl border border-border bg-card p-6 text-left space-y-4 shadow-sm">
      <div className="flex items-center gap-2 border-b border-border pb-4 mb-4">
        <Shield className="h-4.5 w-4.5 text-primary" />
        <h3 className="text-sm font-bold text-foreground tracking-tight">
          System Security & Access Controls
        </h3>
      </div>

      <EmptyState
        title="Security Settings coming soon"
        description="Multi-factor authentication toggles, complex password policy definitions, session TTL, and access auditing history logs are currently deactivated."
        icon={<Lock className="h-8 w-8 text-muted-foreground" />}
      />
    </div>
  );
};
export default SecuritySettings;
