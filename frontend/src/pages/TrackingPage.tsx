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
  ConfirmDialog,
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

export const TrackingPage: React.FC = () => {
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

  // Modal / Drawer / Dialog state
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<TrackingRecord | null>(null);

  // Notifications
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch Tracking History
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['trackingHistory', search, vehicleId, driverId, tripId, page, limit, sortBy, sortOrder],
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

  // Fetch Auxiliary resources for dropdown selects
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

  // Compute KPI Telemetry Metrics
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

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: trackingService.createTracking,
    onSuccess: () => {
      setSuccessMessage('GPS Location tracking record added successfully.');
      setErrorMessage(null);
      void queryClient.invalidateQueries({ queryKey: ['trackingHistory'] });
      setModalOpen(false);
      clearAlertLater();
    },
    onError: (err: any) => {
      setErrorMessage(err.message || 'Failed to create tracking record.');
      setSuccessMessage(null);
    },
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<CreateTrackingPayload> }) => {
      return trackingService.updateTracking(id, payload);
    },
    onSuccess: () => {
      setSuccessMessage('GPS Location tracking record updated successfully.');
      setErrorMessage(null);
      void queryClient.invalidateQueries({ queryKey: ['trackingHistory'] });
      setModalOpen(false);
      clearAlertLater();
    },
    onError: (err: any) => {
      setErrorMessage(err.message || 'Failed to update tracking record.');
      setSuccessMessage(null);
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: trackingService.deleteTracking,
    onSuccess: () => {
      setSuccessMessage('GPS Location tracking record deleted successfully.');
      setErrorMessage(null);
      void queryClient.invalidateQueries({ queryKey: ['trackingHistory'] });
      setDeleteDialogOpen(false);
      setSelectedRecord(null);
      clearAlertLater();
    },
    onError: (err: any) => {
      setErrorMessage(err.message || 'Failed to delete tracking record.');
      setSuccessMessage(null);
      setDeleteDialogOpen(false);
    },
  });

  const clearAlertLater = () => {
    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);
  };

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

  const handleDeleteClick = (id: string) => {
    const record = data?.items.find((item) => item.id === id);
    if (record) {
      setSelectedRecord(record);
      setDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (selectedRecord) {
      deleteMutation.mutate(selectedRecord.id);
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

  return (
    <div className="space-y-6">
      {/* Stitch Header */}
      <TrackingHeader
        totalCount={kpiMetrics.total}
        activeCount={kpiMetrics.online}
        onAddTracking={handleCreateClick}
        onRefresh={handleRefresh}
        isRefreshing={isFetching}
      />

      {/* Notifications */}
      {successMessage && (
        <div className="flex items-center gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-600 dark:text-emerald-400 animate-scale-up">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span className="font-semibold">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-600 dark:text-rose-400 animate-scale-up">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span className="font-semibold">{errorMessage}</span>
        </div>
      )}

      {/* Stitch KPI Cards */}
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

      {/* Main Table / Grid Content */}
      {isLoading && !data ? (
        <TrackingSkeleton />
      ) : error ? (
        <ErrorState
          title="Error loading GPS Tracking logs"
          description={error instanceof Error ? error.message : 'An unexpected error occurred while fetching tracking history.'}
          onRetry={handleRefresh}
        />
      ) : filteredRecords.length === 0 ? (
        <EmptyState
          title="No tracking records found"
          description={
            hasActiveFilters()
              ? 'Try resetting the filters or modifying your search query to locate tracking records.'
              : 'Add your first vehicle GPS location log breadcrumb record.'
          }
          action={
            !hasActiveFilters() ? (
              <button
                onClick={handleCreateClick}
                className="mt-2.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-md hover:bg-primary/90 transition-colors"
              >
                Add Tracking Record
              </button>
            ) : (
              <button
                onClick={handleClearFilters}
                className="mt-2.5 px-4 py-2 rounded-xl border border-input text-xs font-bold hover:bg-muted transition-colors"
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
              onDelete={handleDeleteClick}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
          ) : (
            <TrackingCards
              records={filteredRecords}
              onView={handleViewClick}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              selectedRecordId={selectedRecord?.id}
              onSelectRecord={(r) => setSelectedRecord(r)}
            />
          )}

          {/* Pagination Controls */}
          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 bg-card border border-border rounded-2xl shadow-2xs">
              <span className="text-xs font-semibold text-muted-foreground">
                Showing Page <strong className="text-foreground">{data.page}</strong> of{' '}
                <strong className="text-foreground">{data.totalPages}</strong> (
                <strong className="text-foreground">{data.total}</strong> total records)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1 || isLoadingData}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-input text-xs font-bold hover:bg-muted disabled:opacity-50 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === data.totalPages || isLoadingData}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-input text-xs font-bold hover:bg-muted disabled:opacity-50 transition-colors"
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

      {/* Delete Confirmation Dialogue */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Confirm Tracking Log Deletion"
        description="Are you absolutely sure you want to delete this GPS location history record? This will permanently delete the selected breadcrumb entry from the vehicle's history log. This action is irreversible."
        confirmLabel="Delete Record"
        cancelLabel="Keep Record"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setSelectedRecord(null);
        }}
        loading={deleteMutation.isPending}
        destructive={true}
      />
    </div>
  );

  function hasActiveFilters() {
    return !!(search || vehicleId || driverId || tripId || activeKpiFilter);
  }
};

export default TrackingPage;
