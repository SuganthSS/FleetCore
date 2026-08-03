import React, { useState } from 'react';
import {
  X,
  MapPin,
  ExternalLink,
  Navigation,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Route } from '@/types/route';
import { RouteStatusBadge } from './RouteStatusBadge';
import { RouteTypeBadge } from './RouteTypeBadge';

interface RouteDrawerProps {
  open: boolean;
  route: Route | null;
  onClose: () => void;
}

export const RouteDrawer: React.FC<RouteDrawerProps> = ({ open, route, onClose }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'waypoints' | 'trips'>('overview');

  if (!open || !route) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-background/80 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md border-l border-border bg-card shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-border space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-mono">
                  Route Code: {route.routeCode}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary font-extrabold text-lg">
                <Navigation className="h-7 w-7" />
              </div>
              <div className="space-y-1 flex-1">
                <h2 className="text-lg font-bold text-foreground leading-snug font-mono">
                  {route.routeCode}
                </h2>
                <div className="flex items-center gap-2 flex-wrap">
                  <RouteStatusBadge status={route.status} />
                  <RouteTypeBadge type={route.routeType} />
                </div>
              </div>
            </div>

            {/* Quick link button to full details page */}
            <button
              onClick={() => {
                onClose();
                navigate(`/routes/${route.id}`);
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 font-semibold text-xs transition-colors"
            >
              Open Full Route Details Page
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-border bg-muted/20 px-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('waypoints')}
              className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === 'waypoints'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Stops & Waypoints
            </button>
            <button
              onClick={() => setActiveTab('trips')}
              className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === 'trips'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Active Trips
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Distance & Duration Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl border border-border bg-muted/10 text-center space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Planned Distance</span>
                    <p className="text-xl font-extrabold text-foreground">
                      {route.plannedDistance ? `${route.plannedDistance} mi` : 'N/A'}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl border border-border bg-muted/10 text-center space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Est. Duration</span>
                    <p className="text-xl font-extrabold text-foreground">
                      {route.estimatedDuration ? `${route.estimatedDuration} hrs` : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Corridor Overview */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Origin & Destination
                  </h3>
                  <div className="rounded-xl border border-border bg-muted/10 p-4 space-y-4 text-xs">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase block">Origin</span>
                        <p className="font-bold text-foreground">{route.originCity || route.originAddress}</p>
                        <p className="text-[11px] text-muted-foreground">{route.originAddress}</p>
                      </div>
                    </div>

                    <div className="border-t border-border/60 pt-3 flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase block">Destination</span>
                        <p className="font-bold text-foreground">{route.destinationCity || route.destinationAddress}</p>
                        <p className="text-[11px] text-muted-foreground">{route.destinationAddress}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'waypoints' && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Waypoints & Rest Stops
                </h3>
                <div className="space-y-2">
                  {[
                    { title: 'Origin Freight Hub', address: route.originAddress, type: 'START' },
                    { title: 'Rest Stop / Refuel Depot #1', address: 'Interstate Rest Area 14', type: 'WAYPOINT' },
                    { title: 'Destination Logistics Terminal', address: route.destinationAddress, type: 'END' },
                  ].map((stop, idx) => (
                    <div key={idx} className="p-3 rounded-xl border border-border bg-card text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="h-6 w-6 rounded-full bg-primary/10 text-primary font-bold text-[11px] flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="font-bold text-foreground">{stop.title}</p>
                          <p className="text-[10px] text-muted-foreground">{stop.address}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'trips' && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Active Trips on Route
                </h3>
                <div className="p-3.5 rounded-xl border border-border bg-muted/10 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-primary">TRIP-9901</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600">
                      IN_PROGRESS
                    </span>
                  </div>
                  <p className="text-muted-foreground">Assigned Truck: Volvo FH16 (TRK-408)</p>
                  <p className="text-muted-foreground">Assigned Driver: Marcus Vance</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteDrawer;
