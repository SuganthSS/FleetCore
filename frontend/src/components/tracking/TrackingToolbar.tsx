import React from 'react';
import { Search, RefreshCw, X } from 'lucide-react';
import type { Vehicle } from '@/types/vehicle';
import type { Driver } from '@/types/driver';
import type { Trip } from '@/types/trip';

interface TrackingToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  vehicleId: string;
  onVehicleIdChange: (value: string) => void;
  driverId: string;
  onDriverIdChange: (value: string) => void;
  tripId: string;
  onTripIdChange: (value: string) => void;
  onRefresh: () => void;
  onClearFilters: () => void;
  vehicles: Vehicle[];
  drivers: Driver[];
  trips: Trip[];
  isRefreshing?: boolean;
}

export const TrackingToolbar: React.FC<TrackingToolbarProps> = ({
  search,
  onSearchChange,
  vehicleId,
  onVehicleIdChange,
  driverId,
  onDriverIdChange,
  tripId,
  onTripIdChange,
  onRefresh,
  onClearFilters,
  vehicles,
  drivers,
  trips,
  isRefreshing = false,
}) => {
  const hasActiveFilters = search || vehicleId || driverId || tripId;

  return (
    <div className="flex flex-col gap-4 p-4 bg-card border border-border rounded-xl shadow-sm">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tracking by vehicle registration, driver license..."
            className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-4 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Vehicle Filter */}
          <div className="flex flex-col">
            <select
              value={vehicleId}
              onChange={(e) => onVehicleIdChange(e.target.value)}
              className="h-10 rounded-lg border border-input bg-background px-3 text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring max-w-[150px] truncate"
              aria-label="Filter by Vehicle"
            >
              <option value="">All Vehicles</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.registrationNumber} ({v.make})
                </option>
              ))}
            </select>
          </div>

          {/* Driver Filter */}
          <div className="flex flex-col">
            <select
              value={driverId}
              onChange={(e) => onDriverIdChange(e.target.value)}
              className="h-10 rounded-lg border border-input bg-background px-3 text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring max-w-[150px] truncate"
              aria-label="Filter by Driver"
            >
              <option value="">All Drivers</option>
              {drivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.user ? `${d.user.firstName} ${d.user.lastName}` : `Driver ${d.employeeId}`}
                </option>
              ))}
            </select>
          </div>

          {/* Trip Filter */}
          <div className="flex flex-col">
            <select
              value={tripId}
              onChange={(e) => onTripIdChange(e.target.value)}
              className="h-10 rounded-lg border border-input bg-background px-3 text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring max-w-[150px] truncate"
              aria-label="Filter by Trip"
            >
              <option value="">All Trips</option>
              {trips.map((t) => (
                <option key={t.id} value={t.id}>
                  Trip {t.tripNumber}
                </option>
              ))}
            </select>
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            title="Refresh list"
            aria-label="Refresh list"
          >
            <RefreshCw className={`h-4.5 w-4.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="flex h-10 items-center gap-1.5 rounded-lg border border-dashed border-border px-3 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
              title="Clear filters"
            >
              <X className="h-3.5 w-3.5" />
              Reset Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default TrackingToolbar;
