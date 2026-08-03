import React from 'react';
import {
  X,
  Wrench,
  Truck,
  User,
  DollarSign,
  FileText,
  CheckCircle2,
  FileCode,
  Paperclip,
  ShieldCheck,
} from 'lucide-react';
import type { MaintenanceRecord } from '@/types/maintenance';
import { MaintenanceStatusBadge, MaintenancePriorityBadge } from './MaintenanceStatusBadge';
import { MaintenanceTypeBadge } from './MaintenanceTypeBadge';
import { MaintenanceTimeline } from './MaintenanceTimeline';

interface MaintenanceDetailsPageProps {
  record: MaintenanceRecord | null;
  open: boolean;
  onClose: () => void;
  onEdit?: (record: MaintenanceRecord) => void;
  onCompleteWorkOrder?: (record: MaintenanceRecord) => void;
}

export const MaintenanceDetailsPage: React.FC<MaintenanceDetailsPageProps> = ({
  record,
  open,
  onClose,
  onEdit,
  onCompleteWorkOrder,
}) => {
  if (!open || !record) return null;

  const vehicleName = record.vehicle
    ? `${record.vehicle.registrationNumber} (${record.vehicle.make} ${record.vehicle.model})`
    : 'UNIT-UNASSIGNED';

  const technicianName = record.driver
    ? `${record.driver.firstName} ${record.driver.lastName}`
    : record.serviceProvider || 'Unassigned Certified Tech';

  const isCompleted = record.status === 'COMPLETED';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-xs" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-card border-l border-border shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-border flex items-center justify-between bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <Wrench className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-black text-foreground font-mono">
                    {record.maintenanceRecordNumber}
                  </h2>
                  <MaintenancePriorityBadge type={record.maintenanceType} />
                  <MaintenanceStatusBadge status={record.status} />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">Enterprise Work Order & Diagnostic File</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
            {/* Action Bar */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/40 border border-border/80">
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Service Type
                </span>
                <div className="mt-1">
                  <MaintenanceTypeBadge type={record.maintenanceType} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!isCompleted && onCompleteWorkOrder && (
                  <button
                    onClick={() => onCompleteWorkOrder(record)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xs hover:bg-emerald-700 transition-colors"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Sign-Off Work Order
                  </button>
                )}
                {onEdit && (
                  <button
                    onClick={() => onEdit(record)}
                    className="px-3 py-1.5 rounded-xl border border-input bg-card text-foreground font-bold text-xs hover:bg-muted transition-colors"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>

            {/* Vehicle Information */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5 text-primary" />
                Vehicle Assignment
              </h3>
              <div className="p-4 rounded-2xl border border-border bg-card space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vehicle Reg:</span>
                  <span className="font-mono font-bold text-foreground">{vehicleName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Odometer at Service:</span>
                  <span className="font-mono font-bold text-foreground">
                    {record.odometerReading ? `${record.odometerReading.toLocaleString()} mi` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between border-t border-border/40 pt-2">
                  <span className="text-muted-foreground">Fleet Status:</span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 font-bold text-[10px]">
                    {record.vehicle?.status || 'ACTIVE'}
                  </span>
                </div>
              </div>
            </div>

            {/* Assigned Technician & Cost Summary */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl border border-border bg-card space-y-1.5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <User className="h-3 w-3 text-indigo-500" />
                  Technician
                </span>
                <p className="text-xs font-bold text-foreground truncate">{technicianName}</p>
                <p className="text-[10px] text-muted-foreground">Brembo/Fleet Certified</p>
              </div>

              <div className="p-4 rounded-2xl border border-border bg-card space-y-1.5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <DollarSign className="h-3 w-3 text-emerald-500" />
                  Cost Breakdown
                </span>
                <p className="text-xs font-mono font-black text-foreground">
                  ${(record.cost || 0).toFixed(2)}
                </p>
                <p className="text-[10px] text-muted-foreground">Parts & Labor Included</p>
              </div>
            </div>

            {/* Work Order Details */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-amber-500" />
                Work Order & Description
              </h3>
              <div className="p-4 rounded-2xl border border-border bg-card space-y-3">
                <p className="text-foreground text-xs leading-relaxed">
                  {record.description || 'No work order description supplied.'}
                </p>

                {record.notes && (
                  <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-muted-foreground text-xs space-y-1">
                    <span className="font-bold text-foreground block">Technician Notes:</span>
                    <p>{record.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Parts Used Mock Table */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <FileCode className="h-3.5 w-3.5 text-purple-500" />
                Parts & Component Replacement Audit
              </h3>
              <div className="rounded-2xl border border-border bg-card overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-muted/40 text-[10px] font-bold uppercase text-muted-foreground border-b border-border">
                    <tr>
                      <th className="py-2.5 px-3">Part Name</th>
                      <th className="py-2.5 px-3">Part #</th>
                      <th className="py-2.5 px-3 text-right">Qty</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 font-medium">
                    <tr>
                      <td className="py-2 px-3 text-foreground font-bold">Heavy-Duty Brake Pad Set</td>
                      <td className="py-2 px-3 font-mono text-muted-foreground">BP-982-HD</td>
                      <td className="py-2 px-3 text-right font-mono font-bold">2</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-foreground font-bold">Synthetic Engine Oil 15W-40</td>
                      <td className="py-2 px-3 font-mono text-muted-foreground">OIL-SYN-15W</td>
                      <td className="py-2 px-3 text-right font-mono font-bold">12 Gal</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Timeline */}
            <MaintenanceTimeline record={record} />

            {/* Attachments & Documents */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Paperclip className="h-3.5 w-3.5 text-blue-500" />
                Attached Inspection Documents
              </h3>
              <div className="flex items-center gap-2">
                <div className="p-3 rounded-xl border border-border bg-card flex items-center gap-2 flex-1">
                  <FileText className="h-4 w-4 text-indigo-500 shrink-0" />
                  <div className="truncate">
                    <p className="font-bold text-foreground text-xs truncate">Inspection_Receipt.pdf</p>
                    <span className="text-[10px] text-muted-foreground font-mono">1.2 MB • Verified</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl border border-border bg-card flex items-center gap-2 flex-1">
                  <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                  <div className="truncate">
                    <p className="font-bold text-foreground text-xs truncate">Safety_Signoff.pdf</p>
                    <span className="text-[10px] text-muted-foreground font-mono">840 KB • Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-4 border-t border-border bg-muted/20">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl border border-input bg-card text-foreground font-bold text-xs hover:bg-muted transition-colors shadow-2xs"
            >
              Close Details Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceDetailsPage;
