import React from 'react';
import { ShieldAlert, UserCheck, Wrench, Navigation, Clock } from 'lucide-react';

export interface ActivityLogItem {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  type: 'audit' | 'user' | 'maintenance' | 'trip';
}

interface RecentActivityProps {
  activities?: ActivityLogItem[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  const defaultActivities: ActivityLogItem[] = [
    {
      id: '1',
      action: 'System Administrator updated enterprise security policy',
      user: 'FleetCore Administrator',
      timestamp: '10 mins ago',
      type: 'audit',
    },
    {
      id: '2',
      action: 'Assigned Driver Marcus Vance to Route #7B',
      user: 'Dispatcher Conner',
      timestamp: '25 mins ago',
      type: 'trip',
    },
    {
      id: '3',
      action: 'Logged maintenance work order #WO-998',
      user: 'Maintenance Manager Miller',
      timestamp: '1 hour ago',
      type: 'maintenance',
    },
    {
      id: '4',
      action: 'New driver onboarded & credentials verified',
      user: 'Fleet Manager Vance',
      timestamp: '2 hours ago',
      type: 'user',
    },
  ];

  const items = activities && activities.length > 0 ? activities : defaultActivities;

  const renderIcon = (type: ActivityLogItem['type']) => {
    switch (type) {
      case 'audit':
        return <ShieldAlert className="h-4 w-4 text-[#004ac6]" />;
      case 'user':
        return <UserCheck className="h-4 w-4 text-emerald-600" />;
      case 'maintenance':
        return <Wrench className="h-4 w-4 text-amber-600" />;
      case 'trip':
        return <Navigation className="h-4 w-4 text-purple-600" />;
    }
  };

  return (
    <div className="bg-white border border-[#c3c6d7] rounded-2xl shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] p-5 hover:translate-y-[-2px] hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#0b1c30]">
          Recent User Activity & Audit Logs
        </h3>
        <span className="text-xs font-medium font-['Inter'] text-[#737686] flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" /> Real-time
        </span>
      </div>

      <div className="relative pl-4 border-l-2 border-[#e5eeff] space-y-4">
        {items.map((item) => (
          <div key={item.id} className="relative group">
            <div className="absolute -left-[23px] top-0.5 bg-white p-1 rounded-full border border-[#c3c6d7] shadow-xs group-hover:scale-110 transition-transform">
              {renderIcon(item.type)}
            </div>
            <div>
              <p className="font-['Inter'] text-xs font-semibold text-[#0b1c30]">
                {item.action}
              </p>
              <div className="flex items-center gap-2 mt-1 font-['Inter'] text-[11px] text-[#434655]">
                <span>{item.user}</span>
                <span>•</span>
                <span className="text-[#737686]">{item.timestamp}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
