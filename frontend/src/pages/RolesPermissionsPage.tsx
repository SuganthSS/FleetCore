import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roleService } from '@/services/role.service';
import type { RoleDetail } from '@/types/role';
import {
  RoleHeader,
  RoleToolbar,
  RoleCard,
  RoleTable,
  PermissionMatrix,
  RoleDrawer,
  RoleSkeleton,
  RoleEmptyState,
  RoleErrorState,
} from '@/components/role';

const DEFAULT_CATEGORIES = [
  'Dashboard',
  'Users',
  'Vehicles',
  'Drivers',
  'Trips',
  'Routes',
  'Shipments',
  'Fuel',
  'Maintenance',
  'Tracking',
  'Notifications',
  'Reports',
  'Analytics',
  'AI',
  'Settings',
  'Documents',
  'Audit Logs',
];

const DEFAULT_ACTIONS = ['View', 'Create', 'Edit', 'Delete', 'Export', 'Approve', 'Assign', 'Manage'];

export const RolesPermissionsPage: React.FC = () => {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'system' | 'custom'>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'matrix' | 'table'>('cards');
  const [selectedRole, setSelectedRole] = useState<RoleDetail | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Query enterprise roles list
  const {
    data: rolesResponse,
    isLoading: isLoadingRoles,
    isError: isErrorRoles,
    error: rolesError,
    refetch: refetchRoles,
  } = useQuery({
    queryKey: ['roles'],
    queryFn: () => roleService.getRoles(),
  });

  // Query matrix definition
  const { data: matrixResponse } = useQuery({
    queryKey: ['roles-matrix'],
    queryFn: () => roleService.getPermissionMatrix(),
  });

  // Mutation to update permissions
  const updatePermissionsMutation = useMutation({
    mutationFn: ({ roleId, permissions }: { roleId: string; permissions: Record<string, string[]> }) =>
      roleService.updateRolePermissions(roleId, permissions),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      queryClient.invalidateQueries({ queryKey: ['roles-matrix'] });
    },
  });

  const roles = rolesResponse?.data || [];
  const categories = matrixResponse?.data?.categories || DEFAULT_CATEGORIES;
  const actions = matrixResponse?.data?.actions || DEFAULT_ACTIONS;

  // Filter roles by search query and type filter
  const filteredRoles = useMemo(() => {
    const roleList = rolesResponse?.data || [];
    return roleList.filter((role) => {
      const matchesSearch =
        search === '' ||
        role.name.toLowerCase().includes(search.toLowerCase()) ||
        (role.description && role.description.toLowerCase().includes(search.toLowerCase()));

      const matchesType =
        filterType === 'all' ||
        (filterType === 'system' && role.isSystem) ||
        (filterType === 'custom' && !role.isSystem);

      return matchesSearch && matchesType;
    });
  }, [rolesResponse?.data, search, filterType]);


  const handleSelectRole = (role: RoleDetail) => {
    setSelectedRole(role);
    setIsDrawerOpen(true);
  };

  const handleSavePermissions = async (roleId: string, permissions: Record<string, string[]>) => {
    await updatePermissionsMutation.mutateAsync({ roleId, permissions });
  };

  if (isLoadingRoles) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <RoleSkeleton />
      </div>
    );
  }

  if (isErrorRoles) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <RoleErrorState
          message={(rolesError as Error)?.message || 'Failed to load enterprise roles'}
          onRetry={refetchRoles}
        />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-['Inter']">
      {/* Header */}
      <RoleHeader roles={roles} />

      {/* Toolbar */}
      <RoleToolbar
        search={search}
        viewMode={viewMode}
        filterType={filterType}
        onSearchChange={setSearch}
        onViewModeChange={setViewMode}
        onFilterTypeChange={setFilterType}
        onReset={() => {
          setSearch('');
          setFilterType('all');
        }}
      />

      {/* Main Content Area based on View Mode */}
      {filteredRoles.length === 0 ? (
        <RoleEmptyState
          onReset={() => {
            setSearch('');
            setFilterType('all');
          }}
        />
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoles.map((role) => (
            <RoleCard key={role.id} role={role} onSelect={handleSelectRole} />
          ))}
        </div>
      ) : viewMode === 'matrix' ? (
        <PermissionMatrix
          roles={filteredRoles}
          categories={categories}
          actions={actions}
          isEditable={true}
          onTogglePermission={(roleId, category, action) => {
            const targetRole = roles.find((r) => r.id === roleId);
            if (!targetRole || targetRole.name === 'Administrator') return;

            const current = targetRole.permissions[category] || [];
            const updated = current.includes(action)
              ? current.filter((a) => a !== action)
              : [...current, action];

            handleSavePermissions(roleId, {
              ...targetRole.permissions,
              [category]: updated,
            });
          }}
        />
      ) : (
        <RoleTable roles={filteredRoles} onSelectRole={handleSelectRole} />
      )}

      {/* Detailed Role Permissions Slide-over Drawer */}
      <RoleDrawer
        role={selectedRole}
        isOpen={isDrawerOpen}
        categories={categories}
        actions={actions}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedRole(null);
        }}
        onSavePermissions={handleSavePermissions}
      />
    </div>
  );
};
