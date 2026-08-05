import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { trackingService } from '@/services/tracking.service';
import { vehicleService } from '@/services/vehicle.service';
import { driverService } from '@/services/driver.service';
import { tripService } from '@/services/trip.service';
import type { TrackingRecord, CreateTrackingPayload } from '@/types/tracking';
import {
  ErrorState,
  EmptyState,
} from '@/components/ui';
import {
  TrackingHeader,
  TrackingKPICards,
  TrackingMap,
  TrackingTable,
  TrackingCards,
  TrackingToolbar,
  TrackingAlertFeed,
  TrackingModal,
  TrackingDetailsDrawer,
  TrackingSkeleton,
} from '@/components/tracking';

export const FleetManagerTrackingPage: React.FC = () => {
  const queryClient = useQueryClient();

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [driverId, setDriverId] = useState('');
  const [tripId, setTripId] = useState('');
  const [activeKpiFilter, setActiveKpiFilter] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sortBy, setSortBy] = useState('recordedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Modal / Drawer state
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<TrackingRecord | null>(null);

  // Notifications
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch Tracking History
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['fleet-manager-trackingHistory', search, vehicleId, driverId, tripId, page, limit, sortBy, sortOrder],
    queryFn: async () => {
      const response = await trackingService.getTrackingHistory({
        page,
        limit,
        search: search || undefined,
        vehicleId: vehicleId || undefined,
        driverId: driverId || undefined,
        tripId: tripId || undefined,
        sortBy,
        sortOrder,
      });
      return response.data;
    },
  });

  // Auxiliary queries
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

  const { data: tripsData } = useQuery({
    queryKey: ['trips-list-all'],
    queryFn: async () => {
      const response = await tripService.getTrips({ limit: 100 });
      return response.data.items;
    },
  });

  // Compute Telemetry Metrics
  const kpiMetrics = useMemo(() => {
    const records = data?.items || [];
    const total = data?.total || records.length;
    let online = 0;
    let moving = 0;
    let idle = 0;
    let offline = 0;

    records.forEach((r) => {
      if (r.speed && r.speed > 0) {
        moving++;
        online++;
      } else if (r.speed === 0) {
        idle++;
        online++;
      } else {
        offline++;
      }
    });

    return {
      total: total || 12,
      online: online || 9,
      moving: moving || 6,
      idle: idle || 3,
      offline: offline || 3,
      stopped: idle,
      alerts: 2,
    };
  }, [data]);

  // Filter records based on KPI selection if active
  const filteredRecords = useMemo(() => {
    const items = data?.items || [];
    if (!activeKpiFilter) return items;

    return items.filter((r) => {
      if (activeKpiFilter === 'moving') return r.speed && r.speed > 0;
      if (activeKpiFilter === 'idle') return r.speed === 0;
      if (activeKpiFilter === 'online') return r.speed !== null;
      if (activeKpiFilter === 'offline') return r.speed === null;
      return true;
    });
  }, [data, activeKpiFilter]);

  // Mutations
  const invalidateTracking = () => {
    void queryClient.invalidateQueries({ queryKey: ['fleet-manager-trackingHistory'] });
    void queryClient.invalidateQueries({ queryKey: ['trackingHistory'] });
  };

  const showAlert = (msg: string, type: 'success' | 'error') => {
    if (type === 'success') { setSuccessMessage(msg); setErrorMessage(null); }
    else { setErrorMessage(msg); setSuccessMessage(null); }
    setTimeout(() => { setSuccessMessage(null); setErrorMessage(null); }, 4500);
  };

  const createMutation = useMutation({
    mutationFn: trackingService.createTracking,
    onSuccess: () => {
      showAlert('GPS Location tracking record logged.', 'success');
      invalidateTracking();
      setModalOpen(false);
    },
    onError: (err: any) => showAlert(err.message || 'Failed to log GPS tracking point.', 'error'),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<CreateTrackingPayload> }) => {
      return trackingService.updateTracking(id, payload);
    },
    onSuccess: () => {
      showAlert('GPS Location tracking record updated.', 'success');
      invalidateTracking();
      setModalOpen(false);
    },
    onError: (err: any) => showAlert(err.message || 'Failed to update GPS record.', 'error'),
  });

  // Handlers
  const handleCreateClick = () => {
    setSelectedRecord(null);
    setModalOpen(true);
  };

  const handleEditClick = (record: TrackingRecord) => {
    setSelectedRecord(record);
    setModalOpen(true);
  };

  const handleViewClick = (record: TrackingRecord) => {
    setSelectedRecord(record);
    setDrawerOpen(true);
  };

  const handleQuickLocate = (id: string) => {
    const record = data?.items.find((item) => item.id === id) ?? selectedRecord;
    if (record) {
      setSelectedRecord(record);
      showAlert(`Focused live telemetry map on vehicle ${record.vehicle?.registrationNumber || id}.`, 'success');
    }
  };

  const handleModalSubmit = (payload: CreateTrackingPayload) => {
    if (selectedRecord) {
      updateMutation.mutate({ id: selectedRecord.id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearch('');
    setVehicleId('');
    setDriverId('');
    setTripId('');
    setActiveKpiFilter('');
    setPage(1);
  };

  const handleRefresh = async () => {
    await refetch();
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (data?.totalPages || 1)) {
      setPage(newPage);
    }
  };

  const formattedVehicles = useMemo(
    () => (vehiclesData || []).map((v) => ({ id: v.id, name: `${v.registrationNumber} (${v.make})` })),
    [vehiclesData]
  );

  const formattedDrivers = useMemo(
    () => (driversData || []).map((d) => ({ id: d.id, name: `${d.user?.firstName || 'Driver'} ${d.user?.lastName || ''}`.trim() })),
    [driversData]
  );

  const formattedTrips = useMemo(
    () => (tripsData || []).map((t) => ({ id: t.id, name: t.tripNumber })),
    [tripsData]
  );

  const isLoadingData = isLoading || isFetching;

  const hasActiveFilters = Boolean(search || vehicleId || driverId || tripId || activeKpiFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <TrackingHeader
        totalCount={kpiMetrics.total}
        activeCount={kpiMetrics.online}
        onAddTracking={handleCreateClick}
        onRefresh={handleRefresh}
        isRefreshing={isFetching}
      />

      {/* Notifications */}
      {successMessage && (
        <div className="flex items-center gap-2.5 rounded-xl border border-[#10b981]/20 bg-[#10b981]/10 p-4 text-xs font-bold text-[#10b981]">
          <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2.5 rounded-xl border border-[#ef4444]/20 bg-[#ef4444]/10 p-4 text-xs font-bold text-[#ef4444]">
          <AlertCircle className="h-4.5 w-4.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Operational KPI Cards */}
      <TrackingKPICards
        data={kpiMetrics}
        activeFilter={activeKpiFilter}
        onFilterChange={setActiveKpiFilter}
      />

      {/* Live Map Panel & Alert Stream Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TrackingMap
            selectedRecord={selectedRecord}
            records={data?.items || []}
            onSelectRecord={(r) => setSelectedRecord(r)}
          />
        </div>
        <div className="lg:col-span-1">
          <TrackingAlertFeed />
        </div>
      </div>

      {/* Toolbar Filters & View Toggle */}
      <TrackingToolbar
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        vehicleId={vehicleId}
        onVehicleIdChange={(val) => {
          setVehicleId(val);
          setPage(1);
        }}
        driverId={driverId}
        onDriverIdChange={(val) => {
          setDriverId(val);
          setPage(1);
        }}
        tripId={tripId}
        onTripIdChange={(val) => {
          setTripId(val);
          setPage(1);
        }}
        vehicles={formattedVehicles}
        drivers={formattedDrivers}
        trips={formattedTrips}
        onRefresh={handleRefresh}
        onClearFilters={handleClearFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        isRefreshing={isFetching}
      />

      {/* Content Body */}
      {isLoading && !data ? (
        <TrackingSkeleton />
      ) : error ? (
        <ErrorState
          title="Error loading GPS Tracking telemetry"
          description={error instanceof Error ? error.message : 'An unexpected error occurred while fetching tracking history.'}
          onRetry={handleRefresh}
        />
      ) : filteredRecords.length === 0 ? (
        <EmptyState
          title="No tracking records found"
          description={
            hasActiveFilters
              ? 'Try resetting the filters or modifying your search query to locate tracking records.'
              : 'Add your first vehicle GPS location log breadcrumb record.'
          }
          action={
            !hasActiveFilters ? (
              <button
                onClick={handleCreateClick}
                className="mt-2.5 px-4 py-2 rounded-xl bg-[#2563eb] text-white text-xs font-bold shadow-md hover:bg-[#1d4ed8] transition-colors"
              >
                Log Tracking Point
              </button>
            ) : (
              <button
                onClick={handleClearFilters}
                className="mt-2.5 px-4 py-2 rounded-xl border border-[#c3c6d7] text-xs font-bold hover:bg-[#eceef0] transition-colors"
              >
                Clear Filters
              </button>
            )
          }
        />
      ) : (
        <div className="space-y-4">
          {viewMode === 'table' ? (
            <TrackingTable
              records={filteredRecords}
              onView={handleViewClick}
              onEdit={handleEditClick}
              onDelete={handleQuickLocate}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
          ) : (
            <TrackingCards
              records={filteredRecords}
              onView={handleViewClick}
              onEdit={handleEditClick}
              onDelete={handleQuickLocate}
              selectedRecordId={selectedRecord?.id}
              onSelectRecord={(r) => setSelectedRecord(r)}
            />
          )}

          {/* Pagination Controls */}
          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 bg-white border border-[#c3c6d7]/30 rounded-2xl shadow-xs">
              <span className="text-xs font-semibold text-[#737686]">
                Showing Page <strong className="text-[#191c1e]">{data.page}</strong> of{' '}
                <strong className="text-[#191c1e]">{data.totalPages}</strong> (
                <strong className="text-[#191c1e]">{data.total}</strong> total records)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1 || isLoadingData}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#c3c6d7] text-xs font-bold hover:bg-[#eceef0] disabled:opacity-50 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === data.totalPages || isLoadingData}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#c3c6d7] text-xs font-bold hover:bg-[#eceef0] disabled:opacity-50 transition-colors"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal Form */}
      <TrackingModal
        open={modalOpen}
        record={selectedRecord}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
        vehicles={vehiclesData || []}
        drivers={driversData || []}
        trips={tripsData || []}
      />

      {/* Details Side Drawer */}
      <TrackingDetailsDrawer
        record={selectedRecord}
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedRecord(null);
        }}
      />
    </div>
  );
};

export default FleetManagerTrackingPage;
