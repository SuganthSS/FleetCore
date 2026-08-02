import React, { useState } from 'react';
import { Bell, Search, LogOut, User, Settings, Sun, Moon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';

interface DashboardHeaderProps {
  unreadNotificationsCount?: number;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  unreadNotificationsCount = 0,
}) => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const initials = user
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
    : 'U';

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-border mb-6">
      {/* Greeting & Date */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
          Hello, {user?.firstName || 'User'}
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">{today}</p>
      </div>

      {/* Actions (Search, Theme, Notifications, Avatar) */}
      <div className="flex items-center gap-3 self-end md:self-auto">
        {/* Search Input (UI Only) */}
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search shipments, vehicles..."
            className="h-10 w-64 rounded-lg border border-input bg-card pl-9 pr-4 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="h-4.5 w-4.5 text-amber-500 animate-fade-in" />
          ) : (
            <Moon className="h-4.5 w-4.5 animate-fade-in" />
          )}
        </button>

        {/* Notifications (UI Only) */}
        <button
          className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-4.5 w-4.5" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white ring-2 ring-background">
              {unreadNotificationsCount}
            </span>
          )}
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-border hidden sm:block" />

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-lg border border-border bg-card p-1.5 pr-3 hover:bg-muted/50 transition-colors focus:outline-none"
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-xs font-bold text-white">
              {initials}
            </div>
            <div className="text-left hidden sm:block">
              <span className="block text-xs font-semibold text-foreground leading-none">
                {user?.firstName} {user?.lastName}
              </span>
              <span className="block text-[10px] text-muted-foreground mt-0.5 leading-none">
                {user?.roleName || 'Staff'}
              </span>
            </div>
          </button>

          {dropdownOpen && (
            <>
              {/* Overlay Backdrop to close */}
              <div
                className="fixed inset-0 z-20 cursor-default"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-48 rounded-lg border border-border bg-card p-1 shadow-md z-30 animate-fade-in">
                <div className="px-3 py-2 border-b border-border text-xs text-muted-foreground">
                  Logged in as <span className="font-semibold text-foreground">{user?.email}</span>
                </div>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    // Profile action placeholder
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors text-left"
                >
                  <User className="h-4 w-4 text-muted-foreground" />
                  My Profile
                </button>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    // Settings action placeholder
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors text-left"
                >
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  Settings
                </button>
                <div className="h-px bg-border my-1" />
                <button
                  onClick={async () => {
                    setDropdownOpen(false);
                    await logout();
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors text-left"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
