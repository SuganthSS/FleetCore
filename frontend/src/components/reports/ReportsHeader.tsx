import React from 'react';
import { FileText, Plus, Download, RefreshCw, Calendar } from 'lucide-react';
import { Button } from '@/components/ui';

interface ReportsHeaderProps {
  onBuildReport: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
  onExportAll: () => void;
  dateRangeLabel?: string;
}

export const ReportsHeader: React.FC<ReportsHeaderProps> = ({
  onBuildReport,
  onRefresh,
  isRefreshing,
  onExportAll,
  dateRangeLabel = 'Last 30 Days',
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 rounded-2xl bg-card border border-border shadow-2xs">
      <div>
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <FileText className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-black text-foreground tracking-tight sm:text-2xl">
            Enterprise Reports Center & Report Builder
          </h1>
          <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-mono text-xs font-bold border border-primary/20">
            FleetCore AI (Groq)
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Generate custom operational reports across fleet, drivers, fuel, maintenance, trips, and financial audits.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-input bg-background text-xs font-bold text-foreground">
          <Calendar className="h-3.5 w-3.5 text-primary" />
          <span>{dateRangeLabel}</span>
        </div>

        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-2 rounded-xl border border-input bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50"
          title="Refresh Reports Data"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>

        <button
          onClick={onExportAll}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-input bg-card text-foreground font-bold text-xs hover:bg-muted transition-colors shadow-2xs"
        >
          <Download className="h-3.5 w-3.5 text-primary" />
          Export All
        </button>

        <Button onClick={onBuildReport} className="flex items-center gap-1.5 text-xs font-bold shadow-sm">
          <Plus className="h-4 w-4" />
          New Report Builder
        </Button>
      </div>
    </div>
  );
};

export default ReportsHeader;
