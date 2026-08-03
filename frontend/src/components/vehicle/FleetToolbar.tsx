import React from 'react';
import { Search, X, Filter, SlidersHorizontal } from 'lucide-react';


interface FleetToolbarProps {
  search: string;
  onSearchChange: (val: string) => void;
  status: string;
  onStatusChange: (val: string) => void;
  vehicleType: string;
  onVehicleTypeChange: (val: string) => void;
  fuelType: string;
  onFuelTypeChange: (val: string) => void;
  sortBy: string;
  onSortByChange: (val: string) => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (val: 'asc' | 'desc') => void;
  onClearFilters: () => void;
}

const VEHICLE_STATUSES = [
  { value: '', label: 'All Statuses' },
  { value: 'AVAILABLE', label: 'Available' },
  { value: 'ON_TRIP', label: 'In Trip' },
  { value: 'MAINTENANCE', label: 'Maintenance' },
  { value: 'OUT_OF_SERVICE', label: 'Out of Service' },
  { value: 'DECOMMISSIONED', label: 'Decommissioned' },
];

const VEHICLE_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'TRUCK', label: 'Truck' },
  { value: 'VAN', label: 'Van' },
  { value: 'TRAILER', label: 'Trailer' },
  { value: 'BUS', label: 'Bus' },
  { value: 'CAR', label: 'Car' },
  { value: 'SPECIALIZED', label: 'Specialized' },
];

const FUEL_TYPES = [
  { value: '', label: 'All Fuels' },
  { value: 'DIESEL', label: 'Diesel' },
  { value: 'PETROL', label: 'Petrol' },
  { value: 'ELECTRIC', label: 'Electric' },
  { value: 'HYBRID', label: 'Hybrid' },
  { value: 'CNG', label: 'CNG' },
  { value: 'LPG', label: 'LPG' },
];

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Date Added' },
  { value: 'registrationNumber', label: 'Reg. Number' },
  { value: 'make', label: 'Make / Brand' },
  { value: 'manufacturingYear', label: 'Year' },
  { value: 'status', label: 'Status' },
  { value: 'capacity', label: 'Capacity' },
];

const selectClass =
  'h-9 rounded-lg border border-border bg-card px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 hover:border-primary/30 transition-colors cursor-pointer';

export const FleetToolbar: React.FC<FleetToolbarProps> = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  vehicleType,
  onVehicleTypeChange,
  fuelType,
  onFuelTypeChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  onClearFilters,
}) => {
  const hasFilters = !!(search || status || vehicleType || fuelType);

  return (
    <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
      {/* Search row */}
      <div className="flex items-center gap-3 p-3 border-b border-border/60">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by reg number, VIN, make, model..."
            className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-colors"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Filter className="h-3.5 w-3.5" />
          <span className="text-xs font-semibold hidden sm:block">Filters</span>
        </div>
      </div>

      {/* Filter row */}
      <div className="flex items-center gap-2.5 px-3 py-2.5 overflow-x-auto scrollbar-hide flex-wrap">
        {/* Status */}
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className={selectClass}
          aria-label="Filter by status"
        >
          {VEHICLE_STATUSES.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Vehicle Type */}
        <select
          value={vehicleType}
          onChange={(e) => onVehicleTypeChange(e.target.value)}
          className={selectClass}
          aria-label="Filter by vehicle type"
        >
          {VEHICLE_TYPES.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Fuel Type */}
        <select
          value={fuelType}
          onChange={(e) => onFuelTypeChange(e.target.value)}
          className={selectClass}
          aria-label="Filter by fuel type"
        >
          {FUEL_TYPES.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <div className="hidden sm:block h-4 border-l border-border/60" />

        {/* Sort By */}
        <div className="flex items-center gap-1.5">
          <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className={selectClass}
            aria-label="Sort by field"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <select
            value={sortOrder}
            onChange={(e) => onSortOrderChange(e.target.value as 'asc' | 'desc')}
            className={selectClass}
            aria-label="Sort direction"
          >
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>
        </div>

        {hasFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1 h-9 px-3 rounded-lg text-xs font-semibold text-destructive hover:bg-destructive/10 transition-colors border border-destructive/20"
          >
            <X className="h-3 w-3" />
            Clear All
          </button>
        )}
      </div>
    </div>
  );
};

export default FleetToolbar;
