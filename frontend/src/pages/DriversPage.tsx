import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, ChevronLeft, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { driverService } from '@/services/driver.service';
import type { Driver, DriverAvailability, ExperienceLevel, CreateDriverPayload } from '@/types/driver';
import {
  PageHeader,
  Button,
  ErrorState,
  EmptyState,
  ConfirmDialog,
} from '@/components/ui';
import {
  DriverTable,
  DriverToolbar,
  DriverModal,
  DriverDetailsDrawer,
  DriverSkeleton,
} from '@/components/driver';

export const DriversPage: React.FC = () => {
  const queryClient = useQueryClient();

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [availability, setAvailability] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Modal / Drawer state
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  // Success / Error Alerts
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch Drivers
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['drivers', search, availability, experienceLevel, page, limit, sortBy, sortOrder],
    queryFn: async () => {
      const response = await driverService.getDrivers({
        page,
        limit,
        search: search || undefined,
        availability: availability ? (availability as DriverAvailability) : undefined,
        experienceLevel: experienceLevel ? (experienceLevel as ExperienceLevel) : undefined,
        sortBy,
        sortOrder,
      });
      return response.data;
    },
  });

  // Create Driver Mutation
  const createMutation = useMutation({
    mutationFn: driverService.createDriver,
    onSuccess: (res) => {
      const name = res.data.user ? `${res.data.user.firstName} ${res.data.user.lastName}` : res.data.employeeId;
      setSuccessMessage(`Driver '${name}' created successfully.`);
      setErrorMessage(null);
      void queryClient.invalidateQueries({ queryKey: ['drivers'] });
      setModalOpen(false);
      clearAlertLater();
    },
    onError: (err: any) => {
      setErrorMessage(err.message || 'Failed to create driver.');
      setSuccessMessage(null);
    },
  });

  // Update Driver Mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<CreateDriverPayload> }) => {
      return driverService.updateDriver(id, payload);
    },
    onSuccess: (res) => {
      const name = res.data.user ? `${res.data.user.firstName} ${res.data.user.lastName}` : res.data.employeeId;
      setSuccessMessage(`Driver '${name}' updated successfully.`);
      setErrorMessage(null);
      void queryClient.invalidateQueries({ queryKey: ['drivers'] });
      setModalOpen(false);
      clearAlertLater();
    },
    onError: (err: any) => {
      setErrorMessage(err.message || 'Failed to update driver.');
      setSuccessMessage(null);
    },
  });

  // Delete Driver Mutation
  const deleteMutation = useMutation({
    mutationFn: driverService.deleteDriver,
    onSuccess: () => {
      setSuccessMessage('Driver profile deleted successfully.');
      setErrorMessage(null);
      void queryClient.invalidateQueries({ queryKey: ['drivers'] });
      setDeleteDialogOpen(false);
      clearAlertLater();
    },
    onError: (err: any) => {
      setErrorMessage(err.message || 'Failed to delete driver.');
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
    setSelectedDriver(null);
    setErrorMessage(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (driver: Driver) => {
    setSelectedDriver(driver);
    setErrorMessage(null);
    setModalOpen(true);
  };

  const handleOpenDetailsDrawer = (driver: Driver) => {
    setSelectedDriver(driver);
    setDrawerOpen(true);
  };

  const handleOpenDeleteDialog = (id: string) => {
    const driver = data?.items.find((d: Driver) => d.id === id);

    if (driver) {
      setSelectedDriver(driver);
      setDeleteDialogOpen(true);
    }
  };

  const handleModalSubmit = (payload: CreateDriverPayload) => {
    if (selectedDriver) {
      updateMutation.mutate({ id: selectedDriver.id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleConfirmDelete = () => {
    if (selectedDriver) {
      deleteMutation.mutate(selectedDriver.id);
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setAvailability('');
    setExperienceLevel('');
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Drivers"
          description="Manage your fleet's drivers and operators."
        />
        <DriverSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-10">
        <ErrorState
          title="Failed to Load Drivers"
          description={error instanceof Error ? error.message : 'Could not retrieve driver records from backend.'}
          onRetry={() => void refetch()}
        />
      </div>
    );
  }

  // Backends paginatedResult: { items, total, page, limit, totalPages }
  // Tanstack query response is response which is data.data in driverService.getDrivers
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
        title="Drivers"
        description="Manage your fleet's drivers and operators."
        actions={
          <Button onClick={handleOpenAddModal} className="gap-2 shadow-sm">
            <Plus className="h-4 w-4" />
            Add Driver
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
      <DriverToolbar
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        availability={availability}
        onAvailabilityChange={(val) => {
          setAvailability(val);
          setPage(1);
        }}
        experienceLevel={experienceLevel}
        onExperienceLevelChange={(val) => {
          setExperienceLevel(val);
          setPage(1);
        }}
        onRefresh={() => void refetch()}
        onClearFilters={handleClearFilters}
        isRefreshing={isFetching}
      />

      {/* Data Table */}
      {data && data.items.length > 0 ? (
        <div className="space-y-4">
          <DriverTable
            drivers={data.items}
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
                Showing {pagination.start} to {pagination.end} of {pagination.total} drivers
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
          title="No drivers found"
          description={
            search || availability || experienceLevel
              ? 'Try adjusting your search criteria or resetting filters.'
              : 'Add driver profiles to start assigning them to vehicles and shipments.'
          }
          action={
            (search || availability || experienceLevel) ? (
              <Button variant="outline" size="sm" onClick={handleClearFilters}>
                Clear All Filters
              </Button>
            ) : (
              <Button size="sm" onClick={handleOpenAddModal}>
                + Add First Driver
              </Button>
            )
          }
        />
      )}

      {/* Add / Edit Modal */}
      <DriverModal
        open={modalOpen}
        driver={selectedDriver}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Details Slide-out Drawer */}
      <DriverDetailsDrawer
        open={drawerOpen}
        driver={selectedDriver}
        onClose={() => setDrawerOpen(false)}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        destructive
        title="Delete Driver Profile?"
        description={
          selectedDriver
            ? `Are you sure you want to delete the driver profile for '${selectedDriver.user ? `${selectedDriver.user.firstName} ${selectedDriver.user.lastName}` : selectedDriver.employeeId}'? This action cannot be undone.`
            : 'Are you sure you want to delete this driver profile?'
        }
        confirmLabel="Delete Driver"
        cancelLabel="Keep Profile"
        loading={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
};
export default DriversPage;
