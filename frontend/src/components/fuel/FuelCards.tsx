import React from 'react';
import { Fuel, Truck, MapPin, DollarSign, Calendar, ArrowUpRight, Edit2, Trash2 } from 'lucide-react';
import type { FuelRecord } from '@/types/fuel';
import { FuelStatusBadge } from './FuelStatusBadge';

interface FuelCardsProps {
  records: FuelRecord[];
  onView: (record: FuelRecord) => void;
  onEdit: (record: FuelRecord) => void;
  onDelete: (id: string) => void;
}

export const FuelCards: React.FC<FuelCardsProps> = ({ records, onView, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {records.map((record) => {
        const vehicleName = record.vehicle
          ? `${record.vehicle.registrationNumber} (${record.vehicle.make})`
          : 'Unit Refuel';

        return (
          <div
            key={record.id}
            onClick={() => onView(record)}
            className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col justify-between"
          >
            {/* Top Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-muted-foreground uppercase tracking-wider">
                  {record.fuelRecordNumber}
                </span>
                <FuelStatusBadge cost={record.totalCost} quantity={record.quantity} />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-foreground text-sm">
                  <Truck className="h-4 w-4 text-primary shrink-0" />
                  <span className="group-hover:text-primary transition-colors">{vehicleName}</span>
                </div>
                {record.trip && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Fuel className="h-3.5 w-3.5 shrink-0" />
                    <span>Trip: <strong className="text-foreground font-mono">{record.trip.tripNumber}</strong></span>
                  </div>
                )}
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-2 text-xs font-medium">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Fuel className="h-3.5 w-3.5 text-amber-500" />
                  Volume:
                </span>
                <span className="font-mono font-bold text-foreground">{record.quantity} Gal</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
                  Total Expenditure:
                </span>
                <span className="font-mono font-bold text-foreground">${record.totalCost.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between border-t border-border/40 pt-2 text-[11px]">
                <span className="text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {record.stationName}
                </span>
                <span className="font-mono text-muted-foreground">
                  ${record.pricePerUnit.toFixed(2)}/gal
                </span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
              <div className="flex items-center gap-1 text-muted-foreground font-mono text-[11px]">
                <Calendar className="h-3 w-3" />
                <span>{new Date(record.refueledAt).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onView(record);
                  }}
                  className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-colors"
                  title="View Refueling Details"
                >
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(record);
                  }}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  title="Edit Record"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(record.id);
                  }}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  title="Delete Record"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FuelCards;
