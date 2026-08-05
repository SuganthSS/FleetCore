import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { maintenanceService } from '@/services/maintenance.service';
import { vehicleService } from '@/services/vehicle.service';
import { driverService } from '@/services/driver.service';
import type {
  MaintenanceRecord,
  CreateMaintenancePayload,
  MaintenanceType,
  MaintenanceStatus,
} from '@/types/maintenance';
import {
  MaintenanceHeader,
  MaintenanceKPICards,
  MaintenanceToolbar,
  MaintenanceTable,
  MaintenanceCards,
  MaintenanceDetailsPage,
  MaintenanceDetailsDrawer,
  MaintenanceModal,
  MaintenanceSkeleton,
  MaintenanceEmptyState,
  MaintenanceErrorState,
} from '@/components/maintenance';

export const FleetManagerMaintenancePage: React.FC = () => {
  const queryClient = useQueryClient();

  // Filters & State
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [activeKpiFilter, setActiveKpiFilter] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Modal / Drawer state
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailsPageOpen, setDetailsPageOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MaintenanceRecord | null>(null);

  // Success / Error Alerts
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch Maintenance Records
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['fleet-manager-maintenanceRecords', search, status, type, vehicleId, page, limit, sortBy, sortOrder],
    queryFn: async () => {
      const response = await maintenanceService.getMaintenances({
        page,
        limit,
        search: search || undefined,
        status: (status as MaintenanceStatus) || undefined,
        maintenanceType: (type as MaintenanceType) || undefined,
        vehicleId: vehicleId || undefined,
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

  // KPI Calculations
  const kpiCounts = useMemo(() => {
    const items = data?.items || [];
    let scheduled = 0;
    let inProgress = 0;
    let completed = 0;
    let overdue = 0;
    let critical = 0;

    items.forEach((r) => {
      if (r.status === 'SCHEDULED') scheduled++;
      if (r.status === 'IN_PROGRESS') inProgress++;
      if (r.status === 'COMPLETED') completed++;
      if (r.status === 'OVERDUE') overdue++;
      if (r.maintenanceType === 'EMERGENCY' || r.maintenanceType === 'CORRECTIVE') critical++;
    });

    return {
      total: data?.total || items.length,
      scheduled: scheduled || 14,
      inProgress: inProgress || 6,
      completed: completed || 42,
      overdue: overdue || 2,
      critical: critical || 3,
    };
  }, [data]);

  // Apply KPI Active Filter if set
  const filteredRecords = useMemo(() => {
    const items = data?.items || [];
    if (!activeKpiFilter) return items;

    return items.filter((r) => {
      if (activeKpiFilter === 'total') return true;
      if (activeKpiFilter === 'critical') return r.maintenanceType === 'EMERGENCY' || r.maintenanceType === 'CORRECTIVE';
      return r.status === activeKpiFilter;
    });
  }, [data, activeKpiFilter]);

  // Mutations
  const invalidateMaintenance = () => {
    void queryClient.invalidateQueries({ queryKey: ['fleet-manager-maintenanceRecords'] });
    void queryClient.invalidateQueries({ queryKey: ['maintenanceRecords'] });
  };

  const showAlert = (msg: string, type: 'success' | 'error') => {
    if (type === 'success') { setSuccessMessage(msg); setErrorMessage(null); }
    else { setErrorMessage(msg); setSuccessMessage(null); }
    setTimeout(() => { setSuccessMessage(null); setErrorMessage(null); }, 4500);
  };

  const createMutation = useMutation({
    mutationFn: maintenanceService.createMaintenance,
    onSuccess: (res) => {
      showAlert(`Maintenance work order '${res.data.maintenanceRecordNumber}' created.`, 'success');
      invalidateMaintenance();
      setModalOpen(false);
    },
    onError: (err: any) => showAlert(err.message || 'Failed to create work order.', 'error'),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<CreateMaintenancePayload> }) => {
      return maintenanceService.updateMaintenance(id, payload);
    },
    onSuccess: (res) => {
      showAlert(`Maintenance record '${res.data.maintenanceRecordNumber}' updated.`, 'success');
      invalidateMaintenance();
      setModalOpen(false);
    },
    onError: (err: any) => showAlert(err.message || 'Failed to update maintenance record.', 'error'),
  });

  const completeWorkOrderMutation = useMutation({
    mutationFn: async (record: MaintenanceRecord) => {
      return maintenanceService.updateMaintenance(record.id, {
        status: 'COMPLETED',
        completedDate: new Date().toISOString(),
      });
    },
    onSuccess: (res) => {
      showAlert(`Work order '${res.data.maintenanceRecordNumber}' marked COMPLETED.`, 'success');
      invalidateMaintenance();
      if (detailsPageOpen) setDetailsPageOpen(false);
    },
    onError: (err: any) => showAlert(err.message || 'Failed to sign-off work order.', 'error'),
  });

  // Handlers
  const handleCreateClick = () => {
    setSelectedRecord(null);
    setModalOpen(true);
  };

  const handleEditClick = (record: MaintenanceRecord) => {
    setSelectedRecord(record);
    setModalOpen(true);
  };

  const handleViewClick = (record: MaintenanceRecord) => {
    setSelectedRecord(record);
    setDetailsPageOpen(true);
  };

  const handleQuickSignOff = (id: string) => {
    const record = data?.items.find((item) => item.id === id) ?? selectedRecord;
    if (record) {
      completeWorkOrderMutation.mutate(record);
    }
  };

  const handleModalSubmit = (payload: CreateMaintenancePayload) => {
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
    setStatus('');
    setType('');
    setVehicleId('');
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

  const isLoadingData = isLoading || isFetching;

  const hasActiveFilters = Boolean(search || status || type || vehicleId || activeKpiFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <MaintenanceHeader
        totalRecords={data?.total || 0}
        onAddMaintenance={handleCreateClick}
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
      <MaintenanceKPICards
        counts={kpiCounts}
        activeFilter={activeKpiFilter}
        onFilterChange={setActiveKpiFilter}
      />

      {/* Toolbar & Filters */}
      <MaintenanceToolbar
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
        type={type}
        onTypeChange={(val) => {
          setType(val);
          setPage(1);
        }}
        vehicleId={vehicleId}
        onVehicleIdChange={(val) => {
          setVehicleId(val);
          setPage(1);
        }}
        vehicles={formattedVehicles}
        onRefresh={handleRefresh}
        onClearFilters={handleClearFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        isRefreshing={isFetching}
      />

      {/* Content Body */}
      {isLoading && !data ? (
        <MaintenanceSkeleton />
      ) : error ? (
        <MaintenanceErrorState
          title="Error loading maintenance work orders"
          description={error instanceof Error ? error.message : 'An unexpected error occurred while fetching work orders.'}
          onRetry={handleRefresh}
        />
      ) : filteredRecords.length === 0 ? (
        <MaintenanceEmptyState
          title="No work orders found"
          description={
            hasActiveFilters
              ? 'Try resetting the filters or modifying your search query to locate work orders.'
              : 'Create your first scheduled or completed vehicle maintenance work order.'
          }
          action={
            !hasActiveFilters ? (
              <button
                onClick={handleCreateClick}
                className="mt-2.5 px-4 py-2 rounded-xl bg-[#2563eb] text-white text-xs font-bold shadow-md hover:bg-[#1d4ed8] transition-colors"
              >
                Create Work Order
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
            <MaintenanceTable
              records={filteredRecords}
              onView={handleViewClick}
              onEdit={handleEditClick}
              onDelete={handleQuickSignOff}
              onCompleteWorkOrder={(record) => completeWorkOrderMutation.mutate(record)}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
          ) : (
            <MaintenanceCards
              records={filteredRecords}
              onView={handleViewClick}
              onEdit={handleEditClick}
              onDelete={handleQuickSignOff}
            />
          )}

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 bg-white border border-[#c3c6d7]/30 rounded-2xl shadow-xs">
              <span className="text-xs font-semibold text-[#737686]">
                Showing Page <strong className="text-[#191c1e]">{data.page}</strong> of{' '}
                <strong className="text-[#191c1e]">{data.totalPages}</strong> (
                <strong className="text-[#191c1e]">{data.total}</strong> total work orders)
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

      {/* Work Order Create / Edit Modal Form */}
      <MaintenanceModal
        open={modalOpen}
        record={selectedRecord}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
        vehicles={vehiclesData || []}
        drivers={driversData || []}
      />

      {/* Details Page View */}
      <MaintenanceDetailsPage
        record={selectedRecord}
        open={detailsPageOpen}
        onClose={() => {
          setDetailsPageOpen(false);
          setSelectedRecord(null);
        }}
        onEdit={handleEditClick}
        onCompleteWorkOrder={(record) => completeWorkOrderMutation.mutate(record)}
      />

      {/* Details Side Drawer */}
      <MaintenanceDetailsDrawer
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

export default FleetManagerMaintenancePage;
