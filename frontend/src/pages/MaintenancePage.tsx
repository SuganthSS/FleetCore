import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, ChevronLeft, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { maintenanceService } from '@/services/maintenance.service';
import { vehicleService } from '@/services/vehicle.service';
import { driverService } from '@/services/driver.service';
import type { MaintenanceRecord, CreateMaintenancePayload, MaintenanceType, MaintenanceStatus } from '@/types/maintenance';
import {
  PageHeader,
  Button,
  ErrorState,
  EmptyState,
  ConfirmDialog,
} from '@/components/ui';
import {
  MaintenanceTable,
  MaintenanceToolbar,
  MaintenanceModal,
  MaintenanceDetailsDrawer,
  MaintenanceSkeleton,
} from '@/components/maintenance';

export const MaintenancePage: React.FC = () => {
  const queryClient = useQueryClient();

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Modal / Drawer state
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
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

  // Create Mutation
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

  // Update Mutation
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

  // Delete Mutation
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
        title="Maintenance"
        description="Manage vehicle maintenance schedules, repairs and service records."
        actions={
          <Button onClick={handleCreateClick} className="flex items-center gap-2">
            <Plus className="h-4.5 w-4.5" />
            Create Maintenance Record
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
        onRefresh={handleRefresh}
        onClearFilters={handleClearFilters}
        vehicles={vehiclesData || []}
        isRefreshing={isFetching}
      />

      {/* Main Table Content */}
      {isLoading && !data ? (
        <MaintenanceSkeleton />
      ) : error ? (
        <ErrorState
          title="Error loading maintenance logs"
          description={error instanceof Error ? error.message : 'An unexpected error occurred while fetching maintenance records.'}
          onRetry={handleRefresh}
        />
      ) : !data || data.items.length === 0 ? (
        <EmptyState
          title="No maintenance records found"
          description={
            hasActiveFilters()
              ? 'Try resetting the filters or modifying your search query to locate maintenance records.'
              : 'Create your first scheduled or completed vehicle maintenance work order.'
          }
          action={
            !hasActiveFilters() ? (
              <Button onClick={handleCreateClick} className="mt-2.5">
                Create Maintenance Record
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
          <MaintenanceTable
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

      {/* Modal Form */}
      <MaintenanceModal
        open={modalOpen}
        record={selectedRecord}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
        vehicles={vehiclesData || []}
        drivers={driversData || []}
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

      {/* Delete Confirmation Dialogue */}
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
    return !!(search || status || type || vehicleId);
  }
};
export default MaintenancePage;
