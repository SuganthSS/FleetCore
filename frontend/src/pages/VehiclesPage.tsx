import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { vehicleService } from '@/services/vehicle.service';
import type { Vehicle, VehicleStatus, VehicleType, FuelType, CreateVehiclePayload } from '@/types/vehicle';
import { ConfirmDialog } from '@/components/ui';
import {
  FleetHeader,
  FleetKPICards,
  FleetToolbar,
  FleetPagination,
  VehicleTable,
  VehicleDrawer,
  VehicleModal,
  VehicleSkeleton,
  VehicleEmptyState,
  VehicleErrorState,
} from '@/components/vehicle';

export const VehiclesPage: React.FC = () => {
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // KPI filter — for quick card-click filtering
  const [kpiFilter, setKpiFilter] = useState('');

  // ─── Data Fetch ─────────────────────────────────────────────────────────────
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['vehicles', search, status || kpiFilter, vehicleType, fuelType, page, limit, sortBy, sortOrder],
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

  // KPI summary (total fleet counts) — separate query without filters
  const { data: allData } = useQuery({
    queryKey: ['vehicles-kpi'],
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
      inactive: items.filter((v) => v.status === 'OUT_OF_SERVICE' || v.status === 'DECOMMISSIONED').length,
    };
  })();

  // ─── Mutations ───────────────────────────────────────────────────────────────
  const invalidateVehicles = () => {
    void queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    void queryClient.invalidateQueries({ queryKey: ['vehicles-kpi'] });
  };

  const showAlert = (msg: string, type: 'success' | 'error') => {
    if (type === 'success') { setSuccessMessage(msg); setErrorMessage(null); }
    else { setErrorMessage(msg); setSuccessMessage(null); }
    setTimeout(() => { setSuccessMessage(null); setErrorMessage(null); }, 4500);
  };

  const createMutation = useMutation({
    mutationFn: vehicleService.createVehicle,
    onSuccess: (res) => {
      showAlert(`Vehicle '${res.data.registrationNumber}' added to fleet.`, 'success');
      invalidateVehicles();
      setModalOpen(false);
    },
    onError: (err: Error) => showAlert(err.message || 'Failed to create vehicle.', 'error'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateVehiclePayload> }) =>
      vehicleService.updateVehicle(id, payload),
    onSuccess: (res) => {
      showAlert(`Vehicle '${res.data.registrationNumber}' updated successfully.`, 'success');
      invalidateVehicles();
      setModalOpen(false);
    },
    onError: (err: Error) => showAlert(err.message || 'Failed to update vehicle.', 'error'),
  });

  const deleteMutation = useMutation({
    mutationFn: vehicleService.deleteVehicle,
    onSuccess: () => {
      showAlert('Vehicle removed from fleet.', 'success');
      invalidateVehicles();
      setDeleteDialogOpen(false);
      setDrawerOpen(false);
    },
    onError: (err: Error) => {
      showAlert(err.message || 'Failed to delete vehicle.', 'error');
      setDeleteDialogOpen(false);
    },
  });

  // ─── Handlers ────────────────────────────────────────────────────────────────
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

  const handleOpenDelete = (id: string) => {
    const vehicle = data?.items.find((v) => v.id === id) ?? selectedVehicle;
    if (vehicle) {
      setSelectedVehicle(vehicle);
      setDeleteDialogOpen(true);
    }
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

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      {/* Header */}
      <FleetHeader
        totalVehicles={kpiData.total}
        onAddVehicle={handleOpenAdd}
        onRefresh={() => void refetch()}
        isRefreshing={isFetching}
      />

      {/* Fleet KPI Cards */}
      <FleetKPICards
        data={kpiData}
        activeFilter={kpiFilter}
        onFilterChange={handleKpiFilter}
      />

      {/* Alert Banner */}
      {successMessage && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400 animate-slide-up">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive animate-slide-up">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      {/* Toolbar */}
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

      {/* Body */}
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
        <div className="space-y-3">
          <VehicleTable
            vehicles={data.items}
            onView={handleOpenDrawer}
            onEdit={handleOpenEdit}
            onDelete={handleOpenDelete}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
          />
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

      {/* Vehicle Form Modal */}
      <VehicleModal
        open={modalOpen}
        vehicle={selectedVehicle}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Vehicle Detail Drawer */}
      <VehicleDrawer
        open={drawerOpen}
        vehicle={selectedVehicle}
        onClose={() => setDrawerOpen(false)}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      {/* Confirm Delete */}
      <ConfirmDialog
        open={deleteDialogOpen}
        destructive
        title="Remove Vehicle from Fleet?"
        description={
          selectedVehicle
            ? `Are you sure you want to permanently delete '${selectedVehicle.registrationNumber}' (${selectedVehicle.make} ${selectedVehicle.model}) from your fleet? This action cannot be undone.`
            : 'Are you sure you want to delete this vehicle?'
        }
        confirmLabel="Delete Asset"
        cancelLabel="Keep Asset"
        loading={deleteMutation.isPending}
        onConfirm={() => selectedVehicle && deleteMutation.mutate(selectedVehicle.id)}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
};

export default VehiclesPage;
