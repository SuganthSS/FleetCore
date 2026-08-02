import React from 'react';
import { Truck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-2xl">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg">
            <Truck className="h-7 w-7 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">FleetCore</h1>
            <p className="text-sm text-muted-foreground mt-1">Fleet Management Platform</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-muted/40 p-4 text-center text-sm text-muted-foreground">
            Login form — coming in SPEC-084
          </div>
        </div>
      </div>
    </div>
  );
};
