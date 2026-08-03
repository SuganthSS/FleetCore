import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { auditService } from '@/services/audit.service';
import type { AuditLogItem, AuditQueryFilters } from '@/types/audit';
import {
  AuditHeader,
  AuditToolbar,
  AuditFilters,
  AuditTimeline,
  AuditTable,
  AuditCard,
  AuditDrawer,
  AuditSkeleton,
  AuditEmptyState,
  AuditErrorState,
} from '@/components/audit';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'timeline' | 'table' | 'cards'>('timeline');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filters state
  const [moduleFilter, setModuleFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState<'timestamp' | 'userName' | 'roleName' | 'module' | 'action' | 'severity'>('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const limit = 15;

  const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (moduleFilter) count++;
    if (severityFilter) count++;
    if (roleFilter) count++;
    if (statusFilter) count++;
    if (userFilter) count++;
    if (startDate) count++;
    if (endDate) count++;
    return count;
  }, [moduleFilter, severityFilter, roleFilter, statusFilter, userFilter, startDate, endDate]);

  const queryFilters: AuditQueryFilters = useMemo(
    () => ({
      page,
      limit,
      search: search || undefined,
      sortBy,
      sortOrder,
      module: moduleFilter || undefined,
      severity: severityFilter || undefined,
      role: roleFilter || undefined,
      status: statusFilter || undefined,
      user: userFilter || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    }),
    [
      page,
      limit,
      search,
      sortBy,
      sortOrder,
      moduleFilter,
      severityFilter,
      roleFilter,
      statusFilter,
      userFilter,
      startDate,
      endDate,
    ]
  );

  // Query audit logs
  const {
    data: auditResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['audit-logs', queryFilters],
    queryFn: () => auditService.getAuditLogs(queryFilters),
  });

  // Query metadata for filter dropdown options
  const { data: metaResponse } = useQuery({
    queryKey: ['audit-meta'],
    queryFn: () => auditService.getAuditMeta(),
  });

  const logs = auditResponse?.data || [];
  const meta = auditResponse?.meta || { total: 0, page: 1, limit: 15, totalPages: 1 };

  const handleResetFilters = () => {
    setSearch('');
    setModuleFilter('');
    setSeverityFilter('');
    setRoleFilter('');
    setStatusFilter('');
    setUserFilter('');
    setStartDate('');
    setEndDate('');
    setSortBy('timestamp');
    setSortOrder('desc');
    setPage(1);
  };

  const handleSortChange = (
    column: 'timestamp' | 'userName' | 'roleName' | 'module' | 'action' | 'severity'
  ) => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const handleSelectLog = (log: AuditLogItem) => {
    setSelectedLog(log);
    setIsDrawerOpen(true);
  };

  const handleExportCSV = () => {
    if (!logs.length) return;
    const headers = ['ID', 'Timestamp', 'User', 'Role', 'Module', 'Action', 'Severity', 'IP', 'Status', 'Description'];
    const rows = logs.map((l) => [
      l.id,
      new Date(l.timestamp).toLocaleString(),
      `"${l.userName}"`,
      `"${l.roleName}"`,
      `"${l.module}"`,
      `"${l.action}"`,
      l.severity,
      l.ipAddress,
      l.status,
      `"${l.description.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FleetCore_Audit_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <AuditSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <AuditErrorState
          message={(error as Error)?.message || 'Failed to load enterprise audit logs'}
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-['Inter']">
      {/* Header */}
      <AuditHeader totalCount={meta.total} logs={logs} onExport={handleExportCSV} />

      {/* Toolbar */}
      <AuditToolbar
        search={search}
        viewMode={viewMode}
        isFilterOpen={isFilterOpen}
        activeFilterCount={activeFilterCount}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        onViewModeChange={setViewMode}
        onToggleFilters={() => setIsFilterOpen((prev) => !prev)}
        onReset={handleResetFilters}
      />

      {/* Expandable Filters Panel */}
      <AuditFilters
        isOpen={isFilterOpen}
        meta={metaResponse?.data}
        selectedModule={moduleFilter}
        selectedSeverity={severityFilter}
        selectedRole={roleFilter}
        selectedStatus={statusFilter}
        selectedUser={userFilter}
        startDate={startDate}
        endDate={endDate}
        onModuleChange={(val) => {
          setModuleFilter(val);
          setPage(1);
        }}
        onSeverityChange={(val) => {
          setSeverityFilter(val);
          setPage(1);
        }}
        onRoleChange={(val) => {
          setRoleFilter(val);
          setPage(1);
        }}
        onStatusChange={(val) => {
          setStatusFilter(val);
          setPage(1);
        }}
        onUserChange={(val) => {
          setUserFilter(val);
          setPage(1);
        }}
        onStartDateChange={(val) => {
          setStartDate(val);
          setPage(1);
        }}
        onEndDateChange={(val) => {
          setEndDate(val);
          setPage(1);
        }}
      />

      {/* Content view based on View Mode */}
      {logs.length === 0 ? (
        <AuditEmptyState onReset={handleResetFilters} />
      ) : viewMode === 'timeline' ? (
        <AuditTimeline logs={logs} onSelectLog={handleSelectLog} />
      ) : viewMode === 'table' ? (
        <AuditTable
          logs={logs}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
          onSelectLog={handleSelectLog}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {logs.map((log) => (
            <AuditCard key={log.id} log={log} onSelect={handleSelectLog} />
          ))}
        </div>
      )}

      {/* Pagination Footer */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between bg-white border border-[#c3c6d7] rounded-2xl p-4 shadow-xs text-xs">
          <span className="text-[#737686]">
            Showing page <span className="font-semibold text-[#0b1c30]">{meta.page}</span> of{' '}
            <span className="font-semibold text-[#0b1c30]">{meta.totalPages}</span> ({meta.total}{' '}
            total audit events)
          </span>

          <div className="flex items-center gap-2">
            <button
              disabled={meta.page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 h-8 rounded-lg border border-[#c3c6d7] text-[#004ac6] font-semibold hover:bg-[#eff4ff] disabled:opacity-40 flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </button>
            <button
              disabled={meta.page >= meta.totalPages}
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              className="px-3 h-8 rounded-lg border border-[#c3c6d7] text-[#004ac6] font-semibold hover:bg-[#eff4ff] disabled:opacity-40 flex items-center gap-1 cursor-pointer"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Detail Inspection Drawer */}
      <AuditDrawer
        log={selectedLog}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedLog(null);
        }}
      />
    </div>
  );
};
