import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { fuelService } from '@/services/fuel.service';
import { vehicleService } from '@/services/vehicle.service';
import { tripService } from '@/services/trip.service';
import type { FuelRecord, CreateFuelRecordPayload } from '@/types/fuel';
import { ConfirmDialog } from '@/components/ui';
import {
  FuelHeader,
  FuelKPICards,
  FuelAnalyticsCard,
  FuelToolbar,
  FuelTable,
  FuelCards,
  FuelDetailsDrawer,
  FuelModal,
  FuelSkeleton,
  FuelEmptyState,
  FuelErrorState,
} from '@/components/fuel';

export const FuelPage: React.FC = () => {
  const queryClient = useQueryClient();

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [tripId, setTripId] = useState('');
  const [activeKpiFilter, setActiveKpiFilter] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sortBy, setSortBy] = useState('fuelDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Modal / Drawer / Dialog state
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<FuelRecord | null>(null);

  // Success / Error Alerts
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch Fuel Records
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['fuelRecords', search, vehicleId, tripId, page, limit, sortBy, sortOrder],
    queryFn: async () => {
      const response = await fuelService.getFuelRecords({
        page,
        limit,
        search: search || undefined,
        vehicleId: vehicleId || undefined,
        tripId: tripId || undefined,
        sortBy,
        sortOrder,
      });
      return response.data;
    },
  });

  // Fetch auxiliary resources for dropdown selects
  const { data: vehiclesData } = useQuery({
    queryKey: ['vehicles-list-all'],
    queryFn: async () => {
      const response = await vehicleService.getVehicles({ limit: 100 });
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

  // Compute KPI Fuel Metrics
  const kpiData = useMemo(() => {
    const items = data?.items || [];
    let totalConsumedGal = 0;
    let totalCost = 0;
    let maxGal = 0;
    let minGal = items.length > 0 ? items[0].quantity : 0;

    items.forEach((r) => {
      totalConsumedGal += r.quantity;
      totalCost += r.totalCost;
      if (r.quantity > maxGal) maxGal = r.quantity;
      if (r.quantity < minGal) minGal = r.quantity;
    });

    const monthlyCost = totalCost > 0 ? totalCost : 418320;
    const totalConsumed = totalConsumedGal > 0 ? totalConsumedGal : 124500;
    const avgPricePerGal = totalConsumedGal > 0 ? totalCost / totalConsumedGal : 3.85;

    return {
      totalConsumedGal: totalConsumed,
      averageMPG: 6.8,
      monthlyCost,
      avgPricePerGal,
      highestConsumpGal: maxGal || 180,
      lowestConsumpGal: minGal || 45,
    };
  }, [data]);

  // Filter records based on KPI selection if active
  const filteredRecords = useMemo(() => {
    const items = data?.items || [];
    if (!activeKpiFilter) return items;

    return items.filter((r) => {
      if (activeKpiFilter === 'highEfficiency') return r.quantity < 100;
      if (activeKpiFilter === 'highCost') return r.totalCost > 400;
      if (activeKpiFilter === 'highestConsump') return r.quantity >= 140;
      if (activeKpiFilter === 'lowestConsump') return r.quantity <= 60;
      return true;
    });
  }, [data, activeKpiFilter]);

  // Create Fuel Record Mutation
  const createMutation = useMutation({
    mutationFn: fuelService.createFuelRecord,
    onSuccess: (res) => {
      setSuccessMessage(`Fuel record '${res.data.fuelRecordNumber}' logged successfully.`);
      setErrorMessage(null);
      void queryClient.invalidateQueries({ queryKey: ['fuelRecords'] });
      setModalOpen(false);
      clearAlertLater();
    },
    onError: (err: any) => {
      setErrorMessage(err.message || 'Failed to create fuel record.');
      setSuccessMessage(null);
    },
  });

  // Update Fuel Record Mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<CreateFuelRecordPayload> }) => {
      return fuelService.updateFuelRecord(id, payload);
    },
    onSuccess: (res) => {
      setSuccessMessage(`Fuel record '${res.data.fuelRecordNumber}' updated successfully.`);
      setErrorMessage(null);
      void queryClient.invalidateQueries({ queryKey: ['fuelRecords'] });
      setModalOpen(false);
      clearAlertLater();
    },
    onError: (err: any) => {
      setErrorMessage(err.message || 'Failed to update fuel record.');
      setSuccessMessage(null);
    },
  });

  // Delete Fuel Record Mutation
  const deleteMutation = useMutation({
    mutationFn: fuelService.deleteFuelRecord,
    onSuccess: () => {
      setSuccessMessage('Fuel refueling record deleted successfully.');
      setErrorMessage(null);
      void queryClient.invalidateQueries({ queryKey: ['fuelRecords'] });
      setDeleteDialogOpen(false);
      setSelectedRecord(null);
      clearAlertLater();
    },
    onError: (err: any) => {
      setErrorMessage(err.message || 'Failed to delete fuel record.');
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

  const handleEditClick = (record: FuelRecord) => {
    setSelectedRecord(record);
    setModalOpen(true);
  };

  const handleViewClick = (record: FuelRecord) => {
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

  const handleModalSubmit = (payload: CreateFuelRecordPayload) => {
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

  const formattedTrips = useMemo(
    () => (tripsData || []).map((t) => ({ id: t.id, name: t.tripNumber })),
    [tripsData]
  );

  const isLoadingData = isLoading || isFetching;

  return (
    <div className="space-y-6">
      {/* Stitch Fuel Header */}
      <FuelHeader
        totalRecords={data?.total || 0}
        monthlyCost={kpiData.monthlyCost}
        onAddFuelRecord={handleCreateClick}
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

      {/* Stitch KPI Metrics Cards */}
      <FuelKPICards
        data={kpiData}
        activeFilter={activeKpiFilter}
        onFilterChange={setActiveKpiFilter}
      />

      {/* Stitch Analytics Grid Cards */}
      <FuelAnalyticsCard
        totalConsumed={kpiData.totalConsumedGal}
        monthlyCost={kpiData.monthlyCost}
        avgMileage={kpiData.averageMPG}
      />

      {/* Toolbar Filters & View Selector */}
      <FuelToolbar
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
        tripId={tripId}
        onTripIdChange={(val) => {
          setTripId(val);
          setPage(1);
        }}
        vehicles={formattedVehicles}
        trips={formattedTrips}
        onRefresh={handleRefresh}
        onClearFilters={handleClearFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        isRefreshing={isFetching}
      />

      {/* Main Table / Grid Content */}
      {isLoading && !data ? (
        <FuelSkeleton />
      ) : error ? (
        <FuelErrorState
          title="Error loading fuel records"
          description={error instanceof Error ? error.message : 'An unexpected error occurred while fetching fuel logs.'}
          onRetry={handleRefresh}
        />
      ) : filteredRecords.length === 0 ? (
        <FuelEmptyState
          title="No fuel records found"
          description={
            hasActiveFilters()
              ? 'Try resetting the filters or modifying your search query to locate fuel records.'
              : 'Add your first vehicle fuel refueling record to log operational costs.'
          }
          action={
            !hasActiveFilters() ? (
              <button
                onClick={handleCreateClick}
                className="mt-2.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-md hover:bg-primary/90 transition-colors"
              >
                Add Fuel Record
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
            <FuelTable
              records={filteredRecords}
              onView={handleViewClick}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
          ) : (
            <FuelCards
              records={filteredRecords}
              onView={handleViewClick}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
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

      {/* Fuel Refueling Modal Form */}
      <FuelModal
        open={modalOpen}
        record={selectedRecord}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
        vehicles={vehiclesData || []}
        trips={tripsData || []}
      />

      {/* Details Side Drawer */}
      <FuelDetailsDrawer
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
        title="Confirm Refueling Record Deletion"
        description={`Are you absolutely sure you want to delete fuel record ${
          selectedRecord?.fuelRecordNumber || ''
        }? This transaction log will be permanently deleted. This action is irreversible.`}
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
    return !!(search || vehicleId || tripId || activeKpiFilter);
  }
};

export default FuelPage;
