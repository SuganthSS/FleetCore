import React from 'react';
import { Wrench, Clock, CheckCircle2 } from 'lucide-react';

interface MaintenanceCardProps {
  scheduled?: number;
  inProgress?: number;
  overdue?: number;
  completedThisMonth?: number;
  onClick?: () => void;
}

export const MaintenanceCard: React.FC<MaintenanceCardProps> = ({
  scheduled = 8,
  inProgress = 4,
  overdue = 12,
  completedThisMonth = 34,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="bg-white border border-[#c3c6d7] rounded-2xl p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] hover:translate-y-[-2px] hover:shadow-md transition-all duration-300 cursor-pointer"
    >
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#0b1c30]">
          Maintenance Summary
        </h4>
        <Wrench className="h-5 w-5 text-[#ba1a1a]" />
      </div>

      <div className="text-2xl font-extrabold font-['Plus_Jakarta_Sans'] text-[#ba1a1a] mb-4">
        {overdue}{' '}
        <span className="text-xs font-normal text-[#434655]">Overdue Work Orders</span>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#e5eeff] text-center font-['Inter']">
        <div className="bg-sky-50 p-2 rounded-lg">
          <div className="flex items-center justify-center gap-1 text-[11px] font-medium text-sky-700">
            <Clock className="h-3 w-3" /> Scheduled
          </div>
          <p className="text-sm font-bold text-[#0b1c30] mt-1">{scheduled}</p>
        </div>
        <div className="bg-amber-50 p-2 rounded-lg">
          <div className="flex items-center justify-center gap-1 text-[11px] font-medium text-amber-700">
            <Wrench className="h-3 w-3" /> In Progress
          </div>
          <p className="text-sm font-bold text-[#0b1c30] mt-1">{inProgress}</p>
        </div>
        <div className="bg-emerald-50 p-2 rounded-lg">
          <div className="flex items-center justify-center gap-1 text-[11px] font-medium text-emerald-700">
            <CheckCircle2 className="h-3 w-3" /> Done
          </div>
          <p className="text-sm font-bold text-[#0b1c30] mt-1">{completedThisMonth}</p>
        </div>
      </div>
    </div>
  );
};
