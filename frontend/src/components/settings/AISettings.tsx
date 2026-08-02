import React from 'react';
import { BrainCircuit, Sparkles } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';

export const AISettings: React.FC = () => {
  return (
    <div className="rounded-xl border border-border bg-card p-6 text-left space-y-4 shadow-sm">
      <div className="flex items-center gap-2 border-b border-border pb-4 mb-4">
        <BrainCircuit className="h-4.5 w-4.5 text-primary" />
        <h3 className="text-sm font-bold text-foreground tracking-tight">
          AI Configuration Engine
        </h3>
      </div>

      <EmptyState
        title="AI Settings Locked"
        description="Available after AI Engine implementation. Generative model profiles, route-planning agents, and automated dispatch engines can be set up in a future iteration."
        icon={<Sparkles className="h-8 w-8 text-primary animate-pulse" />}
      />
    </div>
  );
};
export default AISettings;
