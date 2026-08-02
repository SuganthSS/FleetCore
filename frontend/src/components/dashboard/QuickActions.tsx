import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Users, Map, Package, Wrench, Fuel } from 'lucide-react';

interface QuickActionItem {
  title: string;
  description: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const actions: QuickActionItem[] = [
  {
    title: 'Vehicles',
    description: 'Manage fleet assets',
    path: '/vehicles',
    icon: Truck,
    color: 'hover:border-orange-500 hover:bg-orange-500/5 hover:text-orange-500',
  },
  {
    title: 'Drivers',
    description: 'Manage dispatcher availability',
    path: '/drivers',
    icon: Users,
    color: 'hover:border-blue-500 hover:bg-blue-500/5 hover:text-blue-500',
  },
  {
    title: 'Trips',
    description: 'Schedule & route dispatches',
    path: '/trips',
    icon: Map,
    color: 'hover:border-emerald-500 hover:bg-emerald-500/5 hover:text-emerald-500',
  },
  {
    title: 'Shipments',
    description: 'Track cargo orders',
    path: '/shipments',
    icon: Package,
    color: 'hover:border-amber-500 hover:bg-amber-500/5 hover:text-amber-500',
  },
  {
    title: 'Maintenance',
    description: 'Schedule vehicle checks',
    path: '/maintenance',
    icon: Wrench,
    color: 'hover:border-purple-500 hover:bg-purple-500/5 hover:text-purple-500',
  },
  {
    title: 'Fuel Logs',
    description: 'Log and monitor costs',
    path: '/fuel',
    icon: Fuel,
    color: 'hover:border-rose-500 hover:bg-rose-500/5 hover:text-rose-500',
  },
];

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h2 className="text-base font-bold tracking-tight text-foreground">
          Quick Actions
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {actions.map((action, idx) => {
          const IconComponent = action.icon;
          return (
            <button
              key={idx}
              onClick={() => navigate(action.path)}
              className={`flex flex-col items-center justify-center p-4 border border-border rounded-xl bg-card transition-all duration-200 text-center text-muted-foreground ${action.color} hover:scale-102 hover:shadow-sm`}
            >
              <div className="mb-2 p-2 rounded-lg bg-muted/40 transition-colors">
                <IconComponent className="h-5 w-5" />
              </div>
              <span className="block text-xs font-bold text-foreground">
                {action.title}
              </span>
              <span className="block text-[10px] text-muted-foreground mt-0.5 max-w-[120px] truncate">
                {action.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
