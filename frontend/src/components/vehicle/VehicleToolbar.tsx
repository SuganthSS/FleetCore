import React from 'react';
import { Search, RefreshCw, X } from 'lucide-react';

interface VehicleToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  vehicleType: string;
  onVehicleTypeChange: (value: string) => void;
  onRefresh: () => void;
  onClearFilters: () => void;
  isRefreshing?: boolean;
}

export const VehicleToolbar: React.FC<VehicleToolbarProps> = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  vehicleType,
  onVehicleTypeChange,
  onRefresh,
  onClearFilters,
  isRefreshing = false,
}) => {
  const hasActiveFilters = search || status || vehicleType;

  return (
    <div className="flex flex-col gap-4 p-4 bg-card border border-border rounded-xl shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search registration, VIN, manufacturer..."
            className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-4 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Filter */}
          <div className="flex flex-col">
            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              className="h-10 rounded-lg border border-input bg-background px-3 text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Filter by Status"
            >
              <option value="">All Statuses / Availability</option>
              <option value="AVAILABLE">Available</option>
              <option value="ON_TRIP">On Trip</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="OUT_OF_SERVICE">Out Of Service</option>
              <option value="DECOMMISSIONED">Decommissioned</option>
            </select>
          </div>

          {/* Vehicle Type Filter */}
          <div className="flex flex-col">
            <select
              value={vehicleType}
              onChange={(e) => onVehicleTypeChange(e.target.value)}
              className="h-10 rounded-lg border border-input bg-background px-3 text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Filter by Vehicle Type"
            >
              <option value="">All Vehicle Types</option>
              <option value="TRUCK">Truck</option>
              <option value="VAN">Van</option>
              <option value="TRAILER">Trailer</option>
              <option value="BUS">Bus</option>
              <option value="CAR">Car</option>
              <option value="SPECIALIZED">Specialized</option>
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
export default VehicleToolbar;
