import React from 'react';
import { AlertTriangle, MapPin, Clock, ArrowRight } from 'lucide-react';

export interface TrackingAlert {
  id: string;
  vehicleReg: string;
  type: 'GEOFENCE_EXIT' | 'OVERSPEED' | 'IDLE_TIMEOUT' | 'SIGNAL_LOST';
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  timestamp: string;
  location: string;
}

interface TrackingAlertFeedProps {
  alerts?: TrackingAlert[];
  onLocateVehicle?: (vehicleReg: string) => void;
}

export const TrackingAlertFeed: React.FC<TrackingAlertFeedProps> = ({
  alerts = [
    {
      id: 'alt-1',
      vehicleReg: 'UNIT-742',
      type: 'OVERSPEED',
      severity: 'WARNING',
      timestamp: '10 mins ago',
      location: 'Interstate I-10 East',
    },
    {
      id: 'alt-2',
      vehicleReg: 'UNIT-109',
      type: 'GEOFENCE_EXIT',
      severity: 'CRITICAL',
      timestamp: '25 mins ago',
      location: 'Depot Perimeter Sector B',
    },
    {
      id: 'alt-3',
      vehicleReg: 'UNIT-305',
      type: 'IDLE_TIMEOUT',
      severity: 'INFO',
      timestamp: '1 hour ago',
      location: 'Phoenix Terminal Yard',
    },
  ],
  onLocateVehicle,
}) => {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-2xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
            Live Telemetry Alert Stream
          </h3>
        </div>
        <span className="text-[10px] font-bold text-muted-foreground font-mono">
          {alerts.length} Active Events
        </span>
      </div>

      <div className="space-y-2.5">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="flex items-center justify-between p-3 rounded-xl border border-border/80 bg-muted/20 hover:bg-muted/40 transition-colors text-xs"
          >
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-foreground">{alert.vehicleReg}</span>
                <span
                  className={`px-1.5 py-0.5 text-[9px] font-bold rounded-md ${
                    alert.severity === 'CRITICAL'
                      ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                      : alert.severity === 'WARNING'
                      ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                      : 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
                  }`}
                >
                  {alert.type}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {alert.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="h-3 w-3" />
                  {alert.timestamp}
                </span>
              </div>
            </div>

            {onLocateVehicle && (
              <button
                onClick={() => onLocateVehicle(alert.vehicleReg)}
                className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-colors"
                title="Center Vehicle on Map"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrackingAlertFeed;
