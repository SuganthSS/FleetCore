import React from 'react';
import { Eye, Edit2, Trash2, ArrowUpDown, Shield, AlertTriangle } from 'lucide-react';
import type { Vehicle, VehicleStatus } from '@/types/vehicle';
import { VehicleStatusBadge } from './VehicleStatusBadge';

interface VehicleTableProps {
  vehicles: Vehicle[];
  onView: (vehicle: Vehicle) => void;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (id: string) => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSort: (field: string) => void;
}

// Map vehicle types to simple visual styling or icons
const getVehicleIconBg = (type: string) => {
  switch (type) {
    case 'TRUCK':
      return 'bg-orange-500/10 text-orange-500';
    case 'VAN':
      return 'bg-blue-500/10 text-blue-500';
    case 'CAR':
      return 'bg-emerald-500/10 text-emerald-500';
    default:
      return 'bg-zinc-500/10 text-zinc-500';
  }
};

export const VehicleTable: React.FC<VehicleTableProps> = ({
  vehicles,
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

  const getAvailabilityText = (status: VehicleStatus) => {
    switch (status) {
      case 'AVAILABLE':
        return 'Ready to Deploy';
      case 'ON_TRIP':
        return 'Occupied';
      case 'MAINTENANCE':
        return 'In Service Bay';
      default:
        return 'Unavailable';
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30 sticky top-0 z-10">
              <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                Asset
              </th>
              <th
                onClick={() => onSort('registrationNumber')}
                className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px] cursor-pointer hover:text-foreground select-none"
              >
                <div className="flex items-center">
                  Reg Number
                  {renderSortIndicator('registrationNumber')}
                </div>
              </th>
              <th
                onClick={() => onSort('make')}
                className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px] cursor-pointer hover:text-foreground select-none"
              >
                <div className="flex items-center">
                  Vehicle Name
                  {renderSortIndicator('make')}
                </div>
              </th>
              <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                Type
              </th>
              <th
                onClick={() => onSort('capacity')}
                className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px] cursor-pointer hover:text-foreground select-none"
              >
                <div className="flex items-center">
                  Capacity
                  {renderSortIndicator('capacity')}
                </div>
              </th>
              <th
                onClick={() => onSort('status')}
                className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px] cursor-pointer hover:text-foreground select-none"
              >
                <div className="flex items-center">
                  Status
                  {renderSortIndicator('status')}
                </div>
              </th>
              <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                Availability
              </th>
              <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                Assigned Driver
              </th>
              <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px] text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {vehicles.map((vehicle) => (
              <tr
                key={vehicle.id}
                className="hover:bg-muted/30 transition-colors group"
              >
                {/* Visual Avatar */}
                <td className="p-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg font-bold text-xs uppercase ${getVehicleIconBg(vehicle.vehicleType)}`}>
                    {vehicle.make.charAt(0)}{vehicle.model.charAt(0)}
                  </div>
                </td>

                {/* Reg Number */}
                <td className="p-4 font-semibold text-foreground">
                  {vehicle.registrationNumber}
                </td>

                {/* Make & Model */}
                <td className="p-4">
                  <span className="block font-semibold text-foreground leading-none">
                    {vehicle.make} {vehicle.model}
                  </span>
                  <span className="block text-[10px] text-muted-foreground mt-1 select-all">
                    VIN: {vehicle.vin}
                  </span>
                </td>

                {/* Type */}
                <td className="p-4 uppercase text-xs font-semibold text-muted-foreground">
                  {vehicle.vehicleType}
                </td>

                {/* Capacity */}
                <td className="p-4 text-xs font-medium text-foreground">
                  {vehicle.capacity ? `${vehicle.capacity.toLocaleString()} kg` : 'N/A'}
                </td>

                {/* Status Badges */}
                <td className="p-4">
                  <VehicleStatusBadge status={vehicle.status} />
                </td>

                {/* Availability helper */}
                <td className="p-4 text-xs font-medium text-muted-foreground">
                  {getAvailabilityText(vehicle.status)}
                </td>

                {/* Assigned Driver (Dynamic via Trip) */}
                <td className="p-4 text-xs font-medium text-muted-foreground">
                  {vehicle.status === 'ON_TRIP' ? (
                    <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold">
                      <Shield className="h-3.5 w-3.5" />
                      Trip Driver
                    </span>
                  ) : vehicle.status === 'MAINTENANCE' ? (
                    <span className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      Tech Crew
                    </span>
                  ) : (
                    'Unassigned'
                  )}
                </td>

                {/* Actions */}
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onView(vehicle)}
                      className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      title="View Details"
                      aria-label="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onEdit(vehicle)}
                      className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      title="Edit Vehicle"
                      aria-label="Edit Vehicle"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(vehicle.id)}
                      className="rounded-lg p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      title="Delete Vehicle"
                      aria-label="Delete Vehicle"
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
export default VehicleTable;
