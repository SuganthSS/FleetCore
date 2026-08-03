import React from 'react';
import { UserPlus, RefreshCw, Download, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DriverHeaderProps {
  totalDrivers: number;
  onAddDriver: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export const DriverHeader: React.FC<DriverHeaderProps> = ({
  totalDrivers,
  onAddDriver,
  onRefresh,
  isRefreshing,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl font-bold text-foreground tracking-tight font-display">
            Driver Management
          </h1>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            <Users className="h-3 w-3" />
            {totalDrivers} Total
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Monitor driver availability, licenses, safety scores, and assigned vehicle operations.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="gap-1.5 text-xs"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => alert('Exporting driver directory...')}
          className="gap-1.5 text-xs"
        >
          <Download className="h-3.5 w-3.5" />
          Export CSV
        </Button>
        <Button size="sm" onClick={onAddDriver} className="gap-1.5 text-xs font-semibold shadow-sm">
          <UserPlus className="h-4 w-4" />
          Add Driver
        </Button>
      </div>
    </div>
  );
};

export default DriverHeader;
