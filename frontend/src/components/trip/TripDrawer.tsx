import React, { useState } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Trip } from '@/types/trip';
import { TripStatusBadge } from './TripStatusBadge';
import { TripProgressBar } from './TripProgressBar';

interface TripDrawerProps {
  open: boolean;
  trip: Trip | null;
  onClose: () => void;
}

export const TripDrawer: React.FC<TripDrawerProps> = ({
  open,
  trip,
  onClose,
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'assignments' | 'progress' | 'tracking'>('overview');

  if (!open || !trip) return null;

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
    <div className="fixed inset-0 z-50 overflow-hidden bg-background/80 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md border-l border-border bg-card shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-border space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-mono">
                {trip.tripNumber}
              </span>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-bold text-foreground leading-snug">
                Trip Operations Overview
              </h2>
              <div className="flex items-center gap-2 pt-1">
                <TripStatusBadge status={trip.status} />
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                navigate(`/trips/${trip.id}`);
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 font-semibold text-xs transition-colors"
            >
              Open Full Trip Details Page
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-border bg-muted/20 px-6">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'assignments', label: 'Assignments' },
              { id: 'progress', label: 'Progress' },
              { id: 'tracking', label: 'Telemetry' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="p-4 rounded-xl border border-border bg-muted/10 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-medium">Assigned Vehicle</span>
                    <span className="font-bold text-foreground">
                      {trip.vehicle?.registrationNumber || 'None'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-border/60 pt-2">
                    <span className="text-muted-foreground font-medium">Assigned Driver</span>
                    <span className="font-semibold text-foreground">{driverName}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-border/60 pt-2">
                    <span className="text-muted-foreground font-medium">Waybill / Shipment</span>
                    <span className="font-mono font-bold text-foreground">
                      {trip.shipment?.shipmentNumber || 'Unassigned'}
                    </span>
                  </div>
                </div>

                {trip.route && (
                  <div className="p-4 rounded-xl border border-border bg-card space-y-3 text-xs">
                    <span className="text-[10px] font-bold uppercase text-muted-foreground">Assigned Route</span>
                    <div className="flex items-center justify-between font-bold text-foreground">
                      <span>{trip.route.originCity}</span>
                      <span>→</span>
                      <span>{trip.route.destinationCity}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'assignments' && (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-xl border border-border bg-card space-y-2">
                  <span className="text-[10px] font-bold uppercase text-primary">Driver Profile</span>
                  <p className="font-bold text-foreground">{driverName}</p>
                  <p className="text-muted-foreground font-mono">Employee ID: {trip.driver?.employeeId || 'N/A'}</p>
                </div>
                <div className="p-4 rounded-xl border border-border bg-card space-y-2">
                  <span className="text-[10px] font-bold uppercase text-primary">Vehicle Specifications</span>
                  <p className="font-bold text-foreground">{trip.vehicle?.registrationNumber || 'N/A'}</p>
                  <p className="text-muted-foreground">{trip.vehicle?.make} {trip.vehicle?.model}</p>
                </div>
              </div>
            )}

            {activeTab === 'progress' && (
              <div className="space-y-4 text-xs">
                <TripProgressBar progress={getProgressVal(trip.status)} status={trip.status} />
                <div className="p-4 rounded-xl border border-border bg-muted/10 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Scheduled Start:</span>
                    <span className="font-mono font-bold">
                      {trip.scheduledStartTime ? new Date(trip.scheduledStartTime).toLocaleString() : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-border/60 pt-2">
                    <span className="text-muted-foreground">Actual Start:</span>
                    <span className="font-mono font-bold">
                      {trip.actualStartTime ? new Date(trip.actualStartTime).toLocaleString() : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tracking' && (
              <div className="space-y-4 text-xs">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Live Dispatch Stream
                </h3>
                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                  <div className="relative">
                    <span className="absolute -left-6 top-0 h-4 w-4 rounded-full bg-emerald-500 ring-4 ring-card" />
                    <p className="font-bold text-foreground">Trip Created</p>
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(trip.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-6 top-0 h-4 w-4 rounded-full bg-blue-500 ring-4 ring-card" />
                    <p className="font-bold text-foreground">Asset Dispatch Verified</p>
                    <p className="text-[10px] text-muted-foreground">Driver and Vehicle ready</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDrawer;
