import React from 'react';
import { Truck, User, MapPin, Calendar, Edit2, Trash2, ArrowUpRight } from 'lucide-react';
import type { Trip } from '@/types/trip';
import { TripStatusBadge } from './TripStatusBadge';
import { TripProgressBar } from './TripProgressBar';

interface TripCardsProps {
  trips: Trip[];
  onView: (trip: Trip) => void;
  onEdit: (trip: Trip) => void;
  onDelete: (id: string) => void;
}

export const TripCards: React.FC<TripCardsProps> = ({
  trips,
  onView,
  onEdit,
  onDelete,
}) => {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {trips.map((trip) => {
        const driverName = trip.driver
          ? `${trip.driver.firstName || ''} ${trip.driver.lastName || ''}`.trim() || trip.driver.employeeId
          : 'Unassigned';

        return (
          <div
            key={trip.id}
            className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-2xs hover:shadow-md transition-all duration-200 group flex flex-col justify-between"
          >
            {/* Header */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-muted-foreground uppercase tracking-wider">
                  {trip.tripNumber}
                </span>
                <TripStatusBadge status={trip.status} size="sm" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-foreground text-sm">
                  <Truck className="h-4 w-4 text-primary shrink-0" />
                  <span className="group-hover:text-primary transition-colors">
                    {trip.vehicle?.registrationNumber || 'No Vehicle Assigned'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span>Driver: <strong className="text-foreground font-semibold">{driverName}</strong></span>
                </div>
              </div>
            </div>

            {/* Route & Progress info */}
            <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-2.5 text-xs">
              {trip.route ? (
                <div className="flex items-center justify-between font-bold text-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-emerald-500" />
                    <span>{trip.route.originCity}</span>
                  </div>
                  <span className="text-muted-foreground text-[10px]">→</span>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-indigo-500" />
                    <span>{trip.route.destinationCity}</span>
                  </div>
                </div>
              ) : (
                <span className="text-muted-foreground italic">No Route Specified</span>
              )}

              <TripProgressBar progress={getProgressVal(trip.status)} status={trip.status} size="sm" />

              {trip.scheduledStartTime && (
                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/40">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    Scheduled Start:
                  </span>
                  <span className="font-mono font-semibold text-foreground">
                    {new Date(trip.scheduledStartTime).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            {/* Card Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-border/60">
              <button
                onClick={() => onView(trip)}
                className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
              >
                View Trip Details
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => onEdit(trip)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  title="Edit Trip"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => onDelete(trip.id)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  title="Delete Trip"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TripCards;
