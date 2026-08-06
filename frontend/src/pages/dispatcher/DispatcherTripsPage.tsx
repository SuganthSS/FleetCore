import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, AlertCircle, CheckCircle2, Clock, Send, CheckCircle, AlertTriangle, Map } from 'lucide-react';
import { tripService } from '@/services/trip.service';
import { vehicleService } from '@/services/vehicle.service';
import { driverService } from '@/services/driver.service';
import { shipmentService } from '@/services/shipment.service';
import { routeService } from '@/services/route.service';
import type { Trip, TripStatus, CreateTripPayload } from '@/types/trip';
import { Button } from '@/components/ui';
import {
  TripHeader,
  TripToolbar,
  TripTable,
  TripCards,
  TripDrawer,
  TripModal,
  TripSkeleton,
  TripEmptyState,
  TripErrorState,
} from '@/components/trip';

export const DispatcherTripsPage: React.FC = () => {
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

  // Modal / Drawer state
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  // Success / Error Alerts
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch Trips
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['dispatcher-trips-page', search, status, vehicleId, driverId, shipmentId, routeId, page, limit, sortBy, sortOrder],
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

  // Calculate Dispatcher Operational KPIs
  const dispatcherKpis = useMemo(() => {
    const items = data?.items || [];
    const awaitingAssignment = items.filter((i) => !i.driverId || i.status === 'SCHEDULED').length;
    const dispatched = items.filter((i) => i.status === 'DISPATCHED').length;
    const inProgress = items.filter((i) => i.status === 'IN_TRANSIT').length;
    const delayed = items.filter((i) => i.status === 'PAUSED' || (i.scheduledStartTime && new Date(i.scheduledStartTime) < new Date() && i.status !== 'COMPLETED')).length;
    const completedToday = items.filter((i) => i.status === 'COMPLETED').length;

    return { awaitingAssignment, dispatched, inProgress, delayed, completedToday };
  }, [data]);

  // Auxiliary data queries
  const { data: rawVehiclesData } = useQuery({
    queryKey: ['dispatcher-vehicles-list-all'],
    queryFn: async () => {
      const response = await vehicleService.getVehicles({ limit: 100 });
      return response.data.items;
    },
  });

  const vehiclesData = useMemo(() => {
    return (rawVehiclesData || []).map((v) => ({ id: v.id, name: v.registrationNumber }));
  }, [rawVehiclesData]);

  const { data: rawDriversData } = useQuery({
    queryKey: ['dispatcher-drivers-list-all'],
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
    queryKey: ['dispatcher-shipments-list-all'],
    queryFn: async () => {
      const response = await shipmentService.getShipments({ limit: 100 });
      return response.data.items;
    },
  });

  const { data: routesData } = useQuery({
    queryKey: ['dispatcher-routes-list-all'],
    queryFn: async () => {
      const response = await routeService.getRoutes({ limit: 100 });
      return response.data.items;
    },
  });

  // Create Trip Mutation
  const createMutation = useMutation({
    mutationFn: tripService.createTrip,
    onSuccess: (res) => {
      setSuccessMessage(`Dispatch Trip '${res.data.tripNumber}' created and scheduled successfully.`);
      setErrorMessage(null);
      void queryClient.invalidateQueries({ queryKey: ['dispatcher-trips-page'] });
      setModalOpen(false);
      clearAlertLater();
    },
    onError: (err: any) => {
      setErrorMessage(err.message || 'Failed to create trip dispatch.');
      setSuccessMessage(null);
    },
  });

  // Update Trip Mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<CreateTripPayload> }) => {
      return tripService.updateTrip(id, payload);
    },
    onSuccess: (res) => {
      setSuccessMessage(`Trip #${res.data.tripNumber} updated successfully.`);
      setErrorMessage(null);
      void queryClient.invalidateQueries({ queryKey: ['dispatcher-trips-page'] });
      setModalOpen(false);
      clearAlertLater();
    },
    onError: (err: any) => {
      setErrorMessage(err.message || 'Failed to update trip.');
      setSuccessMessage(null);
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
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <TripHeader
        totalTrips={data?.total || 0}
        onAddTrip={handleCreateClick}
        onRefresh={() => void refetch()}
        isRefreshing={isFetching}
      />

      {/* DISPATCHER SPECIFIC KPIS */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-2xl border border-amber-300/40 bg-amber-50/50 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#b45309]">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Awaiting Assign</span>
            <Clock className="h-4 w-4" />
          </div>
          <p className="text-2xl font-black text-[#b45309]">{dispatcherKpis.awaitingAssignment}</p>
          <span className="text-[10px] font-bold text-amber-700">Needs Driver/Vehicle</span>
        </div>

        <div className="p-4 rounded-2xl border border-blue-300/40 bg-blue-50/50 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-blue-700">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Dispatched</span>
            <Send className="h-4 w-4" />
          </div>
          <p className="text-2xl font-black text-blue-900">{dispatcherKpis.dispatched}</p>
          <span className="text-[10px] font-bold text-blue-700">Authorized for Route</span>
        </div>

        <div className="p-4 rounded-2xl border border-purple-300/40 bg-purple-50/50 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-purple-700">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">In Progress</span>
            <Map className="h-4 w-4" />
          </div>
          <p className="text-2xl font-black text-purple-900">{dispatcherKpis.inProgress}</p>
          <span className="text-[10px] font-bold text-purple-700">Active Corridor</span>
        </div>

        <div className="p-4 rounded-2xl border border-red-300/40 bg-red-50/50 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-red-700">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Delayed</span>
            <AlertTriangle className="h-4 w-4" />
          </div>
          <p className="text-2xl font-black text-red-900">{dispatcherKpis.delayed}</p>
          <span className="text-[10px] font-bold text-red-700">Schedule Lag</span>
        </div>

        <div className="p-4 rounded-2xl border border-emerald-300/40 bg-emerald-50/50 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-emerald-700">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Completed Today</span>
            <CheckCircle className="h-4 w-4" />
          </div>
          <p className="text-2xl font-black text-emerald-900">{dispatcherKpis.completedToday}</p>
          <span className="text-[10px] font-bold text-emerald-700">SLA Delivered</span>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="flex items-center gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-50 p-4 text-xs font-bold text-emerald-800">
          <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2.5 rounded-xl border border-red-500/20 bg-red-50 p-4 text-xs font-bold text-red-800">
          <AlertCircle className="h-4.5 w-4.5 shrink-0 text-red-600" />
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

      {/* Main Content Area (Note: NO Delete functionality passed for Dispatcher role) */}
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
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
          ) : (
            <TripCards
              trips={data.items}
              onView={handleViewClick}
              onEdit={handleEditClick}
            />
          )}

          {/* Pagination Controls */}
          {data.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 bg-white border border-[#c3c6d7]/30 rounded-2xl shadow-xs">
              <span className="text-xs font-semibold text-[#737686]">
                Showing Page <strong className="text-[#191c1e]">{data.page}</strong> of{' '}
                <strong className="text-[#191c1e]">{data.totalPages}</strong> (
                <strong className="text-[#191c1e]">{data.total}</strong> total dispatches)
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
    </div>
  );
};

export default DispatcherTripsPage;
