import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { tripService } from '@/services/trip.service';
import { vehicleService } from '@/services/vehicle.service';
import { driverService } from '@/services/driver.service';
import { shipmentService } from '@/services/shipment.service';
import { routeService } from '@/services/route.service';
import type { Trip, TripStatus, CreateTripPayload } from '@/types/trip';
import { Button, ConfirmDialog } from '@/components/ui';
import {
  TripHeader,
  TripKPICards,
  TripToolbar,
  TripTable,
  TripCards,
  TripDrawer,
  TripModal,
  TripSkeleton,
  TripEmptyState,
  TripErrorState,
} from '@/components/trip';

export const TripsPage: React.FC = () => {
  const queryClient = useQueryClient();

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [driverId, setDriverId] = useState('');
  const [shipmentId, setShipmentId] = useState('');
  const [routeId, setRouteId] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Modal / Drawer / Dialog state
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  // Success / Error Alerts
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch Trips
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['trips', search, status, vehicleId, driverId, shipmentId, routeId, page, limit, sortBy, sortOrder],
    queryFn: async () => {
      const response = await tripService.getTrips({
        page,
        limit,
        search: search || undefined,
        status: status ? (status as TripStatus) : undefined,
        vehicleId: vehicleId || undefined,
        driverId: driverId || undefined,
        shipmentId: shipmentId || undefined,
        routeId: routeId || undefined,
        sortBy,
        sortOrder,
      });
      return response.data;
    },
  });

  // Calculate KPI Summary
  const kpiData = useMemo(() => {
    const items = data?.items || [];
    const total = data?.total || 0;
    const scheduled = items.filter((i) => i.status === 'SCHEDULED').length;
    const dispatched = items.filter((i) => i.status === 'DISPATCHED').length;
    const inTransit = items.filter((i) => i.status === 'IN_TRANSIT').length;
    const paused = items.filter((i) => i.status === 'PAUSED').length;
    const completed = items.filter((i) => i.status === 'COMPLETED').length;
    const issues = items.filter((i) => i.status === 'CANCELLED' || i.status === 'FAILED').length;

    return { total, scheduled, dispatched, inTransit, paused, completed, issues };
  }, [data]);

  // Auxiliary data queries
  const { data: rawVehiclesData } = useQuery({
    queryKey: ['vehicles-list-all'],
    queryFn: async () => {
      const response = await vehicleService.getVehicles({ limit: 100 });
      return response.data.items;
    },
  });

  const vehiclesData = useMemo(() => {
    return (rawVehiclesData || []).map((v) => ({ id: v.id, name: v.registrationNumber }));
  }, [rawVehiclesData]);

  const { data: rawDriversData } = useQuery({
    queryKey: ['drivers-list-all'],
    queryFn: async () => {
      const response = await driverService.getDrivers({ limit: 100 });
      return response.data.items;
    },
  });

  const driversData = useMemo(() => {
    return (rawDriversData || []).map((d) => {
      const name = d.user ? `${d.user.firstName || ''} ${d.user.lastName || ''}`.trim() : d.employeeId;
      return { id: d.id, name: name || d.employeeId };
    });
  }, [rawDriversData]);

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
    setShipmentId('');
    setRouteId('');
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (data?.totalPages || 1)) {
      setPage(newPage);
    }
  };

  const hasActiveFilters = Boolean(search || status || vehicleId || driverId || shipmentId || routeId);

  if (isLoading) {
    return <TripSkeleton />;
  }

  if (error) {
    return (
      <TripErrorState
        message={error instanceof Error ? error.message : 'Could not retrieve trip operational records.'}
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <TripHeader
        totalTrips={data?.total || 0}
        onAddTrip={handleCreateClick}
        onRefresh={() => void refetch()}
        isRefreshing={isFetching}
      />

      {/* KPI Cards */}
      <TripKPICards
        data={kpiData}
        activeStatusFilter={status}
        onStatusFilterChange={(val) => {
          setStatus(val);
          setPage(1);
        }}
      />

      {/* Notifications */}
      {successMessage && (
        <div className="flex items-center gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs font-bold text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2.5 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-xs font-bold text-destructive">
          <AlertCircle className="h-4.5 w-4.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Toolbar */}
      <TripToolbar
        search={search}
        onSearchChange={(val: string) => {
          setSearch(val);
          setPage(1);
        }}
        status={status}
        onStatusChange={(val: string) => {
          setStatus(val);
          setPage(1);
        }}
        vehicleId={vehicleId}
        onVehicleIdChange={(val: string) => {
          setVehicleId(val);
          setPage(1);
        }}
        driverId={driverId}
        onDriverIdChange={(val: string) => {
          setDriverId(val);
          setPage(1);
        }}
        routeId={routeId}
        onRouteIdChange={(val: string) => {
          setRouteId(val);
          setPage(1);
        }}
        vehicles={vehiclesData || []}
        drivers={driversData || []}
        routes={(routesData || []).map((r) => ({ id: r.id, name: r.routeCode }))}
        sortBy={sortBy}
        onSortByChange={(val) => {
          setSortBy(val);
          setPage(1);
        }}
        sortOrder={sortOrder}
        onSortOrderChange={(val) => setSortOrder(val)}
        viewMode={viewMode}
        onViewModeChange={(mode) => setViewMode(mode)}
        onClearFilters={handleClearFilters}
      />

      {/* Main Content Area */}
      {!data || data.items.length === 0 ? (
        <TripEmptyState
          hasFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
          onCreateTrip={handleCreateClick}
        />
      ) : (
        <div className="space-y-4">
          {viewMode === 'table' ? (
            <TripTable
              trips={data.items}
              onView={handleViewClick}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
          ) : (
            <TripCards
              trips={data.items}
              onView={handleViewClick}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          )}

          {/* Pagination Controls */}
          {data.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 bg-card border border-border rounded-2xl shadow-xs">
              <span className="text-xs font-semibold text-muted-foreground">
                Showing Page <strong className="text-foreground">{data.page}</strong> of{' '}
                <strong className="text-foreground">{data.totalPages}</strong> (
                <strong className="text-foreground">{data.total}</strong> total trips)
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1 || isFetching}
                  className="h-8.5 px-3 text-xs"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {[...Array(data.totalPages)].map((_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`h-8 w-8 rounded-lg text-xs font-semibold transition-colors ${
                          page === pageNum
                            ? 'bg-primary text-white font-bold'
                            : 'bg-transparent text-muted-foreground hover:bg-muted'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === data.totalPages || isFetching}
                  className="h-8.5 px-3 text-xs"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
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
        vehicles={rawVehiclesData || []}
        drivers={rawDriversData || []}
        routes={routesData || []}
      />

      {/* Details Side Drawer */}
      <TripDrawer
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
        description={`Are you sure you want to delete trip ${
          selectedTrip?.tripNumber || ''
        }? This action cannot be undone.`}
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
};

export default TripsPage;
