import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Truck,
  Users,
  Compass,
  Package,
  DollarSign,
  Fuel,
  Wrench,
  Bell,
  Gauge,
  TrendingUp,
  Activity,
  CheckCircle,
  Zap,
} from 'lucide-react';
import { dashboardService } from '@/services/dashboard.service';
import { ErrorState, EmptyState } from '@/components/ui';
import {
  AnalyticsHeader,
  AnalyticsKPI,
  AnalyticsCard,
  FleetStatusChart,
  TripChart,
  ShipmentChart,
  FuelChart,
  MaintenanceChart,
  AnalyticsSkeleton,
} from '@/components/analytics';

export const AnalyticsPage: React.FC = () => {
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['analyticsDashboardOverview'],
    queryFn: async () => {
      const response = await dashboardService.getOverview();
      return response.data;
    },
  });

  const handleRefresh = async () => {
    await refetch();
  };

  if (isLoading && !data) {
    return <AnalyticsSkeleton />;
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load Fleet Analytics"
        description={error instanceof Error ? error.message : 'An unexpected error occurred while fetching analytics metrics.'}
        onRetry={handleRefresh}
      />
    );
  }

  if (!data) {
    return (
      <EmptyState
        title="No Analytics Data Available"
        description="We couldn't compile fleet stats. Add vehicles, drivers, or trips to enable analysis."
        action={
          <button
            onClick={handleRefresh}
            className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-primary/95"
          >
            Retry Fetching
          </button>
        }
      />
    );
  }

  // Calculated operational insights
  const fleetUtilization = data.fleet.totalVehicles
    ? (data.fleet.activeVehicles / data.fleet.totalVehicles) * 100
    : 0;

  const driverAvailability = data.drivers.totalDrivers
    ? (data.drivers.activeDrivers / data.drivers.totalDrivers) * 100
    : 0;

  const deliverySuccessRate = data.shipments.totalShipments
    ? (data.shipments.delivered / data.shipments.totalShipments) * 100
    : 0;

  const maintenanceRatio = data.maintenance.totalRecords
    ? (data.maintenance.completed / data.maintenance.totalRecords) * 100
    : 0;

  const fuelCostPerGallon = data.fuel.totalFuelConsumed
    ? data.fuel.totalFuelCost / data.fuel.totalFuelConsumed
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <AnalyticsHeader onRefresh={handleRefresh} isRefreshing={isFetching} />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AnalyticsKPI
          title="Fleet Size"
          value={data.fleet.totalVehicles}
          icon={Truck}
          color="blue"
        />
        <AnalyticsKPI
          title="Active Drivers"
          value={data.drivers.activeDrivers}
          icon={Users}
          color="emerald"
        />
        <AnalyticsKPI
          title="Trips Completed"
          value={data.trips.completed}
          icon={Compass}
          color="purple"
        />
        <AnalyticsKPI
          title="Shipments Delivered"
          value={data.shipments.delivered}
          icon={Package}
          color="orange"
        />
        <AnalyticsKPI
          title="Fuel Cost"
          value={data.fuel.totalFuelCost}
          icon={DollarSign}
          format="currency"
          color="orange"
        />
        <AnalyticsKPI
          title="Fuel Consumed"
          value={data.fuel.totalFuelConsumed}
          icon={Fuel}
          color="blue"
        />
        <AnalyticsKPI
          title="Maintenance Jobs"
          value={data.maintenance.totalRecords}
          icon={Wrench}
          color="rose"
        />
        <AnalyticsKPI
          title="Unread Alerts"
          value={data.notifications.unread}
          icon={Bell}
          color={data.notifications.unread > 0 ? 'rose' : 'slate'}
        />
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AnalyticsCard
          title="Fleet Status distribution"
          subtitle="Proportion of vehicles active, inactive, or in maintenance."
        >
          <FleetStatusChart
            data={{
              active: data.fleet.activeVehicles,
              inactive: data.fleet.inactiveVehicles,
              maintenance: data.fleet.maintenanceVehicles,
            }}
          />
        </AnalyticsCard>

        <AnalyticsCard
          title="Trip Status breakdown"
          subtitle="Quantity of trips in planned, active, completed, or cancelled phases."
        >
          <TripChart
            data={{
              planned: data.trips.planned,
              active: data.trips.active,
              completed: data.trips.completed,
              cancelled: data.trips.cancelled,
            }}
          />
        </AnalyticsCard>

        <AnalyticsCard
          title="Shipment Delivery stats"
          subtitle="Donut layout of shipment workflow lifecycle states."
        >
          <ShipmentChart
            data={{
              pending: data.shipments.pending,
              inTransit: data.shipments.inTransit,
              delivered: data.shipments.delivered,
              cancelled: data.shipments.cancelled,
            }}
          />
        </AnalyticsCard>
      </div>

      {/* Secondary Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsCard
          title="Fuel Efficiency Trends"
          subtitle="6-Month cost ($) vs consumption (Gal) business scaling indicator."
        >
          <FuelChart
            data={{
              totalFuelConsumed: data.fuel.totalFuelConsumed,
              totalFuelCost: data.fuel.totalFuelCost,
            }}
          />
        </AnalyticsCard>

        <AnalyticsCard
          title="Maintenance Status distribution"
          subtitle="Horizontal breakdown of scheduled, active, and completed maintenance."
        >
          <MaintenanceChart
            data={{
              scheduled: data.maintenance.scheduled,
              inProgress: data.maintenance.inProgress,
              completed: data.maintenance.completed,
              overdue: data.maintenance.overdue,
            }}
          />
        </AnalyticsCard>
      </div>

      {/* Executive Insights Cards Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider text-left">
          Operational Executive Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Card 1: Fleet Utilization */}
          <div className="rounded-xl border border-border bg-card p-4 text-left space-y-2 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                <Gauge className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold text-foreground">Fleet Utilization</span>
            </div>
            <div className="text-2xl font-extrabold text-foreground mt-1">
              {fleetUtilization.toFixed(1)}%
            </div>
            <p className="text-[10px] text-muted-foreground leading-normal font-medium">
              Ratio of active fleet vehicles currently in operation vs total owned assets.
            </p>
          </div>

          {/* Card 2: Driver Availability */}
          <div className="rounded-xl border border-border bg-card p-4 text-left space-y-2 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                <Activity className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold text-foreground">Driver Availability</span>
            </div>
            <div className="text-2xl font-extrabold text-foreground mt-1">
              {driverAvailability.toFixed(1)}%
            </div>
            <p className="text-[10px] text-muted-foreground leading-normal font-medium">
              Percentage of driver staff actively assigned to ongoing trips and routes.
            </p>
          </div>

          {/* Card 3: Delivery Success Rate */}
          <div className="rounded-xl border border-border bg-card p-4 text-left space-y-2 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                <CheckCircle className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold text-foreground">Delivery Success</span>
            </div>
            <div className="text-2xl font-extrabold text-foreground mt-1">
              {deliverySuccessRate.toFixed(1)}%
            </div>
            <p className="text-[10px] text-muted-foreground leading-normal font-medium">
              Rate of shipments successfully delivered compared to total logged shipments.
            </p>
          </div>

          {/* Card 4: Maintenance Ratio */}
          <div className="rounded-xl border border-border bg-card p-4 text-left space-y-2 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-500">
                <Zap className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold text-foreground">Maintenance Ratio</span>
            </div>
            <div className="text-2xl font-extrabold text-foreground mt-1">
              {maintenanceRatio.toFixed(1)}%
            </div>
            <p className="text-[10px] text-muted-foreground leading-normal font-medium">
              Proportion of maintenance work orders successfully resolved and closed.
            </p>
          </div>

          {/* Card 5: Fuel Efficiency */}
          <div className="rounded-xl border border-border bg-card p-4 text-left space-y-2 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-500">
                <TrendingUp className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold text-foreground">Fuel Cost Metric</span>
            </div>
            <div className="text-2xl font-extrabold text-foreground mt-1">
              ${fuelCostPerGallon.toFixed(2)}/G
            </div>
            <p className="text-[10px] text-muted-foreground leading-normal font-medium">
              Average fuel purchase cost per gallon normalized across all logged operations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AnalyticsPage;
