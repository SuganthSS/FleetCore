import React from 'react';
import { Users, RotateCcw, Plus } from 'lucide-react';

interface UserEmptyStateProps {
  hasFilters: boolean;
  onResetFilters: () => void;
  onAddUser: () => void;
}

export const UserEmptyState: React.FC<UserEmptyStateProps> = ({
  hasFilters,
  onResetFilters,
  onAddUser,
}) => {
  return (
    <div className="bg-white border border-[#c3c6d7] rounded-2xl p-12 text-center shadow-xs space-y-4 font-['Inter']">
      <div className="mx-auto w-14 h-14 rounded-2xl bg-[#eff4ff] border border-[#b4c5ff] flex items-center justify-center text-[#004ac6]">
        <Users className="h-7 w-7" />
      </div>

      <div className="max-w-sm mx-auto">
        <h3 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#0b1c30]">
          {hasFilters ? 'No Matching Employees Found' : 'No Employees Registered Yet'}
        </h3>
        <p className="text-xs text-[#737686] mt-1">
          {hasFilters
            ? 'Try adjusting your search criteria, role selection, or status filters.'
            : 'Get started by creating your first enterprise employee profile for FleetCore.'}
        </p>
      </div>

      <div className="flex justify-center gap-3 pt-2">
        {hasFilters ? (
          <button
            onClick={onResetFilters}
            className="h-9 px-4 rounded-xl border border-[#c3c6d7] text-xs font-semibold text-[#434655] hover:bg-[#f8f9ff] transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Clear Filters
          </button>
        ) : (
          <button
            onClick={onAddUser}
            className="h-9 px-4 rounded-xl bg-[#004ac6] text-white text-xs font-semibold hover:bg-[#003ea8] transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="h-4 w-4" /> Add Employee
          </button>
        )}
      </div>
    </div>
  );
};
