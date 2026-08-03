import React from 'react';
import { Search, LayoutGrid, LayoutList, X, RotateCcw } from 'lucide-react';

interface SelectOption {
  id: string;
  name: string;
}

interface FuelToolbarProps {
  search: string;
  onSearchChange: (val: string) => void;
  vehicleId: string;
  onVehicleIdChange: (val: string) => void;
  tripId: string;
  onTripIdChange: (val: string) => void;
  vehicles?: SelectOption[];
  trips?: SelectOption[];
  onRefresh: () => void;
  onClearFilters: () => void;
  viewMode?: 'table' | 'cards';
  onViewModeChange?: (mode: 'table' | 'cards') => void;
  isRefreshing?: boolean;
}

export const FuelToolbar: React.FC<FuelToolbarProps> = ({
  search,
  onSearchChange,
  vehicleId,
  onVehicleIdChange,
  tripId,
  onTripIdChange,
  vehicles = [],
  trips = [],
  onClearFilters,
  viewMode = 'table',
  onViewModeChange,
}) => {
  const hasActiveFilters = Boolean(search || vehicleId || tripId);

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
            placeholder="Search by fuel station, receipt ref, vehicle..."
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

        {/* Vehicle Select Filter */}
        {vehicles.length > 0 && (
          <select
            value={vehicleId}
            onChange={(e) => onVehicleIdChange(e.target.value)}
            className="px-3 py-2 bg-background border border-input rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 max-w-[160px] truncate"
          >
            <option value="">All Vehicles</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        )}

        {/* Trip Select Filter */}
        {trips.length > 0 && (
          <select
            value={tripId}
            onChange={(e) => onTripIdChange(e.target.value)}
            className="px-3 py-2 bg-background border border-input rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 max-w-[160px] truncate"
          >
            <option value="">All Trips</option>
            {trips.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
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

      {/* View Switcher */}
      {onViewModeChange && (
        <div className="flex items-center gap-2 self-end lg:self-auto">
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
      )}
    </div>
  );
};

export default FuelToolbar;
