import React from 'react';
import { X, Mail, MapPin, Calendar, ClipboardList, Landmark, Weight, Box, Truck } from 'lucide-react';
import type { Shipment } from '@/types/shipment';
import { ShipmentStatusBadge } from './ShipmentStatusBadge';
import { ShipmentPriorityBadge } from './ShipmentPriorityBadge';

interface ShipmentDetailsDrawerProps {
  shipment: Shipment | null;
  open: boolean;
  onClose: () => void;
}

export const ShipmentDetailsDrawer: React.FC<ShipmentDetailsDrawerProps> = ({
  shipment,
  open,
  onClose,
}) => {
  if (!open || !shipment) return null;

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
                Shipment Record Details
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Shipment Code: {shipment.shipmentNumber}
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
                <Box className="h-7 w-7" />
              </div>
              <h3 className="text-base font-bold text-foreground line-clamp-2 px-2">
                {shipment.title}
              </h3>
              {shipment.cargoType && (
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mt-1">
                  Cargo: {shipment.cargoType}
                </span>
              )}
              <div className="flex items-center gap-2 mt-4">
                <ShipmentPriorityBadge priority={shipment.priority} />
                <ShipmentStatusBadge status={shipment.status} />
              </div>
            </div>

            {/* Assigned Trip Section */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Operational Assignment
              </h4>
              <div className="rounded-xl border border-border p-4 bg-muted/30">
                {shipment.trips && shipment.trips.length > 0 ? (
                  <div className="space-y-3">
                    {shipment.trips.map((trip) => (
                      <div key={trip.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Truck className="h-4.5 w-4.5 text-primary shrink-0" />
                          <div>
                            <span className="block text-xs font-bold text-foreground">
                              Trip #{trip.tripNumber}
                            </span>
                            <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                              Status: {trip.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                    <Truck className="h-4.5 w-4.5 opacity-60" />
                    <span>No active trips assigned. Ready for routing scheduling.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Customer Details */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Ordering Customer
              </h4>
              <div className="rounded-xl border border-border p-4 space-y-3 bg-muted/10">
                <div className="flex items-start gap-3 text-xs">
                  <Landmark className="h-4 w-4 text-muted-foreground/75 mt-0.5 shrink-0" />
                  <div>
                    <span className="block text-muted-foreground font-semibold">Company Name</span>
                    <span className="block text-foreground font-bold mt-0.5">
                      {shipment.customer?.companyName || 'Not Assigned'}
                    </span>
                  </div>
                </div>
                {shipment.customer?.customerCode && (
                  <div className="flex items-start gap-3 text-xs border-t border-border/50 pt-3">
                    <ClipboardList className="h-4 w-4 text-muted-foreground/75 mt-0.5 shrink-0" />
                    <div>
                      <span className="block text-muted-foreground font-semibold">Customer Reference Code</span>
                      <span className="block text-foreground font-bold mt-0.5">
                        {shipment.customer.customerCode}
                      </span>
                    </div>
                  </div>
                )}
                {shipment.customer?.email && (
                  <div className="flex items-start gap-3 text-xs border-t border-border/50 pt-3">
                    <Mail className="h-4 w-4 text-muted-foreground/75 mt-0.5 shrink-0" />
                    <div>
                      <span className="block text-muted-foreground font-semibold">Customer Contact Email</span>
                      <span className="block text-foreground font-bold select-all mt-0.5">
                        {shipment.customer.email}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Cargo Dimensions */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Cargo Specifications
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-border p-3.5 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                    <Weight className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Weight</span>
                    <span className="text-sm font-bold text-foreground mt-0.5">
                      {shipment.weight ? `${shipment.weight} kg` : '—'}
                    </span>
                  </div>
                </div>
                <div className="rounded-xl border border-border p-3.5 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-teal-500/10 text-teal-500">
                    <Box className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Volume</span>
                    <span className="text-sm font-bold text-foreground mt-0.5">
                      {shipment.volume ? `${shipment.volume} m³` : '—'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Logistics Timeline */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Logistics Dates
              </h4>
              <div className="rounded-xl border border-border p-4 space-y-3">
                <div className="flex gap-3 text-xs">
                  <Calendar className="h-4 w-4 text-muted-foreground/75 mt-0.5 shrink-0" />
                  <div>
                    <span className="block text-muted-foreground font-semibold">Planned Pickup Date</span>
                    <span className="block text-foreground font-bold mt-0.5">
                      {shipment.pickupDate
                        ? new Date(shipment.pickupDate).toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : 'Not Scheduled'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-3 text-xs border-t border-border/50 pt-3">
                  <Calendar className="h-4 w-4 text-muted-foreground/75 mt-0.5 shrink-0" />
                  <div>
                    <span className="block text-muted-foreground font-semibold">Planned Delivery Date</span>
                    <span className="block text-foreground font-bold mt-0.5">
                      {shipment.expectedDeliveryDate
                        ? new Date(shipment.expectedDeliveryDate).toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : 'Not Scheduled'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pickup & Destination Addresses */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Route Addresses
              </h4>
              <div className="rounded-xl border border-border p-4 space-y-4">
                {/* Origin */}
                <div className="flex gap-3 text-xs">
                  <div className="flex flex-col items-center">
                    <MapPin className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                    <div className="w-0.5 flex-1 bg-border/80 my-1" />
                  </div>
                  <div>
                    <span className="block text-muted-foreground font-semibold">Origin Location</span>
                    <span className="block text-foreground font-bold leading-normal mt-0.5">
                      {shipment.pickupAddress}
                    </span>
                    <span className="block text-xs font-medium text-muted-foreground mt-0.5">
                      {shipment.pickupCity}
                      {shipment.pickupState ? `, ${shipment.pickupState}` : ''}
                      {shipment.pickupPostalCode ? ` (${shipment.pickupPostalCode})` : ''}
                      , {shipment.pickupCountry}
                    </span>
                  </div>
                </div>

                {/* Destination */}
                <div className="flex gap-3 text-xs">
                  <MapPin className="h-4.5 w-4.5 text-rose-500 shrink-0" />
                  <div>
                    <span className="block text-muted-foreground font-semibold">Destination Location</span>
                    <span className="block text-foreground font-bold leading-normal mt-0.5">
                      {shipment.deliveryAddress}
                    </span>
                    <span className="block text-xs font-medium text-muted-foreground mt-0.5">
                      {shipment.deliveryCity}
                      {shipment.deliveryState ? `, ${shipment.deliveryState}` : ''}
                      {shipment.deliveryPostalCode ? ` (${shipment.deliveryPostalCode})` : ''}
                      , {shipment.deliveryCountry}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Special Instructions */}
            {shipment.description && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Special Instructions
                </h4>
                <div className="rounded-xl border border-border p-4 bg-muted/15 text-xs text-foreground leading-relaxed whitespace-pre-wrap">
                  {shipment.description}
                </div>
              </div>
            )}

            {/* System Info */}
            <div className="space-y-3 border-t border-border pt-5">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                System Info
              </h4>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">Tenant Organization</span>
                  <span className="font-semibold text-foreground">{shipment.company?.name || 'FleetCore Client'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">Record Created</span>
                  <span className="font-semibold text-foreground">
                    {new Date(shipment.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">Last Updated</span>
                  <span className="font-semibold text-foreground">
                    {new Date(shipment.updatedAt).toLocaleDateString('en-US', {
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
export default ShipmentDetailsDrawer;
