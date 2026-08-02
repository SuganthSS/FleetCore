import React from 'react';
import { X, Truck, User, Package, MapPin, Navigation } from 'lucide-react';

import type { Trip } from '@/types/trip';
import { TripStatusBadge } from './TripStatusBadge';

interface TripDetailsDrawerProps {
  trip: Trip | null;
  open: boolean;
  onClose: () => void;
}

export const TripDetailsDrawer: React.FC<TripDetailsDrawerProps> = ({
  trip,
  open,
  onClose,
}) => {
  if (!open || !trip) return null;

  const formatDateTime = (dateStr: string | null) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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
                Trip Dispatch Record
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Trip Number: {trip.tripNumber}
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
                <Navigation className="h-7 w-7" />
              </div>
              <h3 className="text-sm font-bold text-foreground">
                {trip.tripNumber}
              </h3>
              <div className="mt-2.5">
                <TripStatusBadge status={trip.status} />
              </div>
            </div>

            {/* Logistics Relations */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Assigned Logistics Entities
              </h4>

              <div className="divide-y divide-border/60 rounded-xl border border-border overflow-hidden bg-card text-xs">
                {/* Shipment */}
                <div className="p-3.5 flex items-start gap-3">
                  <Package className="h-4.5 w-4.5 text-orange-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-bold text-muted-foreground">Shipment Reference</span>
                    {trip.shipment ? (
                      <span className="block font-bold text-foreground mt-0.5 leading-normal">
                        {trip.shipment.shipmentNumber} — {trip.shipment.title}
                      </span>
                    ) : (
                      <span className="block text-muted-foreground italic mt-0.5">Not assigned</span>
                    )}
                  </div>
                </div>

                {/* Vehicle */}
                <div className="p-3.5 flex items-start gap-3">
                  <Truck className="h-4.5 w-4.5 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-bold text-muted-foreground">Assigned Vehicle</span>
                    {trip.vehicle ? (
                      <span className="block font-bold text-foreground mt-0.5 leading-normal">
                        {trip.vehicle.registrationNumber} ({trip.vehicle.make} {trip.vehicle.model})
                      </span>
                    ) : (
                      <span className="block text-muted-foreground italic mt-0.5">Not assigned</span>
                    )}
                  </div>
                </div>

                {/* Driver */}
                <div className="p-3.5 flex items-start gap-3">
                  <User className="h-4.5 w-4.5 text-teal-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-bold text-muted-foreground">Responsible Driver</span>
                    {trip.driver ? (
                      <span className="block font-bold text-foreground mt-0.5 leading-normal">
                        {trip.driver.firstName} {trip.driver.lastName} (ID: {trip.driver.employeeId})
                      </span>
                    ) : (
                      <span className="block text-muted-foreground italic mt-0.5">Not assigned</span>
                    )}
                  </div>
                </div>

                {/* Route */}
                <div className="p-3.5 flex items-start gap-3">
                  <MapPin className="h-4.5 w-4.5 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-bold text-muted-foreground">Planned Route Corridor</span>
                    {trip.route ? (
                      <span className="block font-bold text-foreground mt-0.5 leading-normal">
                        {trip.route.routeCode} ({trip.route.originCity} to {trip.route.destinationCity})
                      </span>
                    ) : (
                      <span className="block text-muted-foreground italic mt-0.5">Not assigned</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Time Planning Metrics */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Timeline Metrics
              </h4>

              <div className="rounded-xl border border-border p-4 space-y-3.5 text-xs bg-card">
                <div>
                  <span className="block font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Planned Dispatch Start</span>
                  <span className="block font-bold text-foreground mt-0.5">
                    {formatDateTime(trip.scheduledStartTime)}
                  </span>
                </div>
                <div>
                  <span className="block font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Planned Arrival Estimate</span>
                  <span className="block font-bold text-foreground mt-0.5">
                    {formatDateTime(trip.scheduledEndTime)}
                  </span>
                </div>
                <div className="border-t border-border/60 my-2 pt-2.5" />
                <div>
                  <span className="block font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Actual Dispatch Start</span>
                  <span className="block font-bold text-foreground mt-0.5">
                    {formatDateTime(trip.actualStartTime)}
                  </span>
                </div>
                <div>
                  <span className="block font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Actual Arrival Completed</span>
                  <span className="block font-bold text-foreground mt-0.5">
                    {formatDateTime(trip.actualEndTime)}
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
                  <span className="text-muted-foreground font-medium">Tenant Organization</span>
                  <span className="font-semibold text-foreground">{trip.company?.name || 'FleetCore Client'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">Record Created</span>
                  <span className="font-semibold text-foreground">
                    {new Date(trip.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">Last Updated</span>
                  <span className="font-semibold text-foreground">
                    {new Date(trip.updatedAt).toLocaleDateString('en-US', {
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
export default TripDetailsDrawer;
