import React from 'react';
import { Search, LayoutGrid, Table, RotateCcw } from 'lucide-react';

interface RoleToolbarProps {
  search: string;
  viewMode: 'cards' | 'matrix' | 'table';
  filterType: 'all' | 'system' | 'custom';
  onSearchChange: (value: string) => void;
  onViewModeChange: (mode: 'cards' | 'matrix' | 'table') => void;
  onFilterTypeChange: (type: 'all' | 'system' | 'custom') => void;
  onReset: () => void;
}

export const RoleToolbar: React.FC<RoleToolbarProps> = ({
  search,
  viewMode,
  filterType,
  onSearchChange,
  onViewModeChange,
  onFilterTypeChange,
  onReset,
}) => {
  return (
    <div className="bg-white border border-[#c3c6d7] rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 font-['Inter'] text-xs">
      {/* Left: Search input */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#737686]" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search role name, capability, or scope..."
          className="w-full pl-9 pr-4 h-9 rounded-xl border border-[#c3c6d7] bg-[#f8f9ff] text-[#0b1c30] placeholder-[#737686] focus:outline-none focus:ring-2 focus:ring-[#004ac6] transition-all"
        />
      </div>

      {/* Right: Filter Dropdown & View Mode Switcher */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Role Type Filter */}
        <select
          value={filterType}
          onChange={(e) => onFilterTypeChange(e.target.value as 'all' | 'system' | 'custom')}
          className="h-9 px-3 rounded-xl border border-[#c3c6d7] bg-white text-[#0b1c30] font-medium focus:ring-2 focus:ring-[#004ac6] focus:outline-none"
        >
          <option value="all">All Role Types</option>
          <option value="system">System Core Roles</option>
          <option value="custom">Custom Roles</option>
        </select>

        {/* View Mode Segmented Switch */}
        <div className="bg-[#eff4ff] p-1 rounded-xl flex items-center gap-1 border border-[#c3c6d7]">
          <button
            onClick={() => onViewModeChange('cards')}
            className={`h-7 px-3 rounded-lg font-semibold text-[11px] transition-colors flex items-center gap-1.5 ${
              viewMode === 'cards'
                ? 'bg-white text-[#004ac6] shadow-xs'
                : 'text-[#434655] hover:text-[#0b1c30]'
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" /> Cards
          </button>
          <button
            onClick={() => onViewModeChange('matrix')}
            className={`h-7 px-3 rounded-lg font-semibold text-[11px] transition-colors flex items-center gap-1.5 ${
              viewMode === 'matrix'
                ? 'bg-white text-[#004ac6] shadow-xs'
                : 'text-[#434655] hover:text-[#0b1c30]'
            }`}
          >
            <Table className="h-3.5 w-3.5" /> Matrix
          </button>
          <button
            onClick={() => onViewModeChange('table')}
            className={`h-7 px-3 rounded-lg font-semibold text-[11px] transition-colors flex items-center gap-1.5 ${
              viewMode === 'table'
                ? 'bg-white text-[#004ac6] shadow-xs'
                : 'text-[#434655] hover:text-[#0b1c30]'
            }`}
          >
            <Table className="h-3.5 w-3.5" /> Table
          </button>
        </div>

        {(search || filterType !== 'all') && (
          <button
            onClick={onReset}
            className="h-9 px-3 rounded-xl border border-[#c3c6d7] text-[#434655] hover:bg-[#f8f9ff] transition-colors flex items-center gap-1 font-medium"
            title="Reset Filters"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
        )}
      </div>
    </div>
  );
};
