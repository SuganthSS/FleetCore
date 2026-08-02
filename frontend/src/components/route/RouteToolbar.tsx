import React from 'react';
import { Search, RefreshCw, X } from 'lucide-react';

interface RouteToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  routeType: string;
  onRouteTypeChange: (value: string) => void;
  onRefresh: () => void;
  onClearFilters: () => void;
  isRefreshing?: boolean;
}

export const RouteToolbar: React.FC<RouteToolbarProps> = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  routeType,
  onRouteTypeChange,
  onRefresh,
  onClearFilters,
  isRefreshing = false,
}) => {
  const hasActiveFilters = search || status || routeType;

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
            placeholder="Search route code, origin, destination or cities..."
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
              <option value="">All Statuses</option>
              <option value="PLANNED">Planned</option>
              <option value="ACTIVE">Active</option>
              <option value="OPTIMIZED">Optimized</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled / Inactive</option>
            </select>
          </div>

          {/* Route Type Filter */}
          <div className="flex flex-col">
            <select
              value={routeType}
              onChange={(e) => onRouteTypeChange(e.target.value)}
              className="h-10 rounded-lg border border-input bg-background px-3 text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Filter by Route Type"
            >
              <option value="">All Route Types</option>
              <option value="URBAN">Urban / Local</option>
              <option value="LAST_MILE">Last Mile</option>
              <option value="REGIONAL">Regional</option>
              <option value="HIGHWAY">Highway</option>
              <option value="INTERSTATE">Interstate</option>
              <option value="CROSS_BORDER">Cross Border / International</option>
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
export default RouteToolbar;
