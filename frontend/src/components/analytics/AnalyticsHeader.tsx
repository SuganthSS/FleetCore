import React from 'react';
import { BarChart3, RefreshCw, Download, Filter, Calendar } from 'lucide-react';
import { Button } from '@/components/ui';

interface AnalyticsHeaderProps {
  onRefresh: () => void;
  isRefreshing?: boolean;
  onExportCSV: () => void;
  onExportExcel: () => void;
  onExportPDF: () => void;
  dateRangeLabel?: string;
  onOpenFilters?: () => void;
}

export const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({
  onRefresh,
  isRefreshing,
  onExportCSV,
  onExportExcel,
  onExportPDF,
  dateRangeLabel = 'Last 30 Days',
  onOpenFilters,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 rounded-2xl bg-card border border-border shadow-2xs">
      <div>
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <BarChart3 className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-black text-foreground tracking-tight sm:text-2xl">
            Enterprise Analytics & Operational Intelligence
          </h1>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold border border-emerald-500/20">
            Live Telemetry
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Executive performance dashboard summarizing fleet availability, driver scores, fuel efficiency, maintenance costs, and shipment SLAs.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-input bg-background text-xs font-bold text-foreground">
          <Calendar className="h-3.5 w-3.5 text-primary" />
          <span>{dateRangeLabel}</span>
        </div>

        {onOpenFilters && (
          <button
            onClick={onOpenFilters}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-input bg-card text-foreground font-bold text-xs hover:bg-muted transition-colors shadow-2xs"
          >
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            Filters
          </button>
        )}

        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-2 rounded-xl border border-input bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50"
          title="Refresh Analytics Data"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={onExportCSV}
            className="flex items-center gap-1 px-2.5 py-2 rounded-xl border border-input bg-card text-foreground font-bold text-xs hover:bg-muted transition-colors shadow-2xs"
            title="Export CSV Data"
          >
            <Download className="h-3.5 w-3.5 text-blue-500" />
            CSV
          </button>
          <button
            onClick={onExportExcel}
            className="flex items-center gap-1 px-2.5 py-2 rounded-xl border border-input bg-card text-foreground font-bold text-xs hover:bg-muted transition-colors shadow-2xs"
            title="Export Excel Summary"
          >
            <Download className="h-3.5 w-3.5 text-emerald-500" />
            Excel
          </button>
          <Button onClick={onExportPDF} className="flex items-center gap-1.5 text-xs font-bold">
            <Download className="h-3.5 w-3.5" />
            PDF Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsHeader;
