import React from 'react';
import { X, Truck, User, Wrench, Compass, MessageSquare } from 'lucide-react';

import type { MaintenanceRecord } from '@/types/maintenance';
import { MaintenanceStatusBadge } from './MaintenanceStatusBadge';
import { MaintenanceTypeBadge } from './MaintenanceTypeBadge';

interface MaintenanceDetailsDrawerProps {
  record: MaintenanceRecord | null;
  open: boolean;
  onClose: () => void;
}

export const MaintenanceDetailsDrawer: React.FC<MaintenanceDetailsDrawerProps> = ({
  record,
  open,
  onClose,
}) => {
  if (!open || !record) return null;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return '—';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const isCompleted = record.status === 'COMPLETED';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
        {/* Drawer Panel */}
        <div className="pointer-events-auto w-screen max-w-md transform bg-card shadow-2xl transition-all duration-300 border-l border-border flex flex-col h-full animate-slide-in">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-6 py-5">
            <div>
              <h2 className="text-base font-bold text-foreground">
                Maintenance Work Order Details
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Order ID: {record.maintenanceRecordNumber}
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Close details panel"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Details Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Visual Status Panel */}
            <div className="rounded-xl border border-border bg-muted/20 p-5 flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3">
                <Wrench className="h-7 w-7" />
              </div>
              <h3 className="text-sm font-bold text-foreground">
                {record.serviceProvider || 'Unassigned Provider'}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Scheduled for {formatDate(record.scheduledDate)}
              </p>
              <div className="flex gap-2 mt-3.5">
                <MaintenanceTypeBadge type={record.maintenanceType} />
                <MaintenanceStatusBadge status={record.status} />
              </div>
            </div>

            {/* Core Financial Costs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-border p-4 text-center bg-card">
                <span className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Estimated Cost</span>
                <span className="block text-base font-bold text-foreground mt-1">
                  {isCompleted ? '—' : formatCurrency(record.cost)}
                </span>
              </div>
              <div className="rounded-xl border border-border p-4 text-center bg-card">
                <span className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Actual Cost</span>
                <span className="block text-base font-bold text-foreground mt-1 text-emerald-600 dark:text-emerald-400">
                  {isCompleted ? formatCurrency(record.cost) : '—'}
                </span>
              </div>
            </div>

            {/* Logistics Associations */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Fleet & Personnel alignment
              </h4>

              <div className="divide-y divide-border/60 rounded-xl border border-border overflow-hidden bg-card text-xs">
                {/* Vehicle */}
                <div className="p-3.5 flex items-start gap-3">
                  <Truck className="h-4.5 w-4.5 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-bold text-muted-foreground">Assigned Vehicle</span>
                    {record.vehicle ? (
                      <span className="block font-bold text-foreground mt-0.5 leading-normal">
                        {record.vehicle.registrationNumber} ({record.vehicle.make} {record.vehicle.model})
                      </span>
                    ) : (
                      <span className="block text-muted-foreground italic mt-0.5">Not assigned</span>
                    )}
                  </div>
                </div>

                {/* Driver */}
                <div className="p-3.5 flex items-start gap-3">
                  <User className="h-4.5 w-4.5 text-orange-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-bold text-muted-foreground">Assigned Personnel / Tech</span>
                    {record.driver ? (
                      <span className="block font-bold text-foreground mt-0.5 leading-normal">
                        {record.driver.firstName} {record.driver.lastName} ({record.driver.licenseNumber})
                      </span>
                    ) : (
                      <span className="block text-muted-foreground italic mt-0.5">Unassigned technician</span>
                    )}
                  </div>
                </div>

                {/* Odometer */}
                <div className="p-3.5 flex items-start gap-3">
                  <Compass className="h-4.5 w-4.5 text-teal-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-bold text-muted-foreground">Logged Mileage (odometer)</span>
                    <span className="block font-bold text-foreground mt-0.5 leading-normal">
                      {record.odometerReading ? `${record.odometerReading.toLocaleString()} miles` : '—'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description of Work */}
            {record.description && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Description of Work / Issue
                </h4>
                <div className="rounded-xl border border-border p-3.5 text-xs bg-card">
                  <p className="text-foreground leading-relaxed font-medium">{record.description}</p>
                </div>
              </div>
            )}

            {/* Scheduling & Interval Details */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Work Order Timeline
              </h4>

              <div className="rounded-xl border border-border p-4 space-y-3.5 text-xs bg-card">
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-semibold">Scheduled Date</span>
                  <span className="font-bold text-foreground">{formatDate(record.scheduledDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-semibold">Completed Date</span>
                  <span className="font-bold text-foreground">{formatDate(record.completedDate)}</span>
                </div>
                <div className="border-t border-border/60 my-2 pt-2.5" />
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-semibold">Next Service Target</span>
                  <span className="font-bold text-foreground">
                    {formatDate(record.nextMaintenanceDate)}
                  </span>
                </div>
              </div>
            </div>

            {/* Technical Notes */}
            {record.notes && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Special Instructions / Tech Notes
                </h4>
                <div className="rounded-xl border border-border p-3.5 text-xs bg-card flex gap-2.5 items-start">
                  <MessageSquare className="h-4 w-4 text-muted-foreground/60 shrink-0 mt-0.5" />
                  <p className="text-muted-foreground leading-relaxed italic">{record.notes}</p>
                </div>
              </div>
            )}

            {/* System Info */}
            <div className="space-y-3 border-t border-border pt-5">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                System Metadata
              </h4>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">Tenant Organization</span>
                  <span className="font-semibold text-foreground">{record.company?.name || 'FleetCore Client'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">Record Created</span>
                  <span className="font-semibold text-foreground">
                    {new Date(record.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">Last Updated</span>
                  <span className="font-semibold text-foreground">
                    {new Date(record.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MaintenanceDetailsDrawer;
