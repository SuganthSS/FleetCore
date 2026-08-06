import React from 'react';
import { Truck, User, MapPin, Compass, Clock, ArrowUpRight, Edit2, Trash2 } from 'lucide-react';
import type { TrackingRecord } from '@/types/tracking';

interface TrackingCardsProps {
  records: TrackingRecord[];
  onView: (record: TrackingRecord) => void;
  onEdit: (record: TrackingRecord) => void;
  onDelete?: (id: string) => void;
  selectedRecordId?: string;
  onSelectRecord?: (record: TrackingRecord) => void;
}

export const TrackingCards: React.FC<TrackingCardsProps> = ({
  records,
  onView,
  onEdit,
  onDelete,
  selectedRecordId,
  onSelectRecord,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {records.map((record) => {
        const isSelected = selectedRecordId === record.id;
        const driverName = record.driver
          ? `${record.driver.firstName || ''} ${record.driver.lastName || ''}`.trim()
          : 'Unassigned';

        const isMoving = record.speed && record.speed > 0;

        return (
          <div
            key={record.id}
            onClick={() => onSelectRecord?.(record)}
            className={`rounded-2xl border bg-card p-5 space-y-4 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col justify-between ${
              isSelected ? 'ring-2 ring-primary border-primary bg-primary/5' : 'border-border'
            }`}
          >
            {/* Header */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-muted-foreground uppercase tracking-wider">
                  {record.vehicle?.registrationNumber || 'UNIT-TRACKING'}
                </span>
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                    isMoving
                      ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20'
                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                  }`}
                >
                  {isMoving ? `Moving • ${record.speed} km/h` : 'Engine Idle / Stopped'}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-foreground text-sm">
                  <Truck className="h-4 w-4 text-primary shrink-0" />
                  <span className="group-hover:text-primary transition-colors">
                    {record.vehicle?.make} {record.vehicle?.model || 'Fleet Vehicle'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <User className="h-3.5 w-3.5 shrink-0" />
                  <span>Driver: <strong className="text-foreground font-semibold">{driverName}</strong></span>
                </div>
              </div>
            </div>

            {/* Spatial Location Info */}
            <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-2 text-xs font-medium">
              <div className="flex items-start gap-1.5 text-foreground">
                <MapPin className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="truncate">{record.address || `${record.city || 'Unknown'}, ${record.state || ''}`}</span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/40 pt-2 font-mono">
                <div className="flex items-center gap-1">
                  <Compass className="h-3 w-3" />
                  <span>{record.latitude.toFixed(3)}°, {record.longitude.toFixed(3)}°</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{new Date(record.recordedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>

            {/* Card Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-border/60">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onView(record);
                }}
                className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
              >
                Telemetry Details
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(record);
                  }}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  title="Edit Log"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                {onDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(record.id);
                    }}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    title="Delete Log"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TrackingCards;
