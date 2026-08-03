import React from 'react';
import { Plus, RefreshCw, Download, Radio } from 'lucide-react';
import { Button } from '@/components/ui';

interface TrackingHeaderProps {
  totalCount: number;
  activeCount: number;
  onAddTracking: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export const TrackingHeader: React.FC<TrackingHeaderProps> = ({
  totalCount,
  activeCount,
  onAddTracking,
  onRefresh,
  isRefreshing,
}) => {
  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,Vehicle,Driver,Trip,Latitude,Longitude,Speed,RecordedAt,Address\n' +
      'UNIT-742,John Doe,TRP-2026-001,34.0522,-118.2437,65 mph,2026-08-04T00:00:00Z,"Los Angeles, CA"\n';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `gps_telemetry_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <Radio className="h-5 w-5 animate-pulse" />
          </div>
          <h1 className="text-xl font-black text-foreground tracking-tight sm:text-2xl">
            Live GPS Tracking
          </h1>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold border border-emerald-500/20 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            {activeCount} / {totalCount} Live Active
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Real-time telemetry, spatial route overlays, geofence audit logs, and speed analytics.
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-2 rounded-xl border border-input bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50"
          title="Refresh Telemetry Stream"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-input bg-card text-foreground font-bold text-xs hover:bg-muted transition-colors shadow-2xs"
        >
          <Download className="h-3.5 w-3.5" />
          Export Telemetry
        </button>

        <Button onClick={onAddTracking} className="flex items-center gap-1.5 text-xs font-bold">
          <Plus className="h-4 w-4" />
          Add GPS Log
        </Button>
      </div>
    </div>
  );
};

export default TrackingHeader;
