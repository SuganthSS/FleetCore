import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { driverService } from '@/services/driver.service';
import type { Driver, DriverAvailability, ExperienceLevel, CreateDriverPayload } from '@/types/driver';
import {
  DriverHeader,
  DriverToolbar,
  DriverTable,
  DriverCards,
  DriverModal,
  DriverDrawer,
  DriverSkeleton,
} from '@/components/driver';
import { CheckCircle2, AlertCircle, Users, Award, ShieldAlert, PhoneCall, ChevronLeft, ChevronRight } from 'lucide-react';

export const FleetManagerDriversPage: React.FC = () => {
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
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  // Success / Error Alerts
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch Drivers
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['fleet-manager-drivers', search, availability, experienceLevel, page, limit, sortBy, sortOrder],
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

  // Calculate Operational Driver Metrics
  const kpiData = {
    total: data?.total || 0,
    onDuty: data?.items.filter((d) => d.availability === 'AVAILABLE' || d.availability === 'ON_TRIP').length || 0,
    available: data?.items.filter((d) => d.availability === 'AVAILABLE').length || 0,
    onTrip: data?.items.filter((d) => d.availability === 'ON_TRIP').length || 0,
    offDuty: data?.items.filter((d) => d.availability === 'OFF_DUTY' || d.availability === 'ON_LEAVE').length || 0,
    expiringLicense: data?.items.filter((d) => {
      const days = Math.ceil((new Date(d.licenseExpiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return days <= 30 && days >= 0;
    }).length || 0,
    avgSafetyScore: 94.8,
  };

  // Mutations
  const invalidateDrivers = () => {
    void queryClient.invalidateQueries({ queryKey: ['fleet-manager-drivers'] });
    void queryClient.invalidateQueries({ queryKey: ['drivers'] });
  };

  const showAlert = (msg: string, type: 'success' | 'error') => {
    if (type === 'success') { setSuccessMessage(msg); setErrorMessage(null); }
    else { setErrorMessage(msg); setSuccessMessage(null); }
    setTimeout(() => { setSuccessMessage(null); setErrorMessage(null); }, 4000);
  };

  const createMutation = useMutation({
    mutationFn: driverService.createDriver,
    onSuccess: (res) => {
      const name = res.data.user ? `${res.data.user.firstName} ${res.data.user.lastName}` : res.data.employeeId;
      showAlert(`Driver '${name}' added to roster.`, 'success');
      invalidateDrivers();
      setModalOpen(false);
    },
    onError: (err: any) => showAlert(err.message || 'Failed to create driver profile.', 'error'),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<CreateDriverPayload> }) => {
      return driverService.updateDriver(id, payload);
    },
    onSuccess: (res) => {
      const name = res.data.user ? `${res.data.user.firstName} ${res.data.user.lastName}` : res.data.employeeId;
      showAlert(`Driver '${name}' operational record updated.`, 'success');
      invalidateDrivers();
      setModalOpen(false);
    },
    onError: (err: any) => showAlert(err.message || 'Failed to update driver profile.', 'error'),
  });

  // Handlers
  const handleQuickContact = (id: string) => {
    const driver = data?.items.find((d) => d.id === id) ?? selectedDriver;
    if (driver) {
      const name = driver.user ? `${driver.user.firstName} ${driver.user.lastName}` : driver.employeeId;
      const phone = driver.user?.phone || 'N/A';
      showAlert(`Initiated dispatch contact for ${name} (${phone}).`, 'success');
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

  const handleOpenAddModal = () => {
    setSelectedDriver(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (driver: Driver) => {
    setSelectedDriver(driver);
    setModalOpen(true);
  };

  const handleOpenDetailsDrawer = (driver: Driver) => {
    setSelectedDriver(driver);
    setDrawerOpen(true);
  };

  const handleModalSubmit = (payload: CreateDriverPayload) => {
    if (selectedDriver) {
      updateMutation.mutate({ id: selectedDriver.id, payload });
    } else {
      createMutation.mutate(payload);
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
        <DriverSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 flex flex-col items-center justify-center text-center space-y-4 bg-white rounded-2xl border border-[#c3c6d7]/30">
        <div className="p-4 rounded-full bg-[#ef4444]/10 text-[#ef4444]">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h2 className="text-lg font-bold text-[#191c1e] font-['Plus_Jakarta_Sans']">Failed to Load Driver Roster</h2>
        <p className="text-xs text-[#737686] max-w-sm">
          {error instanceof Error ? error.message : 'An error occurred while retrieving operational drivers.'}
        </p>
        <button
          onClick={() => void refetch()}
          className="px-4 py-2 rounded-xl bg-[#2563eb] text-white text-xs font-bold shadow-sm hover:bg-[#1d4ed8]"
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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#c3c6d7]/30 shadow-sm">
        <DriverHeader
          totalDrivers={data?.total || 0}
          onAddDriver={handleOpenAddModal}
          onRefresh={() => void refetch()}
          isRefreshing={isFetching}
        />
      </div>

      {/* Operational Driver KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => { setAvailability('AVAILABLE'); setPage(1); }}
          className={`p-5 rounded-2xl border text-left transition-all bg-white shadow-sm ${
            availability === 'AVAILABLE' ? 'border-[#2563eb] ring-2 ring-[#2563eb]/20' : 'border-[#c3c6d7]/30 hover:border-[#2563eb]/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#737686]">Drivers On Duty</span>
            <div className="p-2 rounded-xl bg-[#10b981]/10 text-[#10b981]">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#191c1e] font-['Plus_Jakarta_Sans'] mt-3">{kpiData.available} Available</p>
          <p className="text-xs text-[#10b981] font-semibold mt-1">Ready for assignment</p>
        </button>

        <button
          onClick={() => { setAvailability('ON_TRIP'); setPage(1); }}
          className={`p-5 rounded-2xl border text-left transition-all bg-white shadow-sm ${
            availability === 'ON_TRIP' ? 'border-[#2563eb] ring-2 ring-[#2563eb]/20' : 'border-[#c3c6d7]/30 hover:border-[#2563eb]/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#737686]">Active On Route</span>
            <div className="p-2 rounded-xl bg-[#2563eb]/10 text-[#2563eb]">
              <PhoneCall className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#191c1e] font-['Plus_Jakarta_Sans'] mt-3">{kpiData.onTrip} In Transit</p>
          <p className="text-xs text-[#2563eb] font-semibold mt-1">Streaming telemetry</p>
        </button>

        <button
          onClick={() => { setAvailability('OFF_DUTY'); setPage(1); }}
          className={`p-5 rounded-2xl border text-left transition-all bg-white shadow-sm ${
            availability === 'OFF_DUTY' ? 'border-[#2563eb] ring-2 ring-[#2563eb]/20' : 'border-[#c3c6d7]/30 hover:border-[#2563eb]/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#737686]">License Warnings</span>
            <div className="p-2 rounded-xl bg-[#f59e0b]/10 text-[#f59e0b]">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#191c1e] font-['Plus_Jakarta_Sans'] mt-3">{kpiData.expiringLicense} Expiring</p>
          <p className="text-xs text-[#f59e0b] font-semibold mt-1">Next 30 days</p>
        </button>

        <div className="p-5 rounded-2xl border border-[#c3c6d7]/30 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#737686]">Fleet Safety Score</span>
            <div className="p-2 rounded-xl bg-[#10b981]/10 text-[#10b981]">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#191c1e] font-['Plus_Jakarta_Sans'] mt-3">{kpiData.avgSafetyScore} / 100</p>
          <p className="text-xs text-[#10b981] font-semibold mt-1">Excellent compliance</p>
        </div>
      </div>

      {/* Alerts */}
      {successMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-[#10b981]/20 bg-[#10b981]/10 p-4 text-xs font-semibold text-[#10b981]">
          <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-[#ef4444]/20 bg-[#ef4444]/10 p-4 text-xs font-semibold text-[#ef4444]">
          <AlertCircle className="h-4.5 w-4.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Toolbar */}
      <div className="bg-white p-5 rounded-2xl border border-[#c3c6d7]/30 shadow-sm">
        <DriverToolbar
          search={search}
          onSearchChange={(val) => { setSearch(val); setPage(1); }}
          availability={availability}
          onAvailabilityChange={(val) => { setAvailability(val); setPage(1); }}
          experienceLevel={experienceLevel}
          onExperienceLevelChange={(val) => { setExperienceLevel(val); setPage(1); }}
          sortBy={sortBy}
          onSortByChange={(val) => { setSortBy(val); setPage(1); }}
          sortOrder={sortOrder}
          onSortOrderChange={(val) => setSortOrder(val)}
          viewMode={viewMode}
          onViewModeChange={(mode) => setViewMode(mode)}
          onClearFilters={handleClearFilters}
        />
      </div>

      {/* Roster Data */}
      {data && data.items.length > 0 ? (
        <div className="space-y-4">
          {viewMode === 'table' ? (
            <div className="bg-white rounded-2xl border border-[#c3c6d7]/30 shadow-sm overflow-hidden p-1">
              <DriverTable
                drivers={data.items}
                onView={handleOpenDetailsDrawer}
                onEdit={handleOpenEditModal}
                onDelete={handleQuickContact}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
              />
            </div>
          ) : (
            <DriverCards
              drivers={data.items}
              onView={handleOpenDetailsDrawer}
              onEdit={handleOpenEditModal}
              onDelete={handleQuickContact}
            />
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 bg-white border border-[#c3c6d7]/30 rounded-2xl shadow-xs">
              <span className="text-xs text-[#737686] font-medium">
                Showing {pagination.start} to {pagination.end} of {pagination.total} drivers
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 rounded-lg border border-[#c3c6d7] bg-white text-xs font-semibold text-[#191c1e] hover:bg-[#eceef0] disabled:opacity-40 flex items-center gap-1"
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
                            ? 'bg-[#2563eb] text-white'
                            : 'bg-transparent text-[#737686] hover:bg-[#eceef0] hover:text-[#191c1e]'
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
                  className="px-3 py-1.5 rounded-lg border border-[#c3c6d7] bg-white text-xs font-semibold text-[#191c1e] hover:bg-[#eceef0] disabled:opacity-40 flex items-center gap-1"
                >
                  Next
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[#c3c6d7] bg-white p-12 text-center space-y-3 shadow-sm">
          <p className="text-sm font-bold text-[#191c1e] font-['Plus_Jakarta_Sans']">No drivers matching operational criteria</p>
          <p className="text-xs text-[#737686] max-w-sm mx-auto">
            {search || availability || experienceLevel
              ? 'Try adjusting your operational query or clear active filters.'
              : 'Add drivers to your operational roster to start assigning trips.'}
          </p>
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 rounded-xl border border-[#c3c6d7] text-xs font-bold text-[#191c1e] hover:bg-[#eceef0]"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Driver Modal */}
      <DriverModal
        open={modalOpen}
        driver={selectedDriver}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Driver Drawer */}
      <DriverDrawer
        open={drawerOpen}
        driver={selectedDriver}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
};

export default FleetManagerDriversPage;
