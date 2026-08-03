import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { driverService } from '@/services/driver.service';
import type { Driver, DriverAvailability, ExperienceLevel, CreateDriverPayload } from '@/types/driver';
import { ConfirmDialog } from '@/components/ui';
import {
  DriverHeader,
  DriverKPICards,
  DriverToolbar,
  DriverTable,
  DriverCards,
  DriverModal,
  DriverDrawer,
  DriverSkeleton,
} from '@/components/driver';
import { CheckCircle2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

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
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Modal / Drawer state
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  // Success / Error Alerts
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch Drivers with TanStack Query
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

  // Calculate KPI Counts from cached drivers
  const kpiData = {
    total: data?.total || 0,
    available: data?.items.filter((d) => d.availability === 'AVAILABLE').length || 0,
    onTrip: data?.items.filter((d) => d.availability === 'ON_TRIP').length || 0,
    offDuty: data?.items.filter((d) => d.availability === 'OFF_DUTY' || d.availability === 'ON_LEAVE').length || 0,
    expiringLicense: data?.items.filter((d) => {
      const days = Math.ceil((new Date(d.licenseExpiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return days <= 30 && days >= 0;
    }).length || 0,
    suspended: data?.items.filter((d) => d.availability === 'SUSPENDED').length || 0,
  };

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
      <div className="space-y-6 p-6">
        <DriverSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 flex flex-col items-center justify-center text-center space-y-4">
        <div className="p-4 rounded-full bg-destructive/10 text-destructive">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h2 className="text-lg font-bold text-foreground">Failed to Load Driver Directory</h2>
        <p className="text-xs text-muted-foreground max-w-sm">
          {error instanceof Error ? error.message : 'An error occurred while connecting to the driver service.'}
        </p>
        <button
          onClick={() => void refetch()}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold shadow-sm hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
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
    <div className="space-y-6 p-6">
      {/* Header */}
      <DriverHeader
        totalDrivers={data?.total || 0}
        onAddDriver={handleOpenAddModal}
        onRefresh={() => void refetch()}
        isRefreshing={isFetching}
      />

      {/* KPI Cards */}
      <DriverKPICards
        data={kpiData}
        activeFilter={availability}
        onFilterChange={(val) => {
          setAvailability(val);
          setPage(1);
        }}
      />

      {/* Alerts */}
      {successMessage && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-xs font-semibold text-destructive">
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

      {/* Data Views */}
      {data && data.items.length > 0 ? (
        <div className="space-y-4">
          {viewMode === 'table' ? (
            <DriverTable
              drivers={data.items}
              onView={handleOpenDetailsDrawer}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteDialog}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
          ) : (
            <DriverCards
              drivers={data.items}
              onView={handleOpenDetailsDrawer}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteDialog}
            />
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 bg-card border border-border rounded-xl shadow-xs">
              <span className="text-xs text-muted-foreground font-medium">
                Showing {pagination.start} to {pagination.end} of {pagination.total} drivers
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 rounded-lg border border-input bg-background text-xs font-semibold text-foreground hover:bg-muted disabled:opacity-40 transition-colors flex items-center gap-1"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Previous
                </button>
                <div className="flex items-center gap-1">
                  {[...Array(pagination.totalPages)].map((_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`h-8 w-8 rounded-lg text-xs font-bold transition-colors ${
                          page === pageNum
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages))}
                  disabled={page === pagination.totalPages}
                  className="px-3 py-1.5 rounded-lg border border-input bg-background text-xs font-semibold text-foreground hover:bg-muted disabled:opacity-40 transition-colors flex items-center gap-1"
                >
                  Next
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center space-y-3">
          <p className="text-sm font-bold text-foreground">No drivers found</p>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            {search || availability || experienceLevel
              ? 'Try adjusting your search query or reset active filters.'
              : 'Create driver profiles to start assigning them to fleet operations.'}
          </p>
          {search || availability || experienceLevel ? (
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 rounded-lg border border-input text-xs font-bold text-foreground hover:bg-muted transition-colors"
            >
              Clear Filters
            </button>
          ) : (
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold shadow-sm hover:bg-primary/90 transition-colors"
            >
              + Add First Driver
            </button>
          )}
        </div>
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
      <DriverDrawer
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
