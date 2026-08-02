import React from 'react';
import { X, Truck, Fuel, Calendar, Scale, FileText } from 'lucide-react';

import type { Vehicle } from '@/types/vehicle';
import { VehicleStatusBadge } from './VehicleStatusBadge';

interface VehicleDetailsDrawerProps {
  vehicle: Vehicle | null;
  open: boolean;
  onClose: () => void;
}

export const VehicleDetailsDrawer: React.FC<VehicleDetailsDrawerProps> = ({
  vehicle,
  open,
  onClose,
}) => {
  if (!open || !vehicle) return null;

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
                Vehicle Details
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Registration: {vehicle.registrationNumber}
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
            {/* Visual Hero Panel */}
            <div className="rounded-xl border border-border bg-muted/20 p-5 flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3">
                <Truck className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                {vehicle.make} {vehicle.model}
              </h3>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">
                {vehicle.vehicleType}
              </p>
              <div className="mt-4">
                <VehicleStatusBadge status={vehicle.status} />
              </div>
            </div>

            {/* Structured Specifications Grid */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Specifications
              </h4>

              <div className="grid grid-cols-2 gap-4">
                {/* VIN */}
                <div className="rounded-lg border border-border/50 p-3 space-y-1">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <FileText className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">VIN</span>
                  </div>
                  <span className="block text-sm font-semibold text-foreground select-all">
                    {vehicle.vin}
                  </span>
                </div>

                {/* Manufacturing Year */}
                <div className="rounded-lg border border-border/50 p-3 space-y-1">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Year</span>
                  </div>
                  <span className="block text-sm font-semibold text-foreground">
                    {vehicle.manufacturingYear}
                  </span>
                </div>

                {/* Fuel Type */}
                <div className="rounded-lg border border-border/50 p-3 space-y-1">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Fuel className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Fuel Type</span>
                  </div>
                  <span className="block text-sm font-semibold text-foreground uppercase">
                    {vehicle.fuelType}
                  </span>
                </div>

                {/* Capacity */}
                <div className="rounded-lg border border-border/50 p-3 space-y-1">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Scale className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Payload Capacity</span>
                  </div>
                  <span className="block text-sm font-semibold text-foreground">
                    {vehicle.capacity ? `${vehicle.capacity.toLocaleString()} kg` : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* System Info */}
            <div className="space-y-3 border-t border-border pt-5">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                System Info
              </h4>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">Tenant Company</span>
                  <span className="font-semibold text-foreground">{vehicle.company?.name || 'FleetCore Account'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">Registration Date</span>
                  <span className="font-semibold text-foreground">
                    {new Date(vehicle.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">Last Updated</span>
                  <span className="font-semibold text-foreground">
                    {new Date(vehicle.updatedAt).toLocaleDateString('en-US', {
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
export default VehicleDetailsDrawer;
