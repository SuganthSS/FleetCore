import React from 'react';
import { Search, LayoutGrid, LayoutList, X, RotateCcw } from 'lucide-react';

interface SelectOption {
  id: string;
  name: string;
}

interface TripToolbarProps {
  search: string;
  onSearchChange: (val: string) => void;
  status: string;
  onStatusChange: (val: string) => void;
  vehicleId: string;
  onVehicleIdChange: (val: string) => void;
  driverId: string;
  onDriverIdChange: (val: string) => void;
  routeId?: string;
  onRouteIdChange?: (val: string) => void;
  vehicles?: SelectOption[];
  drivers?: SelectOption[];
  routes?: SelectOption[];
  sortBy: string;
  onSortByChange: (val: string) => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (val: 'asc' | 'desc') => void;
  viewMode: 'table' | 'cards';
  onViewModeChange: (mode: 'table' | 'cards') => void;
  onClearFilters: () => void;
}

export const TripToolbar: React.FC<TripToolbarProps> = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  vehicleId,
  onVehicleIdChange,
  driverId,
  onDriverIdChange,
  routeId = '',
  onRouteIdChange,
  vehicles = [],
  drivers = [],
  routes = [],
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  viewMode,
  onViewModeChange,
  onClearFilters,
}) => {
  const hasActiveFilters = Boolean(search || status || vehicleId || driverId || routeId);

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-3 rounded-2xl bg-card border border-border shadow-2xs">
      {/* Search & Filter Dropdowns */}
      <div className="flex flex-wrap items-center gap-2 flex-1">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by trip #, vehicle reg, driver ID, route..."
            className="w-full pl-9 pr-4 py-2 bg-background border border-input rounded-xl text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Status Select */}
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-3 py-2 bg-background border border-input rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="">All Statuses</option>
          <option value="SCHEDULED">Scheduled</option>
          <option value="DISPATCHED">Dispatched</option>
          <option value="IN_TRANSIT">In Transit</option>
          <option value="PAUSED">Paused</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="FAILED">Failed</option>
        </select>

        {/* Driver Select */}
        {drivers.length > 0 && (
          <select
            value={driverId}
            onChange={(e) => onDriverIdChange(e.target.value)}
            className="px-3 py-2 bg-background border border-input rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 max-w-[150px] truncate"
          >
            <option value="">All Drivers</option>
            {drivers.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        )}

        {/* Vehicle Select */}
        {vehicles.length > 0 && (
          <select
            value={vehicleId}
            onChange={(e) => onVehicleIdChange(e.target.value)}
            className="px-3 py-2 bg-background border border-input rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 max-w-[150px] truncate"
          >
            <option value="">All Vehicles</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        )}

        {/* Route Select */}
        {routes.length > 0 && onRouteIdChange && (
          <select
            value={routeId}
            onChange={(e) => onRouteIdChange(e.target.value)}
            className="px-3 py-2 bg-background border border-input rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 max-w-[150px] truncate"
          >
            <option value="">All Routes</option>
            {routes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        )}

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-bold text-destructive hover:bg-destructive/10 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        )}
      </div>

      {/* Sort & View Mode Controls */}
      <div className="flex items-center gap-2 self-end lg:self-auto">
        <div className="flex items-center gap-1.5 border-l border-border pl-2">
          <span className="text-[11px] font-bold text-muted-foreground">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="px-2.5 py-1.5 bg-background border border-input rounded-xl text-xs font-semibold"
          >
            <option value="createdAt">Date Created</option>
            <option value="tripNumber">Trip #</option>
            <option value="plannedStartTime">Scheduled Start</option>
            <option value="status">Status</option>
          </select>
          <button
            onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-1.5 rounded-xl border border-input bg-background text-xs font-mono font-bold hover:bg-muted"
            title="Toggle sort direction"
          >
            {sortOrder.toUpperCase()}
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center p-1 rounded-xl bg-muted/60 border border-border">
          <button
            onClick={() => onViewModeChange('table')}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'table'
                ? 'bg-card text-foreground shadow-2xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title="Table View"
          >
            <LayoutList className="h-4 w-4" />
          </button>
          <button
            onClick={() => onViewModeChange('cards')}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'cards'
                ? 'bg-card text-foreground shadow-2xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title="Cards View"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripToolbar;
