import React, { useState } from 'react';
import { Sparkles, XCircle } from 'lucide-react';
import {
  ReportsHeader,
  ReportCategoryGrid,
  RecentReportsTable,
  ExportCenter,
} from '@/components/reports';

export const ReportsPage: React.FC = () => {
  const [comingSoonFeature, setComingSoonFeature] = useState<string | null>(null);

  const handleActionTrigger = (featureName: string) => {
    setComingSoonFeature(featureName);
    setTimeout(() => {
      setComingSoonFeature(null);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <ReportsHeader onGenerateReport={() => handleActionTrigger('General Report Generation')} />

      {/* Floating Alert / Status Banner */}
      {comingSoonFeature && (
        <div className="flex items-center justify-between gap-2.5 rounded-xl border border-primary/20 bg-primary/10 p-4 text-sm text-foreground animate-scale-up text-left">
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-5 w-5 text-primary shrink-0 animate-pulse" />
            <span>
              The <strong>{comingSoonFeature}</strong> feature is currently in design/development. Direct server-side generation will be available in the next release!
            </span>
          </div>
          <button
            onClick={() => setComingSoonFeature(null)}
            className="rounded-lg p-1 text-muted-foreground hover:text-foreground hover:bg-muted"
            aria-label="Dismiss alert"
          >
            <XCircle className="h-4.5 w-4.5" />
          </button>
        </div>
      )}

      {/* Categories Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider text-left">
          Report Category Downloads
        </h3>
        <ReportCategoryGrid onExportCategory={(cat) => handleActionTrigger(`${cat} compilation`)} />
      </div>

      {/* Export Center and Recent Reports Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExportCenter onExportFormat={(fmt) => handleActionTrigger(`Consolidated ${fmt} Export`)} />
        <RecentReportsTable />
      </div>
    </div>
  );
};
export default ReportsPage;
