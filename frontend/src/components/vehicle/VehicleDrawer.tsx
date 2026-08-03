import React, { useState } from 'react';
import {
  X, Truck, Fuel, Calendar, Scale, FileText, Edit2, Trash2,
  MapPin, User, Zap, Info, Clock, AlertTriangle, ChevronRight
} from 'lucide-react';
import type { Vehicle } from '@/types/vehicle';
import { VehicleStatusBadge } from './VehicleStatusBadge';
import { VehicleTypeBadge } from './VehicleTypeBadge';

interface VehicleDrawerProps {
  vehicle: Vehicle | null;
  open: boolean;
  onClose: () => void;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (id: string) => void;
  onViewFull?: (vehicle: Vehicle) => void;
}

type DrawerTab = 'overview' | 'specs' | 'history';

const InfoRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex items-start justify-between gap-3 py-2.5 border-b border-border/50 last:border-0">
    <span className="text-xs font-medium text-muted-foreground shrink-0">{label}</span>
    <span className="text-xs font-semibold text-foreground text-right">{value}</span>
  </div>
);

const SpecCard: React.FC<{ icon: React.ElementType; label: string; value: string }> = ({ icon: Icon, label, value }) => (
  <div className="flex flex-col gap-2 rounded-xl border border-border/60 bg-muted/20 p-3">
    <div className="flex items-center gap-1.5 text-muted-foreground">
      <Icon className="h-3.5 w-3.5" />
      <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
    </div>
    <span className="text-sm font-bold text-foreground">{value}</span>
  </div>
);

