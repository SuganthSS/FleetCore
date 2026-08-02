import React from 'react';
import { Cpu, Link2 } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';

export const IntegrationSettings: React.FC = () => {
  return (
    <div className="rounded-xl border border-border bg-card p-6 text-left space-y-4 shadow-sm">
      <div className="flex items-center gap-2 border-b border-border pb-4 mb-4">
        <Cpu className="h-4.5 w-4.5 text-primary" />
        <h3 className="text-sm font-bold text-foreground tracking-tight">
          Third-Party Integrations
        </h3>
      </div>

      <EmptyState
        title="App Integrations coming soon"
        description="External sync hooks for ERP APIs, SMS Gateways, OpenStreetMap layers, and Gemini LLM keys will be accessible in Phase 7."
        icon={<Link2 className="h-8 w-8 text-muted-foreground" />}
      />
    </div>
  );
};
export default IntegrationSettings;
