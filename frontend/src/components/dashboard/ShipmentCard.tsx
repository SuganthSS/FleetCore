import React from 'react';
import { Package, CheckCircle2, Clock, Truck } from 'lucide-react';

interface ShipmentCardProps {
  totalShipments?: number;
  inTransit?: number;
  delivered?: number;
  pending?: number;
  onClick?: () => void;
}

export const ShipmentCard: React.FC<ShipmentCardProps> = ({
  totalShipments = 840,
  inTransit = 320,
  delivered = 490,
  pending = 30,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="bg-white border border-[#c3c6d7] rounded-2xl p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] hover:translate-y-[-2px] hover:shadow-md transition-all duration-300 cursor-pointer"
    >
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#0b1c30]">
          Shipments Summary
        </h4>
        <Package className="h-5 w-5 text-[#004ac6]" />
      </div>

      <div className="text-2xl font-extrabold font-['Plus_Jakarta_Sans'] text-[#0b1c30] mb-4">
        {totalShipments.toLocaleString()}{' '}
        <span className="text-xs font-normal text-[#434655]">Total Orders</span>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#e5eeff] text-center font-['Inter']">
        <div className="bg-[#eff4ff] p-2 rounded-lg">
          <div className="flex items-center justify-center gap-1 text-[11px] font-medium text-[#004ac6]">
            <Truck className="h-3 w-3" /> In Transit
          </div>
          <p className="text-sm font-bold text-[#0b1c30] mt-1">{inTransit}</p>
        </div>
        <div className="bg-emerald-50 p-2 rounded-lg">
          <div className="flex items-center justify-center gap-1 text-[11px] font-medium text-emerald-700">
            <CheckCircle2 className="h-3 w-3" /> Delivered
          </div>
          <p className="text-sm font-bold text-[#0b1c30] mt-1">{delivered}</p>
        </div>
        <div className="bg-amber-50 p-2 rounded-lg">
          <div className="flex items-center justify-center gap-1 text-[11px] font-medium text-amber-700">
            <Clock className="h-3 w-3" /> Pending
          </div>
          <p className="text-sm font-bold text-[#0b1c30] mt-1">{pending}</p>
        </div>
      </div>
    </div>
  );
};
