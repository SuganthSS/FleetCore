import React from 'react';
import { PermissionBadge } from './PermissionBadge';


interface PermissionGroupProps {
  category: string;
  availableActions: string[];
  selectedActions: string[];
  onToggleAction: (action: string) => void;
  disabled?: boolean;
}

export const PermissionGroup: React.FC<PermissionGroupProps> = ({
  category,
  availableActions,
  selectedActions,
  onToggleAction,
  disabled = false,
}) => {
  const isAllSelected = availableActions.every((a) => selectedActions.includes(a));

  return (
    <div className="bg-[#f8f9ff] border border-[#c3c6d7] rounded-xl p-3.5 space-y-2.5 font-['Inter']">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-xs text-[#0b1c30]">{category}</span>
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            if (isAllSelected) {
              availableActions.forEach((a) => {
                if (selectedActions.includes(a)) onToggleAction(a);
              });
            } else {
              availableActions.forEach((a) => {
                if (!selectedActions.includes(a)) onToggleAction(a);
              });
            }
          }}
          className="text-[10px] text-[#004ac6] hover:underline font-semibold disabled:opacity-50"
        >
          {isAllSelected ? 'Deselect All' : 'Select All'}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {availableActions.map((action) => {
          const checked = selectedActions.includes(action) || selectedActions.includes('Manage');

          return (
            <label
              key={action}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs cursor-pointer select-none transition-all ${
                checked
                  ? 'bg-white border-[#004ac6] shadow-xs'
                  : 'bg-white/50 border-[#c3c6d7] opacity-70 hover:opacity-100'
              } ${disabled ? 'pointer-events-none opacity-50' : ''}`}
            >
              <input
                type="checkbox"
                checked={checked}
                disabled={disabled}
                onChange={() => onToggleAction(action)}
                className="rounded border-[#c3c6d7] text-[#004ac6] focus:ring-[#004ac6] h-3.5 w-3.5"
              />
              <PermissionBadge action={action} />
            </label>
          );
        })}
      </div>
    </div>
  );
};
