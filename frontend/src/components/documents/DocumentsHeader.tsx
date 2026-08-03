import React from 'react';
import { FileText, Upload, RefreshCw } from 'lucide-react';

interface DocumentsHeaderProps {
  onRefresh: () => void;
  onUpload: () => void;
  isRefreshing: boolean;
  totalCount: number;
}

export const DocumentsHeader: React.FC<DocumentsHeaderProps> = ({
  onRefresh,
  onUpload,
  isRefreshing,
  totalCount,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-5">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <FileText className="h-6 w-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Document Library
            </h1>
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
              {totalCount} Documents
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Centralized enterprise repository for vehicle registrations, driver compliance, service logs, and contracts.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
        <button
          onClick={onUpload}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-primary/90 transition-all"
        >
          <Upload className="h-4 w-4" /> Upload Document
        </button>
      </div>
    </div>
  );
};
