import React from 'react';
import { CheckCircle2, XCircle, Download, X } from 'lucide-react';


interface BulkActionsProps {
  selectedCount: number;
  totalCount: number;
  onClearSelection: () => void;
  onBulkActivate: () => void;
  onBulkDeactivate: () => void;
  onBulkExport: () => void;
}

export const BulkActions: React.FC<BulkActionsProps> = ({
  selectedCount,
  onClearSelection,
  onBulkActivate,
  onBulkDeactivate,
  onBulkExport,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="bg-[#0b1c30] text-white rounded-2xl p-3 px-5 shadow-lg flex items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2 duration-200 font-['Inter'] text-xs">
      <div className="flex items-center gap-3">
        <span className="font-['Plus_Jakarta_Sans'] font-extrabold text-sm text-white bg-[#004ac6] px-2.5 py-0.5 rounded-full">
          {selectedCount}
        </span>
        <span className="font-medium text-[#c3c6d7]">
          {selectedCount === 1 ? 'employee selected' : 'employees selected'}
        </span>
        <button
          onClick={onClearSelection}
          className="text-[#737686] hover:text-white transition-colors p-1"
          title="Clear selection"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onBulkActivate}
          className="h-8 px-3 rounded-xl bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/30 transition-colors flex items-center gap-1.5 font-medium"
        >
          <CheckCircle2 className="h-3.5 w-3.5" /> Activate
        </button>
        <button
          onClick={onBulkDeactivate}
          className="h-8 px-3 rounded-xl bg-amber-600/20 text-amber-300 hover:bg-amber-600/30 border border-amber-500/30 transition-colors flex items-center gap-1.5 font-medium"
        >
          <XCircle className="h-3.5 w-3.5" /> Deactivate
        </button>
        <button
          onClick={onBulkExport}
          className="h-8 px-3 rounded-xl bg-white/10 text-white hover:bg-white/20 border border-white/20 transition-colors flex items-center gap-1.5 font-medium"
        >
          <Download className="h-3.5 w-3.5" /> Export Selected
        </button>
      </div>
    </div>
  );
};
