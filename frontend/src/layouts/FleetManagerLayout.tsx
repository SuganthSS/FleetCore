import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  Truck,
  LayoutDashboard,
  Users,
  Map,
  Wrench,
  Fuel,
  Navigation,
  Bell,
  TrendingUp,
  FileText,
  Settings,
  Sparkles,
  Search,
  User,
  LogOut,
  Shield,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuth } from '@/hooks/useAuth';

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

const fleetManagerNavItems: NavItem[] = [
  { name: 'Dashboard', path: '/fleet-manager/dashboard', icon: LayoutDashboard },
  { name: 'Vehicles', path: '/fleet-manager/vehicles', icon: Truck },
  { name: 'Drivers', path: '/fleet-manager/drivers', icon: Users },
  { name: 'Trips', path: '/fleet-manager/trips', icon: Map },
  { name: 'Fuel Logs', path: '/fleet-manager/fuel', icon: Fuel },
  { name: 'Maintenance', path: '/fleet-manager/maintenance', icon: Wrench },
  { name: 'GPS Tracking', path: '/fleet-manager/tracking', icon: Navigation },
  { name: 'Documents', path: '/fleet-manager/documents', icon: FileText },
  { name: 'Notifications', path: '/fleet-manager/notifications', icon: Bell },
  { name: 'Analytics', path: '/fleet-manager/analytics', icon: TrendingUp },
  { name: 'AI Insights', path: '/fleet-manager/ai', icon: Sparkles },
  { name: 'Reports', path: '/fleet-manager/reports', icon: FileText },
  { name: 'Global Search', path: '/fleet-manager/search', icon: Search },
  { name: 'My Profile', path: '/fleet-manager/profile', icon: User },
  { name: 'Settings', path: '/fleet-manager/settings', icon: Settings },
];

export const FleetManagerLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-[#f7f9fb] text-[#191c1e]">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-[#c3c6d7]/40 bg-white flex flex-col shadow-sm">
        {/* Logo & Portal Badge */}
        <div className="flex flex-col px-6 py-5 border-b border-[#c3c6d7]/30 bg-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2563eb] shadow-md shadow-[#2563eb]/25">
              <Truck className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="block text-base font-bold tracking-tight text-[#191c1e] font-['Plus_Jakarta_Sans']">
                FleetCore
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#2563eb]/10 text-[#2563eb]">
                  <Shield className="w-2.5 h-2.5" /> Fleet Manager
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Operational Navigation */}
        <nav className="flex-1 px-3.5 py-5 space-y-1 overflow-y-auto" aria-label="Fleet Manager Sidebar Navigation">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-[#737686]">
            Operations Portal
          </div>
          {fleetManagerNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                    isActive
                      ? 'bg-[#2563eb] text-white shadow-sm shadow-[#2563eb]/30 font-semibold'
                      : 'text-[#434655] hover:bg-[#eceef0] hover:text-[#191c1e]'
                  )
                }
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Info & Logout Footer */}
        <div className="p-4 border-t border-[#c3c6d7]/30 bg-[#f7f9fb]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-9 w-9 rounded-full bg-[#2563eb]/10 border border-[#2563eb]/20 flex items-center justify-center font-bold text-sm text-[#2563eb]">
                {user?.firstName?.charAt(0) || 'F'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#191c1e] truncate">
                  {user ? `${user.firstName} ${user.lastName}` : 'Fleet Manager'}
                </p>
                <p className="text-[10px] text-[#737686] truncate">{user?.email || 'manager@fleetcore.com'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Log out"
              className="p-1.5 rounded-lg text-[#737686] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
