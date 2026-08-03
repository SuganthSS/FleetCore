import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { routeService } from '@/services/route.service';
import type { Route, RouteType, RouteStatus, CreateRoutePayload } from '@/types/route';
import { ConfirmDialog } from '@/components/ui';
import {
  RouteHeader,
  RouteKPICards,
  RouteToolbar,
  RouteTable,
  RouteCards,
  RouteModal,
  RouteDrawer,
  RouteSkeleton,
} from '@/components/route';
import { CheckCircle2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

export const RoutesPage: React.FC = () => {
  const queryClient = useQueryClient();

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [routeType, setRouteType] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Modal / Drawer state
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);

  // Success / Error Alerts
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch Routes with TanStack Query
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['routes', search, status, routeType, page, limit, sortBy, sortOrder],
    queryFn: async () => {
      const response = await routeService.getRoutes({
        page,
        limit,
        search: search || undefined,
        status: status ? (status as RouteStatus) : undefined,
        routeType: routeType ? (routeType as RouteType) : undefined,
        sortBy,
        sortOrder,
      });
      return response.data;
    },
  });

  // Calculate KPI Counts from cached data
  const kpiData = {
    total: data?.total || 0,
    active: data?.items.filter((r) => r.status === 'ACTIVE').length || 0,
    planned: data?.items.filter((r) => r.status === 'PLANNED').length || 0,
    urban: data?.items.filter((r) => r.routeType === 'URBAN').length || 0,
    interstate: data?.items.filter((r) => r.routeType === 'INTERSTATE' || r.routeType === 'HIGHWAY').length || 0,
    crossBorder: data?.items.filter((r) => r.routeType === 'CROSS_BORDER').length || 0,
  };

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: routeService.createRoute,
    onSuccess: (res) => {
      setSuccessMessage(`Route corridor '${res.data.routeCode}' created successfully.`);
      setErrorMessage(null);
      void queryClient.invalidateQueries({ queryKey: ['routes'] });
      setModalOpen(false);
      clearAlertLater();
    },
    onError: (err: any) => {
      setErrorMessage(err.message || 'Failed to create route.');
      setSuccessMessage(null);
    },
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<CreateRoutePayload> }) => {
      return routeService.updateRoute(id, payload);
    },
    onSuccess: (res) => {
      setSuccessMessage(`Route corridor '${res.data.routeCode}' updated successfully.`);
      setErrorMessage(null);
      void queryClient.invalidateQueries({ queryKey: ['routes'] });
      setModalOpen(false);
      clearAlertLater();
    },
    onError: (err: any) => {
      setErrorMessage(err.message || 'Failed to update route.');
      setSuccessMessage(null);
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: routeService.deleteRoute,
    onSuccess: () => {
      setSuccessMessage('Route corridor deleted successfully.');
      setErrorMessage(null);
      void queryClient.invalidateQueries({ queryKey: ['routes'] });
      setDeleteDialogOpen(false);
      clearAlertLater();
    },
    onError: (err: any) => {
      setErrorMessage(err.message || 'Failed to delete route.');
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
    setSelectedRoute(null);
    setErrorMessage(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (route: Route) => {
    setSelectedRoute(route);
    setErrorMessage(null);
    setModalOpen(true);
  };

  const handleOpenDetailsDrawer = (route: Route) => {
    setSelectedRoute(route);
    setDrawerOpen(true);
  };

  const handleOpenDeleteDialog = (id: string) => {
    const route = data?.items.find((r) => r.id === id);
    if (route) {
      setSelectedRoute(route);
      setDeleteDialogOpen(true);
    }
  };

  const handleModalSubmit = (payload: CreateRoutePayload) => {
    if (selectedRoute) {
      updateMutation.mutate({ id: selectedRoute.id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleConfirmDelete = () => {
    if (selectedRoute) {
      deleteMutation.mutate(selectedRoute.id);
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setStatus('');
    setRouteType('');
    setPage(1);
  };

  if (isLoading) {
    return <RouteSkeleton />;
  }

  if (error) {
    return (
      <div className="p-10 flex flex-col items-center justify-center text-center space-y-4">
        <div className="p-4 rounded-full bg-destructive/10 text-destructive">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h2 className="text-lg font-bold text-foreground">Failed to Load Routes Directory</h2>
        <p className="text-xs text-muted-foreground max-w-sm">
          {error instanceof Error ? error.message : 'An error occurred while connecting to the route service.'}
        </p>
        <button
          onClick={() => void refetch()}
          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-sm hover:bg-primary/90 transition-colors"
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
      <RouteHeader
        totalRoutes={data?.total || 0}
        onAddRoute={handleOpenAddModal}
        onRefresh={() => void refetch()}
        isRefreshing={isFetching}
      />

      {/* KPI Cards */}
      <RouteKPICards
        data={kpiData}
        activeStatusFilter={status}
        activeTypeFilter={routeType}
        onStatusFilterChange={(val) => {
          setStatus(val);
          setPage(1);
        }}
        onTypeFilterChange={(val) => {
          setRouteType(val);
          setPage(1);
        }}
      />

      {/* Success / Error Alerts */}
      {successMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-xs font-semibold text-destructive">
          <AlertCircle className="h-4.5 w-4.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Toolbar */}
      <RouteToolbar
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
        routeType={routeType}
        onRouteTypeChange={(val) => {
          setRouteType(val);
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
            <RouteTable
              routes={data.items}
              onView={handleOpenDetailsDrawer}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteDialog}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
          ) : (
            <RouteCards
              routes={data.items}
              onView={handleOpenDetailsDrawer}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteDialog}
            />
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 bg-card border border-border rounded-2xl shadow-xs">
              <span className="text-xs text-muted-foreground font-medium">
                Showing {pagination.start} to {pagination.end} of {pagination.total} routes
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 rounded-xl border border-input bg-background text-xs font-semibold text-foreground hover:bg-muted disabled:opacity-40 transition-colors flex items-center gap-1"
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
                        className={`h-8 w-8 rounded-xl text-xs font-bold transition-colors ${
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
                  className="px-3 py-1.5 rounded-xl border border-input bg-background text-xs font-semibold text-foreground hover:bg-muted disabled:opacity-40 transition-colors flex items-center gap-1"
                >
                  Next
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center space-y-3">
          <p className="text-sm font-bold text-foreground">No routes found</p>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            {search || status || routeType
              ? 'Try adjusting your search query or reset active filters.'
              : 'Create route corridors to start planning freight trips.'}
          </p>
          {search || status || routeType ? (
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 rounded-xl border border-input text-xs font-bold text-foreground hover:bg-muted transition-colors"
            >
              Clear Filters
            </button>
          ) : (
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-sm hover:bg-primary/90 transition-colors"
            >
              + Add First Route
            </button>
          )}
        </div>
      )}

      {/* Modal */}
      <RouteModal
        open={modalOpen}
        route={selectedRoute}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Drawer */}
      <RouteDrawer
        open={drawerOpen}
        route={selectedRoute}
        onClose={() => setDrawerOpen(false)}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        destructive
        title="Delete Route Corridor?"
        description={
          selectedRoute
            ? `Are you sure you want to delete route corridor '${selectedRoute.routeCode}'? This action cannot be undone.`
            : 'Are you sure you want to delete this route corridor?'
        }
        confirmLabel="Delete Route"
        cancelLabel="Keep Route"
        loading={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
};

export default RoutesPage;
