import React from 'react';
import { X, Fuel, Truck, DollarSign, FileText } from 'lucide-react';
import type { FuelRecord } from '@/types/fuel';
import { FuelStatusBadge } from './FuelStatusBadge';

interface FuelDetailsDrawerProps {
  record: FuelRecord | null;
  open: boolean;
  onClose: () => void;
}

export const FuelDetailsDrawer: React.FC<FuelDetailsDrawerProps> = ({ record, open, onClose }) => {
  if (!open || !record) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-xs" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-card border-l border-border shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-5 border-b border-border flex items-center justify-between bg-muted/30">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Fuel className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-foreground font-mono">
                  {record.fuelRecordNumber}
                </h2>
                <p className="text-[11px] text-muted-foreground">Fuel Refueling Log Audit</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
            {/* Status Summary Banner */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/40 border border-border/80">
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Expenditure Tier
                </span>
                <div className="mt-1">
                  <FuelStatusBadge cost={record.totalCost} quantity={record.quantity} />
                </div>
              </div>
              <div className="text-right font-mono">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Total Paid
                </span>
                <span className="text-base font-black text-foreground">
                  ${record.totalCost.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Vehicle Information Card */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5 text-primary" />
                Vehicle Assignment
              </h3>
              <div className="p-4 rounded-2xl border border-border bg-card space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Registration:</span>
                  <span className="font-mono font-bold text-foreground">
                    {record.vehicle?.registrationNumber || 'UNIT-UNASSIGNED'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Make / Model:</span>
                  <span className="font-semibold text-foreground">
                    {record.vehicle?.make} {record.vehicle?.model}
                  </span>
                </div>
                <div className="flex justify-between border-t border-border/40 pt-2">
                  <span className="text-muted-foreground">Vehicle Status:</span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 font-bold text-[10px]">
                    {record.vehicle?.status || 'ACTIVE'}
                  </span>
                </div>
              </div>
            </div>

            {/* Refueling Transaction Details */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
                Refueling Metrics
              </h3>
              <div className="p-4 rounded-2xl border border-border bg-card space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fuel Station:</span>
                  <span className="font-semibold text-foreground">{record.stationName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Volume Purchased:</span>
                  <span className="font-mono font-bold text-foreground">{record.quantity} Gallons</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Unit Price:</span>
                  <span className="font-mono font-bold text-foreground">${record.pricePerUnit.toFixed(2)} / Gal</span>
                </div>
                <div className="flex justify-between border-t border-border/40 pt-2">
                  <span className="text-muted-foreground">Odometer Reading:</span>
                  <span className="font-mono font-bold text-foreground">{record.odometerReading.toLocaleString()} miles</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Refuel Date:</span>
                  <span className="font-mono text-foreground">{new Date(record.refueledAt).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Receipt & Notes */}
            {record.notes && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-amber-500" />
                  Notes & Audit Record
                </h3>
                <div className="p-4 rounded-2xl border border-border bg-muted/20 text-muted-foreground text-xs leading-relaxed">
                  {record.notes}
                </div>
              </div>
            )}
          </div>

          {/* Footer Action */}
          <div className="p-4 border-t border-border bg-muted/20">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl border border-input bg-card text-foreground font-bold text-xs hover:bg-muted transition-colors shadow-2xs"
            >
              Close Drawer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FuelDetailsDrawer;
