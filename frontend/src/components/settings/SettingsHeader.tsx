import React from 'react';
import { Building2, ShieldCheck, Cpu } from 'lucide-react';

export const SettingsHeader: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/80 pb-6 text-left">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
            <Building2 className="h-3.5 w-3.5" />
            Enterprise Logistics Single-Org
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="h-3 w-3" />
            Administrator Portal
          </span>
        </div>
        <h1 className="text-2.5xl font-bold tracking-tight text-foreground font-heading">
          Organization Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
          Manage core organization profile, system preferences, security rules, alert notifications, Groq AI assistant, and Cloudinary media integrations.
        </p>
      </div>

      <div className="flex items-center gap-3 self-start md:self-auto">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-medium text-muted-foreground shadow-2xs">
          <Cpu className="h-4 w-4 text-primary" />
          <span>Groq LPU: <strong className="text-foreground">Online</strong></span>
        </div>
      </div>
    </div>
  );
};
export default SettingsHeader;
