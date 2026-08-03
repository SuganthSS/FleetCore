import React from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';

interface ChartCardProps {
  title?: string;
  subtitle?: string;
  onClick?: () => void;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title = 'Fleet Utilization & Fuel Efficiency Trends',
  subtitle = 'Weekly performance metrics across all operational corridors',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="bg-white border border-[#c3c6d7] rounded-2xl p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] hover:translate-y-[-2px] hover:shadow-md transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#0b1c30]">
              {title}
            </h3>
            <p className="font-['Inter'] text-xs text-[#434655] mt-0.5">{subtitle}</p>
          </div>
          <div className="bg-[#eff4ff] p-2 rounded-xl text-[#004ac6]">
            <BarChart3 className="h-5 w-5" />
          </div>
        </div>

        {/* Visual Simulated Bar Chart */}
        <div className="mt-6 space-y-3 font-['Inter']">
          <div>
            <div className="flex justify-between text-xs font-semibold text-[#0b1c30] mb-1">
              <span>Operational Efficiency</span>
              <span className="text-[#004ac6]">94.2%</span>
            </div>
            <div className="h-2.5 w-full bg-[#eff4ff] rounded-full overflow-hidden">
              <div className="h-full bg-[#004ac6] rounded-full w-[94%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-[#0b1c30] mb-1">
              <span>On-Time Delivery Rate</span>
              <span className="text-emerald-600">98.5%</span>
            </div>
            <div className="h-2.5 w-full bg-emerald-50 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full w-[98%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-[#0b1c30] mb-1">
              <span>Fleet Availability</span>
              <span className="text-purple-600">91.0%</span>
            </div>
            <div className="h-2.5 w-full bg-purple-50 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full w-[91%]" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[#e5eeff] flex justify-between items-center text-xs font-['Inter']">
        <span className="text-[#004ac6] font-semibold flex items-center gap-1">
          <TrendingUp className="h-3.5 w-3.5" /> +4.2% efficiency vs last week
        </span>
        <span className="text-[#737686]">Updated 5m ago</span>
      </div>
    </div>
  );
};
