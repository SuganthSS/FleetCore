import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, AlertCircle, CheckCircle2, Play, CheckCircle, Clock } from 'lucide-react';
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

export const FleetManagerTripsPage: React.FC = () => {
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

  // Notifications
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch Trips
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['fleet-manager-trips', search, status, vehicleId, driverId, shipmentId, routeId, page, limit, sortBy, sortOrder],
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

  // Calculate Operational Metrics
  const kpiData = useMemo(() => {
    const items = data?.items || [];
    const total = data?.total || 0;
    const scheduled = items.filter((i) => i.status === 'SCHEDULED').length;
    const dispatched = items.filter((i) => i.status === 'DISPATCHED').length;
    const inTransit = items.filter((i) => i.status === 'IN_TRANSIT').length;
    const completed = items.filter((i) => i.status === 'COMPLETED').length;
    const issues = items.filter((i) => i.status === 'CANCELLED' || i.status === 'FAILED' || i.status === 'PAUSED').length;

    return { total, scheduled, dispatched, inTransit, completed, issues };
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

  // Mutations
  const invalidateTrips = () => {
    void queryClient.invalidateQueries({ queryKey: ['fleet-manager-trips'] });
    void queryClient.invalidateQueries({ queryKey: ['trips'] });
  };

  const showAlert = (msg: string, type: 'success' | 'error') => {
    if (type === 'success') { setSuccessMessage(msg); setErrorMessage(null); }
    else { setErrorMessage(msg); setSuccessMessage(null); }
    setTimeout(() => { setSuccessMessage(null); setErrorMessage(null); }, 4500);
  };

  const createMutation = useMutation({
    mutationFn: tripService.createTrip,
    onSuccess: (res) => {
      showAlert(`Trip '${res.data.tripNumber}' dispatched to driver.`, 'success');
      invalidateTrips();
      setModalOpen(false);
    },
    onError: (err: any) => showAlert(err.message || 'Failed to dispatch trip.', 'error'),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<CreateTripPayload> }) => {
      return tripService.updateTrip(id, payload);
    },
    onSuccess: (res) => {
      showAlert(`Trip '${res.data.tripNumber}' updated successfully.`, 'success');
      invalidateTrips();
      setModalOpen(false);
    },
    onError: (err: any) => showAlert(err.message || 'Failed to update trip.', 'error'),
  });

  // Quick Dispatch / Complete Handlers
  const handleQuickDispatchTrip = (id: string) => {
    const trip = data?.items.find((t) => t.id === id) ?? selectedTrip;
    if (trip) {
      updateMutation.mutate({ id: trip.id, payload: { status: 'DISPATCHED' } });
      showAlert(`Trip '${trip.tripNumber}' status set to DISPATCHED.`, 'success');
    }
  };

  const handleQuickCompleteTrip = (id: string) => {
    const trip = data?.items.find((t) => t.id === id) ?? selectedTrip;
    if (trip) {
      updateMutation.mutate({ id: trip.id, payload: { status: 'COMPLETED' } });
      showAlert(`Trip '${trip.tripNumber}' marked as COMPLETED.`, 'success');
    }
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
        message={error instanceof Error ? error.message : 'Could not retrieve operational trip records.'}
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#c3c6d7]/30 shadow-sm">
        <TripHeader
          totalTrips={data?.total || 0}
          onAddTrip={handleCreateClick}
          onRefresh={() => void refetch()}
          isRefreshing={isFetching}
        />
      </div>

      {/* Operational Dispatch KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => { setStatus('SCHEDULED'); setPage(1); }}
          className={`p-5 rounded-2xl border text-left transition-all bg-white shadow-sm ${
            status === 'SCHEDULED' ? 'border-[#2563eb] ring-2 ring-[#2563eb]/20' : 'border-[#c3c6d7]/30 hover:border-[#2563eb]/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#737686]">Today's Departures</span>
            <div className="p-2 rounded-xl bg-[#2563eb]/10 text-[#2563eb]">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#191c1e] font-['Plus_Jakarta_Sans'] mt-3">{kpiData.scheduled} Scheduled</p>
          <p className="text-xs text-[#2563eb] font-semibold mt-1">Pending dispatch</p>
        </button>

        <button
          onClick={() => { setStatus('IN_TRANSIT'); setPage(1); }}
          className={`p-5 rounded-2xl border text-left transition-all bg-white shadow-sm ${
            status === 'IN_TRANSIT' ? 'border-[#2563eb] ring-2 ring-[#2563eb]/20' : 'border-[#c3c6d7]/30 hover:border-[#2563eb]/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#737686]">Active On Route</span>
            <div className="p-2 rounded-xl bg-[#10b981]/10 text-[#10b981]">
              <Play className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#191c1e] font-['Plus_Jakarta_Sans'] mt-3">{kpiData.inTransit} In Transit</p>
          <p className="text-xs text-[#10b981] font-semibold mt-1">GPS tracking live</p>
        </button>

        <button
          onClick={() => { setStatus('COMPLETED'); setPage(1); }}
          className={`p-5 rounded-2xl border text-left transition-all bg-white shadow-sm ${
            status === 'COMPLETED' ? 'border-[#2563eb] ring-2 ring-[#2563eb]/20' : 'border-[#c3c6d7]/30 hover:border-[#2563eb]/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#737686]">Completed Today</span>
            <div className="p-2 rounded-xl bg-[#10b981]/10 text-[#10b981]">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#191c1e] font-['Plus_Jakarta_Sans'] mt-3">{kpiData.completed} Delivered</p>
          <p className="text-xs text-[#10b981] font-semibold mt-1">100% On-time delivery</p>
        </button>

        <button
          onClick={() => { setStatus('CANCELLED'); setPage(1); }}
          className={`p-5 rounded-2xl border border-[#c3c6d7]/30 bg-white text-left shadow-sm hover:border-[#ef4444]/50 ${
            status === 'CANCELLED' ? 'border-[#ef4444] ring-2 ring-[#ef4444]/20' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#737686]">Operational Alerts</span>
            <div className="p-2 rounded-xl bg-[#ef4444]/10 text-[#ef4444]">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#191c1e] font-['Plus_Jakarta_Sans'] mt-3">{kpiData.issues} Issues</p>
          <p className="text-xs text-[#ef4444] font-semibold mt-1">Requires manager review</p>
        </button>
      </div>

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

      {/* Toolbar */}
      <div className="bg-white p-5 rounded-2xl border border-[#c3c6d7]/30 shadow-sm">
        <TripToolbar
          search={search}
          onSearchChange={(val: string) => { setSearch(val); setPage(1); }}
          status={status}
          onStatusChange={(val: string) => { setStatus(val); setPage(1); }}
          vehicleId={vehicleId}
          onVehicleIdChange={(val: string) => { setVehicleId(val); setPage(1); }}
          driverId={driverId}
          onDriverIdChange={(val: string) => { setDriverId(val); setPage(1); }}
          routeId={routeId}
          onRouteIdChange={(val: string) => { setRouteId(val); setPage(1); }}
          vehicles={vehiclesData || []}
          drivers={driversData || []}
          routes={(routesData || []).map((r) => ({ id: r.id, name: r.routeCode }))}
          sortBy={sortBy}
          onSortByChange={(val) => { setSortBy(val); setPage(1); }}
          sortOrder={sortOrder}
          onSortOrderChange={(val) => setSortOrder(val)}
          viewMode={viewMode}
          onViewModeChange={(mode) => setViewMode(mode)}
          onClearFilters={handleClearFilters}
        />
      </div>

      {/* Main Table / Cards */}
      {!data || data.items.length === 0 ? (
        <TripEmptyState
          hasFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
          onCreateTrip={handleCreateClick}
        />
      ) : (
        <div className="space-y-4">
          {viewMode === 'table' ? (
            <div className="bg-white rounded-2xl border border-[#c3c6d7]/30 shadow-sm overflow-hidden p-1">
              <TripTable
                trips={data.items}
                onView={handleViewClick}
                onEdit={handleEditClick}
                onDelete={handleQuickDispatchTrip}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
              />
            </div>
          ) : (
            <TripCards
              trips={data.items}
              onView={handleViewClick}
              onEdit={handleEditClick}
              onDelete={handleQuickCompleteTrip}
            />
          )}

          {/* Pagination Controls */}
          {data.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 bg-white border border-[#c3c6d7]/30 rounded-2xl shadow-xs">
              <span className="text-xs font-semibold text-[#737686]">
                Showing Page <strong className="text-[#191c1e]">{data.page}</strong> of{' '}
                <strong className="text-[#191c1e]">{data.totalPages}</strong> (
                <strong className="text-[#191c1e]">{data.total}</strong> total trips)
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1 || isFetching}
                  className="h-8.5 px-3 text-xs border-[#c3c6d7]"
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
                            ? 'bg-[#2563eb] text-white font-bold'
                            : 'bg-transparent text-[#737686] hover:bg-[#eceef0]'
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
                  className="h-8.5 px-3 text-xs border-[#c3c6d7]"
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

export default FleetManagerTripsPage;
