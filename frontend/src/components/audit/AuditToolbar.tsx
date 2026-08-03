import React from 'react';
import { Search, Filter, LayoutList, Clock, LayoutGrid, RotateCcw } from 'lucide-react';

interface AuditToolbarProps {
  search: string;
  viewMode: 'timeline' | 'table' | 'cards';
  isFilterOpen: boolean;
  activeFilterCount: number;
  onSearchChange: (value: string) => void;
  onViewModeChange: (mode: 'timeline' | 'table' | 'cards') => void;
  onToggleFilters: () => void;
  onReset: () => void;
}

export const AuditToolbar: React.FC<AuditToolbarProps> = ({
  search,
  viewMode,
  isFilterOpen,
  activeFilterCount,
  onSearchChange,
  onViewModeChange,
  onToggleFilters,
  onReset,
}) => {
  return (
    <div className="bg-white border border-[#c3c6d7] rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] font-['Inter']">
      {/* Search Input */}
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#737686]" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by user, action, module, description, IP address..."
          className="w-full pl-10 pr-4 h-10 rounded-xl border border-[#c3c6d7] text-xs text-[#0b1c30] placeholder-[#737686] focus:outline-none focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6]"
        />
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto justify-end">
        {/* Toggle Filters Button */}
        <button
          onClick={onToggleFilters}
          className={`h-10 px-3.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
            isFilterOpen || activeFilterCount > 0
              ? 'bg-[#eff4ff] border-[#004ac6] text-[#004ac6]'
              : 'border-[#c3c6d7] text-[#434655] hover:bg-[#f8f9ff]'
          }`}
        >
          <Filter className="h-4 w-4" /> Filters
          {activeFilterCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-[#004ac6] text-white text-[10px] font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>

        {activeFilterCount > 0 && (
          <button
            onClick={onReset}
            className="h-10 px-3 rounded-xl border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 transition-colors flex items-center gap-1 cursor-pointer"
            title="Reset Filters"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        )}

        {/* View Mode Switcher */}
        <div className="flex items-center p-1 bg-[#eff4ff] rounded-xl border border-[#c3c6d7]">
          <button
            onClick={() => onViewModeChange('timeline')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              viewMode === 'timeline'
                ? 'bg-white text-[#004ac6] shadow-xs font-bold'
                : 'text-[#434655] hover:text-[#0b1c30]'
            }`}
          >
            <Clock className="h-3.5 w-3.5" /> Timeline
          </button>
          <button
            onClick={() => onViewModeChange('table')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              viewMode === 'table'
                ? 'bg-white text-[#004ac6] shadow-xs font-bold'
                : 'text-[#434655] hover:text-[#0b1c30]'
            }`}
          >
            <LayoutList className="h-3.5 w-3.5" /> Table
          </button>
          <button
            onClick={() => onViewModeChange('cards')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              viewMode === 'cards'
                ? 'bg-white text-[#004ac6] shadow-xs font-bold'
                : 'text-[#434655] hover:text-[#0b1c30]'
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" /> Cards
          </button>
        </div>
      </div>
    </div>
  );
};
