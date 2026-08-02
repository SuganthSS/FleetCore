import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, ChevronLeft, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { fuelService } from '@/services/fuel.service';
import { vehicleService } from '@/services/vehicle.service';
import { tripService } from '@/services/trip.service';
import type { FuelRecord, CreateFuelRecordPayload } from '@/types/fuel';
import {
  PageHeader,
  Button,
  ErrorState,
  EmptyState,
  ConfirmDialog,
} from '@/components/ui';
import {
  FuelTable,
  FuelToolbar,
  FuelModal,
  FuelDetailsDrawer,
  FuelSkeleton,
} from '@/components/fuel';

export const FuelPage: React.FC = () => {
  const queryClient = useQueryClient();

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [tripId, setTripId] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Modal / Drawer state
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

  const isLoadingData = isLoading || isFetching;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Fuel Management"
        description="Track fuel consumption, operational costs and vehicle refueling history."
        actions={
          <Button onClick={handleCreateClick} className="flex items-center gap-2">
            <Plus className="h-4.5 w-4.5" />
            Add Fuel Record
          </Button>
        }
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

      {/* Toolbar Filters */}
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
        onRefresh={handleRefresh}
        onClearFilters={handleClearFilters}
        vehicles={vehiclesData || []}
        trips={tripsData || []}
        isRefreshing={isFetching}
      />

      {/* Main Table Content */}
      {isLoading && !data ? (
        <FuelSkeleton />
      ) : error ? (
        <ErrorState
          title="Error loading fuel records"
          description={error instanceof Error ? error.message : 'An unexpected error occurred while fetching fuel logs.'}
          onRetry={handleRefresh}
        />
      ) : !data || data.items.length === 0 ? (
        <EmptyState
          title="No fuel records found"
          description={
            hasActiveFilters()
              ? 'Try resetting the filters or modifying your search query to locate fuel records.'
              : 'Add your first vehicle fuel refueling record to log operational costs.'
          }
          action={
            !hasActiveFilters() ? (
              <Button onClick={handleCreateClick} className="mt-2.5">
                Add Fuel Record
              </Button>
            ) : (
              <Button variant="outline" onClick={handleClearFilters} className="mt-2.5">
                Clear Filters
              </Button>
            )
          }
        />
      ) : (
        <div className="space-y-4">
          <FuelTable
            records={data.items}
            onView={handleViewClick}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
          />

          {/* Pagination Controls */}
          {data.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 bg-card border border-border rounded-xl shadow-sm">
              <span className="text-xs font-semibold text-muted-foreground">
                Showing Page <strong className="text-foreground">{data.page}</strong> of{' '}
                <strong className="text-foreground">{data.totalPages}</strong> (
                <strong className="text-foreground">{data.total}</strong> total records)
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1 || isLoadingData}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === data.totalPages || isLoadingData}
                  className="flex items-center gap-1"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
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
    return !!(search || vehicleId || tripId);
  }
};
export default FuelPage;
