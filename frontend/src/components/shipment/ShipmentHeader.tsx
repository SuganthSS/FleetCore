import React from 'react';
import { Package, Plus, RefreshCw, Download } from 'lucide-react';
import { Button } from '@/components/ui';

interface ShipmentHeaderProps {
  totalShipments: number;
  onAddShipment: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export const ShipmentHeader: React.FC<ShipmentHeaderProps> = ({
  totalShipments,
  onAddShipment,
  onRefresh,
  isRefreshing,
}) => {
  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,Shipment ID,Title,Status,Priority,Customer\n' +
      'SHP-101,Electronics Cargo,IN_TRANSIT,HIGH,Apex Freight\n';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `shipments_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <Package className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-black text-foreground tracking-tight sm:text-2xl">
            Shipment Management
          </h1>
          <span className="px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground font-mono text-xs font-bold border border-border">
            {totalShipments} total
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Monitor freight dispatches, pickup/delivery itineraries, and logistics operations.
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

        <Button onClick={onAddShipment} className="flex items-center gap-1.5 text-xs font-bold">
          <Plus className="h-4 w-4" />
          Create Shipment
        </Button>
      </div>
    </div>
  );
};

export default ShipmentHeader;
