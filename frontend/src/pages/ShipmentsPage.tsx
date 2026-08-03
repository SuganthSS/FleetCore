import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { shipmentService } from '@/services/shipment.service';
import { customerService } from '@/services/customer.service';
import type { Shipment, ShipmentStatus, ShipmentPriority, CreateShipmentPayload } from '@/types/shipment';
import { Button, ConfirmDialog } from '@/components/ui';
import {
  ShipmentHeader,
  ShipmentKPICards,
  ShipmentToolbar,
  ShipmentTable,
  ShipmentCards,
  ShipmentDrawer,
  ShipmentModal,
  ShipmentSkeleton,
  ShipmentEmptyState,
  ShipmentErrorState,
} from '@/components/shipment';

export const ShipmentsPage: React.FC = () => {
  const queryClient = useQueryClient();

  // Search, Filter & View state
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Modal / Drawer / Dialog state
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  // Success / Error Alerts
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch Customers for selection dropdowns
  const { data: customersData } = useQuery({
    queryKey: ['customers-list-all'],
    queryFn: async () => {
      const response = await customerService.getCustomers({
        page: 1,
        limit: 100,
        sortBy: 'companyName',
        sortOrder: 'asc',
      });
      return response.data;
    },
  });

  const customersList = customersData?.items || [];

  // Fetch Shipments
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['shipments', search, status, priority, customerId, page, limit, sortBy, sortOrder],
    queryFn: async () => {
      const response = await shipmentService.getShipments({
        page,
        limit,
        search: search || undefined,
        status: status ? (status as ShipmentStatus) : undefined,
        priority: priority ? (priority as ShipmentPriority) : undefined,
        customerId: customerId || undefined,
        sortBy,
        sortOrder,
      });
      return response.data;
    },
  });

  // Calculate KPI Summary
  const kpiData = useMemo(() => {
    const items = data?.items || [];
    const total = data?.total || 0;
    const pending = items.filter((i) => i.status === 'PENDING').length;
    const dispatched = items.filter((i) => i.status === 'DISPATCHED').length;
    const inTransit = items.filter((i) => i.status === 'IN_TRANSIT').length;
    const delivered = items.filter((i) => i.status === 'DELIVERED').length;
    const cancelled = items.filter((i) => i.status === 'CANCELLED').length;
    const failed = items.filter((i) => i.status === 'FAILED').length;

    return { total, pending, dispatched, inTransit, delivered, cancelled, failed };
  }, [data]);

  // Create Shipment Mutation
  const createMutation = useMutation({
    mutationFn: shipmentService.createShipment,
    onSuccess: (res) => {
      setSuccessMessage(`Shipment '${res.data.shipmentNumber}' created successfully.`);
      setErrorMessage(null);
      void queryClient.invalidateQueries({ queryKey: ['shipments'] });
      setModalOpen(false);
      clearAlertLater();
    },
    onError: (err: any) => {
      setErrorMessage(err.message || 'Failed to create shipment.');
      setSuccessMessage(null);
    },
  });

  // Update Shipment Mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<CreateShipmentPayload> }) => {
      return shipmentService.updateShipment(id, payload);
    },
    onSuccess: (res) => {
      setSuccessMessage(`Shipment '${res.data.shipmentNumber}' updated successfully.`);
      setErrorMessage(null);
      void queryClient.invalidateQueries({ queryKey: ['shipments'] });
      setModalOpen(false);
      clearAlertLater();
    },
    onError: (err: any) => {
      setErrorMessage(err.message || 'Failed to update shipment.');
      setSuccessMessage(null);
    },
  });

  // Delete Shipment Mutation
  const deleteMutation = useMutation({
    mutationFn: shipmentService.deleteShipment,
    onSuccess: () => {
      setSuccessMessage('Shipment record deleted successfully.');
      setErrorMessage(null);
      void queryClient.invalidateQueries({ queryKey: ['shipments'] });
      setDeleteDialogOpen(false);
      setSelectedShipment(null);
      clearAlertLater();
    },
    onError: (err: any) => {
      setErrorMessage(err.message || 'Failed to delete shipment.');
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
    setSelectedShipment(null);
    setModalOpen(true);
  };

  const handleEditClick = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setModalOpen(true);
  };

  const handleViewClick = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setDrawerOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    const shipment = data?.items.find((item) => item.id === id);
    if (shipment) {
      setSelectedShipment(shipment);
      setDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (selectedShipment) {
      deleteMutation.mutate(selectedShipment.id);
    }
  };

  const handleModalSubmit = (payload: CreateShipmentPayload) => {
    if (selectedShipment) {
      updateMutation.mutate({ id: selectedShipment.id, payload });
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
    setPriority('');
    setCustomerId('');
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (data?.totalPages || 1)) {
      setPage(newPage);
    }
  };

  const hasActiveFilters = Boolean(search || status || priority || customerId);

  if (isLoading) {
    return <ShipmentSkeleton />;
  }

  if (error) {
    return (
      <ShipmentErrorState
        message={error instanceof Error ? error.message : 'Could not retrieve shipment records.'}
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <ShipmentHeader
        totalShipments={data?.total || 0}
        onAddShipment={handleCreateClick}
        onRefresh={() => void refetch()}
        isRefreshing={isFetching}
      />

      {/* KPI Cards */}
      <ShipmentKPICards
        data={kpiData}
        activeStatusFilter={status}
        onStatusFilterChange={(val) => {
          setStatus(val);
          setPage(1);
        }}
      />

      {/* Alerts */}
      {successMessage && (
        <div className="flex items-center gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs font-bold text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2.5 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-xs font-bold text-destructive">
          <AlertCircle className="h-4.5 w-4.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Toolbar */}
      <ShipmentToolbar
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
        priority={priority}
        onPriorityChange={(val) => {
          setPriority(val);
          setPage(1);
        }}
        customerId={customerId}
        onCustomerIdChange={(val) => {
          setCustomerId(val);
          setPage(1);
        }}
        customers={customersList}
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

      {/* Main Content Area */}
      {!data || data.items.length === 0 ? (
        <ShipmentEmptyState
          hasFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
          onCreateShipment={handleCreateClick}
        />
      ) : (
        <div className="space-y-4">
          {viewMode === 'table' ? (
            <ShipmentTable
              shipments={data.items}
              onView={handleViewClick}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
          ) : (
            <ShipmentCards
              shipments={data.items}
              onView={handleViewClick}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          )}

          {/* Pagination Controls */}
          {data.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 bg-card border border-border rounded-2xl shadow-xs">
              <span className="text-xs font-semibold text-muted-foreground">
                Showing Page <strong className="text-foreground">{data.page}</strong> of{' '}
                <strong className="text-foreground">{data.totalPages}</strong> (
                <strong className="text-foreground">{data.total}</strong> total shipments)
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1 || isFetching}
                  className="h-8.5 px-3 text-xs"
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
                            ? 'bg-primary text-white font-bold'
                            : 'bg-transparent text-muted-foreground hover:bg-muted'
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
                  className="h-8.5 px-3 text-xs"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Shipment Modal Form */}
      <ShipmentModal
        open={modalOpen}
        shipment={selectedShipment}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        customers={customersList}
        loading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Details Side Drawer */}
      <ShipmentDrawer
        shipment={selectedShipment}
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedShipment(null);
        }}
      />

      {/* Delete Confirmation Dialogue */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Confirm Shipment Deletion"
        description={`Are you sure you want to delete shipment ${
          selectedShipment?.shipmentNumber || ''
        }? This action cannot be undone.`}
        confirmLabel="Delete Shipment"
        cancelLabel="Keep Record"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setSelectedShipment(null);
        }}
        loading={deleteMutation.isPending}
        destructive={true}
      />
    </div>
  );
};

export default ShipmentsPage;
