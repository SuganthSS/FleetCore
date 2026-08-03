import React from 'react';
import { Search, Filter, Plus, RotateCcw } from 'lucide-react';
import type { UserQueryParams } from '@/types/user';

interface UserToolbarProps {
  queryParams: UserQueryParams;
  onFilterChange: (updates: Partial<UserQueryParams>) => void;
  onResetFilters: () => void;
  onAddUser: () => void;
}

export const UserToolbar: React.FC<UserToolbarProps> = ({
  queryParams,
  onFilterChange,
  onResetFilters,
  onAddUser,
}) => {
  const hasActiveFilters =
    Boolean(queryParams.search) ||
    Boolean(queryParams.role) ||
    Boolean(queryParams.status);

  return (
    <div className="bg-white border border-[#c3c6d7] rounded-2xl p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] space-y-4">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#737686]" />
          <input
            type="text"
            value={queryParams.search || ''}
            onChange={(e) => onFilterChange({ search: e.target.value, page: 1 })}
            placeholder="Search by employee name or email..."
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-[#c3c6d7] bg-[#f8f9ff] text-xs font-['Inter'] text-[#0b1c30] placeholder-[#737686] focus:outline-none focus:ring-2 focus:ring-[#004ac6] focus:border-transparent transition-all"
          />
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 self-end md:self-auto">
          {/* Role Filter */}
          <div className="relative">
            <select
              value={queryParams.role || ''}
              onChange={(e) => onFilterChange({ role: e.target.value || undefined, page: 1 })}
              className="h-10 px-3 pr-8 rounded-xl border border-[#c3c6d7] bg-white text-xs font-['Inter'] font-medium text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#004ac6] cursor-pointer appearance-none"
            >
              <option value="">All Roles</option>
              <option value="Administrator">Administrator</option>
              <option value="Fleet Manager">Fleet Manager</option>
              <option value="Dispatcher">Dispatcher</option>
              <option value="Maintenance Manager">Maintenance Manager</option>
              <option value="Accountant">Accountant</option>
              <option value="Driver">Driver</option>
            </select>
            <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#737686] pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={queryParams.status || ''}
              onChange={(e) => onFilterChange({ status: e.target.value || undefined, page: 1 })}
              className="h-10 px-3 pr-8 rounded-xl border border-[#c3c6d7] bg-white text-xs font-['Inter'] font-medium text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#004ac6] cursor-pointer appearance-none"
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
            <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#737686] pointer-events-none" />
          </div>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="h-10 px-3 rounded-xl border border-[#c3c6d7] bg-[#f8f9ff] text-xs font-['Inter'] font-semibold text-[#434655] hover:bg-gray-100 transition-colors flex items-center gap-1.5"
              title="Reset all filters"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          )}

          {/* Add Employee Button */}
          <button
            onClick={onAddUser}
            className="h-10 px-4 rounded-xl bg-[#004ac6] text-white text-xs font-['Inter'] font-semibold hover:bg-[#003ea8] transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="h-4 w-4" />
            Add Employee
          </button>
        </div>
      </div>
    </div>
  );
};
