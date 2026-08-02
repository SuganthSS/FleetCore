import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import {
  Truck,
  LayoutDashboard,
  Users,
  Map,
  Package,
  Wrench,
  Fuel,
  Building,
  Compass,
  Navigation,
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Vehicles', path: '/vehicles', icon: Truck },
  { name: 'Drivers', path: '/drivers', icon: Users },
  { name: 'Customers', path: '/customers', icon: Building },
  { name: 'Trips', path: '/trips', icon: Map },
  { name: 'Shipments', path: '/shipments', icon: Package },
  { name: 'Routes', path: '/routes', icon: Compass },
  { name: 'Maintenance', path: '/maintenance', icon: Wrench },
  { name: 'Fuel Logs', path: '/fuel', icon: Fuel },
  { name: 'GPS Tracking', path: '/tracking', icon: Navigation },
];




export const DashboardLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-border bg-card flex flex-col">
        {/* Logo Section */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-sm shadow-primary/20 animate-pulse">
            <Truck className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="block text-sm font-bold tracking-tight text-foreground leading-none">
              FleetCore
            </span>
            <span className="block text-[10px] text-muted-foreground uppercase tracking-wider leading-none mt-1">
              Fleet Management
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto" aria-label="Sidebar navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all duration-150',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )
                }
              >
                <Icon className="h-4.5 w-4.5" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Content Wrapper */}
        <main className="flex-1 overflow-y-auto p-8 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
