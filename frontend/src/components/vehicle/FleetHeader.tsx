import React from 'react';
import { Plus, Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FleetHeaderProps {
  totalVehicles: number;
  onAddVehicle: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export const FleetHeader: React.FC<FleetHeaderProps> = ({
  totalVehicles,
  onAddVehicle,
  onRefresh,
  isRefreshing = false,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-display">
            Fleet Management
          </h1>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
            {totalVehicles} Vehicles
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Real-time overview of all active and inactive assets.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border bg-card text-muted-foreground text-xs font-semibold hover:bg-muted hover:text-foreground transition-colors disabled:opacity-50"
          aria-label="Refresh fleet data"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
        <button
          className="flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border bg-card text-muted-foreground text-xs font-semibold hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Export fleet data"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export</span>
        </button>
        <Button
          onClick={onAddVehicle}
          size="sm"
          className="h-9 px-4 text-xs font-bold gap-1.5 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Add Vehicle
        </Button>
      </div>
    </div>
  );
};

export default FleetHeader;
