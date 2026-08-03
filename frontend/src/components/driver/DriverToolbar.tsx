import React from 'react';
import { Search, X, Filter, SlidersHorizontal, LayoutGrid, LayoutList } from 'lucide-react';

interface DriverToolbarProps {
  search: string;
  onSearchChange: (val: string) => void;
  availability: string;
  onAvailabilityChange: (val: string) => void;
  experienceLevel: string;
  onExperienceLevelChange: (val: string) => void;
  sortBy: string;
  onSortByChange: (val: string) => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (val: 'asc' | 'desc') => void;
  viewMode: 'table' | 'cards';
  onViewModeChange: (mode: 'table' | 'cards') => void;
  onClearFilters: () => void;
}

export const DriverToolbar: React.FC<DriverToolbarProps> = ({
  search,
  onSearchChange,
  availability,
  onAvailabilityChange,
  experienceLevel,
  onExperienceLevelChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  viewMode,
  onViewModeChange,
  onClearFilters,
}) => {
  const hasFilters = search || availability || experienceLevel;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-xs">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search driver name, employee ID, license number, email..."
            className="w-full rounded-lg border border-input bg-background pl-9 pr-8 py-2 text-xs font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-md hover:bg-muted text-muted-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 rounded-lg border border-border p-1 bg-muted/20 self-start sm:self-auto">
          <button
            onClick={() => onViewModeChange('table')}
            className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition-colors ${
              viewMode === 'table' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
            }`}
            title="Table View"
          >
            <LayoutList className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Table</span>
          </button>
          <button
            onClick={() => onViewModeChange('cards')}
            className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition-colors ${
              viewMode === 'cards' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
            }`}
            title="Grid Cards View"
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Cards</span>
          </button>
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-border/60">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 text-xs font-bold text-muted-foreground mr-1">
            <Filter className="h-3.5 w-3.5" />
            Filters:
          </div>

          {/* Availability Select */}
          <select
            value={availability}
            onChange={(e) => onAvailabilityChange(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">All Statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="ON_TRIP">On Trip</option>
            <option value="OFF_DUTY">Off Duty</option>
            <option value="ON_LEAVE">On Leave</option>
            <option value="SUSPENDED">Suspended</option>
          </select>

          {/* Experience Select */}
          <select
            value={experienceLevel}
            onChange={(e) => onExperienceLevelChange(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">All Experience</option>
            <option value="JUNIOR">Junior (1-2 yrs)</option>
            <option value="MID">Mid Level (3-5 yrs)</option>
            <option value="SENIOR">Senior (5-8 yrs)</option>
            <option value="EXPERT">Expert (8+ yrs)</option>
          </select>

          {hasFilters && (
            <button
              onClick={onClearFilters}
              className="text-xs font-bold text-primary hover:underline px-2 py-1 flex items-center gap-1"
            >
              <X className="h-3 w-3" />
              Clear All
            </button>
          )}
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Sort:
          </div>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="rounded-lg border border-input bg-background px-2.5 py-1.5 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="createdAt">Date Added</option>
            <option value="employeeId">Employee ID</option>
            <option value="licenseExpiry">License Expiry</option>
            <option value="experienceLevel">Experience</option>
            <option value="availability">Status</option>
          </select>
          <button
            onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="rounded-lg border border-input bg-background px-2.5 py-1.5 text-xs font-bold text-foreground hover:bg-muted"
            title="Toggle sort direction"
          >
            {sortOrder === 'asc' ? '↑ ASC' : '↓ DESC'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DriverToolbar;
