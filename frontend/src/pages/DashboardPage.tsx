import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Truck,
  Users,
  MapPin,
  Package,
  Wrench,
  Fuel,
  TrendingUp,
  Bell,
} from 'lucide-react';
import { dashboardService } from '@/services/dashboard.service';
import { ErrorState } from '@/components/ui';
import {
  DashboardHeader,
  StatCard,
  FleetOverviewCard,
  OperationsCard,
  ActivityTimeline,
  QuickActions,
  DashboardSkeleton,
} from '@/components/dashboard';

export const DashboardPage: React.FC = () => {
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
      <div className="py-10">
        <ErrorState
          title="Failed to Load Dashboard"
          description={
            error instanceof Error
              ? error.message
              : 'An unexpected error occurred while fetching dashboard statistics.'
          }
          onRetry={() => void refetch()}
        />
      </div>
    );
  }

  // Format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <DashboardHeader unreadNotificationsCount={data.notifications.unread} />

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Vehicles"
          value={data.fleet.totalVehicles}
          icon={Truck}
          accentColor="orange"
        />
        <StatCard
          title="Active Drivers"
          value={data.drivers.activeDrivers}
          icon={Users}
          accentColor="blue"
        />
        <StatCard
          title="Active Trips"
          value={data.trips.active}
          icon={MapPin}
          accentColor="green"
        />
        <StatCard
          title="Total Shipments"
          value={data.shipments.totalShipments}
          icon={Package}
          accentColor="amber"
        />
        <StatCard
          title="Maintenance In-Progress"
          value={data.maintenance.inProgress}
          icon={Wrench}
          accentColor="purple"
        />
        <StatCard
          title="Total Fuel Cost"
          value={formatCurrency(data.fuel.totalFuelCost)}
          icon={Fuel}
          accentColor="rose"
        />
        <StatCard
          title="Active Customers"
          value={data.customers.activeCustomers}
          icon={TrendingUp}
          accentColor="cyan"
        />
        <StatCard
          title="Unread Alerts"
          value={data.notifications.unread}
          icon={Bell}
          accentColor="red"
        />
      </div>

      {/* Fleet Overview & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <FleetOverviewCard
            total={data.fleet.totalVehicles}
            active={data.fleet.activeVehicles}
            inactive={data.fleet.inactiveVehicles}
            maintenance={data.fleet.maintenanceVehicles}
          />
        </div>
        <div className="lg:col-span-4">
          <QuickActions />
        </div>
      </div>

      {/* Operations Summary */}
      <div className="space-y-4">
        <div className="border-b border-border pb-2">
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            Operations Summary
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Key indicators for active operations across modules
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Trips Summary */}
          <OperationsCard
            title="Trips Status"
            mainLabel="Total Trips"
            mainValue={data.trips.totalTrips}
            items={[
              { label: 'Planned / Scheduled', value: data.trips.planned, badge: 'Scheduled', badgeVariant: 'info' },
              { label: 'Active Transit', value: data.trips.active, badge: 'In Transit', badgeVariant: 'warning' },
              { label: 'Completed successfully', value: data.trips.completed, badge: 'Success', badgeVariant: 'success' },
              { label: 'Cancelled / Failed', value: data.trips.cancelled, badge: 'Failed', badgeVariant: 'error' },
            ]}
          />

          {/* Shipments Summary */}
          <OperationsCard
            title="Shipments Status"
            mainLabel="Total Cargo Orders"
            mainValue={data.shipments.totalShipments}
            items={[
              { label: 'Pending Dispatch', value: data.shipments.pending, badge: 'Pending', badgeVariant: 'info' },
              { label: 'In-Transit Status', value: data.shipments.inTransit, badge: 'In-Transit', badgeVariant: 'warning' },
              { label: 'Delivered Packages', value: data.shipments.delivered, badge: 'Delivered', badgeVariant: 'success' },
              { label: 'Cancelled/Failed Orders', value: data.shipments.cancelled, badge: 'Cancelled', badgeVariant: 'error' },
            ]}
          />

          {/* Maintenance Summary */}
          <OperationsCard
            title="Maintenance Overview"
            mainLabel="Total Service Records"
            mainValue={data.maintenance.totalRecords}
            items={[
              { label: 'Scheduled Service', value: data.maintenance.scheduled, badge: 'Scheduled', badgeVariant: 'info' },
              { label: 'In Progress Checks', value: data.maintenance.inProgress, badge: 'Active', badgeVariant: 'warning' },
              { label: 'Completed Checks', value: data.maintenance.completed, badge: 'Done', badgeVariant: 'success' },
              { label: 'Overdue Maintenance', value: data.maintenance.overdue, badge: 'Overdue', badgeVariant: 'error' },
            ]}
          />

          {/* Fuel Consumption */}
          <OperationsCard
            title="Fuel Tracking"
            mainLabel="Total Expenses"
            mainValue={formatCurrency(data.fuel.totalFuelCost)}
            items={[
              { label: 'Fuel Records logged', value: data.fuel.totalRecords },
              { label: 'Total fuel consumed', value: `${data.fuel.totalFuelConsumed.toLocaleString()} L` },
              { label: 'Avg cost per log', value: data.fuel.totalRecords > 0 ? formatCurrency(data.fuel.totalFuelCost / data.fuel.totalRecords) : '$0' },
            ]}
          />
        </div>
      </div>

      {/* Activity Logs (Empty State) */}
      <ActivityTimeline />
    </div>
  );
};
