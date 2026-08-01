import React from 'react';
import { Outlet } from 'react-router-dom';
import { Truck } from 'lucide-react';

export const RootLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border bg-card p-4">
        <div className="container mx-auto flex items-center gap-2">
          <Truck className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold tracking-tight">FleetCore Platform</h1>
        </div>
      </header>
      <main className="flex-1 container mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
};
