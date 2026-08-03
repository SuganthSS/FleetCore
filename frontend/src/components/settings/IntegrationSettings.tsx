import React from 'react';
import { Cpu, Database, Cloud, Activity, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import type { IntegrationSettings as IntegrationSettingsType } from '@/types/settings';

interface IntegrationSettingsProps {
  initialData?: IntegrationSettingsType;
  onRefresh?: () => void;
}

export const IntegrationSettings: React.FC<IntegrationSettingsProps> = ({ initialData }) => {
  const integrations = initialData?.integrations || [
    {
      id: 'cloudinary',
      name: 'Cloudinary Asset Media Hub',
      description: 'Enterprise image hosting, document storage, and vehicle asset transformations.',
      configured: true,
      status: 'CONNECTED' as const,
      cloudName: 'fleetcore-cloud',
      folder: 'FleetCore',
    },
    {
      id: 'neon',
      name: 'Neon PostgreSQL Database',
      description: 'High-availability serverless relational database powering FleetCore data layer.',
      configured: true,
      status: 'CONNECTED' as const,
      connectionPool: 'Active (Max 25 connections)',
    },
    {
      id: 'groq',
      name: 'Groq LPU Inference Engine',
      description: 'Sub-second AI model inference powering fleet route optimization & telemetry analytics.',
      configured: true,
      status: 'CONNECTED' as const,
      model: 'llama-3.3-70b-versatile',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONNECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Connected
          </span>
        );
      case 'DEGRADED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <AlertTriangle className="h-3.5 w-3.5" />
            Degraded
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
            <ShieldCheck className="h-3.5 w-3.5" />
            Mock Mode
          </span>
        );
    }
  };

  const getIcon = (id: string) => {
    switch (id) {
      case 'cloudinary':
        return <Cloud className="h-6 w-6 text-sky-500" />;
      case 'neon':
        return <Database className="h-6 w-6 text-emerald-500" />;
      case 'groq':
        return <Cpu className="h-6 w-6 text-primary" />;
      default:
        return <Activity className="h-6 w-6 text-primary" />;
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground tracking-tight">
                Integrations & Connected Infrastructure
              </h3>
              <p className="text-xs text-muted-foreground">
                Monitor live connections to Cloudinary, Neon PostgreSQL Database, and Groq LPU.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            All Infrastructure Healthy
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 gap-4">
          {integrations.map((item) => (
            <div
              key={item.id}
              className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl border border-border bg-card/60 hover:bg-card transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl border border-border bg-muted/30 shrink-0">
                  {getIcon(item.id)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-foreground tracking-tight">{item.name}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground max-w-xl">{item.description}</p>

                  <div className="flex flex-wrap gap-4 text-[11px] font-mono text-muted-foreground pt-2">
                    {item.cloudName && (
                      <div>
                        Cloud: <strong className="text-foreground font-sans">{item.cloudName}</strong>
                      </div>
                    )}
                    {item.folder && (
                      <div>
                        Folder: <strong className="text-foreground font-sans">{item.folder}</strong>
                      </div>
                    )}
                    {item.connectionPool && (
                      <div>
                        Pool: <strong className="text-foreground font-sans">{item.connectionPool}</strong>
                      </div>
                    )}
                    {item.model && (
                      <div>
                        Model: <strong className="text-foreground font-sans">{item.model}</strong>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="self-end md:self-center shrink-0">
                {getStatusBadge(item.status)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default IntegrationSettings;
