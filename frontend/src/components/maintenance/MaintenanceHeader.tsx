import React from 'react';
import { Wrench, RefreshCw, Download, Plus } from 'lucide-react';
import { Button } from '@/components/ui';

interface MaintenanceHeaderProps {
  totalRecords: number;
  onAddMaintenance: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export const MaintenanceHeader: React.FC<MaintenanceHeaderProps> = ({
  totalRecords,
  onAddMaintenance,
  onRefresh,
  isRefreshing,
}) => {
  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,WorkOrderRef,Vehicle,Type,Status,ScheduledDate,Cost,ServiceProvider\n' +
      `WO-2026-001,UNIT-882,"PREVENTIVE","IN_PROGRESS",2026-08-05,$450.00,"Brembo Certified Tech"\n`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `maintenance_schedule_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Wrench className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-black text-foreground tracking-tight sm:text-2xl">
            Maintenance & Service Schedule
          </h1>
          <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-mono text-xs font-bold border border-primary/20">
            {totalRecords} Work Orders
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Track scheduled servicing, predictive failure diagnostics, technician assignments, and repair costs across your fleet.
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-2 rounded-xl border border-input bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50"
          title="Refresh Maintenance Data"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-input bg-card text-foreground font-bold text-xs hover:bg-muted transition-colors shadow-2xs"
        >
          <Download className="h-3.5 w-3.5" />
          Export Schedule
        </button>

        <Button onClick={onAddMaintenance} className="flex items-center gap-1.5 text-xs font-bold">
          <Plus className="h-4 w-4" />
          Create Work Order
        </Button>
      </div>
    </div>
  );
};

export default MaintenanceHeader;
