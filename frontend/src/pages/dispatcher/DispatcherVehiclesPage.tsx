import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Truck,
  Search,
  Filter,
  RefreshCw,
  Fuel,
  Layers,
  Send,
  ChevronRight,
  MapPin,
  Activity,
  Wrench,
} from 'lucide-react';
import { vehicleService } from '@/services/vehicle.service';
import type { VehicleStatus } from '@/types/vehicle';
import { cn } from '@/utils/cn';

export const DispatcherVehiclesPage: React.FC = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  // Fetch Vehicles using vehicleService
  const { data: vehicleData, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['dispatcher-vehicles', search, statusFilter],
    queryFn: async () => {
      const res = await vehicleService.getVehicles({
        search: search || undefined,
        status: statusFilter ? (statusFilter as VehicleStatus) : undefined,
        limit: 50,
      });
      return res.data;
    },
  });

  const vehicles = vehicleData?.items || [];

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#c3c6d7]/30 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-[#2563eb]" />
            <h1 className="text-xl font-black tracking-tight text-[#191c1e]">
              Fleet Readiness & Vehicle Telemetry
            </h1>
          </div>
          <p className="text-xs font-semibold text-[#737686] mt-0.5">
            Monitor active fleet availability, fuel levels, cargo payload capacities & GPS telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => void refetch()}
            disabled={isFetching}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#c3c6d7] text-xs font-bold text-[#434655] hover:bg-[#eceef0] transition-colors disabled:opacity-50"
          >
            <RefreshCw className={cn('h-3.5 w-3.5', isFetching && 'animate-spin')} />
            <span>Refresh Fleet</span>
          </button>

          <button
            onClick={() => navigate('/dispatcher/dispatch-center')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2563eb] text-white text-xs font-bold shadow-md shadow-[#2563eb]/25 hover:bg-[#1d4ed8] transition-colors"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Assign Vehicle to Trip</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#c3c6d7]/30 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#737686]" />
          <input
            type="text"
            placeholder="Search plate # or model..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#c3c6d7]/40 text-xs focus:outline-none focus:border-[#2563eb]"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-[#737686]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-[#c3c6d7]/40 text-xs focus:outline-none focus:border-[#2563eb] bg-white font-bold"
            >
              <option value="">All Vehicle Statuses</option>
              <option value="AVAILABLE">Available (Ready)</option>
              <option value="ON_TRIP">On Active Trip</option>
              <option value="MAINTENANCE">In Maintenance</option>
              <option value="OUT_OF_SERVICE">Out of Service</option>
            </select>
          </div>
        </div>
      </div>

      {/* Vehicle Fleet Grid */}
      {isLoading ? (
        <div className="py-16 text-center text-xs text-[#737686]">Loading vehicle fleet...</div>
      ) : vehicles.length === 0 ? (
        <div className="py-16 text-center text-xs text-[#737686]">No vehicles found matching criteria.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.map((vehicle) => {
            const isAvailable = vehicle.status === 'AVAILABLE';
            const fuelLevel = (vehicle as any).fuelLevel ?? 85;
            const needsService = vehicle.status === 'MAINTENANCE';

            return (
              <div
                key={vehicle.id}
                className="p-5 rounded-2xl border border-[#c3c6d7]/30 bg-white shadow-xs hover:border-[#2563eb]/40 transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="h-9 w-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                        <Truck className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-mono font-black text-sm text-[#191c1e]">{vehicle.registrationNumber}</h3>
                        <p className="text-[11px] text-[#737686]">
                          {vehicle.make} {vehicle.model} ({vehicle.manufacturingYear || 2023})
                        </p>
                      </div>
                    </div>

                    <span
                      className={cn(
                        'px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase',
                        isAvailable ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      )}
                    >
                      {vehicle.status}
                    </span>
                  </div>

                  {/* Fuel Gauge & Payload */}
                  <div className="space-y-2 bg-[#f7f9fb] p-3 rounded-xl text-[11px]">
                    <div className="flex items-center justify-between font-bold text-[#434655]">
                      <span className="flex items-center gap-1">
                        <Fuel className="h-3.5 w-3.5 text-amber-500" /> Fuel Level
                      </span>
                      <span>{fuelLevel}%</span>
                    </div>
                    <div className="w-full bg-[#c3c6d7]/30 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full',
                          fuelLevel > 50 ? 'bg-emerald-500' : fuelLevel > 20 ? 'bg-amber-500' : 'bg-red-500'
                        )}
                        style={{ width: `${fuelLevel}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] text-[#737686] pt-1">
                      <span className="flex items-center gap-1">
                        <Layers className="h-3 w-3" /> Max Capacity: {vehicle.capacity || 18000} kg
                      </span>
                      <span className="flex items-center gap-1">
                        <Activity className="h-3 w-3 text-emerald-600" /> GPS Signal: 100%
                      </span>
                    </div>
                  </div>

                  {/* Maintenance Warning if applicable */}
                  {needsService && (
                    <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-[11px] text-red-900 flex items-center gap-2 font-bold">
                      <Wrench className="h-4 w-4 text-red-600 shrink-0" />
                      <span>Scheduled Maintenance Warning: Inspection Required.</span>
                    </div>
                  )}
                </div>

                {/* Dispatcher Actions */}
                <div className="pt-3 border-t border-[#c3c6d7]/20 flex items-center justify-between gap-2">
                  <button
                    onClick={() => navigate('/dispatcher/tracking')}
                    className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800"
                  >
                    <MapPin className="h-3.5 w-3.5" />
                    <span>View GPS</span>
                  </button>

                  <button
                    onClick={() => navigate('/dispatcher/dispatch-center')}
                    className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-[#2563eb] text-white font-bold text-xs hover:bg-[#1d4ed8] transition-colors"
                  >
                    <span>Assign Vehicle</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DispatcherVehiclesPage;
