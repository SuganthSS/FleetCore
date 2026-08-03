import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { customerService } from '@/services/customer.service';
import type { Customer, CustomerStatus, CreateCustomerPayload } from '@/types/customer';
import { getCustomerType } from '@/utils/customer';
import { Button, ErrorState, EmptyState, ConfirmDialog } from '@/components/ui';
import {
  CustomerHeader,
  CustomerKPICards,
  CustomerToolbar,
  CustomerTable,
  CustomerCards,
  CustomerModal,
  CustomerDrawer,
  CustomerSkeleton,
} from '@/components/customer';

export const CustomersPage: React.FC = () => {
  const queryClient = useQueryClient();

  // Search & Filter & View state
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Modal / Drawer state
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Success / Error Alerts
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch Customers
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['customers', search, status, page, limit, sortBy, sortOrder],
    queryFn: async () => {
      const response = await customerService.getCustomers({
        page,
        limit,
        search: search || undefined,
        status: status ? (status as CustomerStatus) : undefined,
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
    const active = items.filter((i) => i.status === 'ACTIVE').length;
    const inactive = items.filter((i) => i.status !== 'ACTIVE').length;
    const vip = items.filter((i) => getCustomerType(i.id) === 'VIP').length;
    const corporate = items.filter((i) => getCustomerType(i.id) === 'CORPORATE').length;
    const individual = items.filter((i) => getCustomerType(i.id) === 'INDIVIDUAL').length;

    return { total, active, inactive, vip, corporate, individual };
  }, [data]);

  // Create Customer Mutation
  const createMutation = useMutation({
    mutationFn: customerService.createCustomer,
    onSuccess: (res) => {
      setSuccessMessage(`Customer '${res.data.companyName}' created successfully.`);
      setErrorMessage(null);
      void queryClient.invalidateQueries({ queryKey: ['customers'] });
      setModalOpen(false);
      clearAlertLater();
    },
    onError: (err: any) => {
      setErrorMessage(err.message || 'Failed to create customer.');
      setSuccessMessage(null);
    },
  });

  // Update Customer Mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<CreateCustomerPayload> }) => {
      return customerService.updateCustomer(id, payload);
    },
    onSuccess: (res) => {
      setSuccessMessage(`Customer '${res.data.companyName}' updated successfully.`);
      setErrorMessage(null);
      void queryClient.invalidateQueries({ queryKey: ['customers'] });
      setModalOpen(false);
      clearAlertLater();
    },
    onError: (err: any) => {
      setErrorMessage(err.message || 'Failed to update customer.');
      setSuccessMessage(null);
    },
  });

  // Delete Customer Mutation
  const deleteMutation = useMutation({
    mutationFn: customerService.deleteCustomer,
    onSuccess: () => {
      setSuccessMessage('Customer profile deleted successfully.');
      setErrorMessage(null);
      void queryClient.invalidateQueries({ queryKey: ['customers'] });
      setDeleteDialogOpen(false);
      clearAlertLater();
    },
    onError: (err: any) => {
      setErrorMessage(err.message || 'Failed to delete customer.');
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
    setSelectedCustomer(null);
    setErrorMessage(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setErrorMessage(null);
    setModalOpen(true);
  };

  const handleOpenDetailsDrawer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDrawerOpen(true);
  };

  const handleOpenDeleteDialog = (id: string) => {
    const customer = data?.items.find((c: Customer) => c.id === id);
    if (customer) {
      setSelectedCustomer(customer);
      setDeleteDialogOpen(true);
    }
  };

  const handleModalSubmit = (payload: CreateCustomerPayload) => {
    if (selectedCustomer) {
      updateMutation.mutate({ id: selectedCustomer.id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleConfirmDelete = () => {
    if (selectedCustomer) {
      deleteMutation.mutate(selectedCustomer.id);
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setStatus('');
    setType('');
    setPage(1);
  };

  if (isLoading) {
    return <CustomerSkeleton />;
  }

  if (error) {
    return (
      <div className="py-10">
        <ErrorState
          title="Failed to Load Customers"
          description={error instanceof Error ? error.message : 'Could not retrieve customer records.'}
          onRetry={() => void refetch()}
        />
      </div>
    );
  }

  // Client-side filtering by Customer Type if selected
  const displayItems = data
    ? data.items.filter((item: Customer) => {
        if (!type) return true;
        return getCustomerType(item.id) === type;
      })
    : [];

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
      {/* Customer Header */}
      <CustomerHeader
        totalCustomers={data?.total || 0}
        onAddCustomer={handleOpenAddModal}
        onRefresh={() => void refetch()}
        isRefreshing={isFetching}
      />

      {/* KPI Metrics Cards */}
      <CustomerKPICards
        data={kpiData}
        activeStatusFilter={status}
        activeTypeFilter={type}
        onStatusFilterChange={(val) => {
          setStatus(val);
          setPage(1);
        }}
        onTypeFilterChange={(val) => {
          setType(val);
          setPage(1);
        }}
      />

      {/* Alerts */}
      {successMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-xs font-bold text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-xs font-bold text-destructive">
          <AlertCircle className="h-4.5 w-4.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Toolbar */}
      <CustomerToolbar
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

      {/* Data View */}
      {data && displayItems.length > 0 ? (
        <div className="space-y-4">
          {viewMode === 'table' ? (
            <CustomerTable
              customers={displayItems}
              onView={handleOpenDetailsDrawer}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteDialog}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
          ) : (
            <CustomerCards
              customers={displayItems}
              onView={handleOpenDetailsDrawer}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteDialog}
            />
          )}

          {/* Pagination Footer */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 bg-card border border-border rounded-2xl shadow-xs">
              <span className="text-xs text-muted-foreground font-medium">
                Showing {pagination.start} to {pagination.end} of {pagination.total} customers
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="h-8.5 px-3 text-xs"
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
                  onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages))}
                  disabled={page === pagination.totalPages}
                  className="h-8.5 px-3 text-xs"
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
          title="No customers found"
          description={
            search || status || type
              ? 'Try adjusting your search criteria or resetting filters.'
              : 'Add customer profiles to start recording shipping assignments.'
          }
          action={
            (search || status || type) ? (
              <Button variant="outline" size="sm" onClick={handleClearFilters}>
                Clear All Filters
              </Button>
            ) : (
              <Button size="sm" onClick={handleOpenAddModal}>
                + Add First Customer
              </Button>
            )
          }
        />
      )}

      {/* Add / Edit Modal */}
      <CustomerModal
        open={modalOpen}
        customer={selectedCustomer}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Details Slide-out Drawer */}
      <CustomerDrawer
        open={drawerOpen}
        customer={selectedCustomer}
        onClose={() => setDrawerOpen(false)}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        destructive
        title="Delete Customer Profile?"
        description={
          selectedCustomer
            ? `Are you sure you want to delete customer '${selectedCustomer.companyName}'? This action cannot be undone.`
            : 'Are you sure you want to delete this customer profile?'
        }
        confirmLabel="Delete Customer"
        cancelLabel="Keep Profile"
        loading={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
};

export default CustomersPage;
