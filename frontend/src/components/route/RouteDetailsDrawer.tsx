import React from 'react';
import { X, MapPin, Compass, Clock, Navigation } from 'lucide-react';

import type { Route } from '@/types/route';
import { RouteStatusBadge } from './RouteStatusBadge';
import { RouteTypeBadge } from './RouteTypeBadge';

interface RouteDetailsDrawerProps {
  route: Route | null;
  open: boolean;
  onClose: () => void;
}

export const RouteDetailsDrawer: React.FC<RouteDetailsDrawerProps> = ({
  route,
  open,
  onClose,
}) => {
  if (!open || !route) return null;

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return '—';
    const hrs = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hrs === 0) return `${mins} mins`;
    return `${hrs}h ${mins}m`;
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
                Route Record Details
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Route Code: {route.routeCode}
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
                <Compass className="h-7 w-7" />
              </div>
              <h3 className="text-sm font-bold text-foreground line-clamp-2 px-2">
                {route.name}
              </h3>
              {route.description && (
                <p className="text-xs text-muted-foreground mt-1.5 line-clamp-3 px-1">
                  {route.description}
                </p>
              )}
              <div className="flex items-center gap-2 mt-4">
                <RouteTypeBadge type={route.routeType} />
                <RouteStatusBadge status={route.status} />
              </div>
            </div>

            {/* Route Stats */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Planning Metrics
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-border p-3.5 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                    <Navigation className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Planned Distance</span>
                    <span className="text-sm font-bold text-foreground mt-0.5">
                      {route.plannedDistance ? `${route.plannedDistance} km` : '—'}
                    </span>
                  </div>
                </div>
                <div className="rounded-xl border border-border p-3.5 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-teal-500/10 text-teal-500">
                    <Clock className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Est. Duration</span>
                    <span className="text-sm font-bold text-foreground mt-0.5">
                      {formatDuration(route.estimatedDuration)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Origin & Destination Addresses */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Route Path Corridors
              </h4>
              <div className="rounded-xl border border-border p-4 space-y-4">
                {/* Origin */}
                <div className="flex gap-3 text-xs">
                  <div className="flex flex-col items-center">
                    <MapPin className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                    <div className="w-0.5 flex-1 bg-border/80 my-1" />
                  </div>
                  <div>
                    <span className="block text-muted-foreground font-semibold">Origin Point</span>
                    <span className="block text-foreground font-bold leading-normal mt-0.5">
                      {route.originAddress}
                    </span>
                    <span className="block text-xs font-medium text-muted-foreground mt-0.5">
                      City: {route.originCity || '—'}
                    </span>
                  </div>
                </div>

                {/* Destination */}
                <div className="flex gap-3 text-xs">
                  <MapPin className="h-4.5 w-4.5 text-rose-500 shrink-0" />
                  <div>
                    <span className="block text-muted-foreground font-semibold">Destination Point</span>
                    <span className="block text-foreground font-bold leading-normal mt-0.5">
                      {route.destinationAddress}
                    </span>
                    <span className="block text-xs font-medium text-muted-foreground mt-0.5">
                      City: {route.destinationCity || '—'}
                    </span>
                  </div>
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
                  <span className="font-semibold text-foreground">{route.company?.name || 'FleetCore Client'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">Record Created</span>
                  <span className="font-semibold text-foreground">
                    {new Date(route.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">Last Updated</span>
                  <span className="font-semibold text-foreground">
                    {new Date(route.updatedAt).toLocaleDateString('en-US', {
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
export default RouteDetailsDrawer;
