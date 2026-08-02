import React from 'react';
import { Eye, Edit2, Trash2, ArrowUpDown, Calendar, MapPin, User, Truck, Package } from 'lucide-react';
import type { Trip } from '@/types/trip';
import { TripStatusBadge } from './TripStatusBadge';

interface TripTableProps {
  trips: Trip[];
  onView: (trip: Trip) => void;
  onEdit: (trip: Trip) => void;
  onDelete: (id: string) => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSort: (field: string) => void;
}

export const TripTable: React.FC<TripTableProps> = ({
  trips,
  onView,
  onEdit,
  onDelete,
  sortBy,
  sortOrder,
  onSort,
}) => {
  const renderSortIndicator = (field: string) => {
    if (sortBy !== field) return <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-40" />;
    return (
      <ArrowUpDown className={`ml-1.5 h-3.5 w-3.5 text-primary ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
    );
  };

  const formatDateTime = (dateStr: string | null) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30 sticky top-0 z-10">
              <th
                onClick={() => onSort('tripNumber')}
                className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px] cursor-pointer hover:text-foreground select-none"
              >
                <div className="flex items-center">
                  Trip Number
                  {renderSortIndicator('tripNumber')}
                </div>
              </th>
              <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                Shipment
              </th>
              <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                Vehicle
              </th>
              <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                Driver
              </th>
              <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                Route
              </th>
              <th
                onClick={() => onSort('plannedStartTime')}
                className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px] cursor-pointer hover:text-foreground select-none"
              >
                <div className="flex items-center">
                  Planned Start
                  {renderSortIndicator('plannedStartTime')}
                </div>
              </th>
              <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                Planned End
              </th>
              <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                Status
              </th>
              <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px] text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {trips.map((trip) => {
              return (
                <tr
                  key={trip.id}
                  className="hover:bg-muted/30 transition-colors group"
                >
                  {/* Trip Number */}
                  <td className="p-4 font-bold text-primary select-all whitespace-nowrap">
                    {trip.tripNumber}
                  </td>

                  {/* Shipment */}
                  <td className="p-4 text-xs font-semibold text-foreground max-w-[180px] truncate">
                    {trip.shipment ? (
                      <span className="flex items-center gap-1.5" title={`${trip.shipment.shipmentNumber}: ${trip.shipment.title}`}>
                        <Package className="h-3.5 w-3.5 text-orange-500 shrink-0" />
                        {trip.shipment.shipmentNumber}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>

                  {/* Vehicle */}
                  <td className="p-4 text-xs font-semibold text-foreground whitespace-nowrap">
                    {trip.vehicle ? (
                      <span className="flex items-center gap-1.5">
                        <Truck className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                        {trip.vehicle.registrationNumber}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>

                  {/* Driver */}
                  <td className="p-4 text-xs font-semibold text-foreground max-w-[150px] truncate">
                    {trip.driver ? (
                      <span className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-teal-500 shrink-0" />
                        {trip.driver.firstName} {trip.driver.lastName}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>

                  {/* Route */}
                  <td className="p-4 text-xs font-semibold text-foreground max-w-[180px] truncate">
                    {trip.route ? (
                      <span className="flex items-center gap-1.5" title={`${trip.route.routeCode}: ${trip.route.originCity} to ${trip.route.destinationCity}`}>
                        <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                        {trip.route.routeCode}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>

                  {/* Planned Start */}
                  <td className="p-4 text-xs text-muted-foreground whitespace-nowrap">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground/50" />
                      {formatDateTime(trip.scheduledStartTime)}
                    </span>
                  </td>

                  {/* Planned End */}
                  <td className="p-4 text-xs text-muted-foreground whitespace-nowrap">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground/50" />
                      {formatDateTime(trip.scheduledEndTime)}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="p-4">
                    <TripStatusBadge status={trip.status} />
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onView(trip)}
                        className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        title="View Details"
                        aria-label="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEdit(trip)}
                        className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        title="Edit Trip"
                        aria-label="Edit Trip"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(trip.id)}
                        className="rounded-lg p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        title="Delete Trip"
                        aria-label="Delete Trip"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default TripTable;
