import React from 'react';
import { Outlet } from 'react-router-dom';
import { Truck } from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-border bg-card flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Truck className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="block text-sm font-bold tracking-tight text-foreground leading-none">
              FleetCore
            </span>
            <span className="block text-xs text-muted-foreground leading-none mt-0.5">
              Fleet Management
            </span>
          </div>
        </div>

        {/* Nav placeholder — populated in SPEC-084+ */}
        <nav className="flex-1 px-4 py-4" aria-label="Sidebar navigation" />
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-6">
          <div />
          <div className="flex items-center gap-3" />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
