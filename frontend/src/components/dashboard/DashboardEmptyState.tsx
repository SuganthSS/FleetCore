import React from 'react';
import { Truck, Plus } from 'lucide-react';

interface DashboardEmptyStateProps {
  onAction?: () => void;
}

export const DashboardEmptyState: React.FC<DashboardEmptyStateProps> = ({ onAction }) => {
  return (
    <div className="bg-white border border-[#c3c6d7] rounded-2xl p-12 text-center shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] max-w-2xl mx-auto my-10">
      <div className="bg-[#eff4ff] text-[#004ac6] p-4 rounded-2xl w-16 h-16 mx-auto flex items-center justify-center mb-4">
        <Truck className="h-8 w-8" />
      </div>
      <h3 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-[#0b1c30] mb-2">
        No Fleet Data Available
      </h3>
      <p className="font-['Inter'] text-sm text-[#434655] max-w-md mx-auto mb-6">
        Welcome to FleetCore. Your enterprise dashboard currently has no operational vehicles or trips registered.
      </p>
      {onAction && (
        <button
          onClick={onAction}
          className="bg-[#004ac6] text-white font-['Inter'] text-xs font-semibold px-5 py-2.5 rounded-lg hover:bg-[#003ea8] transition-colors inline-flex items-center gap-2 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Add First Vehicle
        </button>
      )}
    </div>
  );
};
