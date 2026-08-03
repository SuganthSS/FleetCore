import React from 'react';
import { Fuel, RefreshCw, Download, Plus } from 'lucide-react';
import { Button } from '@/components/ui';

interface FuelHeaderProps {
  totalRecords: number;
  monthlyCost: number;
  onAddFuelRecord: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export const FuelHeader: React.FC<FuelHeaderProps> = ({
  totalRecords,
  onAddFuelRecord,
  onRefresh,
  isRefreshing,
}) => {
  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,RecordRef,Vehicle,FuelStation,QuantityGal,PricePerGal,TotalCost,Odometer,Date\n' +
      `FUEL-REC-001,UNIT-742,"Shell Commercial Depot",120,$3.85,$462.00,45210,2026-08-04\n`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `fuel_management_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Fuel className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-black text-foreground tracking-tight sm:text-2xl">
            Fuel Management
          </h1>
          <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-mono text-xs font-bold border border-primary/20">
            {totalRecords} Refuels Logged
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Monitor consumption, costs, mileage efficiency, and identify refueling anomalies across your fleet.
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-2 rounded-xl border border-input bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50"
          title="Refresh Fuel Data"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-input bg-card text-foreground font-bold text-xs hover:bg-muted transition-colors shadow-2xs"
        >
          <Download className="h-3.5 w-3.5" />
          Export Fuel Log
        </button>

        <Button onClick={onAddFuelRecord} className="flex items-center gap-1.5 text-xs font-bold">
          <Plus className="h-4 w-4" />
          Log Refueling
        </Button>
      </div>
    </div>
  );
};

export default FuelHeader;
