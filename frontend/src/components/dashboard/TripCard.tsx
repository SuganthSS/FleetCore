import React from 'react';
import { Compass, CheckCircle, Play, AlertCircle } from 'lucide-react';

interface TripCardProps {
  totalTrips?: number;
  activeTrips?: number;
  completedTrips?: number;
  delayedTrips?: number;
  onClick?: () => void;
}

export const TripCard: React.FC<TripCardProps> = ({
  activeTrips = 432,
  completedTrips = 72,
  delayedTrips = 8,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="bg-white border border-[#c3c6d7] rounded-2xl p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] hover:translate-y-[-2px] hover:shadow-md transition-all duration-300 cursor-pointer"
    >
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#0b1c30]">
          Active Operations & Trips
        </h4>
        <Compass className="h-5 w-5 text-purple-600" />
      </div>

      <div className="text-2xl font-extrabold font-['Plus_Jakarta_Sans'] text-[#0b1c30] mb-4">
        {activeTrips.toLocaleString()}{' '}
        <span className="text-xs font-normal text-[#434655]">Active Trips</span>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#e5eeff] text-center font-['Inter']">
        <div className="bg-purple-50 p-2 rounded-lg">
          <div className="flex items-center justify-center gap-1 text-[11px] font-medium text-purple-700">
            <Play className="h-3 w-3" /> Active
          </div>
          <p className="text-sm font-bold text-[#0b1c30] mt-1">{activeTrips}</p>
        </div>
        <div className="bg-emerald-50 p-2 rounded-lg">
          <div className="flex items-center justify-center gap-1 text-[11px] font-medium text-emerald-700">
            <CheckCircle className="h-3 w-3" /> Done
          </div>
          <p className="text-sm font-bold text-[#0b1c30] mt-1">{completedTrips}</p>
        </div>
        <div className="bg-red-50 p-2 rounded-lg">
          <div className="flex items-center justify-center gap-1 text-[11px] font-medium text-red-700">
            <AlertCircle className="h-3 w-3" /> Delayed
          </div>
          <p className="text-sm font-bold text-[#0b1c30] mt-1">{delayedTrips}</p>
        </div>
      </div>
    </div>
  );
};
