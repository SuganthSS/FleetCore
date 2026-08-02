import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, ChevronLeft, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { tripService } from '@/services/trip.service';
import { vehicleService } from '@/services/vehicle.service';
import { driverService } from '@/services/driver.service';
import { shipmentService } from '@/services/shipment.service';
import { routeService } from '@/services/route.service';
import type { Trip, TripStatus, CreateTripPayload } from '@/types/trip';
import {
  PageHeader,
  Button,
  ErrorState,
  EmptyState,
  ConfirmDialog,
} from '@/components/ui';
import {
  TripTable,
  TripToolbar,
  TripModal,
  TripDetailsDrawer,
  TripSkeleton,
} from '@/components/trip';

export const TripsPage: React.FC = () => {
  const queryClient = useQueryClient();

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [driverId, setDriverId] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Modal / Drawer state
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  // Success / Error Alerts
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch Trips
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['trips', search, status, vehicleId, driverId, page, limit, sortBy, sortOrder],
    queryFn: async () => {
      const response = await tripService.getTrips({
        page,
        limit,
        search: search || undefined,
        status: status ? (status as TripStatus) : undefined,
        vehicleId: vehicleId || undefined,
        driverId: driverId || undefined,
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

  const { data: driversData } = useQuery({
    queryKey: ['drivers-list-all'],
    queryFn: async () => {
      const response = await driverService.getDrivers({ limit: 100 });
      return response.data.items;
    },
  });

  const { data: shipmentsData } = useQuery({
    queryKey: ['shipments-list-all'],
    queryFn: async () => {
      const response = await shipmentService.getShipments({ limit: 100 });
      return response.data.items;
    },
  });

  const { data: routesData } = useQuery({
    queryKey: ['routes-list-all'],
    queryFn: async () => {
      const response = await routeService.getRoutes({ limit: 100 });
      return response.data.items;
    },
  });

  // Create Trip Mutation
  const createMutation = useMutation({
    mutationFn: tripService.createTrip,
    onSuccess: (res) => {
      setSuccessMessage(`Trip '${res.data.tripNumber}' created and dispatched.`);
      setErrorMessage(null);
      void queryClient.invalidateQueries({ queryKey: ['trips'] });
      setModalOpen(false);
      clearAlertLater();
    },
    onError: (err: any) => {
      setErrorMessage(err.message || 'Failed to create trip.');
      setSuccessMessage(null);
    },
  });

  // Update Trip Mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<CreateTripPayload> }) => {
      return tripService.updateTrip(id, payload);
    },
    onSuccess: (res) => {
      setSuccessMessage(`Trip '${res.data.tripNumber}' updated successfully.`);
      setErrorMessage(null);
      void queryClient.invalidateQueries({ queryKey: ['trips'] });
      setModalOpen(false);
      clearAlertLater();
    },
    onError: (err: any) => {
      setErrorMessage(err.message || 'Failed to update trip.');
      setSuccessMessage(null);
    },
  });

  // Delete Trip Mutation
  const deleteMutation = useMutation({
    mutationFn: tripService.deleteTrip,
    onSuccess: () => {
      setSuccessMessage('Trip record deleted successfully.');
      setErrorMessage(null);
      void queryClient.invalidateQueries({ queryKey: ['trips'] });
      setDeleteDialogOpen(false);
      setSelectedTrip(null);
      clearAlertLater();
    },
    onError: (err: any) => {
      setErrorMessage(err.message || 'Failed to delete trip.');
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
    setSelectedTrip(null);
    setModalOpen(true);
  };

  const handleEditClick = (trip: Trip) => {
    setSelectedTrip(trip);
    setModalOpen(true);
  };

  const handleViewClick = (trip: Trip) => {
    setSelectedTrip(trip);
    setDrawerOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    const trip = data?.items.find((item) => item.id === id);
    if (trip) {
      setSelectedTrip(trip);
      setDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (selectedTrip) {
      deleteMutation.mutate(selectedTrip.id);
    }
  };

  const handleModalSubmit = (payload: CreateTripPayload) => {
    if (selectedTrip) {
      updateMutation.mutate({ id: selectedTrip.id, payload });
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
    setStatus('');
    setVehicleId('');
    setDriverId('');
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
        title="Trips"
        description="Manage fleet operations, dispatches and transportation execution."
        actions={
          <Button onClick={handleCreateClick} className="flex items-center gap-2">
            <Plus className="h-4.5 w-4.5" />
            Create Trip
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
      <TripToolbar
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        status={status}
        onStatusChange={(val) => {
          setStatus(val);
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
        onRefresh={handleRefresh}
        onClearFilters={handleClearFilters}
        vehicles={vehiclesData || []}
        drivers={driversData || []}
        isRefreshing={isFetching}
      />

      {/* Main Table Content */}
      {isLoading && !data ? (
        <TripSkeleton />
      ) : error ? (
        <ErrorState
          title="Error loading trips"
          description={error instanceof Error ? error.message : 'An unexpected error occurred while fetching trips data.'}
          onRetry={handleRefresh}
        />
      ) : !data || data.items.length === 0 ? (
        <EmptyState
          title="No trips found"
          description={
            hasActiveFilters()
              ? 'Try resetting the filters or modifying your search query to locate trips.'
              : 'Add your first operational trip record to dispatch driver and vehicle assets.'
          }
          action={
            !hasActiveFilters() ? (
              <Button onClick={handleCreateClick} className="mt-2.5">
                Create Trip
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
          <TripTable
            trips={data.items}
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
                <strong className="text-foreground">{data.total}</strong> total trips)
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

      {/* Trip Modal Form */}
      <TripModal
        open={modalOpen}
        trip={selectedTrip}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
        shipments={shipmentsData || []}
        vehicles={vehiclesData || []}
        drivers={driversData || []}
        routes={routesData || []}
      />

      {/* Details Side Drawer */}
      <TripDetailsDrawer
        trip={selectedTrip}
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedTrip(null);
        }}
      />

      {/* Delete Confirmation Dialogue */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Confirm Trip Deletion"
        description={`Are you absolutely sure you want to delete trip ${
          selectedTrip?.tripNumber || ''
        }? This operational transaction record will be permanently deleted. This action is irreversible.`}
        confirmLabel="Delete Trip"
        cancelLabel="Keep Record"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setSelectedTrip(null);
        }}
        loading={deleteMutation.isPending}
        destructive={true}
      />
    </div>
  );

  function hasActiveFilters() {
    return !!(search || status || vehicleId || driverId);
  }
};
export default TripsPage;
