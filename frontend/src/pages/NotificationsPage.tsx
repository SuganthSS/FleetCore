import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, ChevronLeft, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { notificationService } from '@/services/notification.service';
import { driverService } from '@/services/driver.service';
import { useAuth } from '@/hooks/useAuth';
import type { NotificationRecord, CreateNotificationPayload } from '@/types/notification';
import {
  PageHeader,
  Button,
  ErrorState,
  EmptyState,
  ConfirmDialog,
} from '@/components/ui';
import {
  NotificationTable,
  NotificationToolbar,
  NotificationModal,
  NotificationDetailsDrawer,
  NotificationSkeleton,
} from '@/components/notifications';

export const NotificationsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [userId, setUserId] = useState('');
  const [type, setType] = useState('');
  const [priority, setPriority] = useState('');
  const [isRead, setIsRead] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Modal / Drawer / Dialog state
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<NotificationRecord | null>(null);

  // Success / Error Alerts
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch Notifications
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['notifications', search, userId, type, priority, isRead, page, limit, sortBy, sortOrder],
    queryFn: async () => {
      const response = await notificationService.getNotifications({
        page,
        limit,
        search: search || undefined,
        userId: userId || undefined,
        type: type || undefined,
        priority: priority || undefined,
        isRead: isRead === '' ? undefined : isRead === 'true',
        sortBy,
        sortOrder,
      });
      return response.data;
    },
  });

  // Fetch drivers list to extract recipient users
  const { data: driversData } = useQuery({
    queryKey: ['drivers-list-for-notifications'],
    queryFn: async () => {
      const response = await driverService.getDrivers({ limit: 100 });
      return response.data.items;
    },
  });

  // Combine authenticated user + driver users to construct available recipients list
  const availableUsers = useMemo(() => {
    const list: Array<{ id: string; firstName: string; lastName: string; email: string }> = [];

    if (currentUser) {
      list.push({
        id: currentUser.id,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
      });
    }

    if (driversData) {
      driversData.forEach((d) => {
        if (d.user && !list.some((u) => u.id === d.user?.id)) {
          list.push({
            id: d.user.id,
            firstName: d.user.firstName,
            lastName: d.user.lastName,
            email: d.user.email,
          });
        }
      });
    }

    return list;
  }, [driversData, currentUser]);

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: notificationService.createNotification,
    onSuccess: () => {
      setSuccessMessage('System notification created successfully.');
      setErrorMessage(null);
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
      setModalOpen(false);
      clearAlertLater();
    },
    onError: (err: any) => {
      setErrorMessage(err.message || 'Failed to create notification.');
      setSuccessMessage(null);
    },
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<CreateNotificationPayload> }) => {
      return notificationService.updateNotification(id, payload);
    },
    onSuccess: () => {
      setSuccessMessage('Notification log record updated successfully.');
      setErrorMessage(null);
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
      setModalOpen(false);
      clearAlertLater();
    },
    onError: (err: any) => {
      setErrorMessage(err.message || 'Failed to update notification.');
      setSuccessMessage(null);
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: notificationService.deleteNotification,
    onSuccess: () => {
      setSuccessMessage('Notification record deleted successfully.');
      setErrorMessage(null);
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
      setDeleteDialogOpen(false);
      setSelectedRecord(null);
      clearAlertLater();
    },
    onError: (err: any) => {
      setErrorMessage(err.message || 'Failed to delete notification.');
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

  const handleEditClick = (record: NotificationRecord) => {
    setSelectedRecord(record);
    setModalOpen(true);
  };

  const handleViewClick = (record: NotificationRecord) => {
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

  const handleModalSubmit = (payload: CreateNotificationPayload) => {
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
    setUserId('');
    setType('');
    setPriority('');
    setIsRead('');
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
        title="Notifications"
        description="Manage system notifications and user alerts."
        actions={
          <Button onClick={handleCreateClick} className="flex items-center gap-2">
            <Plus className="h-4.5 w-4.5" />
            Create Notification
          </Button>
        }
      />

      {/* Notifications Alerts */}
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
      <NotificationToolbar
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        userId={userId}
        onUserIdChange={(val) => {
          setUserId(val);
          setPage(1);
        }}
        type={type}
        onTypeChange={(val) => {
          setType(val);
          setPage(1);
        }}
        priority={priority}
        onPriorityChange={(val) => {
          setPriority(val);
          setPage(1);
        }}
        isRead={isRead}
        onIsReadChange={(val) => {
          setIsRead(val);
          setPage(1);
        }}
        onRefresh={handleRefresh}
        onClearFilters={handleClearFilters}
        users={availableUsers}
        isRefreshing={isFetching}
      />

      {/* Table Content */}
      {isLoading && !data ? (
        <NotificationSkeleton />
      ) : error ? (
        <ErrorState
          title="Error loading notifications"
          description={error instanceof Error ? error.message : 'An unexpected error occurred.'}
          onRetry={handleRefresh}
        />
      ) : !data || data.items.length === 0 ? (
        <EmptyState
          title="No notifications found"
          description={
            hasActiveFilters()
              ? 'Try resetting the filters or modifying your query.'
              : 'Add your first system notification to trigger alerts.'
          }
          action={
            !hasActiveFilters() ? (
              <Button onClick={handleCreateClick} className="mt-2.5">
                Create Notification
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
          <NotificationTable
            records={data.items}
            onView={handleViewClick}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
          />

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 bg-card border border-border rounded-xl shadow-sm">
              <span className="text-xs font-semibold text-muted-foreground">
                Showing Page <strong className="text-foreground">{data.page}</strong> of{' '}
                <strong className="text-foreground">{data.totalPages}</strong> (
                <strong className="text-foreground">{data.total}</strong> total notifications)
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

      {/* Create / Edit Modal */}
      <NotificationModal
        open={modalOpen}
        record={selectedRecord}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
        users={availableUsers}
      />

      {/* Detail Drawer */}
      <NotificationDetailsDrawer
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
        title="Confirm Notification Deletion"
        description="Are you absolutely sure you want to delete this notification record? This will permanently delete the entry from organization's notification history log. This action is irreversible."
        confirmLabel="Delete Notification"
        cancelLabel="Keep Notification"
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
    return !!(search || userId || type || priority || isRead !== '');
  }
};
export default NotificationsPage;
