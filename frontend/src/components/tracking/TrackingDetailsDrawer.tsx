import { X, Truck, User, Navigation, Map } from 'lucide-react';

import type { TrackingRecord } from '@/types/tracking';

interface TrackingDetailsDrawerProps {
  record: TrackingRecord | null;
  open: boolean;
  onClose: () => void;
}

export const TrackingDetailsDrawer: React.FC<TrackingDetailsDrawerProps> = ({
  record,
  open,
  onClose,
}) => {
  if (!open || !record) return null;

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const hasValidCoordinates =
    typeof record.latitude === 'number' &&
    typeof record.longitude === 'number' &&
    record.latitude >= -90 &&
    record.latitude <= 90 &&
    record.longitude >= -180 &&
    record.longitude <= 180;

  // Compute bounding box coordinates for OpenStreetMap iframe
  const delta = 0.005;
  const bbox = hasValidCoordinates
    ? `${record.longitude - delta}%2C${record.latitude - delta}%2C${record.longitude + delta}%2C${record.latitude + delta}`
    : '';
  const osmUrl = hasValidCoordinates
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${record.latitude}%2C${record.longitude}`
    : '';

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
                GPS Tracking Log Details
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Log ID: {record.id}
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
            {/* Map Preview Section */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Map className="h-4 w-4 text-blue-500" />
                Live Map Breadcrumb
              </h4>
              {hasValidCoordinates ? (
                <div className="rounded-xl border border-border overflow-hidden shadow-sm h-52 relative bg-muted">
                  <iframe
                    title="OSM Live Location"
                    width="100%"
                    height="100%"
                    src={osmUrl}
                    style={{ border: 0 }}
                    aria-label="OpenStreetMap GPS position"
                  />
                </div>
              ) : (
                <div className="rounded-xl border border-border p-8 text-center bg-muted/20">
                  <p className="text-xs text-muted-foreground">Coordinates are unavailable for map rendering.</p>
                </div>
              )}
            </div>

            {/* Core Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-border p-3 text-center bg-card">
                <span className="block text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Speed</span>
                <span className="block text-sm font-bold text-foreground mt-1">
                  {record.speed !== null ? `${record.speed} mph` : '—'}
                </span>
              </div>
              <div className="rounded-xl border border-border p-3 text-center bg-card">
                <span className="block text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Heading</span>
                <span className="block text-sm font-bold text-foreground mt-1">
                  {record.heading !== null ? `${record.heading}°` : '—'}
                </span>
              </div>
              <div className="rounded-xl border border-border p-3 text-center bg-card">
                <span className="block text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Altitude</span>
                <span className="block text-sm font-bold text-foreground mt-1 text-teal-600 dark:text-teal-400">
                  {record.altitude !== null ? `${record.altitude} m` : '—'}
                </span>
              </div>
            </div>

            {/* Logistics Associations */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Asset & Operations Scoping
              </h4>

              <div className="divide-y divide-border/60 rounded-xl border border-border overflow-hidden bg-card text-xs">
                {/* Vehicle */}
                <div className="p-3.5 flex items-start gap-3">
                  <Truck className="h-4.5 w-4.5 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-bold text-muted-foreground">Vehicle Asset</span>
                    {record.vehicle ? (
                      <span className="block font-bold text-foreground mt-0.5">
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
                    <span className="block font-bold text-muted-foreground">Active Driver</span>
                    {record.driver ? (
                      <span className="block font-bold text-foreground mt-0.5">
                        {record.driver.firstName} {record.driver.lastName} ({record.driver.licenseNumber})
                      </span>
                    ) : (
                      <span className="block text-muted-foreground italic mt-0.5">Unassigned driver</span>
                    )}
                  </div>
                </div>

                {/* Trip */}
                <div className="p-3.5 flex items-start gap-3">
                  <Navigation className="h-4.5 w-4.5 text-indigo-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-bold text-muted-foreground">Associated Trip</span>
                    {record.trip ? (
                      <span className="block font-bold text-foreground mt-0.5">
                        Trip {record.trip.tripNumber} ({record.trip.status})
                      </span>
                    ) : (
                      <span className="block text-muted-foreground italic mt-0.5">No active trip</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Geographical details */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Geographical Coordinates & Address
              </h4>

              <div className="rounded-xl border border-border p-4 space-y-3 text-xs bg-card">
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-semibold">Latitude</span>
                  <span className="font-mono font-bold text-foreground">{record.latitude.toFixed(6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-semibold">Longitude</span>
                  <span className="font-mono font-bold text-foreground">{record.longitude.toFixed(6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-semibold">Accuracy</span>
                  <span className="font-bold text-foreground">
                    {record.accuracy !== null ? `${record.accuracy} meters` : '—'}
                  </span>
                </div>
                <div className="border-t border-border/60 my-2 pt-2.5" />
                <div className="space-y-1">
                  <span className="text-muted-foreground font-semibold block">Full Address</span>
                  <span className="font-bold text-foreground leading-relaxed block">
                    {record.address || '—'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-1.5">
                  <div>
                    <span className="text-muted-foreground font-semibold block">City</span>
                    <span className="font-bold text-foreground mt-0.5 block">{record.city || '—'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground font-semibold block">State / Region</span>
                    <span className="font-bold text-foreground mt-0.5 block">{record.state || '—'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground font-semibold block">Country</span>
                    <span className="font-bold text-foreground mt-0.5 block">{record.country || '—'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground font-semibold block">Postal Code</span>
                    <span className="font-bold text-foreground mt-0.5 block">{record.postalCode || '—'}</span>
                  </div>
                </div>
              </div>
            </div>

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
                  <span className="text-muted-foreground font-medium">Time Recorded</span>
                  <span className="font-semibold text-foreground">{formatDate(record.recordedAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">Log Created</span>
                  <span className="font-semibold text-foreground">{formatDate(record.createdAt)}</span>
                </div>
                {record.updatedAt && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-medium">Last Updated</span>
                    <span className="font-semibold text-foreground">{formatDate(record.updatedAt)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TrackingDetailsDrawer;
