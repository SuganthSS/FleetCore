import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Truck,
  LayoutDashboard,
  Radio,
  Map,
  Package,
  Navigation,
  Users,
  Activity,
  Bell,
  FileText,
  Sparkles,
  Search,
  User,
  LogOut,
  Shield,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuth } from '@/hooks/useAuth';

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const dispatcherNavItems: NavItem[] = [
  { name: 'Dashboard', path: '/dispatcher/dashboard', icon: LayoutDashboard },
  { name: 'Dispatch Center', path: '/dispatcher/dispatch-center', icon: Radio, badge: 'LIVE' },
  { name: 'Trips', path: '/dispatcher/trips', icon: Map },
  { name: 'Shipments', path: '/dispatcher/shipments', icon: Package },
  { name: 'Routes', path: '/dispatcher/routes', icon: Navigation },
  { name: 'Drivers', path: '/dispatcher/drivers', icon: Users },
  { name: 'Vehicles', path: '/dispatcher/vehicles', icon: Truck },
  { name: 'Live Tracking', path: '/dispatcher/tracking', icon: Activity },
  { name: 'Notifications', path: '/dispatcher/notifications', icon: Bell },
  { name: 'Documents', path: '/dispatcher/documents', icon: FileText },
  { name: 'AI Dispatcher', path: '/dispatcher/ai', icon: Sparkles },
  { name: 'Global Search', path: '/dispatcher/search', icon: Search },
  { name: 'My Profile', path: '/dispatcher/profile', icon: User },
];

export const DispatcherLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Compute Current Breadcrumb label
  const currentNavItem = dispatcherNavItems.find(
    (item) => location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)
  );
  const pageTitle = currentNavItem ? currentNavItem.name : 'Dispatcher Portal';

  return (
    <div className="flex min-h-screen bg-[#f7f9fb] text-[#191c1e] font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 border-r border-[#c3c6d7]/40 bg-white flex-col shadow-sm sticky top-0 h-screen">
        {/* Logo & Portal Badge */}
        <div className="flex flex-col px-6 py-5 border-b border-[#c3c6d7]/30 bg-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2563eb] shadow-md shadow-[#2563eb]/25">
              <Radio className="h-5 w-5 text-white animate-pulse" />
            </div>
            <div>
              <span className="block text-base font-bold tracking-tight text-[#191c1e]">
                FleetCore
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#2563eb]/10 text-[#2563eb]">
                  <Shield className="w-2.5 h-2.5" /> Dispatcher Portal
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dispatch Operations Navigation */}
        <nav className="flex-1 px-3.5 py-4 space-y-1 overflow-y-auto" aria-label="Dispatcher Sidebar Navigation">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-[#737686]">
            Dispatch Operations
          </div>
          {dispatcherNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-150',
                    isActive
                      ? 'bg-[#2563eb] text-white shadow-md shadow-[#2563eb]/25 font-bold'
                      : 'text-[#434655] hover:bg-[#eceef0] hover:text-[#191c1e]'
                  )
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4.5 w-4.5 shrink-0" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded-md text-[9px] font-extrabold bg-[#ef4444] text-white animate-pulse">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Profile & Logout Footer */}
        <div className="p-4 border-t border-[#c3c6d7]/30 bg-[#f7f9fb]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-9 w-9 rounded-full bg-[#2563eb]/10 border border-[#2563eb]/20 flex items-center justify-center font-bold text-sm text-[#2563eb]">
                {user?.firstName?.charAt(0) || 'D'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#191c1e] truncate">
                  {user ? `${user.firstName} ${user.lastName}` : 'Dispatcher User'}
                </p>
                <p className="text-[10px] text-[#737686] truncate">{user?.email || 'dispatcher@fleetcore.com'}</p>
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

      {/* Mobile Sidebar Overlay Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-64 bg-white flex flex-col h-full z-10 shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-[#c3c6d7]/30">
              <div className="flex items-center gap-2">
                <Radio className="h-5 w-5 text-[#2563eb]" />
                <span className="font-bold text-sm text-[#191c1e]">Dispatcher Portal</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              {dispatcherNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors',
                        isActive
                          ? 'bg-[#2563eb] text-white font-bold'
                          : 'text-[#434655] hover:bg-[#eceef0]'
                      )
                    }
                  >
                    <Icon className="h-4.5 w-4.5 shrink-0" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>
            <div className="p-4 border-t border-slate-100 bg-[#f7f9fb]">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Body */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Sticky Header Bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#c3c6d7]/30 bg-white/95 px-4 lg:px-8 backdrop-blur-md">
          {/* Left: Mobile Toggle & Breadcrumbs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              title="Open Navigation Menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-xs font-semibold text-[#737686]">
              <span>Dispatcher</span>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-[#191c1e] font-bold">{pageTitle}</span>
            </div>
          </div>

          {/* Right: Header Controls */}
          <div className="flex items-center gap-3">
            {/* Role Badge Indicator */}
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#2563eb]/10 text-[#2563eb] border border-[#2563eb]/20">
              <span className="h-2 w-2 rounded-full bg-[#2563eb] animate-ping" />
              Dispatcher Control Room
            </span>

            {/* Global Search Shortcut Button */}
            <button
              onClick={() => navigate('/dispatcher/search')}
              className="p-2 rounded-xl text-slate-600 hover:bg-[#eceef0] hover:text-slate-900 transition-colors"
              title="Global Search"
            >
              <Search className="h-4.5 w-4.5" />
            </button>

            {/* Notifications Shortcut */}
            <button
              onClick={() => navigate('/dispatcher/notifications')}
              className="relative p-2 rounded-xl text-slate-600 hover:bg-[#eceef0] hover:text-slate-900 transition-colors"
              title="Dispatcher Alerts"
            >
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
            </button>

            {/* User Profile Menu Indicator */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <button
                onClick={() => navigate('/dispatcher/profile')}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <div className="h-8 w-8 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  {user?.firstName?.charAt(0) || 'D'}
                </div>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DispatcherLayout;
