import React from 'react';
import { Search, LayoutGrid, Table, ArrowUpDown, X } from 'lucide-react';

interface RouteToolbarProps {
  search: string;
  onSearchChange: (val: string) => void;
  status: string;
  onStatusChange: (val: string) => void;
  routeType: string;
  onRouteTypeChange: (val: string) => void;
  sortBy: string;
  onSortByChange: (val: string) => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (val: 'asc' | 'desc') => void;
  viewMode: 'table' | 'cards';
  onViewModeChange: (mode: 'table' | 'cards') => void;
  onClearFilters: () => void;
}

export const RouteToolbar: React.FC<RouteToolbarProps> = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  routeType,
  onRouteTypeChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  viewMode,
  onViewModeChange,
  onClearFilters,
}) => {
  const hasActiveFilters = Boolean(search || status || routeType);

  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-3 rounded-2xl border border-border bg-card shadow-xs">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[240px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by route code, origin, or destination..."
          className="w-full pl-9 pr-4 py-2 text-xs font-medium bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground"
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

      {/* Filter Options */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Status Filter */}
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-3 py-2 text-xs font-semibold bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground cursor-pointer"
        >
          <option value="">All Statuses</option>
          <option value="PLANNED">Planned</option>
          <option value="ACTIVE">Active</option>
          <option value="OPTIMIZED">Optimized</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        {/* Route Type Filter */}
        <select
          value={routeType}
          onChange={(e) => onRouteTypeChange(e.target.value)}
          className="px-3 py-2 text-xs font-semibold bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground cursor-pointer"
        >
          <option value="">All Types</option>
          <option value="HIGHWAY">Highway</option>
          <option value="URBAN">Urban</option>
          <option value="INTERSTATE">Interstate</option>
          <option value="CROSS_BORDER">Cross-Border</option>
          <option value="REGIONAL">Regional</option>
          <option value="LAST_MILE">Last Mile</option>
        </select>

        {/* Sort Field */}
        <select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
          className="px-3 py-2 text-xs font-semibold bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground cursor-pointer"
        >
          <option value="createdAt">Sort: Created Date</option>
          <option value="name">Sort: Route Code</option>
          <option value="distance">Sort: Distance</option>
        </select>

        {/* Sort Direction */}
        <button
          onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
          className="p-2 rounded-xl border border-input bg-background text-foreground hover:bg-muted transition-colors"
          title={`Order: ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
        >
          <ArrowUpDown className="h-4 w-4" />
        </button>

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-destructive/10 text-destructive text-xs font-bold hover:bg-destructive/20 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </button>
        )}

        {/* View Mode Switcher */}
        <div className="flex items-center rounded-xl border border-input bg-muted/30 p-1 ml-auto">
          <button
            onClick={() => onViewModeChange('table')}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'table'
                ? 'bg-card text-primary shadow-xs font-bold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title="Table View"
          >
            <Table className="h-4 w-4" />
          </button>
          <button
            onClick={() => onViewModeChange('cards')}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'cards'
                ? 'bg-card text-primary shadow-xs font-bold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title="Grid Cards View"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RouteToolbar;
