import React from 'react';
import { Activity, RotateCcw } from 'lucide-react';

interface AuditEmptyStateProps {
  onReset: () => void;
}

export const AuditEmptyState: React.FC<AuditEmptyStateProps> = ({ onReset }) => {
  return (
    <div className="bg-white border border-[#c3c6d7] rounded-2xl p-12 text-center space-y-4 font-['Inter'] shadow-xs">
      <div className="mx-auto w-12 h-12 rounded-2xl bg-[#eff4ff] text-[#004ac6] flex items-center justify-center">
        <Activity className="h-6 w-6" />
      </div>

      <div className="space-y-1">
        <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#0b1c30]">
          No Audit Log Entries Found
        </h3>
        <p className="text-xs text-[#737686] max-w-sm mx-auto">
          We couldn't find any enterprise audit events matching your filter parameters or search term.
        </p>
      </div>

      <button
        onClick={onReset}
        className="inline-flex items-center gap-1.5 px-4 h-9 rounded-xl border border-[#c3c6d7] text-xs font-semibold text-[#004ac6] hover:bg-[#eff4ff] transition-colors"
      >
        <RotateCcw className="h-3.5 w-3.5" /> Clear Filters
      </button>
    </div>
  );
};
