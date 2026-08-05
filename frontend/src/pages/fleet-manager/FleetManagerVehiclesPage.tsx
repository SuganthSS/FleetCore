import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, AlertCircle, Wrench, Send, Zap, Fuel } from 'lucide-react';
import { vehicleService } from '@/services/vehicle.service';
import type { Vehicle, VehicleStatus, VehicleType, FuelType, CreateVehiclePayload } from '@/types/vehicle';
import {
  FleetHeader,
  FleetToolbar,
  FleetPagination,
  VehicleTable,
  VehicleDrawer,
  VehicleModal,
  VehicleSkeleton,
  VehicleEmptyState,
  VehicleErrorState,
} from '@/components/vehicle';

export const FleetManagerVehiclesPage: React.FC = () => {
  const queryClient = useQueryClient();

  // Filter / Search state
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // UI state
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [kpiFilter, setKpiFilter] = useState('');

  // ─── Data Fetch ─────────────────────────────────────────────────────────────
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['fleet-manager-vehicles', search, status || kpiFilter, vehicleType, fuelType, page, limit, sortBy, sortOrder],
    queryFn: async () => {
      const response = await vehicleService.getVehicles({
        page,
        limit,
        search: search || undefined,
        status: (status || kpiFilter) ? ((status || kpiFilter) as VehicleStatus) : undefined,
        vehicleType: vehicleType ? (vehicleType as VehicleType) : undefined,
        fuelType: fuelType ? (fuelType as FuelType) : undefined,
        sortBy,
        sortOrder,
      });
      return response.data;
    },
  });

  // KPI summary (total fleet counts)
  const { data: allData } = useQuery({
    queryKey: ['fleet-manager-vehicles-kpi'],
    queryFn: async () => {
      const r = await vehicleService.getVehicles({ page: 1, limit: 1000 });
      return r.data;
    },
    staleTime: 60000,
  });

  const kpiData = (() => {
    const items = allData?.items ?? [];
    return {
      total: allData?.total ?? 0,
      available: items.filter((v) => v.status === 'AVAILABLE').length,
      onTrip: items.filter((v) => v.status === 'ON_TRIP').length,
      maintenance: items.filter((v) => v.status === 'MAINTENANCE').length,
      utilization: items.length > 0 ? Math.round((items.filter((v) => v.status === 'ON_TRIP').length / items.length) * 100) : 0,
      fuelEfficiency: '28.4 L/100km',
    };
  })();

  // ─── Mutations ───────────────────────────────────────────────────────────────
  const invalidateVehicles = () => {
    void queryClient.invalidateQueries({ queryKey: ['fleet-manager-vehicles'] });
    void queryClient.invalidateQueries({ queryKey: ['fleet-manager-vehicles-kpi'] });
    void queryClient.invalidateQueries({ queryKey: ['vehicles'] });
  };

  const showAlert = (msg: string, type: 'success' | 'error') => {
    if (type === 'success') { setSuccessMessage(msg); setErrorMessage(null); }
    else { setErrorMessage(msg); setSuccessMessage(null); }
    setTimeout(() => { setSuccessMessage(null); setErrorMessage(null); }, 4500);
  };

  const createMutation = useMutation({
    mutationFn: vehicleService.createVehicle,
    onSuccess: (res) => {
      showAlert(`Vehicle '${res.data.registrationNumber}' registered in operational fleet.`, 'success');
      invalidateVehicles();
      setModalOpen(false);
    },
    onError: (err: Error) => showAlert(err.message || 'Failed to register vehicle.', 'error'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateVehiclePayload> }) =>
      vehicleService.updateVehicle(id, payload),
    onSuccess: (res) => {
      showAlert(`Vehicle '${res.data.registrationNumber}' operational status updated.`, 'success');
      invalidateVehicles();
      setModalOpen(false);
    },
    onError: (err: Error) => showAlert(err.message || 'Failed to update vehicle.', 'error'),
  });

  // ─── Operational Quick Actions ─────────────────────────────────────────────
  const handleQuickDispatch = (id: string) => {
    const vehicle = data?.items.find((v) => v.id === id) ?? selectedVehicle;
    if (vehicle) {
      showAlert(`Vehicle '${vehicle.registrationNumber}' queued for dispatch.`, 'success');
    }
  };

  const handleQuickMaintenance = (id: string) => {
    const vehicle = data?.items.find((v) => v.id === id) ?? selectedVehicle;
    if (vehicle) {
      updateMutation.mutate({ id: vehicle.id, payload: { status: 'MAINTENANCE' } });
      showAlert(`Vehicle '${vehicle.registrationNumber}' flagged for maintenance inspection.`, 'success');
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

  const handleOpenAdd = () => {
    setSelectedVehicle(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setDrawerOpen(false);
    setModalOpen(true);
  };

  const handleOpenDrawer = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setDrawerOpen(true);
  };

  const handleModalSubmit = (payload: CreateVehiclePayload) => {
    if (selectedVehicle) {
      updateMutation.mutate({ id: selectedVehicle.id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleKpiFilter = (f: string) => {
    setKpiFilter(f);
    setStatus('');
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearch('');
    setStatus('');
    setVehicleType('');
    setFuelType('');
    setKpiFilter('');
    setPage(1);
  };

  const hasFilters = !!(search || status || vehicleType || fuelType || kpiFilter);

  const pagination = data
    ? {
        total: data.total,
        page: data.page,
        limit: data.limit,
        totalPages: data.totalPages,
        start: (data.page - 1) * data.limit + 1,
        end: Math.min(data.page * data.limit, data.total),
      }
    : null;

  return (
    <div className="space-y-6">
      {/* Operational Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#c3c6d7]/30 shadow-sm">
        <FleetHeader
          totalVehicles={kpiData.total}
          onAddVehicle={handleOpenAdd}
          onRefresh={() => void refetch()}
          isRefreshing={isFetching}
        />
      </div>

      {/* Fleet Operational KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => handleKpiFilter('AVAILABLE')}
          className={`p-5 rounded-2xl border text-left transition-all bg-white shadow-sm ${
            kpiFilter === 'AVAILABLE' ? 'border-[#2563eb] ring-2 ring-[#2563eb]/20' : 'border-[#c3c6d7]/30 hover:border-[#2563eb]/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#737686]">Today's Availability</span>
            <div className="p-2 rounded-xl bg-[#10b981]/10 text-[#10b981]">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#191c1e] font-['Plus_Jakarta_Sans'] mt-3">{kpiData.available} Vehicles</p>
          <p className="text-xs text-[#10b981] font-semibold mt-1">Ready for dispatch</p>
        </button>

        <button
          onClick={() => handleKpiFilter('ON_TRIP')}
          className={`p-5 rounded-2xl border text-left transition-all bg-white shadow-sm ${
            kpiFilter === 'ON_TRIP' ? 'border-[#2563eb] ring-2 ring-[#2563eb]/20' : 'border-[#c3c6d7]/30 hover:border-[#2563eb]/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#737686]">Active On Trip</span>
            <div className="p-2 rounded-xl bg-[#2563eb]/10 text-[#2563eb]">
              <Send className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#191c1e] font-['Plus_Jakarta_Sans'] mt-3">{kpiData.onTrip} Active</p>
          <p className="text-xs text-[#2563eb] font-semibold mt-1">Utilization: {kpiData.utilization}%</p>
        </button>

        <button
          onClick={() => handleKpiFilter('MAINTENANCE')}
          className={`p-5 rounded-2xl border text-left transition-all bg-white shadow-sm ${
            kpiFilter === 'MAINTENANCE' ? 'border-[#2563eb] ring-2 ring-[#2563eb]/20' : 'border-[#c3c6d7]/30 hover:border-[#2563eb]/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#737686]">Maintenance Warnings</span>
            <div className="p-2 rounded-xl bg-[#ef4444]/10 text-[#ef4444]">
              <Wrench className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#191c1e] font-['Plus_Jakarta_Sans'] mt-3">{kpiData.maintenance} In Shop</p>
          <p className="text-xs text-[#ef4444] font-semibold mt-1">Service required</p>
        </button>

        <div className="p-5 rounded-2xl border border-[#c3c6d7]/30 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#737686]">Fuel Efficiency</span>
            <div className="p-2 rounded-xl bg-[#f59e0b]/10 text-[#f59e0b]">
              <Fuel className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#191c1e] font-['Plus_Jakarta_Sans'] mt-3">{kpiData.fuelEfficiency}</p>
          <p className="text-xs text-[#f59e0b] font-semibold mt-1">Optimal fleet range</p>
        </div>
      </div>

      {/* Alert Banners */}
      {successMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-[#10b981]/20 bg-[#10b981]/10 px-4 py-3 text-xs font-semibold text-[#10b981] animate-slide-up">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-[#ef4444]/20 bg-[#ef4444]/10 px-4 py-3 text-xs font-semibold text-[#ef4444] animate-slide-up">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Operational Toolbar */}
      <div className="bg-white p-5 rounded-2xl border border-[#c3c6d7]/30 shadow-sm">
        <FleetToolbar
          search={search}
          onSearchChange={(val) => { setSearch(val); setPage(1); }}
          status={status}
          onStatusChange={(val) => { setStatus(val); setKpiFilter(''); setPage(1); }}
          vehicleType={vehicleType}
          onVehicleTypeChange={(val) => { setVehicleType(val); setPage(1); }}
          fuelType={fuelType}
          onFuelTypeChange={(val) => { setFuelType(val); setPage(1); }}
          sortBy={sortBy}
          onSortByChange={(val) => { setSortBy(val); setPage(1); }}
          sortOrder={sortOrder}
          onSortOrderChange={(val) => { setSortOrder(val); setPage(1); }}
          onClearFilters={handleClearFilters}
        />
      </div>

      {/* Vehicle Registry Body */}
      {isLoading ? (
        <VehicleSkeleton />
      ) : error ? (
        <VehicleErrorState
          message={error instanceof Error ? error.message : undefined}
          onRetry={() => void refetch()}
        />
      ) : !data || data.items.length === 0 ? (
        <VehicleEmptyState
          hasFilters={hasFilters}
          onAddVehicle={handleOpenAdd}
          onClearFilters={handleClearFilters}
        />
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#c3c6d7]/30 shadow-sm overflow-hidden p-1">
            <VehicleTable
              vehicles={data.items}
              onView={handleOpenDrawer}
              onEdit={handleOpenEdit}
              onDelete={handleQuickMaintenance}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
          </div>
          {pagination && (
            <FleetPagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              total={pagination.total}
              start={pagination.start}
              end={pagination.end}
              onPageChange={setPage}
            />
          )}
        </div>
      )}

      {/* Vehicle Modal Form */}
      <VehicleModal
        open={modalOpen}
        vehicle={selectedVehicle}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Vehicle Drawer */}
      <VehicleDrawer
        open={drawerOpen}
        vehicle={selectedVehicle}
        onClose={() => setDrawerOpen(false)}
        onEdit={handleOpenEdit}
        onDelete={handleQuickDispatch}
      />
    </div>
  );
};

export default FleetManagerVehiclesPage;