export const VehicleDrawer: React.FC<VehicleDrawerProps> = ({
  vehicle,
  open,
  onClose,
  onEdit,
  onDelete,
  onViewFull,
}) => {
  const [activeTab, setActiveTab] = useState<DrawerTab>('overview');

  if (!open || !vehicle) return null;

  const tabs: { key: DrawerTab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'specs', label: 'Specifications' },
    { key: 'history', label: 'Activity' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-label="Vehicle Details Drawer">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
        <div className="pointer-events-auto w-screen max-w-md bg-card border-l border-border shadow-2xl flex flex-col h-full">

          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-card shrink-0">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold text-sm ${
                vehicle.vehicleType === 'TRUCK' ? 'bg-orange-500/10 text-orange-600' :
                vehicle.vehicleType === 'VAN' ? 'bg-sky-500/10 text-sky-600' :
                'bg-primary/10 text-primary'
              }`}>
                {vehicle.make.charAt(0)}{vehicle.model.charAt(0)}
              </div>
              <div>
                <h2 className="text-sm font-bold text-foreground leading-tight">
                  {vehicle.make} {vehicle.model}
                </h2>
                <p className="text-xs font-mono text-muted-foreground mt-0.5">
                  {vehicle.registrationNumber}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onEdit(vehicle)}
                className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                title="Edit Vehicle"
                aria-label="Edit vehicle"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(vehicle.id)}
                className="rounded-lg p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                title="Delete Vehicle"
                aria-label="Delete vehicle"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors ml-1"
                aria-label="Close panel"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>

          {/* Status banner */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-border/60 bg-muted/20 shrink-0">
            <VehicleStatusBadge status={vehicle.status} />
            <VehicleTypeBadge type={vehicle.vehicleType} />
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border shrink-0 px-4">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-3 text-xs font-bold transition-colors border-b-2 -mb-px ${
                  activeTab === tab.key
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content — Scrollable */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <>
                {/* Key Info */}
                <section className="space-y-0.5">
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    Vehicle Identity
                  </h4>
                  <InfoRow label="License Plate" value={vehicle.registrationNumber} />
                  <InfoRow label="Make" value={vehicle.make} />
                  <InfoRow label="Model" value={vehicle.model} />
                  <InfoRow label="Year" value={vehicle.manufacturingYear} />
                  <InfoRow
                    label="VIN"
                    value={
                      <span className="font-mono text-[10px] select-all">{vehicle.vin}</span>
                    }
                  />
                </section>

                {/* Assignment Info */}
                <section className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <User className="h-3 w-3" />
                    Assigned Driver
                  </h4>
                  {vehicle.status === 'ON_TRIP' ? (
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-sm">
                        D
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">Trip Driver</p>
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Active · On Duty</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">No driver currently assigned to this vehicle.</p>
                  )}
                </section>

                {/* Location Info */}
                <section className="rounded-xl border border-border bg-muted/20 p-4 space-y-2">
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="h-3 w-3" />
                    Live Location
                  </h4>
                  {vehicle.status === 'ON_TRIP' ? (
                    <div>
                      <p className="text-xs font-semibold text-foreground">Active Route — In Transit</p>
                      <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Updated 2 min ago
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">Location data is only available when the vehicle is on a trip.</p>
                  )}
                </section>

                {/* Dates */}
                <section className="space-y-0.5 pt-1 border-t border-border">
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    Record Info
                  </h4>
                  <InfoRow
                    label="Added to Fleet"
                    value={new Date(vehicle.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  />
                  <InfoRow
                    label="Last Updated"
                    value={new Date(vehicle.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  />
                </section>
              </>
            )}

            {/* Specifications Tab */}
            {activeTab === 'specs' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <SpecCard icon={Truck} label="Vehicle Type" value={vehicle.vehicleType} />
                  <SpecCard icon={Fuel} label="Fuel Type" value={vehicle.fuelType} />
                  <SpecCard icon={Calendar} label="Year" value={String(vehicle.manufacturingYear)} />
                  <SpecCard icon={Scale} label="Payload" value={vehicle.capacity ? `${vehicle.capacity.toLocaleString()} kg` : 'N/A'} />
                  <SpecCard icon={FileText} label="VIN" value={vehicle.vin} />
                  <SpecCard icon={Zap} label="Status" value={vehicle.status.replace('_', ' ')} />
                </div>

                <div className="rounded-xl border border-border p-4 bg-muted/10 space-y-2 mt-2">
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Service Readiness
                  </h4>
                  <div className="space-y-2">
                    {[
                      { label: 'Safety Inspection', val: 'Current', ok: true },
                      { label: 'Insurance', val: 'Valid', ok: true },
                      { label: 'Maintenance Schedule', val: vehicle.status === 'MAINTENANCE' ? 'Due' : 'On Schedule', ok: vehicle.status !== 'MAINTENANCE' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{item.label}</span>
                        <span className={`text-xs font-bold flex items-center gap-1 ${item.ok ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                          {item.ok ? '✓' : <AlertTriangle className="h-3 w-3" />}
                          {item.val}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Activity / History Tab */}
            {activeTab === 'history' && (
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Recent Activity
                </h4>

                {[
                  {
                    icon: FileText,
                    title: 'Vehicle Record Created',
                    time: new Date(vehicle.createdAt).toLocaleDateString(),
                    color: 'text-primary bg-primary/10',
                  },
                  {
                    icon: Info,
                    title: 'Status Updated to ' + vehicle.status.replace('_', ' '),
                    time: new Date(vehicle.updatedAt).toLocaleDateString(),
                    color: 'text-blue-500 bg-blue-500/10',
                  },
                ].map((event, idx) => {
                  const Icon = event.icon;
                  return (
                    <div key={idx} className="flex gap-3">
                      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${event.color}`}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground">{event.title}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{event.time}</p>
                      </div>
                    </div>
                  );
                })}

                <div className="rounded-xl border border-dashed border-border p-4 text-center">
                  <p className="text-xs text-muted-foreground">
                    Maintenance history, fuel logs, and trip history will display here once connected to real-time telemetry data.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer Action */}
          {onViewFull && (
            <div className="border-t border-border px-6 py-4 shrink-0">
              <button
                onClick={() => onViewFull(vehicle)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 transition-colors text-sm font-bold"
              >
                <span>Open Full Vehicle Details</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleDrawer;
