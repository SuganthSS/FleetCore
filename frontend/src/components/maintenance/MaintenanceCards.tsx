import React from 'react';
import { Truck, User, Calendar, DollarSign, Edit2, Trash2, ArrowUpRight } from 'lucide-react';
import type { MaintenanceRecord } from '@/types/maintenance';
import { MaintenanceStatusBadge, MaintenancePriorityBadge } from './MaintenanceStatusBadge';
import { MaintenanceTypeBadge } from './MaintenanceTypeBadge';

interface MaintenanceCardsProps {
  records: MaintenanceRecord[];
  onView: (record: MaintenanceRecord) => void;
  onEdit: (record: MaintenanceRecord) => void;
  onDelete: (id: string) => void;
}

export const MaintenanceCards: React.FC<MaintenanceCardsProps> = ({
  records,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {records.map((record) => {
        const vehicleName = record.vehicle
          ? `${record.vehicle.registrationNumber} (${record.vehicle.make})`
          : 'Unit Refuel';

        const technicianName = record.driver
          ? `${record.driver.firstName} ${record.driver.lastName}`
          : record.serviceProvider || 'Unassigned Technician';

        return (
          <div
            key={record.id}
            onClick={() => onView(record)}
            className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col justify-between"
          >
            {/* Header */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-muted-foreground uppercase tracking-wider">
                  {record.maintenanceRecordNumber}
                </span>
                <div className="flex items-center gap-1.5">
                  <MaintenancePriorityBadge type={record.maintenanceType} />
                  <MaintenanceStatusBadge status={record.status} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-foreground text-sm">
                  <Truck className="h-4 w-4 text-primary shrink-0" />
                  <span className="group-hover:text-primary transition-colors">{vehicleName}</span>
                </div>
                <div className="mt-1">
                  <MaintenanceTypeBadge type={record.maintenanceType} />
                </div>
              </div>
            </div>

            {/* Description & Tech */}
            <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-2 text-xs font-medium">
              {record.description && (
                <p className="text-foreground line-clamp-2 text-xs italic">
                  "{record.description}"
                </p>
              )}

              <div className="flex items-center justify-between border-t border-border/40 pt-2">
                <span className="text-muted-foreground flex items-center gap-1">
                  <User className="h-3.5 w-3.5 text-indigo-500" />
                  Technician:
                </span>
                <span className="font-bold text-foreground truncate max-w-[140px]">{technicianName}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
                  Service Cost:
                </span>
                <span className="font-mono font-bold text-foreground">
                  ${(record.cost || 0).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
              <div className="flex items-center gap-1 text-muted-foreground font-mono text-[11px]">
                <Calendar className="h-3 w-3" />
                <span>{new Date(record.scheduledDate).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onView(record);
                  }}
                  className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-colors"
                  title="View Work Order"
                >
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(record);
                  }}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  title="Edit Work Order"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(record.id);
                  }}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  title="Delete Work Order"
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

export default MaintenanceCards;
