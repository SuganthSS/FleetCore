import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  RefreshCw,
  Phone,
  Send,
  Award,
  Clock,
  ChevronRight,
  X,
} from 'lucide-react';
import { driverService } from '@/services/driver.service';
import type { Driver, DriverAvailability } from '@/types/driver';
import { cn } from '@/utils/cn';

export const DispatcherDriversPage: React.FC = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('');
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  // Fetch Drivers using driverService
  const { data: driverData, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['dispatcher-drivers', search, availabilityFilter],
    queryFn: async () => {
      const res = await driverService.getDrivers({
        search: search || undefined,
        availability: availabilityFilter ? (availabilityFilter as DriverAvailability) : undefined,
        limit: 50,
      });
      return res.data;
    },
  });

  const drivers = driverData?.items || [];

  const handleCallDriver = (driver: Driver) => {
    setSelectedDriver(driver);
    setContactModalOpen(true);
  };

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#c3c6d7]/30 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-[#2563eb]" />
            <h1 className="text-xl font-black tracking-tight text-[#191c1e]">
              Driver Roster & Availability
            </h1>
          </div>
          <p className="text-xs font-semibold text-[#737686] mt-0.5">
            Monitor active driver availability, Hours of Service (HOS), license compliance & trip assignments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => void refetch()}
            disabled={isFetching}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#c3c6d7] text-xs font-bold text-[#434655] hover:bg-[#eceef0] transition-colors disabled:opacity-50"
          >
            <RefreshCw className={cn('h-3.5 w-3.5', isFetching && 'animate-spin')} />
            <span>Refresh Roster</span>
          </button>

          <button
            onClick={() => navigate('/dispatcher/dispatch-center')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2563eb] text-white text-xs font-bold shadow-md shadow-[#2563eb]/25 hover:bg-[#1d4ed8] transition-colors"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Assign Driver to Trip</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#c3c6d7]/30 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#737686]" />
          <input
            type="text"
            placeholder="Search driver name or employee ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#c3c6d7]/40 text-xs focus:outline-none focus:border-[#2563eb]"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-[#737686]" />
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-[#c3c6d7]/40 text-xs focus:outline-none focus:border-[#2563eb] bg-white font-bold"
            >
              <option value="">All Driver Statuses</option>
              <option value="AVAILABLE">Available (On Duty)</option>
              <option value="ON_TRIP">On Active Trip</option>
              <option value="OFF_DUTY">Off Duty</option>
              <option value="ON_LEAVE">On Leave</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Driver Cards Grid */}
      {isLoading ? (
        <div className="py-16 text-center text-xs text-[#737686]">Loading driver roster...</div>
      ) : drivers.length === 0 ? (
        <div className="py-16 text-center text-xs text-[#737686]">No drivers found matching criteria.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {drivers.map((driver) => {
            const isAvailable = driver.availability === 'AVAILABLE';

            return (
              <div
                key={driver.id}
                className="p-5 rounded-2xl border border-[#c3c6d7]/30 bg-white shadow-xs hover:border-[#2563eb]/40 transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-black text-sm">
                        {driver.user ? `${driver.user.firstName[0]}${driver.user.lastName[0]}` : driver.employeeId.slice(0, 2)}
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-[#191c1e]">
                          {driver.user ? `${driver.user.firstName} ${driver.user.lastName}` : driver.employeeId}
                        </h3>
                        <p className="text-[11px] text-[#737686] font-mono">Employee ID: {driver.employeeId}</p>
                      </div>
                    </div>

                    <span
                      className={cn(
                        'px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase',
                        isAvailable ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      )}
                    >
                      {driver.availability}
                    </span>
                  </div>

                  {/* Driver Telemetry Specs */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-[#f7f9fb] p-3 rounded-xl text-[#434655]">
                    <div>
                      <span className="block text-[9px] text-[#737686] font-extrabold uppercase">Experience</span>
                      <span className="font-bold flex items-center gap-1">
                        <Award className="h-3 w-3 text-amber-500" />
                        {driver.experienceLevel}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[9px] text-[#737686] font-extrabold uppercase">HOS Remaining</span>
                      <span className="font-bold flex items-center gap-1">
                        <Clock className="h-3 w-3 text-blue-500" />
                        6.5 / 11.0 Hours
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1 text-[11px] text-[#737686]">
                    <p className="flex items-center justify-between">
                      <span>License Number:</span>
                      <strong className="font-mono text-[#191c1e]">{driver.licenseNumber}</strong>
                    </p>
                    <p className="flex items-center justify-between">
                      <span>License Expiry:</span>
                      <strong className="text-[#191c1e]">{driver.licenseExpiry}</strong>
                    </p>
                  </div>
                </div>

                {/* Dispatcher Actions */}
                <div className="pt-3 border-t border-[#c3c6d7]/20 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleCallDriver(driver)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#c3c6d7] text-[#434655] font-bold text-xs hover:bg-[#eceef0] transition-colors"
                  >
                    <Phone className="h-3.5 w-3.5 text-blue-600" />
                    <span>Call Driver</span>
                  </button>

                  <button
                    onClick={() => navigate('/dispatcher/dispatch-center')}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#2563eb] text-white font-bold text-xs hover:bg-[#1d4ed8] transition-colors"
                  >
                    <span>Assign to Trip</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Call / Contact Driver Quick Dispatch Modal */}
      {contactModalOpen && selectedDriver && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#c3c6d7]/30 pb-3">
              <div className="flex items-center gap-2 text-blue-600">
                <Phone className="h-5 w-5" />
                <h3 className="text-sm font-black text-[#191c1e]">Contact Driver Dispatch</h3>
              </div>
              <button onClick={() => setContactModalOpen(false)} className="text-[#737686] hover:text-[#191c1e]">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#434655]">
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                <p className="font-bold text-blue-900 text-sm">
                  {selectedDriver.user
                    ? `${selectedDriver.user.firstName} ${selectedDriver.user.lastName}`
                    : selectedDriver.employeeId}
                </p>
                <p className="text-[11px] text-blue-700 font-mono">Mobile: {selectedDriver.user?.phone || '+1 (555) 234-5678'}</p>
              </div>

              <div className="space-y-2">
                <a
                  href={`tel:${selectedDriver.user?.phone || '+15552345678'}`}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  <span>Initiate Direct Voice Call</span>
                </a>

                <button
                  onClick={() => {
                    setContactModalOpen(false);
                    navigate('/dispatcher/dispatch-center');
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#2563eb] text-white font-bold text-xs hover:bg-[#1d4ed8] transition-colors"
                >
                  <Send className="h-4 w-4" />
                  <span>Send Dispatch Instructions</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DispatcherDriversPage;
