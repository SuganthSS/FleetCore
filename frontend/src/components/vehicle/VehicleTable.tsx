import React from 'react';
import { ArrowUpDown, Eye, Edit2, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import type { Vehicle } from '@/types/vehicle';
import { VehicleStatusBadge } from './VehicleStatusBadge';
import { VehicleTypeBadge } from './VehicleTypeBadge';

interface VehicleTableProps {
  vehicles: Vehicle[];
  onView: (vehicle: Vehicle) => void;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (id: string) => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSort: (field: string) => void;
}

const getVehicleInitials = (make: string, model: string) =>
  `${make.charAt(0)}${model.charAt(0)}`.toUpperCase();

const getVehicleAvatarBg = (type: string): string => {
  switch (type) {
    case 'TRUCK': return 'bg-orange-500/10 text-orange-600 dark:text-orange-400';
    case 'VAN': return 'bg-sky-500/10 text-sky-600 dark:text-sky-400';
    case 'CAR': return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400';
    case 'TRAILER': return 'bg-violet-500/10 text-violet-600 dark:text-violet-400';
    case 'BUS': return 'bg-teal-500/10 text-teal-600 dark:text-teal-400';
    default: return 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400';
  }
};

const SortIcon: React.FC<{ field: string; sortBy: string; sortOrder: 'asc' | 'desc' }> = ({
  field,
  sortBy,
  sortOrder,
}) => {
  if (field !== sortBy) {
    return <ArrowUpDown className="ml-1 h-3 w-3 opacity-30 group-hover:opacity-60 transition-opacity" />;
  }
  return sortOrder === 'asc' ? (
    <ChevronUp className="ml-1 h-3 w-3 text-primary" />
  ) : (
    <ChevronDown className="ml-1 h-3 w-3 text-primary" />
  );
};

const thClass =
  'px-4 py-3 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-wider border-b border-border select-none';
const sortThClass = `${thClass} cursor-pointer hover:text-foreground transition-colors group`;

export const VehicleTable: React.FC<VehicleTableProps> = ({
  vehicles,
  onView,
  onEdit,
  onDelete,
  sortBy,
  sortOrder,
  onSort,
}) => {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left text-sm">
          {/* Sticky Header */}
          <thead className="bg-muted/30 backdrop-blur-sm sticky top-0 z-10">
            <tr>
              <th className={thClass}>Asset</th>
              <th className={sortThClass} onClick={() => onSort('registrationNumber')}>
                <div className="flex items-center">
                  Reg Number
                  <SortIcon field="registrationNumber" sortBy={sortBy} sortOrder={sortOrder} />
                </div>
              </th>
              <th className={sortThClass} onClick={() => onSort('make')}>
                <div className="flex items-center">
                  Make / Model
                  <SortIcon field="make" sortBy={sortBy} sortOrder={sortOrder} />
                </div>
              </th>
              <th className={thClass}>Type</th>
              <th className={thClass}>Fuel</th>
              <th className={sortThClass} onClick={() => onSort('manufacturingYear')}>
                <div className="flex items-center">
                  Year
                  <SortIcon field="manufacturingYear" sortBy={sortBy} sortOrder={sortOrder} />
                </div>
              </th>
              <th className={sortThClass} onClick={() => onSort('capacity')}>
                <div className="flex items-center">
                  Capacity
                  <SortIcon field="capacity" sortBy={sortBy} sortOrder={sortOrder} />
                </div>
              </th>
              <th className={sortThClass} onClick={() => onSort('status')}>
                <div className="flex items-center">
                  Status
                  <SortIcon field="status" sortBy={sortBy} sortOrder={sortOrder} />
                </div>
              </th>
              <th className={`${thClass} text-right`}>Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border/50">
            {vehicles.map((vehicle) => (
              <tr
                key={vehicle.id}
                className="group hover:bg-muted/30 transition-colors cursor-pointer"
                onClick={() => onView(vehicle)}
              >
                {/* Avatar */}
                <td className="px-4 py-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold text-xs ${getVehicleAvatarBg(vehicle.vehicleType)}`}
                  >
                    {getVehicleInitials(vehicle.make, vehicle.model)}
                  </div>
                </td>

                {/* Reg Number */}
                <td className="px-4 py-3">
                  <span className="font-mono font-bold text-sm text-foreground tracking-tight">
                    {vehicle.registrationNumber}
                  </span>
                </td>

                {/* Make / Model */}
                <td className="px-4 py-3">
                  <span className="block font-semibold text-sm text-foreground leading-none">
                    {vehicle.make} {vehicle.model}
                  </span>
                  <span className="block text-[11px] text-muted-foreground mt-0.5 font-mono select-all">
                    VIN: {vehicle.vin.slice(0, 8)}…
                  </span>
                </td>

                {/* Type */}
                <td className="px-4 py-3">
                  <VehicleTypeBadge type={vehicle.vehicleType} />
                </td>

                {/* Fuel */}
                <td className="px-4 py-3">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">
                    {vehicle.fuelType}
                  </span>
                </td>

                {/* Year */}
                <td className="px-4 py-3">
                  <span className="text-sm font-semibold text-foreground">
                    {vehicle.manufacturingYear}
                  </span>
                </td>

                {/* Capacity */}
                <td className="px-4 py-3">
                  <span className="text-xs font-medium text-foreground">
                    {vehicle.capacity ? `${vehicle.capacity.toLocaleString()} kg` : '—'}
                  </span>
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <VehicleStatusBadge status={vehicle.status} />
                </td>

                {/* Actions */}
                <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onView(vehicle)}
                      className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      title="View Details"
                      aria-label="View Details"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onEdit(vehicle)}
                      className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      title="Edit Vehicle"
                      aria-label="Edit Vehicle"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(vehicle.id)}
                      className="rounded-lg p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      title="Delete Vehicle"
                      aria-label="Delete Vehicle"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
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
