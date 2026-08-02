import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, ChevronLeft, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { vehicleService } from '@/services/vehicle.service';
import type { Vehicle, VehicleStatus, VehicleType, CreateVehiclePayload } from '@/types/vehicle';
import {
  PageHeader,
  Button,
  ErrorState,
  EmptyState,
  ConfirmDialog,
} from '@/components/ui';
import {
  VehicleTable,
  VehicleToolbar,
  VehicleModal,
  VehicleDetailsDrawer,
  VehicleSkeleton,
} from '@/components/vehicle';

export const VehiclesPage: React.FC = () => {
  const queryClient = useQueryClient();

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Modal / Drawer state
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // Success / Error Alerts
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch Vehicles
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['vehicles', search, status, vehicleType, page, limit, sortBy, sortOrder],
    queryFn: async () => {
      const response = await vehicleService.getVehicles({
        page,
        limit,
        search: search || undefined,
        status: status ? (status as VehicleStatus) : undefined,
        vehicleType: vehicleType ? (vehicleType as VehicleType) : undefined,
        sortBy,
        sortOrder,
      });
      return response.data;
    },
  });

  // Create Vehicle Mutation
  const createMutation = useMutation({
    mutationFn: vehicleService.createVehicle,
    onSuccess: (res) => {
      setSuccessMessage(`Vehicle '${res.data.registrationNumber}' created successfully.`);
      setErrorMessage(null);
      void queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      setModalOpen(false);
      clearAlertLater();
    },
    onError: (err: any) => {
      setErrorMessage(err.message || 'Failed to create vehicle.');
      setSuccessMessage(null);
    },
  });

  // Update Vehicle Mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<CreateVehiclePayload> }) => {
      return vehicleService.updateVehicle(id, payload);
    },
    onSuccess: (res) => {
      setSuccessMessage(`Vehicle '${res.data.registrationNumber}' updated successfully.`);
      setErrorMessage(null);
      void queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      setModalOpen(false);
      clearAlertLater();
    },
    onError: (err: any) => {
      setErrorMessage(err.message || 'Failed to update vehicle.');
      setSuccessMessage(null);
    },
  });

  // Delete Vehicle Mutation
  const deleteMutation = useMutation({
    mutationFn: vehicleService.deleteVehicle,
    onSuccess: () => {
      setSuccessMessage('Vehicle deleted successfully.');
      setErrorMessage(null);
      void queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      setDeleteDialogOpen(false);
      clearAlertLater();
    },
    onError: (err: any) => {
      setErrorMessage(err.message || 'Failed to delete vehicle.');
      setSuccessMessage(null);
      setDeleteDialogOpen(false);
    },
  });

  const clearAlertLater = () => {
    setTimeout(() => {
      setSuccessMessage(null);
    }, 4000);
  };

  // Handlers
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setPage(1);
  };

  const handleOpenAddModal = () => {
    setSelectedVehicle(null);
    setErrorMessage(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setErrorMessage(null);
    setModalOpen(true);
  };

  const handleOpenDetailsDrawer = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setDrawerOpen(true);
  };

  const handleOpenDeleteDialog = (id: string) => {
    const vehicle = data?.items.find((v) => v.id === id);
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

  const handleConfirmDelete = () => {
    if (selectedVehicle) {
      deleteMutation.mutate(selectedVehicle.id);
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setStatus('');
    setVehicleType('');
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Vehicles"
          description="Manage your organization's fleet."
        />
        <VehicleSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-10">
        <ErrorState
          title="Failed to Load Vehicles"
          description={error instanceof Error ? error.message : 'Could not retrieve fleet information from backend.'}
          onRetry={() => void refetch()}
        />
      </div>
    );
  }

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
      {/* Page Header */}
      <PageHeader
        title="Vehicles"
        description="Manage your organization's fleet."
        actions={
          <Button onClick={handleOpenAddModal} className="gap-2 shadow-sm">
            <Plus className="h-4 w-4" />
            Add Vehicle
          </Button>
        }
      />

      {/* Alerts */}
      {successMessage && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-emerald-600 dark:text-emerald-400 animate-slide-up">
          <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive animate-slide-up">
          <AlertCircle className="h-4.5 w-4.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Toolbar */}
      <VehicleToolbar
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
        vehicleType={vehicleType}
        onVehicleTypeChange={(val) => {
          setVehicleType(val);
          setPage(1);
        }}
        onRefresh={() => void refetch()}
        onClearFilters={handleClearFilters}
        isRefreshing={isFetching}
      />

      {/* Data Table */}
      {data && data.items.length > 0 ? (
        <div className="space-y-4">
          <VehicleTable
            vehicles={data.items}
            onView={handleOpenDetailsDrawer}
            onEdit={handleOpenEditModal}
            onDelete={handleOpenDeleteDialog}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
          />

          {/* Pagination Footer */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 bg-card border border-border rounded-xl shadow-sm">
              <span className="text-xs text-muted-foreground font-medium">
                Showing {pagination.start} to {pagination.end} of {pagination.total} vehicles
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="h-8.5 px-3"
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {[...Array(pagination.totalPages)].map((_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`h-8.5 w-8.5 rounded-lg text-xs font-semibold transition-colors ${
                          page === pageNum
                            ? 'bg-primary text-white'
                            : 'bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                        aria-label={`Page ${pageNum}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages))}
                  disabled={page === pagination.totalPages}
                  className="h-8.5 px-3"
                  aria-label="Next Page"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <EmptyState
          title="No vehicles found"
          description={
            search || status || vehicleType
              ? 'Try adjusting your search criteria or resetting filters.'
              : 'Add vehicles to start managing your logistics fleet.'
          }
          action={
            (search || status || vehicleType) ? (
              <Button variant="outline" size="sm" onClick={handleClearFilters}>
                Clear All Filters
              </Button>
            ) : (
              <Button size="sm" onClick={handleOpenAddModal}>
                + Add First Vehicle
              </Button>
            )
          }
        />
      )}

      {/* Add / Edit Modal */}
      <VehicleModal
        open={modalOpen}
        vehicle={selectedVehicle}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Details Slide-out Drawer */}
      <VehicleDetailsDrawer
        open={drawerOpen}
        vehicle={selectedVehicle}
        onClose={() => setDrawerOpen(false)}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        destructive
        title="Delete Vehicle?"
        description={
          selectedVehicle
            ? `Are you sure you want to delete vehicle '${selectedVehicle.registrationNumber}' (${selectedVehicle.make} ${selectedVehicle.model})? This action cannot be undone.`
            : 'Are you sure you want to delete this vehicle?'
        }
        confirmLabel="Delete Asset"
        cancelLabel="Keep Asset"
        loading={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
};
export default VehiclesPage;
