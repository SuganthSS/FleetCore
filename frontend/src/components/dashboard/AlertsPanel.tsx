import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Fuel, Wrench, AlertTriangle, ChevronRight } from 'lucide-react';

interface AlertItem {
  id: string;
  type: 'fuel' | 'maintenance' | 'driver' | 'trip';
  title: string;
  description: string;
  timestamp?: string;
  targetPath?: string;
}

interface AlertsPanelProps {
  alerts?: AlertItem[];
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts }) => {
  const navigate = useNavigate();

  const defaultAlerts: AlertItem[] = [
    {
      id: '1',
      type: 'fuel',
      title: 'Fuel Anomaly Detected',
      description: 'Vehicle #4022 - Rapid level drop',
      targetPath: '/fuel',
    },
    {
      id: '2',
      type: 'maintenance',
      title: 'Maintenance Overdue',
      description: 'Vehicle #1093 - Engine check',
      targetPath: '/maintenance',
    },
  ];

  const items = alerts && alerts.length > 0 ? alerts : defaultAlerts;

  const renderIcon = (type: AlertItem['type']) => {
    switch (type) {
      case 'fuel':
        return <Fuel className="h-4.5 w-4.5 text-[#ba1a1a]" />;
      case 'maintenance':
        return <Wrench className="h-4.5 w-4.5 text-[#005a82]" />;
      default:
        return <AlertTriangle className="h-4.5 w-4.5 text-amber-600" />;
    }
  };

  const renderBg = (type: AlertItem['type']) => {
    switch (type) {
      case 'fuel':
        return 'bg-[#ffdad6] border-[#ffdad6]';
      case 'maintenance':
        return 'bg-[#e5eeff] border-[#c3c6d7]';
      default:
        return 'bg-amber-50 border-amber-200';
    }
  };

  return (
    <div className="bg-white border border-[#c3c6d7] rounded-2xl shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] p-5 hover:translate-y-[-2px] hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#0b1c30]">
          High Priority Alerts
        </h3>
        <span className="text-xs font-semibold font-['Inter'] text-[#ba1a1a] bg-[#ffdad6] px-2.5 py-1 rounded-full">
          {items.length} Critical
        </span>
      </div>

      <ul className="space-y-3.5">
        {items.map((item) => (
          <li
            key={item.id}
            onClick={() => item.targetPath && navigate(item.targetPath)}
            className={`flex items-start justify-between gap-3 p-3.5 border rounded-xl cursor-pointer hover:opacity-90 transition-all ${renderBg(
              item.type
            )}`}
          >
            <div className="flex items-start gap-3">
              <div className="bg-white/80 p-2 rounded-lg shrink-0 shadow-sm">
                {renderIcon(item.type)}
              </div>
              <div>
                <p
                  className={`font-['Inter'] text-xs font-bold ${
                    item.type === 'fuel' ? 'text-[#ba1a1a]' : 'text-[#005a82]'
                  }`}
                >
                  {item.title}
                </p>
                <p className="font-['Inter'] text-xs text-[#0b1c30] mt-0.5">
                  {item.description}
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-[#737686] self-center shrink-0" />
          </li>
        ))}
      </ul>
    </div>
  );
};
