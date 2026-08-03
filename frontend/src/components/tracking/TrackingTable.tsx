import React from 'react';
import { Eye, Edit2, Trash2, ArrowUpRight, Truck, User, MapPin } from 'lucide-react';
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
    if (sortBy !== field) return null;
    return <span className="ml-1 text-[10px] font-mono">{sortOrder === 'asc' ? '▲' : '▼'}</span>;
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-2xs">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border bg-muted/40 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            <th
              onClick={() => onSort('vehicleId')}
              className="py-3.5 px-4 cursor-pointer hover:text-foreground"
            >
              Vehicle Reg {renderSortIndicator('vehicleId')}
            </th>
            <th className="py-3.5 px-4">Assigned Driver</th>
            <th className="py-3.5 px-4">Location Landmark</th>
            <th className="py-3.5 px-4 font-mono">Coordinates</th>
            <th className="py-3.5 px-4 font-mono">Speed</th>
            <th
              onClick={() => onSort('recordedAt')}
              className="py-3.5 px-4 cursor-pointer hover:text-foreground"
            >
              Timestamp {renderSortIndicator('recordedAt')}
            </th>
            <th className="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60 text-xs font-medium">
          {records.map((record) => {
            const driverName = record.driver
              ? `${record.driver.firstName || ''} ${record.driver.lastName || ''}`.trim()
              : 'Unassigned';

            const isMoving = record.speed && record.speed > 0;

            return (
              <tr key={record.id} className="hover:bg-muted/30 transition-colors group">
                {/* Vehicle */}
                <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                  <button
                    onClick={() => onView(record)}
                    className="hover:text-primary transition-colors flex items-center gap-1.5"
                  >
                    <Truck className="h-4 w-4 text-primary shrink-0" />
                    <span>{record.vehicle?.registrationNumber || 'UNIT-TRACKING'}</span>
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                  </button>
                </td>

                {/* Driver */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5 text-foreground font-semibold">
                    <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span>{driverName}</span>
                  </div>
                </td>

                {/* Address */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5 text-muted-foreground truncate max-w-[220px]">
                    <MapPin className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span className="truncate">{record.address || `${record.city || ''}, ${record.state || ''}`}</span>
                  </div>
                </td>

                {/* Coordinates */}
                <td className="py-3.5 px-4 font-mono text-muted-foreground text-[11px]">
                  {record.latitude.toFixed(4)}°, {record.longitude.toFixed(4)}°
                </td>

                {/* Speed */}
                <td className="py-3.5 px-4 font-mono">
                  <span
                    className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                      isMoving
                        ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {record.speed ? `${record.speed} km/h` : '0 km/h (Idle)'}
                  </span>
                </td>

                {/* Timestamp */}
                <td className="py-3.5 px-4 font-mono text-muted-foreground">
                  {new Date(record.recordedAt).toLocaleString()}
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onView(record)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      title="Telemetry Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onEdit(record)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      title="Edit Record"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(record.id)}
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

export default TrackingTable;
