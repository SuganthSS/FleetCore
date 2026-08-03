import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, AlertTriangle } from 'lucide-react';

interface FleetHealthCardProps {
  totalVehicles?: number;
  activeVehicles?: number;
  maintenanceDue?: number;
}

export const FleetHealthCard: React.FC<FleetHealthCardProps> = ({
  totalVehicles = 1248,
  activeVehicles = 980,
  maintenanceDue = 12,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-[#c3c6d7] rounded-2xl shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] overflow-hidden flex flex-col min-h-[440px]">
      <div className="p-4 border-b border-[#c3c6d7] flex justify-between items-center bg-white/70 backdrop-blur-sm sticky top-0 z-10">
        <div>
          <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#0b1c30]">
            Live Fleet Map & Real-time Operations
          </h3>
          <p className="font-['Inter'] text-xs text-[#434655]">
            {activeVehicles} active vehicles tracked across operational corridors
          </p>
        </div>
        <button
          onClick={() => navigate('/tracking')}
          className="text-[#004ac6] font-['Inter'] text-xs font-semibold hover:underline"
        >
          View Full Map
        </button>
      </div>

      <div
        className="flex-1 relative bg-[#d3e4fe] min-h-[350px]"
        style={{
          backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCJIQF2sljZ9rdMh6MUhpG0-llUAlM_hBtcD_5UCXotns4opYyotyV3lh1CaS-7odExItQHOFs0DoneBJXYAXxWr6OVtNiyczIlNr2vMaiI0Ud9AsoDMohqkwheC9hUdTqUbrbmEGiKi03fy9mZqDsQNS3d8tC-sB3HFkixALxqT1WJyaKw8_l77jisPFcCwbqAbolTtptwmLez4f0SPKtNoeMtRcYBFEN0ZqEGR5DJfIlZJ_IYCEUBlw')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Map Marker 1 */}
        <div className="absolute top-[25%] left-[33%] bg-[#004ac6] text-white rounded-full p-2.5 shadow-lg cursor-pointer transform hover:scale-110 transition-transform group">
          <Truck className="h-4.5 w-4.5" />
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 bg-[#0b1c30] text-white text-[10px] py-1 px-2 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-20">
            Vehicle #4022 - Operational Corridors
          </div>
          <div className="absolute inset-0 rounded-full bg-[#004ac6] opacity-35 animate-ping" />
        </div>

        {/* Map Marker 2 */}
        <div className="absolute top-[50%] left-[50%] bg-[#ba1a1a] text-white rounded-full p-2.5 shadow-lg cursor-pointer transform hover:scale-110 transition-transform group">
          <AlertTriangle className="h-4.5 w-4.5" />
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 bg-[#ba1a1a] text-white text-[10px] py-1 px-2 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-20">
            Alert: Rapid Fuel Level Drop (#1093)
          </div>
          <div className="absolute inset-0 rounded-full bg-[#ba1a1a] opacity-35 animate-ping" />
        </div>

        {/* Floating Health Status Overlay */}
        <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md rounded-xl p-3 border border-[#c3c6d7] flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4 text-xs font-['Inter']">
            <span className="flex items-center gap-1.5 font-medium text-[#0b1c30]">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              Active: {activeVehicles}
            </span>
            <span className="flex items-center gap-1.5 font-medium text-[#0b1c30]">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
              Idle/Standby: {totalVehicles - activeVehicles - maintenanceDue}
            </span>
            <span className="flex items-center gap-1.5 font-medium text-[#0b1c30]">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
              Maintenance: {maintenanceDue}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
