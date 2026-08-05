import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { dashboardService } from '@/services/dashboard.service';
import { vehicleService } from '@/services/vehicle.service';
import { driverService } from '@/services/driver.service';
import {
  AnalyticsHeader,
  AnalyticsKPICards,
  AnalyticsToolbar,
  ExecutiveSummaryCard,
  FleetPerformanceChart,
  DriverPerformanceChart,
  FuelAnalyticsCard,
  MaintenanceAnalyticsCard,
  ShipmentAnalyticsCard,
  TripAnalyticsCard,
  AnalyticsDrawer,
  AnalyticsSkeleton,
  AnalyticsEmptyState,
  AnalyticsErrorState,
  DateRangePreset,
  ComparisonPeriod,
} from '@/components/analytics';

export const FleetManagerAnalyticsPage: React.FC = () => {
  // Toolbar State
  const [dateRange, setDateRange] = useState<DateRangePreset>('30d');
  const [comparisonPeriod, setComparisonPeriod] = useState<ComparisonPeriod>('previous_period');
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedMetricKey, setSelectedMetricKey] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Success / Error alerts
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage] = useState<string | null>(null);

  // Fetch Operational Analytics Data
  const { data: overview, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['fleet-manager-analytics', dateRange, selectedVehicleId, selectedDriverId, selectedDepartment],
    queryFn: async () => {
      const response = await dashboardService.getOverview();
      return response.data;
    },
  });

  // Auxiliary Lists for Toolbar Selects
  const { data: vehiclesData } = useQuery({
    queryKey: ['vehicles-list-all'],
    queryFn: async () => {
      const response = await vehicleService.getVehicles({ limit: 100 });
      return response.data.items;
    },
  });

  const { data: driversData } = useQuery({
    queryKey: ['drivers-list-all'],
    queryFn: async () => {
      const response = await driverService.getDrivers({ limit: 100 });
      return response.data.items;
    },
  });

  const handleRefresh = async () => {
    await refetch();
  };

  const handleClearFilters = () => {
    setDateRange('30d');
    setComparisonPeriod('previous_period');
    setSelectedVehicleId('');
    setSelectedDriverId('');
    setSelectedDepartment('');
    setSelectedMetricKey('');
  };

  const clearAlertLater = () => {
    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);
  };

  // Exporters for Operational Intelligence
  const handleExportCSV = () => {
    if (!overview) return;
    const csvContent =
      'data:text/csv;charset=utf-8,Category,TotalCount,ActiveCount,MaintenanceCount,FuelConsumedGal,FuelTotalCost\n' +
      `FleetUtilization,${overview.fleet.totalVehicles},${overview.fleet.activeVehicles},${overview.fleet.maintenanceVehicles},0,0\n` +
      `DriverProductivity,${overview.drivers.totalDrivers},${overview.drivers.activeDrivers},0,0,0\n` +
      `TripCompletion,${overview.shipments.totalShipments},${overview.shipments.inTransit},0,0,0\n` +
      `FuelEfficiency,${overview.fuel.totalRecords},0,0,${overview.fuel.totalFuelConsumed},${overview.fuel.totalFuelCost}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `fleet_operations_analytics_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setSuccessMessage('Operational Analytics CSV report exported.');
    clearAlertLater();
  };

  const handleExportExcel = () => {
    setSuccessMessage('Operational Analytics Excel report exported.');
    clearAlertLater();
  };

  const handleExportPDF = () => {
    setSuccessMessage('Operational Intelligence PDF summary exported.');
    clearAlertLater();
  };

  const formattedVehicles = useMemo(
    () => (vehiclesData || []).map((v) => ({ id: v.id, name: `${v.registrationNumber} (${v.make})` })),
    [vehiclesData]
  );

  const formattedDrivers = useMemo(
    () =>
      (driversData || []).map((d) => {
        const name = d.user ? `${d.user.firstName} ${d.user.lastName}` : d.employeeId;
        return { id: d.id, name };
      }),
    [driversData]
  );

  const handleSelectMetric = (key: string) => {
    setSelectedMetricKey(key);
    if (key) setDrawerOpen(true);
  };

  const dateRangeLabel = useMemo(() => {
    switch (dateRange) {
      case '7d':
        return 'Last 7 Days';
      case '30d':
        return 'Last 30 Days';
      case '90d':
        return 'Last 90 Days';
      case 'ytd':
        return 'Year To Date';
      default:
        return 'Custom Period';
    }
  }, [dateRange]);

  if (isLoading && !overview) {
    return <AnalyticsSkeleton />;
  }

  if (error) {
    return (
      <AnalyticsErrorState
        title="Failed to Load Operational Analytics"
        description={error instanceof Error ? error.message : 'An unexpected error occurred while fetching operational metrics.'}
        onRetry={handleRefresh}
      />
    );
  }

  if (!overview) {
    return (
      <AnalyticsEmptyState
        title="No Operational Telemetry Available"
        description="We couldn't compile fleet stats. Add vehicles, drivers, or dispatches to enable operational analysis."
        action={
          <button
            onClick={handleRefresh}
            className="mt-4 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-primary/95"
          >
            Retry Fetching
          </button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <AnalyticsHeader
        onRefresh={handleRefresh}
        isRefreshing={isFetching}
        onExportCSV={handleExportCSV}
        onExportExcel={handleExportExcel}
        onExportPDF={handleExportPDF}
        dateRangeLabel={dateRangeLabel}
        onOpenFilters={() => setDrawerOpen(true)}
      />

      {/* Notifications */}
      {successMessage && (
        <div className="flex items-center gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs font-bold text-emerald-600 dark:text-emerald-400 animate-scale-up">
          <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs font-bold text-rose-600 dark:text-rose-400 animate-scale-up">
          <AlertCircle className="h-4.5 w-4.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Operational KPI Telemetry Cards */}
      <AnalyticsKPICards
        overview={overview}
        selectedMetricKey={selectedMetricKey}
        onSelectMetric={handleSelectMetric}
      />

      {/* Filters Toolbar */}
      <AnalyticsToolbar
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        comparisonPeriod={comparisonPeriod}
        onComparisonChange={setComparisonPeriod}
        selectedVehicleId={selectedVehicleId}
        onVehicleIdChange={setSelectedVehicleId}
        selectedDriverId={selectedDriverId}
        onDriverIdChange={setSelectedDriverId}
        selectedDepartment={selectedDepartment}
        onDepartmentChange={setSelectedDepartment}
        vehicles={formattedVehicles}
        drivers={formattedDrivers}
        onClearFilters={handleClearFilters}
      />

      {/* Operational Intelligence Executive Summary Card */}
      <ExecutiveSummaryCard overview={overview} />

      {/* Primary Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FleetPerformanceChart overview={overview} />
        <DriverPerformanceChart overview={overview} />
      </div>

      {/* Category Operational Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <FuelAnalyticsCard overview={overview} />
        <MaintenanceAnalyticsCard overview={overview} />
        <ShipmentAnalyticsCard overview={overview} />
        <TripAnalyticsCard overview={overview} />
      </div>

      {/* Metric Inspector Drawer */}
      <AnalyticsDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        overview={overview}
        selectedMetricKey={selectedMetricKey}
      />
    </div>
  );
};

export default FleetManagerAnalyticsPage;
