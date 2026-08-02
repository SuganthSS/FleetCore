import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, ChevronLeft, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { shipmentService } from '@/services/shipment.service';
import { customerService } from '@/services/customer.service';
import type { Shipment, ShipmentStatus, ShipmentPriority, CreateShipmentPayload } from '@/types/shipment';
import {
  PageHeader,
  Button,
  ErrorState,
  EmptyState,
  ConfirmDialog,
} from '@/components/ui';
import {
  ShipmentTable,
  ShipmentToolbar,
  ShipmentModal,
  ShipmentDetailsDrawer,
  ShipmentSkeleton,
} from '@/components/shipment';

export const ShipmentsPage: React.FC = () => {
  const queryClient = useQueryClient();

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Modal / Drawer state
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  // Success / Error Alerts
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch Customers for select dropdown options
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
        title="Shipments"
        description="Manage deliveries, cargo movements and shipment lifecycle."
        actions={
          <Button onClick={handleCreateClick} className="flex items-center gap-2">
            <Plus className="h-4.5 w-4.5" />
            Create Shipment
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
        onRefresh={handleRefresh}
        onClearFilters={handleClearFilters}
        isRefreshing={isFetching}
      />

      {/* Main Table Content */}
      {isLoading && !data ? (
        <ShipmentSkeleton />
      ) : error ? (
        <ErrorState
          title="Error loading shipments"
          description={error instanceof Error ? error.message : 'An unexpected error occurred while fetching shipments data.'}
          onRetry={handleRefresh}
        />
      ) : !data || data.items.length === 0 ? (
        <EmptyState
          title="No shipments found"
          description={
            hasActiveFilters()
              ? 'Try resetting the filters or modifying your search query to locate shipments.'
              : 'Add your first shipment to start planning and executing cargo movements.'
          }
          action={
            !hasActiveFilters() ? (
              <Button onClick={handleCreateClick} className="mt-2.5">
                Create Shipment
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
          <ShipmentTable
            shipments={data.items}
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
                <strong className="text-foreground">{data.total}</strong> total shipments)
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
      <ShipmentDetailsDrawer
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
        description={`Are you absolutely sure you want to delete shipment ${
          selectedShipment?.shipmentNumber || ''
        }? This operational transaction record will be permanently deleted. This action is irreversible.`}
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

  function hasActiveFilters() {
    return !!(search || status || priority || customerId);
  }
};
export default ShipmentsPage;
