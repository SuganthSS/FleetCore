import React from 'react';
import { Navigation, Plus, RefreshCw, Download } from 'lucide-react';
import { Button } from '@/components/ui';

interface TripHeaderProps {
  totalTrips: number;
  onAddTrip: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export const TripHeader: React.FC<TripHeaderProps> = ({
  totalTrips,
  onAddTrip,
  onRefresh,
  isRefreshing,
}) => {
  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,Trip ID,Trip Number,Status,Origin,Destination\n' +
      'TRP-101,TRP-2026-001,IN_TRANSIT,Chicago,Detroit\n';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `trips_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <Navigation className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-black text-foreground tracking-tight sm:text-2xl">
            Trip Management
          </h1>
          <span className="px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground font-mono text-xs font-bold border border-border">
            {totalTrips} total
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Monitor dispatch assignments, route progress, driver/vehicle allocations, and transit execution.
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-2 rounded-xl border border-input bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50"
          title="Refresh Data"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-input bg-card text-foreground font-bold text-xs hover:bg-muted transition-colors shadow-2xs"
        >
          <Download className="h-3.5 w-3.5" />
          Export CSV
        </button>

        <Button onClick={onAddTrip} className="flex items-center gap-1.5 text-xs font-bold">
          <Plus className="h-4 w-4" />
          Create Trip
        </Button>
      </div>
    </div>
  );
};

export default TripHeader;
