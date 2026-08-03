import React from 'react';
import { Fuel, AlertTriangle } from 'lucide-react';

interface FuelCardProps {
  totalFuelCost?: number;
  fuelGallons?: number;
  anomalyCount?: number;
  onClick?: () => void;
}

export const FuelCard: React.FC<FuelCardProps> = ({
  totalFuelCost = 42850,
  fuelGallons = 12450,
  anomalyCount = 1,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="bg-white border border-[#c3c6d7] rounded-2xl p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] hover:translate-y-[-2px] hover:shadow-md transition-all duration-300 cursor-pointer"
    >
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#0b1c30]">
          Fuel Consumption & Cost
        </h4>
        <Fuel className="h-5 w-5 text-amber-600" />
      </div>

      <div className="text-2xl font-extrabold font-['Plus_Jakarta_Sans'] text-[#0b1c30] mb-4">
        ${totalFuelCost.toLocaleString()}{' '}
        <span className="text-xs font-normal text-[#434655]">Monthly Cost</span>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#e5eeff] font-['Inter']">
        <div className="bg-amber-50 p-2.5 rounded-lg">
          <p className="text-[11px] font-medium text-amber-800">Gallons Used</p>
          <p className="text-sm font-bold text-[#0b1c30] mt-0.5">{fuelGallons.toLocaleString()} gal</p>
        </div>
        <div className="bg-red-50 p-2.5 rounded-lg">
          <div className="flex items-center gap-1 text-[11px] font-medium text-[#ba1a1a]">
            <AlertTriangle className="h-3 w-3" /> Anomalies
          </div>
          <p className="text-sm font-bold text-[#ba1a1a] mt-0.5">{anomalyCount} Flagged</p>
        </div>
      </div>
    </div>
  );
};
