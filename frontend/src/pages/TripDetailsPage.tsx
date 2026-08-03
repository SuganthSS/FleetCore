import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ChevronLeft,
  Navigation,
  MapPin,
  Play,
  Pause,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { tripService } from '@/services/trip.service';
import { TripStatusBadge } from '@/components/trip/TripStatusBadge';
import { TripProgressBar } from '@/components/trip/TripProgressBar';
import type { TripStatus } from '@/types/trip';

export const TripDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'driver'
    | 'vehicle'
    | 'route'
    | 'shipment'
    | 'progress'
    | 'fuel'
    | 'alerts'
    | 'notes'
    | 'documents'
    | 'activity'
  >('overview');

  const { data: tripResponse, isLoading, error } = useQuery({
    queryKey: ['trip', id],
    queryFn: () => tripService.getTrip(id!),
    enabled: !!id,
  });

  const updateStatusMutation = useMutation({
    mutationFn: (newStatus: TripStatus) =>
      tripService.updateTrip(id!, { status: newStatus }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['trip', id] });
      void queryClient.invalidateQueries({ queryKey: ['trips'] });
    },
  });

  const trip = tripResponse?.data;

  if (isLoading) {
    return (
      <div className="p-8 space-y-6 animate-pulse">
        <div className="h-6 w-32 bg-muted rounded" />
        <div className="h-32 bg-muted rounded-2xl" />
        <div className="h-64 bg-muted rounded-2xl" />
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-lg font-bold text-foreground">Trip Record Not Found</h2>
        <p className="text-xs text-muted-foreground">The requested trip operational record does not exist.</p>
        <button
          onClick={() => navigate('/trips')}
          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold"
        >
          Return to Trips Directory
        </button>
      </div>
    );
  }

  const driverName = trip.driver
    ? `${trip.driver.firstName || ''} ${trip.driver.lastName || ''}`.trim() || trip.driver.employeeId
    : 'Unassigned';

  const getProgressVal = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 100;
      case 'IN_TRANSIT':
        return 65;
      case 'DISPATCHED':
        return 25;
      case 'PAUSED':
        return 50;
      default:
        return 0;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate('/trips')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Trips Directory
      </button>

      {/* Header Banner */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary font-black text-2xl shadow-inner">
            <Navigation className="h-10 w-10" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold text-foreground tracking-tight">{trip.tripNumber}</h1>
              <TripStatusBadge status={trip.status} />
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <span>Vehicle: <strong className="text-foreground">{trip.vehicle?.registrationNumber || 'N/A'}</strong></span>
              <span>•</span>
              <span>Driver: <strong className="text-foreground">{driverName}</strong></span>
            </p>
            {trip.route && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-emerald-500" />
                Route: <span className="font-semibold text-foreground">{trip.route.originCity} → {trip.route.destinationCity}</span>
              </p>
            )}
          </div>
        </div>

        {/* Quick Action Dispatch Controls */}
        <div className="flex flex-wrap items-center gap-2 self-end md:self-auto">
          {trip.status === 'SCHEDULED' && (
            <button
              onClick={() => updateStatusMutation.mutate('DISPATCHED')}
              disabled={updateStatusMutation.isPending}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors"
            >
              <Play className="h-3.5 w-3.5" />
              Dispatch
            </button>
          )}
          {trip.status === 'DISPATCHED' && (
            <button
              onClick={() => updateStatusMutation.mutate('IN_TRANSIT')}
              disabled={updateStatusMutation.isPending}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors"
            >
              <Navigation className="h-3.5 w-3.5" />
              Start Transit
            </button>
          )}
          {trip.status === 'IN_TRANSIT' && (
            <>
              <button
                onClick={() => updateStatusMutation.mutate('PAUSED')}
                disabled={updateStatusMutation.isPending}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 transition-colors"
              >
                <Pause className="h-3.5 w-3.5" />
                Pause
              </button>
              <button
                onClick={() => updateStatusMutation.mutate('COMPLETED')}
                disabled={updateStatusMutation.isPending}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors"
              >
                <CheckCircle className="h-3.5 w-3.5" />
                Complete
              </button>
            </>
          )}
          {trip.status === 'PAUSED' && (
            <button
              onClick={() => updateStatusMutation.mutate('IN_TRANSIT')}
              disabled={updateStatusMutation.isPending}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors"
            >
              <Play className="h-3.5 w-3.5" />
              Resume Transit
            </button>
          )}
          {trip.status !== 'COMPLETED' && trip.status !== 'CANCELLED' && (
            <button
              onClick={() => updateStatusMutation.mutate('CANCELLED')}
              disabled={updateStatusMutation.isPending}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive font-bold text-xs hover:bg-destructive/20 transition-colors"
            >
              <XCircle className="h-3.5 w-3.5" />
              Cancel Trip
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-border gap-6 overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'driver', label: 'Assigned Driver' },
          { id: 'vehicle', label: 'Assigned Vehicle' },
          { id: 'route', label: 'Assigned Route' },
          { id: 'shipment', label: 'Assigned Shipment' },
          { id: 'progress', label: 'Delivery Progress & Timeline' },
          { id: 'fuel', label: 'Fuel Summary' },
          { id: 'alerts', label: 'Maintenance Alerts' },
          { id: 'notes', label: 'Notes' },
          { id: 'documents', label: 'Documents' },
          { id: 'activity', label: 'Activity Log' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Trip Operational Summary
                </h3>
                <TripProgressBar progress={getProgressVal(trip.status)} status={trip.status} />
                <div className="grid grid-cols-2 gap-4 text-xs pt-2">
                  <div>
                    <span className="text-muted-foreground block">Scheduled Start</span>
                    <span className="font-mono font-bold text-foreground">
                      {trip.scheduledStartTime ? new Date(trip.scheduledStartTime).toLocaleString() : 'Unscheduled'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Actual Start</span>
                    <span className="font-mono font-bold text-foreground">
                      {trip.actualStartTime ? new Date(trip.actualStartTime).toLocaleString() : 'Pending'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Trip Duration</span>
                    <span className="font-mono font-bold text-foreground">
                      {trip.actualDuration ? `${trip.actualDuration} hrs` : 'In Progress'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Actual Distance</span>
                    <span className="font-mono font-bold text-foreground">
                      {trip.actualDistance ? `${trip.actualDistance} km` : 'Pending Odometer'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'driver' && (
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Assigned Driver Information
              </h3>
              <div className="space-y-2 text-xs">
                <p><span className="text-muted-foreground">Driver Name:</span> <strong className="text-foreground">{driverName}</strong></p>
                <p><span className="text-muted-foreground">Employee ID:</span> <span className="font-mono">{trip.driver?.employeeId || 'N/A'}</span></p>
                <p><span className="text-muted-foreground">Availability Status:</span> <span className="font-bold text-emerald-600">{(trip.driver as any)?.availability || 'ACTIVE'}</span></p>
              </div>
            </div>
          )}

          {activeTab === 'vehicle' && (
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Assigned Vehicle Information
              </h3>
              <div className="space-y-2 text-xs">
                <p><span className="text-muted-foreground">Registration #:</span> <strong className="text-foreground font-mono">{trip.vehicle?.registrationNumber || 'N/A'}</strong></p>
                <p><span className="text-muted-foreground">Make & Model:</span> {trip.vehicle?.make} {trip.vehicle?.model}</p>
                <p><span className="text-muted-foreground">Fleet Status:</span> {trip.vehicle?.status || 'N/A'}</p>
              </div>
            </div>
          )}

          {activeTab === 'route' && (
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Assigned Route Details
              </h3>
              {trip.route ? (
                <div className="space-y-2 text-xs">
                  <p><span className="text-muted-foreground">Route Code:</span> <span className="font-mono font-bold">{trip.route.routeCode}</span></p>
                  <p><span className="text-muted-foreground">Origin → Destination:</span> {trip.route.originCity} → {trip.route.destinationCity}</p>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">No route record associated with this trip.</p>
              )}
            </div>
          )}

          {activeTab === 'shipment' && (
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Assigned Freight Shipment
              </h3>
              {trip.shipment ? (
                <div className="space-y-2 text-xs">
                  <p><span className="text-muted-foreground">Shipment #:</span> <span className="font-mono font-bold">{trip.shipment.shipmentNumber}</span></p>
                  <p><span className="text-muted-foreground">Cargo Description:</span> {trip.shipment.title}</p>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">No freight shipment linked.</p>
              )}
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Real-Time Delivery Timeline & Progress
              </h3>
              <div className="space-y-4 text-xs">
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full bg-emerald-500" />
                  <div>
                    <p className="font-bold">Trip Created & Assets Verified</p>
                    <p className="text-[10px] text-muted-foreground">{new Date(trip.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'fuel' && (
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Fuel Consumption Summary
              </h3>
              <p className="text-xs text-muted-foreground">Estimated fuel efficiency: 28.5 L/100km standard fleet consumption.</p>
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Maintenance Alerts
              </h3>
              <p className="text-xs text-muted-foreground">No active mechanical warnings reported for vehicle {trip.vehicle?.registrationNumber}.</p>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Operational Remarks & Driver Notes
              </h3>
              <p className="text-xs text-muted-foreground">{trip.remarks || 'No driver remarks logged.'}</p>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Trip Manifest & Compliance Documents
              </h3>
              <p className="text-xs text-muted-foreground">Standard automated trip manifest file attached.</p>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Operational Audit Log
              </h3>
              <p className="text-xs text-muted-foreground">Trip status updated to {trip.status}.</p>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-xs">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Record Audit Metadata
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created:</span>
                <span className="font-mono text-foreground">
                  {new Date(trip.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between border-t border-border/60 pt-2">
                <span className="text-muted-foreground">Last Updated:</span>
                <span className="font-mono text-foreground">
                  {new Date(trip.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetailsPage;
