import React from 'react';
import { Eye, Edit2, Trash2, ArrowUpDown, Calendar, Truck, User, Navigation } from 'lucide-react';

import type { TrackingRecord } from '@/types/tracking';

interface TrackingTableProps {
  records: TrackingRecord[];
  onView: (record: TrackingRecord) => void;
  onEdit: (record: TrackingRecord) => void;
  onDelete: (id: string) => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSort: (field: string) => void;
}

export const TrackingTable: React.FC<TrackingTableProps> = ({
  records,
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

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30 sticky top-0 z-10">
              <th
                onClick={() => onSort('recordedAt')}
                className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px] cursor-pointer hover:text-foreground select-none"
              >
                <div className="flex items-center">
                  Recorded Time
                  {renderSortIndicator('recordedAt')}
                </div>
              </th>
              <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                Vehicle
              </th>
              <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                Driver
              </th>
              <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                Trip
              </th>
              <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                Latitude
              </th>
              <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                Longitude
              </th>
              <th
                onClick={() => onSort('speed')}
                className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px] cursor-pointer hover:text-foreground select-none text-right"
              >
                <div className="flex items-center justify-end">
                  Speed
                  {renderSortIndicator('speed')}
                </div>
              </th>
              <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px] text-right">
                Accuracy
              </th>
              <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                Address
              </th>
              <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px] text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {records.map((record) => (
              <tr
                key={record.id}
                className="hover:bg-muted/30 transition-colors group"
              >
                {/* Recorded Time */}
                <td className="p-4 text-xs font-bold text-foreground whitespace-nowrap">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    {formatDate(record.recordedAt)}
                  </span>
                </td>

                {/* Vehicle */}
                <td className="p-4 text-xs font-semibold text-foreground whitespace-nowrap">
                  {record.vehicle ? (
                    <span className="flex items-center gap-1.5">
                      <Truck className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                      {record.vehicle.registrationNumber}
                    </span>
                  ) : (
                    '—'
                  )}
                </td>

                {/* Driver */}
                <td className="p-4 text-xs font-semibold text-foreground whitespace-nowrap">
                  {record.driver ? (
                    <span className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-orange-500 shrink-0" />
                      {record.driver.firstName} {record.driver.lastName}
                    </span>
                  ) : (
                    '—'
                  )}
                </td>

                {/* Trip */}
                <td className="p-4 text-xs font-bold text-primary whitespace-nowrap">
                  {record.trip ? `Trip ${record.trip.tripNumber}` : '—'}
                </td>

                {/* Latitude */}
                <td className="p-4 text-xs font-mono text-muted-foreground whitespace-nowrap">
                  {record.latitude.toFixed(6)}
                </td>

                {/* Longitude */}
                <td className="p-4 text-xs font-mono text-muted-foreground whitespace-nowrap">
                  {record.longitude.toFixed(6)}
                </td>

                {/* Speed */}
                <td className="p-4 text-xs font-bold text-foreground text-right whitespace-nowrap">
                  {record.speed !== null ? `${record.speed} mph` : '—'}
                </td>

                {/* Accuracy */}
                <td className="p-4 text-xs font-semibold text-muted-foreground text-right whitespace-nowrap">
                  {record.accuracy !== null ? `${record.accuracy} m` : '—'}
                </td>

                {/* Address */}
                <td className="p-4 text-xs font-medium text-foreground max-w-[150px] truncate">
                  <span className="flex items-center gap-1.5" title={record.address || ''}>
                    <Navigation className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    {record.address || 'GPS Coordinates Logged'}
                  </span>
                </td>

                {/* Actions */}
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onView(record)}
                      className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      title="View Details"
                      aria-label="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onEdit(record)}
                      className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      title="Edit Record"
                      aria-label="Edit Record"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(record.id)}
                      className="rounded-lg p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      title="Delete Record"
                      aria-label="Delete Record"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default TrackingTable;
