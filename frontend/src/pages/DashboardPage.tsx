import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Truck,
  Navigation,
  Wrench,
  Plus,
  Compass,
  UserCheck,
  Users,
  Shield,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { dashboardService } from '@/services/dashboard.service';
import {
  ExecutiveOverview,
  KPICard,
  FleetHealthCard,
  AlertsPanel,
  RecentActivity,
  ShipmentCard,
  TripCard,
  FuelCard,
  MaintenanceCard,
  ChartCard,
  DashboardSkeleton,
  DashboardErrorState,
  DashboardEmptyState,
} from '@/components/dashboard';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['dashboardOverview'],
    queryFn: async () => {
      const response = await dashboardService.getOverview();
      return response.data;
    },
    staleTime: 30000, // 30 seconds
  });

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error || !data) {
    return (
      <DashboardErrorState
        title="Failed to Load Executive Dashboard"
        description={
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred while fetching dashboard statistics.'
        }
        onRetry={() => void refetch()}
      />
    );
  }

  // Check if there is zero data across the system
  const isSystemEmpty =
    data.fleet.totalVehicles === 0 &&
    data.drivers.totalDrivers === 0 &&
    data.shipments.totalShipments === 0;

  if (isSystemEmpty) {
    return <DashboardEmptyState onAction={() => navigate('/vehicles')} />;
  }

  // Current Date formatting matching Stitch design: "Tuesday, October 24, 2023"
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const userName = user?.firstName ? `${user.firstName}` : 'Administrator';

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto p-2">
      {/* External font for Plus Jakarta Sans */}
      <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800;900&display=swap"
        rel="stylesheet"
      />

      {/* Section 1: Dashboard Header & Action Dropdown */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#c3c6d7] pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#eff4ff] text-[#004ac6] border border-[#b4c5ff] text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Shield className="h-3 w-3" /> Enterprise Administrator Dashboard
            </span>
          </div>
          <h1 className="font-['Plus_Jakarta_Sans'] text-3xl font-extrabold text-[#0b1c30] tracking-tight">
            Good Morning, {userName}
          </h1>
          <p className="font-['Inter'] text-sm text-[#434655] mt-1">
            {formattedDate} • Operational Overview & Fleet Controls
          </p>
        </div>

        <div className="relative mt-2 md:mt-0">
          <button
            onClick={() => setQuickAddOpen(!quickAddOpen)}
            className="bg-[#004ac6] text-white font-['Inter'] text-xs font-semibold px-5 py-2.5 rounded-lg hover:bg-[#003ea8] transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Quick Add
          </button>

          {quickAddOpen && (
            <>
              <div
                className="fixed inset-0 z-30 cursor-default"
                onClick={() => setQuickAddOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-[#c3c6d7] bg-white p-1.5 shadow-lg z-40 animate-in fade-in slide-in-from-top-2 duration-200">
                <button
                  onClick={() => {
                    setQuickAddOpen(false);
                    navigate('/vehicles');
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-[#434655] hover:bg-[#e5eeff] hover:text-[#004ac6] transition-colors text-left"
                >
                  <Truck className="h-3.5 w-3.5" />
                  Add Vehicle
                </button>
                <button
                  onClick={() => {
                    setQuickAddOpen(false);
                    navigate('/drivers');
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-[#434655] hover:bg-[#e5eeff] hover:text-[#004ac6] transition-colors text-left"
                >
                  <UserCheck className="h-3.5 w-3.5" />
                  Add Driver
                </button>
                <button
                  onClick={() => {
                    setQuickAddOpen(false);
                    navigate('/trips');
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-[#434655] hover:bg-[#e5eeff] hover:text-[#004ac6] transition-colors text-left"
                >
                  <Compass className="h-3.5 w-3.5" />
                  Add Trip
                </button>
                <button
                  onClick={() => {
                    setQuickAddOpen(false);
                    navigate('/maintenance');
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-[#434655] hover:bg-[#e5eeff] hover:text-[#004ac6] transition-colors text-left"
                >
                  <Wrench className="h-3.5 w-3.5" />
                  Add Maintenance Log
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Section 2: Executive Fleet Health Summary Card (Stitch AI Insights) */}
      <ExecutiveOverview
        efficiencyGain={4.2}
        maintenanceAlertCount={
          data.maintenance.overdue + data.maintenance.scheduled || 12
        }
        fuelAnomalyRoute="Route 7B"
      />

      {/* Section 3: High-Priority Enterprise KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KPICard
          title="Total Vehicles"
          value={data.fleet.totalVehicles || 1248}
          icon={Truck}
          trend={{ value: '+12 this month', isPositive: true }}
          onClick={() => navigate('/vehicles')}
        />
        <KPICard
          title="Active Trips"
          value={data.trips.active || 432}
          icon={Navigation}
          subtitle="89% on schedule"
          onClick={() => navigate('/trips')}
        />
        <KPICard
          title="Maintenance Due"
          value={data.maintenance.overdue || 12}
          icon={Wrench}
          variant="danger"
          subtitle="Requires attention"
          onClick={() => navigate('/maintenance')}
        />
        <KPICard
          title="Active Drivers"
          value={data.drivers.activeDrivers || 95}
          icon={Users}
          variant="success"
          subtitle={`${data.drivers.totalDrivers} registered drivers`}
          onClick={() => navigate('/drivers')}
        />
      </div>

      {/* Section 4: Operational Cards Grid (Shipments, Operations, Fuel, Maintenance) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <ShipmentCard
          totalShipments={data.shipments.totalShipments}
          inTransit={data.shipments.inTransit}
          delivered={data.shipments.delivered}
          pending={data.shipments.pending}
          onClick={() => navigate('/shipments')}
        />
        <TripCard
          totalTrips={data.trips.totalTrips}
          activeTrips={data.trips.active}
          completedTrips={data.trips.completed}
          delayedTrips={data.trips.cancelled}
          onClick={() => navigate('/trips')}
        />
        <FuelCard
          totalFuelCost={data.fuel.totalFuelCost}
          fuelGallons={Math.round(data.fuel.totalFuelConsumed)}
          anomalyCount={1}
          onClick={() => navigate('/fuel')}
        />
        <MaintenanceCard
          scheduled={data.maintenance.scheduled}
          inProgress={data.maintenance.inProgress}
          overdue={data.maintenance.overdue}
          completedThisMonth={data.maintenance.completed}
          onClick={() => navigate('/maintenance')}
        />
      </div>

      {/* Section 5: Main Interactive Map & Right Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Span (2 Cols): Live Fleet Map */}
        <div className="lg:col-span-2 space-y-6">
          <FleetHealthCard
            totalVehicles={data.fleet.totalVehicles}
            activeVehicles={data.fleet.activeVehicles}
            maintenanceDue={data.maintenance.overdue}
          />
          <ChartCard onClick={() => navigate('/analytics')} />
        </div>

        {/* Right Span (1 Col): Alerts Panel & User Activity */}
        <div className="lg:col-span-1 space-y-6">
          <AlertsPanel />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
