import { Eye, Edit2, Trash2, ArrowUpRight, Truck, User, MapPin, Package } from 'lucide-react';
import type { Trip } from '@/types/trip';
import { TripStatusBadge } from './TripStatusBadge';
import { TripProgressBar } from './TripProgressBar';

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
    if (sortBy !== field) return null;
    return <span className="ml-1 text-[10px] font-mono">{sortOrder === 'asc' ? '▲' : '▼'}</span>;
  };

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
    <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-2xs">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border bg-muted/40 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            <th
              onClick={() => onSort('tripNumber')}
              className="py-3.5 px-4 cursor-pointer hover:text-foreground"
            >
              Trip # {renderSortIndicator('tripNumber')}
            </th>
            <th className="py-3.5 px-4">Vehicle & Driver</th>
            <th className="py-3.5 px-4">Route (Origin → Dest)</th>
            <th className="py-3.5 px-4">Shipment</th>
            <th
              onClick={() => onSort('plannedStartTime')}
              className="py-3.5 px-4 cursor-pointer hover:text-foreground"
            >
              Sched. Start {renderSortIndicator('plannedStartTime')}
            </th>
            <th className="py-3.5 px-4 min-w-[140px]">Progress</th>
            <th className="py-3.5 px-4">Status</th>
            <th className="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60 text-xs font-medium">
          {trips.map((trip) => {
            const driverName = trip.driver
              ? `${trip.driver.firstName || ''} ${trip.driver.lastName || ''}`.trim() || trip.driver.employeeId
              : 'Unassigned';

            return (
              <tr
                key={trip.id}
                className="hover:bg-muted/30 transition-colors group"
              >
                {/* Trip Number */}
                <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                  <button
                    onClick={() => onView(trip)}
                    className="hover:text-primary transition-colors flex items-center gap-1"
                  >
                    {trip.tripNumber}
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                  </button>
                </td>

                {/* Vehicle & Driver */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5 font-bold text-foreground">
                    <Truck className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>{trip.vehicle?.registrationNumber || 'No Vehicle'}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
                    <User className="h-3 w-3 shrink-0" />
                    <span className="truncate max-w-[130px]">{driverName}</span>
                  </div>
                </td>

                {/* Route */}
                <td className="py-3.5 px-4">
                  {trip.route ? (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span className="font-bold text-foreground">{trip.route.originCity}</span>
                      <span>→</span>
                      <span className="font-bold text-foreground">{trip.route.destinationCity}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground italic">No Route</span>
                  )}
                </td>

                {/* Shipment */}
                <td className="py-3.5 px-4">
                  {trip.shipment ? (
                    <div className="flex items-center gap-1.5 text-foreground font-semibold">
                      <Package className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                      <span className="font-mono text-xs">{trip.shipment.shipmentNumber}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground italic">Unassigned</span>
                  )}
                </td>

                {/* Scheduled Start */}
                <td className="py-3.5 px-4 font-mono text-muted-foreground">
                  {trip.scheduledStartTime
                    ? new Date(trip.scheduledStartTime).toLocaleDateString()
                    : 'Unscheduled'}
                </td>

                {/* Progress Bar */}
                <td className="py-3.5 px-4">
                  <TripProgressBar progress={getProgressVal(trip.status)} status={trip.status} size="sm" />
                </td>

                {/* Status */}
                <td className="py-3.5 px-4">
                  <TripStatusBadge status={trip.status} size="sm" />
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onView(trip)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      title="Quick Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onEdit(trip)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      title="Edit Trip"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(trip.id)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      title="Delete Record"
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
  );
};

export default TripTable;
