import React, { useState } from 'react';
import { GlobalSearchOverlay } from '@/components/search';
import { Search, Truck, Users, FileText, Wrench, Fuel, MapPin } from 'lucide-react';

export const FleetManagerSearchPage: React.FC = () => {
  const [overlayOpen, setOverlayOpen] = useState(true);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Search className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Operational Fleet Search
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Search across vehicles, drivers, trips, fuel logs, maintenance work orders, live GPS telemetry, documents, and reports.
            </p>
          </div>
        </div>

        <button
          onClick={() => setOverlayOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-primary/90 transition-all shrink-0"
        >
          <Search className="h-4 w-4" /> Open Search Modal (Ctrl + K)
        </button>
      </div>

      {/* Main Search Quick Operational Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => setOverlayOpen(true)}
          className="group rounded-2xl border border-border bg-card p-6 shadow-sm hover:border-primary/40 cursor-pointer transition-all space-y-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
            <Truck className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">
            Vehicles & Fleet Assets
          </h3>
          <p className="text-xs text-muted-foreground">
            Locate vehicles by registration plate, VIN, model, make, or status.
          </p>
        </div>

        <div
          onClick={() => setOverlayOpen(true)}
          className="group rounded-2xl border border-border bg-card p-6 shadow-sm hover:border-primary/40 cursor-pointer transition-all space-y-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
            <Users className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">
            Drivers & Duty Personnel
          </h3>
          <p className="text-xs text-muted-foreground">
            Find active drivers, CDL licenses, contact numbers, and duty rosters.
          </p>
        </div>

        <div
          onClick={() => setOverlayOpen(true)}
          className="group rounded-2xl border border-border bg-card p-6 shadow-sm hover:border-primary/40 cursor-pointer transition-all space-y-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
            <Wrench className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">
            Maintenance & Repairs
          </h3>
          <p className="text-xs text-muted-foreground">
            Search work orders, service histories, repair bay logs, and technician notes.
          </p>
        </div>

        <div
          onClick={() => setOverlayOpen(true)}
          className="group rounded-2xl border border-border bg-card p-6 shadow-sm hover:border-primary/40 cursor-pointer transition-all space-y-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600">
            <Fuel className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">
            Fuel Refuel Logs
          </h3>
          <p className="text-xs text-muted-foreground">
            Lookup fuel card receipts, refuel transactions, and MPG efficiency logs.
          </p>
        </div>

        <div
          onClick={() => setOverlayOpen(true)}
          className="group rounded-2xl border border-border bg-card p-6 shadow-sm hover:border-primary/40 cursor-pointer transition-all space-y-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600">
            <MapPin className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">
            GPS Live Telemetry
          </h3>
          <p className="text-xs text-muted-foreground">
            Search active trip dispatches, waypoint locations, and geofence alerts.
          </p>
        </div>

        <div
          onClick={() => setOverlayOpen(true)}
          className="group rounded-2xl border border-border bg-card p-6 shadow-sm hover:border-primary/40 cursor-pointer transition-all space-y-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600">
            <FileText className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">
            Documents & Reports
          </h3>
          <p className="text-xs text-muted-foreground">
            Search invoices, registration permits, waybills, and operational reports.
          </p>
        </div>
      </div>

      <GlobalSearchOverlay open={overlayOpen} onClose={() => setOverlayOpen(false)} />
    </div>
  );
};

export default FleetManagerSearchPage;
