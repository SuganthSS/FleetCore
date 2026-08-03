import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, UserCheck, UserX, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import { userService } from '@/services/user.service';
import type {
  UserItem,
  UserQueryParams,
  CreateUserInput,
  UpdateUserInput,
  UserStatus,
} from '@/types/user';
import {
  UserToolbar,
  UserTable,
  UserDrawer,
  UserModal,
  ResetPasswordModal,
  BulkActions,
  UserSkeleton,
  UserEmptyState,
  UserErrorState,
} from '@/components/user';

export const UsersPage: React.FC = () => {
  const queryClient = useQueryClient();

  // Filters & Pagination State
  const [queryParams, setQueryParams] = useState<UserQueryParams>({
    page: 1,
    limit: 10,
    search: '',
    role: undefined,
    status: undefined,
  });

  // Selected Users State for Bulk Actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Drawer & Modal States
  const [drawerUser, setDrawerUser] = useState<UserItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [modalUser, setModalUser] = useState<UserItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [passwordModalUser, setPasswordModalUser] = useState<UserItem | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Toast / Feedback State
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(
    null
  );

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Query: Users List
  const {
    data: usersResponse,
    isLoading: isLoadingUsers,
    isError: isUsersError,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: ['users', queryParams],
    queryFn: () => userService.getUsers(queryParams),
  });

  // Query: System Roles
  const { data: rolesResponse } = useQuery({
    queryKey: ['user-roles'],
    queryFn: () => userService.getRoles(),
  });

  const roles = rolesResponse?.data || [
    { id: 'admin-id', name: 'Administrator' },
    { id: 'fm-id', name: 'Fleet Manager' },
    { id: 'disp-id', name: 'Dispatcher' },
    { id: 'mm-id', name: 'Maintenance Manager' },
    { id: 'acc-id', name: 'Accountant' },
    { id: 'driver-id', name: 'Driver' },
  ];

  const paginatedData = usersResponse?.data;
  const users = paginatedData?.users || [];
  const meta = paginatedData?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 };

  // Calculate Stat Metrics from current backend list / metadata
  const totalCount = meta.total;
  const activeCount = users.filter((u) => u.status === 'ACTIVE').length;
  const inactiveCount = users.filter((u) => u.status === 'INACTIVE' || u.status === 'SUSPENDED').length;
  const adminCount = users.filter(
    (u) => u.roleName === 'Administrator' || u.role?.name === 'Administrator'
  ).length;

  // Mutation: Create User
  const createUserMutation = useMutation({
    mutationFn: (input: CreateUserInput) => userService.createUser(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsModalOpen(false);
      showToast('New enterprise employee created successfully.');
    },
    onError: (err: Error) => {
      showToast(err.message || 'Failed to create user', 'error');
    },
  });

  // Mutation: Update User
  const updateUserMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateUserInput }) =>
      userService.updateUser(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsModalOpen(false);
      setModalUser(null);
      if (drawerUser) setIsDrawerOpen(false);
      showToast('Employee profile updated successfully.');
    },
    onError: (err: Error) => {
      showToast(err.message || 'Failed to update user', 'error');
    },
  });

  // Mutation: Status Toggle
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: UserStatus }) =>
      userService.updateUserStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      showToast(`User status updated to ${variables.status.toLowerCase()}.`);
    },
    onError: (err: Error) => {
      showToast(err.message || 'Failed to update status', 'error');
    },
  });

  // Mutation: Reset Password
  const resetPasswordMutation = useMutation({
    mutationFn: ({ id, pass }: { id: string; pass: string }) =>
      userService.resetPassword(id, pass),
    onSuccess: () => {
      setIsPasswordModalOpen(false);
      setPasswordModalUser(null);
      showToast('Employee password reset successfully.');
    },
    onError: (err: Error) => {
      showToast(err.message || 'Failed to reset password', 'error');
    },
  });

  // Mutation: Delete User
  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      if (drawerUser) setIsDrawerOpen(false);
      showToast('User record soft-deleted successfully.');
    },
    onError: (err: Error) => {
      showToast(err.message || 'Failed to delete user', 'error');
    },
  });

  // Handlers
  const handleFilterChange = (updates: Partial<UserQueryParams>) => {
    setQueryParams((prev) => ({ ...prev, ...updates }));
  };

  const handleResetFilters = () => {
    setQueryParams({
      page: 1,
      limit: 10,
      search: '',
      role: undefined,
      status: undefined,
    });
  };

  const handleSelectToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllToggle = () => {
    if (users.length === 0) return;
    const allIds = users.map((u) => u.id);
    const areAllSelected = users.every((u) => selectedIds.includes(u.id));
    if (areAllSelected) {
      setSelectedIds((prev) => prev.filter((id) => !allIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...allIds])));
    }
  };

  const handleCreateOrUpdate = async (input: CreateUserInput | UpdateUserInput) => {
    if (modalUser) {
      await updateUserMutation.mutateAsync({ id: modalUser.id, input: input as UpdateUserInput });
    } else {
      await createUserMutation.mutateAsync(input as CreateUserInput);
    }
  };

  const handleToggleStatus = (user: UserItem) => {
    const nextStatus: UserStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    updateStatusMutation.mutate({ id: user.id, status: nextStatus });
  };

  const handleDeleteUser = (user: UserItem) => {
    if (confirm(`Are you sure you want to soft delete ${user.firstName} ${user.lastName}?`)) {
      deleteUserMutation.mutate(user.id);
    }
  };

  const handleBulkActivate = () => {
    selectedIds.forEach((id) => updateStatusMutation.mutate({ id, status: 'ACTIVE' }));
    showToast(`Activated ${selectedIds.length} employees.`);
    setSelectedIds([]);
  };

  const handleBulkDeactivate = () => {
    selectedIds.forEach((id) => updateStatusMutation.mutate({ id, status: 'INACTIVE' }));
    showToast(`Deactivated ${selectedIds.length} employees.`);
    setSelectedIds([]);
  };

  const handleBulkExport = () => {
    const selectedUsers = users.filter((u) => selectedIds.includes(u.id));
    const jsonStr = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(selectedUsers, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonStr);
    downloadAnchor.setAttribute('download', `fleetcore_employees_export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast(`Exported ${selectedIds.length} employee records.`);
  };

  const hasActiveFilters =
    Boolean(queryParams.search) ||
    Boolean(queryParams.role) ||
    Boolean(queryParams.status);

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {feedback && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-2xl shadow-xl border text-xs font-['Inter'] font-semibold animate-in fade-in slide-in-from-top-2 duration-200 flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-[#ffdad6] text-[#ba1a1a] border-[#ffdad6]'
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-['Plus_Jakarta_Sans'] text-2xl font-extrabold text-[#0b1c30] tracking-tight">
            User Management
          </h1>
          <p className="font-['Inter'] text-xs text-[#737686] mt-1">
            Manage enterprise employee accounts, system RBAC roles, security credentials, and access policies.
          </p>
        </div>
      </div>

      {/* Top Stat Cards (Stitch Source Alignment) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#c3c6d7] rounded-2xl p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] flex items-center gap-3">
          <div className="p-3 rounded-xl bg-[#eff4ff] text-[#004ac6]">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="font-['Inter'] text-[11px] font-semibold text-[#737686] uppercase tracking-wider">
              Total Users
            </p>
            <h3 className="font-['Plus_Jakarta_Sans'] text-xl font-extrabold text-[#0b1c30]">
              {totalCount}
            </h3>
          </div>
        </div>

        <div className="bg-white border border-[#c3c6d7] rounded-2xl p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <UserCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="font-['Inter'] text-[11px] font-semibold text-[#737686] uppercase tracking-wider">
              Active Users
            </p>
            <h3 className="font-['Plus_Jakarta_Sans'] text-xl font-extrabold text-[#0b1c30]">
              {activeCount}
            </h3>
          </div>
        </div>

        <div className="bg-white border border-[#c3c6d7] rounded-2xl p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] flex items-center gap-3">
          <div className="p-3 rounded-xl bg-slate-100 text-slate-600">
            <UserX className="h-5 w-5" />
          </div>
          <div>
            <p className="font-['Inter'] text-[11px] font-semibold text-[#737686] uppercase tracking-wider">
              Inactive / Suspended
            </p>
            <h3 className="font-['Plus_Jakarta_Sans'] text-xl font-extrabold text-[#0b1c30]">
              {inactiveCount}
            </h3>
          </div>
        </div>

        <div className="bg-white border border-[#c3c6d7] rounded-2xl p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <p className="font-['Inter'] text-[11px] font-semibold text-[#737686] uppercase tracking-wider">
              Administrators
            </p>
            <h3 className="font-['Plus_Jakarta_Sans'] text-xl font-extrabold text-[#0b1c30]">
              {adminCount}
            </h3>
          </div>
        </div>
      </div>

      {/* Toolbar (Search, Filters, Add Employee) */}
      <UserToolbar
        queryParams={queryParams}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        onAddUser={() => {
          setModalUser(null);
          setIsModalOpen(true);
        }}
      />

      {/* Bulk Actions Floating Bar */}
      <BulkActions
        selectedCount={selectedIds.length}
        totalCount={users.length}
        onClearSelection={() => setSelectedIds([])}
        onBulkActivate={handleBulkActivate}
        onBulkDeactivate={handleBulkDeactivate}
        onBulkExport={handleBulkExport}
      />

      {/* Main Content Area */}
      {isLoadingUsers ? (
        <UserSkeleton />
      ) : isUsersError ? (
        <UserErrorState onRetry={() => refetchUsers()} />
      ) : users.length === 0 ? (
        <UserEmptyState
          hasFilters={hasActiveFilters}
          onResetFilters={handleResetFilters}
          onAddUser={() => {
            setModalUser(null);
            setIsModalOpen(true);
          }}
        />
      ) : (
        <>
          <UserTable
            users={users}
            selectedIds={selectedIds}
            onSelectToggle={handleSelectToggle}
            onSelectAllToggle={handleSelectAllToggle}
            onViewUser={(user) => {
              setDrawerUser(user);
              setIsDrawerOpen(true);
            }}
            onEditUser={(user) => {
              setModalUser(user);
              setIsModalOpen(true);
            }}
            onToggleStatus={handleToggleStatus}
            onResetPassword={(user) => {
              setPasswordModalUser(user);
              setIsPasswordModalOpen(true);
            }}
            onDeleteUser={handleDeleteUser}
          />

          {/* Pagination Bar */}
          <div className="bg-white border border-[#c3c6d7] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 font-['Inter'] text-xs">
            <p className="text-[#737686]">
              Showing <span className="font-semibold text-[#0b1c30]">{(meta.page - 1) * meta.limit + 1}</span> to{' '}
              <span className="font-semibold text-[#0b1c30]">
                {Math.min(meta.page * meta.limit, meta.total)}
              </span>{' '}
              of <span className="font-semibold text-[#0b1c30]">{meta.total}</span> employees
            </p>

            <div className="flex items-center gap-2">
              <button
                disabled={meta.page <= 1}
                onClick={() => handleFilterChange({ page: meta.page - 1 })}
                className="h-8 px-3 rounded-xl border border-[#c3c6d7] bg-white text-[#434655] font-semibold hover:bg-[#f8f9ff] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
              >
                <ChevronLeft className="h-3.5 w-3.5" /> Previous
              </button>
              <span className="px-3 font-semibold text-[#0b1c30]">
                Page {meta.page} of {meta.totalPages || 1}
              </span>
              <button
                disabled={meta.page >= meta.totalPages}
                onClick={() => handleFilterChange({ page: meta.page + 1 })}
                className="h-8 px-3 rounded-xl border border-[#c3c6d7] bg-white text-[#434655] font-semibold hover:bg-[#f8f9ff] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
              >
                Next <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* User Details Drawer */}
      <UserDrawer
        user={drawerUser}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onEdit={(user) => {
          setModalUser(user);
          setIsModalOpen(true);
        }}
        onResetPassword={(user) => {
          setPasswordModalUser(user);
          setIsPasswordModalOpen(true);
        }}
      />

      {/* User Create/Edit Modal */}
      <UserModal
        isOpen={isModalOpen}
        userToEdit={modalUser}
        roles={roles}
        isSubmitting={createUserMutation.isPending || updateUserMutation.isPending}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateOrUpdate}
      />

      {/* Reset Password Modal */}
      <ResetPasswordModal
        user={passwordModalUser}
        isOpen={isPasswordModalOpen}
        isSubmitting={resetPasswordMutation.isPending}
        onClose={() => setIsPasswordModalOpen(false)}
        onSubmit={async (pass) => {
          if (passwordModalUser) {
            await resetPasswordMutation.mutateAsync({ id: passwordModalUser.id, pass });
          }
        }}
      />
    </div>
  );
};
export default UsersPage;
