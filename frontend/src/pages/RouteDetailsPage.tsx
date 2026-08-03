import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ChevronLeft,
  Clock,
  Navigation,
} from 'lucide-react';
import { routeService } from '@/services/route.service';
import { RouteStatusBadge } from '@/components/route/RouteStatusBadge';
import { RouteTypeBadge } from '@/components/route/RouteTypeBadge';

export const RouteDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'map' | 'stops' | 'trips' | 'activity'>('overview');

  const { data: routeResponse, isLoading, error } = useQuery({
    queryKey: ['route', id],
    queryFn: () => routeService.getRoute(id!),
    enabled: !!id,
  });

  const route = routeResponse?.data;

  if (isLoading) {
    return (
      <div className="p-8 space-y-6 animate-pulse">
        <div className="h-6 w-32 bg-muted rounded" />
        <div className="h-32 bg-muted rounded-2xl" />
        <div className="h-64 bg-muted rounded-2xl" />
      </div>
    );
  }

  if (error || !route) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-lg font-bold text-foreground">Route Corridor Not Found</h2>
        <p className="text-xs text-muted-foreground">The requested route profile does not exist or was deleted.</p>
        <button
          onClick={() => navigate('/routes')}
          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold"
        >
          Return to Routes Directory
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate('/routes')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Routes Directory
      </button>

      {/* Route Banner Header */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary font-extrabold text-2xl shadow-inner">
            <Navigation className="h-10 w-10" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold text-foreground tracking-tight font-mono">{route.routeCode}</h1>
              <RouteStatusBadge status={route.status} />
              <RouteTypeBadge type={route.routeType} />
            </div>
            <p className="text-xs font-medium text-muted-foreground">
              Corridor: {route.originCity || route.originAddress} → {route.destinationCity || route.destinationAddress}
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
              <span className="flex items-center gap-1 font-bold text-foreground">
                Planned Distance: {route.plannedDistance ? `${route.plannedDistance} mi` : 'N/A'}
              </span>
              <span className="flex items-center gap-1 font-bold text-foreground">
                <Clock className="h-3.5 w-3.5 text-primary" />
                Est. Duration: {route.estimatedDuration ? `${route.estimatedDuration} hrs` : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-center">
            <span className="block text-[10px] font-bold uppercase tracking-wider">Traffic Status</span>
            <span className="text-xl font-black">OPTIMAL</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-border gap-6">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'map', label: 'Interactive Map' },
          { id: 'stops', label: 'Waypoints & Rest Stops' },
          { id: 'trips', label: 'Assigned Trips' },
          { id: 'activity', label: 'Timeline & History' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Corridor Specifications
                </h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground block">Origin Address</span>
                    <span className="font-semibold text-foreground">{route.originAddress}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Destination Address</span>
                    <span className="font-semibold text-foreground">{route.destinationAddress}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Total Distance</span>
                    <span className="font-mono font-bold text-foreground">
                      {route.plannedDistance ? `${route.plannedDistance} mi` : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Average Travel Time</span>
                    <span className="font-mono text-foreground">
                      {route.estimatedDuration ? `${route.estimatedDuration} hrs` : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'map' && (
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Corridor GPS Map Visualization
              </h3>
              <div className="h-80 w-full rounded-xl bg-muted/40 border border-border flex flex-col items-center justify-center p-6 text-center space-y-3">
                <Navigation className="h-10 w-10 text-primary animate-bounce" />
                <p className="text-xs font-bold text-foreground">GPS Corridor Track Active</p>
                <p className="text-[11px] text-muted-foreground max-w-md">
                  Route telemetry connected to live GIS mapping network ({route.originCity || route.originAddress} to {route.destinationCity || route.destinationAddress}).
                </p>
              </div>
            </div>
          )}

          {activeTab === 'stops' && (
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Stops & Checkpoint Timeline
              </h3>
              <div className="space-y-3">
                {[
                  { title: 'Origin Terminal', address: route.originAddress, status: 'START' },
                  { title: 'Highway Fuel & Rest Checkpoint', address: 'Interstate Hub #12', status: 'MID' },
                  { title: 'Destination Distribution Hub', address: route.destinationAddress, status: 'END' },
                ].map((stop, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3.5 rounded-xl border border-border bg-muted/10 text-xs">
                    <span className="h-6 w-6 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="font-bold text-foreground">{stop.title}</p>
                      <p className="text-[10px] text-muted-foreground">{stop.address}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'trips' && (
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Assigned Active Trips
              </h3>
              <div className="p-4 rounded-xl border border-border bg-muted/10 space-y-2 text-xs">
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

          {activeTab === 'activity' && (
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Audit Timeline & Route Changes
              </h3>
              <p className="text-xs text-muted-foreground">Route Corridor created and verified by Administrator.</p>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-xs">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Assigned Vehicles & Drivers
            </h3>
            <div className="p-3.5 rounded-xl bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20 space-y-1 text-xs">
              <span className="font-bold block">Vehicle: Volvo FH16 (TRK-408)</span>
              <span className="text-[11px] text-muted-foreground block">Driver: Marcus Vance</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteDetailsPage;
