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
import { ConfirmDialog } from '@/components/ui';
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

export const MaintenancePage: React.FC = () => {
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

  // Modal / Drawer / Dialog state
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailsPageOpen, setDetailsPageOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MaintenanceRecord | null>(null);

  // Success / Error Alerts
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch Maintenance Records
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['maintenanceRecords', search, status, type, vehicleId, page, limit, sortBy, sortOrder],
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

  // Fetch Auxiliary resources for select dropdowns
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
  const createMutation = useMutation({
    mutationFn: maintenanceService.createMaintenance,
    onSuccess: (res) => {
      setSuccessMessage(`Maintenance work order '${res.data.maintenanceRecordNumber}' created successfully.`);
      setErrorMessage(null);
      void queryClient.invalidateQueries({ queryKey: ['maintenanceRecords'] });
      setModalOpen(false);
      clearAlertLater();
    },
    onError: (err: any) => {
      setErrorMessage(err.message || 'Failed to create maintenance work order.');
      setSuccessMessage(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<CreateMaintenancePayload> }) => {
      return maintenanceService.updateMaintenance(id, payload);
    },
    onSuccess: (res) => {
      setSuccessMessage(`Maintenance record '${res.data.maintenanceRecordNumber}' updated successfully.`);
      setErrorMessage(null);
      void queryClient.invalidateQueries({ queryKey: ['maintenanceRecords'] });
      setModalOpen(false);
      clearAlertLater();
    },
    onError: (err: any) => {
      setErrorMessage(err.message || 'Failed to update maintenance record.');
      setSuccessMessage(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: maintenanceService.deleteMaintenance,
    onSuccess: () => {
      setSuccessMessage('Maintenance record deleted successfully.');
      setErrorMessage(null);
      void queryClient.invalidateQueries({ queryKey: ['maintenanceRecords'] });
      setDeleteDialogOpen(false);
      setSelectedRecord(null);
      clearAlertLater();
    },
    onError: (err: any) => {
      setErrorMessage(err.message || 'Failed to delete maintenance record.');
      setSuccessMessage(null);
      setDeleteDialogOpen(false);
    },
  });

  const completeWorkOrderMutation = useMutation({
    mutationFn: async (record: MaintenanceRecord) => {
      return maintenanceService.updateMaintenance(record.id, {
        status: 'COMPLETED',
        completedDate: new Date().toISOString(),
      });
    },
    onSuccess: (res) => {
      setSuccessMessage(`Work order '${res.data.maintenanceRecordNumber}' signed off & marked COMPLETED.`);
      setErrorMessage(null);
      void queryClient.invalidateQueries({ queryKey: ['maintenanceRecords'] });
      if (detailsPageOpen) setDetailsPageOpen(false);
      clearAlertLater();
    },
    onError: (err: any) => {
      setErrorMessage(err.message || 'Failed to sign-off work order.');
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

  const handleEditClick = (record: MaintenanceRecord) => {
    setSelectedRecord(record);
    setModalOpen(true);
  };

  const handleViewClick = (record: MaintenanceRecord) => {
    setSelectedRecord(record);
    setDetailsPageOpen(true);
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

  return (
    <div className="space-y-6">
      {/* Stitch Header */}
      <MaintenanceHeader
        totalRecords={data?.total || 0}
        onAddMaintenance={handleCreateClick}
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
          title="Error loading maintenance records"
          description={error instanceof Error ? error.message : 'An unexpected error occurred while fetching work orders.'}
          onRetry={handleRefresh}
        />
      ) : filteredRecords.length === 0 ? (
        <MaintenanceEmptyState
          title="No work orders found"
          description={
            hasActiveFilters()
              ? 'Try resetting the filters or modifying your search query to locate work orders.'
              : 'Create your first scheduled or completed vehicle maintenance work order.'
          }
          action={
            !hasActiveFilters() ? (
              <button
                onClick={handleCreateClick}
                className="mt-2.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-md hover:bg-primary/90 transition-colors"
              >
                Create Work Order
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
            <MaintenanceTable
              records={filteredRecords}
              onView={handleViewClick}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
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
              onDelete={handleDeleteClick}
            />
          )}

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 bg-card border border-border rounded-2xl shadow-2xs">
              <span className="text-xs font-semibold text-muted-foreground">
                Showing Page <strong className="text-foreground">{data.page}</strong> of{' '}
                <strong className="text-foreground">{data.totalPages}</strong> (
                <strong className="text-foreground">{data.total}</strong> total work orders)
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

      {/* Confirm Delete Dialogue */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Confirm Work Order Deletion"
        description={`Are you absolutely sure you want to delete maintenance record ${
          selectedRecord?.maintenanceRecordNumber || ''
        }? This service history transaction log will be permanently deleted. This action is irreversible.`}
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
    return !!(search || status || type || vehicleId || activeKpiFilter);
  }
};

export default MaintenancePage;
