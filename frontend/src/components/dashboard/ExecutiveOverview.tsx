import React from 'react';
import { Sparkles } from 'lucide-react';

interface ExecutiveOverviewProps {
  efficiencyGain?: number;
  maintenanceAlertCount?: number;
  fuelAnomalyRoute?: string;
}

export const ExecutiveOverview: React.FC<ExecutiveOverviewProps> = ({
  efficiencyGain = 4.2,
  maintenanceAlertCount = 12,
  fuelAnomalyRoute = 'Route 7B',
}) => {
  return (
    <div className="bg-gradient-to-r from-[#e5eeff] to-[#f8f9ff] border border-[#b4c5ff] rounded-2xl p-5 hover:translate-y-[-2px] hover:shadow-md transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className="bg-[#dbe1ff] text-[#004ac6] p-2.5 rounded-xl shrink-0">
          <Sparkles className="h-5 w-5 animate-pulse" />
        </div>
        <div>
          <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#0b1c30] mb-1">
            Fleet Health Summary
          </h3>
          <p className="font-['Inter'] text-sm text-[#434655] leading-relaxed max-w-4xl">
            Overall fleet efficiency is up{' '}
            <strong className="text-[#004ac6] font-semibold">{efficiencyGain}%</strong> this week.{' '}
            <strong className="text-[#004ac6] font-semibold">
              {maintenanceAlertCount} vehicles
            </strong>{' '}
            require scheduled maintenance or attention within the next 48 hours. Fuel consumption anomalies detected in{' '}
            <strong className="text-[#ba1a1a] font-semibold">{fuelAnomalyRoute}</strong>; consider immediate review.
          </p>
        </div>
      </div>
    </div>
  );
};
