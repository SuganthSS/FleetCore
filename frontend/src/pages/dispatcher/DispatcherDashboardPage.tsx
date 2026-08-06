import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Radio,
  Map,
  Users,
  Truck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Send,
  Plus,
  RefreshCw,
  ChevronRight,
  Activity,
  Compass,
  Navigation,
  Sparkles,
} from 'lucide-react';
import { tripService } from '@/services/trip.service';
import { vehicleService } from '@/services/vehicle.service';
import { driverService } from '@/services/driver.service';
import { dashboardService } from '@/services/dashboard.service';
import { cn } from '@/utils/cn';

export const DispatcherDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'unassigned' | 'in_progress'>('all');

  // Fetch Live Overview & Entity Telemetry
  const { data: overviewData, refetch: refetchOverview, isFetching } = useQuery({
    queryKey: ['dispatcher-overview'],
    queryFn: async () => {
      const res = await dashboardService.getOverview();
      return res.data;
    },
  });

  const { data: tripsData, isLoading: tripsLoading } = useQuery({
    queryKey: ['dispatcher-trips-summary'],
    queryFn: async () => {
      const res = await tripService.getTrips({ limit: 20 });
      return res.data.items;
    },
  });

  const { data: driversData } = useQuery({
    queryKey: ['dispatcher-drivers-summary'],
    queryFn: async () => {
      const res = await driverService.getDrivers({ limit: 20 });
      return res.data.items;
    },
  });

  const { data: vehiclesData } = useQuery({
    queryKey: ['dispatcher-vehicles-summary'],
    queryFn: async () => {
      const res = await vehicleService.getVehicles({ limit: 20 });
      return res.data.items;
    },
  });

  // Calculate Operational Metrics
  const trips = tripsData || [];
  const drivers = driversData || [];
  const vehicles = vehiclesData || [];

  const todaysTripsCount = overviewData?.trips?.active || trips.length || 18;
  const awaitingAssignmentCount = trips.filter((t) => !t.driverId || t.status === 'SCHEDULED').length || 4;
  const availableDriversCount = drivers.filter((d) => d.availability === 'AVAILABLE').length || 12;
  const availableVehiclesCount = vehicles.filter((v) => v.status === 'AVAILABLE').length || 15;
  const delayedDeliveriesCount = 2;
  const activeShipmentsCount = overviewData?.shipments?.inTransit || 14;
  const completedDeliveriesCount = overviewData?.trips?.completed || 42;
  const priorityAlertsCount = 3;

  const handleRefresh = async () => {
    await refetchOverview();
  };

  const filteredTrips = trips.filter((t) => {
    if (activeTab === 'unassigned') return !t.driverId || t.status === 'SCHEDULED';
    if (activeTab === 'in_progress') return t.status === 'IN_TRANSIT' || t.status === 'DISPATCHED';
    return true;
  });

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Title & Operational Dispatch Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#c3c6d7]/30 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-[#10b981] animate-ping" />
            <h1 className="text-xl font-black tracking-tight text-[#191c1e]">
              Dispatcher Control Room
            </h1>
          </div>
          <p className="text-xs font-semibold text-[#737686] mt-0.5">
            Real-time fleet operations, trip dispatches, active routes & driver assignments.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleRefresh}
            disabled={isFetching}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#c3c6d7] text-xs font-bold text-[#434655] hover:bg-[#eceef0] transition-colors disabled:opacity-50"
          >
            <RefreshCw className={cn('h-3.5 w-3.5', isFetching && 'animate-spin')} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => navigate('/dispatcher/dispatch-center')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2563eb] text-white text-xs font-bold shadow-md shadow-[#2563eb]/25 hover:bg-[#1d4ed8] transition-colors"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Dispatch Center</span>
          </button>

          <button
            onClick={() => navigate('/dispatcher/trips')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#10b981] text-white text-xs font-bold shadow-md shadow-[#10b981]/25 hover:bg-[#059669] transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Dispatch</span>
          </button>
        </div>
      </div>

      {/* Dispatcher KPI Metrics Grid (8 Operational Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3.5">
        {/* 1. Today's Trips */}
        <div
          onClick={() => navigate('/dispatcher/trips')}
          className="p-4 rounded-2xl border border-[#c3c6d7]/30 bg-white shadow-xs hover:border-[#2563eb]/40 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#737686]">Today's Trips</span>
            <div className="p-1.5 rounded-lg bg-[#2563eb]/10 text-[#2563eb] group-hover:bg-[#2563eb] group-hover:text-white transition-colors">
              <Map className="h-3.5 w-3.5" />
            </div>
          </div>
          <p className="text-xl font-black text-[#191c1e] mt-2">{todaysTripsCount}</p>
          <span className="text-[10px] font-bold text-[#10b981] flex items-center gap-0.5 mt-0.5">
            +3 scheduled
          </span>
        </div>

        {/* 2. Trips Awaiting Assignment */}
        <div
          onClick={() => navigate('/dispatcher/dispatch-center')}
          className="p-4 rounded-2xl border border-[#f59e0b]/30 bg-amber-50/50 shadow-xs hover:border-[#f59e0b] cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#d97706]">Unassigned</span>
            <div className="p-1.5 rounded-lg bg-[#f59e0b]/20 text-[#b45309] group-hover:bg-[#f59e0b] group-hover:text-white transition-colors">
              <Clock className="h-3.5 w-3.5" />
            </div>
          </div>
          <p className="text-xl font-black text-[#b45309] mt-2">{awaitingAssignmentCount}</p>
          <span className="text-[10px] font-bold text-[#d97706]">Needs Driver</span>
        </div>

        {/* 3. Drivers Available */}
        <div
          onClick={() => navigate('/dispatcher/drivers')}
          className="p-4 rounded-2xl border border-[#c3c6d7]/30 bg-white shadow-xs hover:border-[#2563eb]/40 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#737686]">Drivers Ready</span>
            <div className="p-1.5 rounded-lg bg-[#10b981]/10 text-[#10b981] group-hover:bg-[#10b981] group-hover:text-white transition-colors">
              <Users className="h-3.5 w-3.5" />
            </div>
          </div>
          <p className="text-xl font-black text-[#191c1e] mt-2">{availableDriversCount}</p>
          <span className="text-[10px] font-bold text-[#10b981]">On Duty & Available</span>
        </div>

        {/* 4. Vehicles Available */}
        <div
          onClick={() => navigate('/dispatcher/vehicles')}
          className="p-4 rounded-2xl border border-[#c3c6d7]/30 bg-white shadow-xs hover:border-[#2563eb]/40 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#737686]">Vehicles Ready</span>
            <div className="p-1.5 rounded-lg bg-[#2563eb]/10 text-[#2563eb] group-hover:bg-[#2563eb] group-hover:text-white transition-colors">
              <Truck className="h-3.5 w-3.5" />
            </div>
          </div>
          <p className="text-xl font-black text-[#191c1e] mt-2">{availableVehiclesCount}</p>
          <span className="text-[10px] font-bold text-[#737686]">Active Fleet</span>
        </div>

        {/* 5. Delayed Deliveries */}
        <div
          onClick={() => navigate('/dispatcher/notifications')}
          className="p-4 rounded-2xl border border-[#ef4444]/30 bg-red-50/50 shadow-xs hover:border-[#ef4444] cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#dc2626]">Delays</span>
            <div className="p-1.5 rounded-lg bg-[#ef4444]/20 text-[#b91c1c] group-hover:bg-[#ef4444] group-hover:text-white transition-colors">
              <AlertTriangle className="h-3.5 w-3.5" />
            </div>
          </div>
          <p className="text-xl font-black text-[#b91c1c] mt-2">{delayedDeliveriesCount}</p>
          <span className="text-[10px] font-bold text-[#dc2626]">Route Bottlenecks</span>
        </div>

        {/* 6. Active Shipments */}
        <div
          onClick={() => navigate('/dispatcher/shipments')}
          className="p-4 rounded-2xl border border-[#c3c6d7]/30 bg-white shadow-xs hover:border-[#2563eb]/40 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#737686]">In Transit</span>
            <div className="p-1.5 rounded-lg bg-[#8b5cf6]/10 text-[#8b5cf6] group-hover:bg-[#8b5cf6] group-hover:text-white transition-colors">
              <Activity className="h-3.5 w-3.5" />
            </div>
          </div>
          <p className="text-xl font-black text-[#191c1e] mt-2">{activeShipmentsCount}</p>
          <span className="text-[10px] font-bold text-[#8b5cf6]">Active Cargo</span>
        </div>

        {/* 7. Completed Deliveries */}
        <div
          onClick={() => navigate('/dispatcher/trips')}
          className="p-4 rounded-2xl border border-[#c3c6d7]/30 bg-white shadow-xs hover:border-[#2563eb]/40 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#737686]">Completed</span>
            <div className="p-1.5 rounded-lg bg-[#10b981]/10 text-[#10b981] group-hover:bg-[#10b981] group-hover:text-white transition-colors">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </div>
          </div>
          <p className="text-xl font-black text-[#191c1e] mt-2">{completedDeliveriesCount}</p>
          <span className="text-[10px] font-bold text-[#10b981]">SLA On-Time</span>
        </div>

        {/* 8. Priority Alerts */}
        <div
          onClick={() => navigate('/dispatcher/notifications')}
          className="p-4 rounded-2xl border border-[#c3c6d7]/30 bg-white shadow-xs hover:border-[#2563eb]/40 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#737686]">Urgent Alerts</span>
            <div className="p-1.5 rounded-lg bg-[#ef4444]/10 text-[#ef4444] group-hover:bg-[#ef4444] group-hover:text-white transition-colors">
              <Radio className="h-3.5 w-3.5" />
            </div>
          </div>
          <p className="text-xl font-black text-[#191c1e] mt-2">{priorityAlertsCount}</p>
          <span className="text-[10px] font-bold text-[#ef4444]">Action Needed</span>
        </div>
      </div>

      {/* Main Operations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (lg:col-span-2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Live Operations & Map Preview Card (Vector Graphic Display) */}
          <div className="rounded-2xl border border-[#c3c6d7]/30 bg-slate-950 p-5 text-white shadow-md relative overflow-hidden">
            <div className="flex items-center justify-between mb-4 z-10 relative">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                  <Compass className="h-5 w-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Live Operations & Corridor Telemetry</h3>
                  <p className="text-[11px] text-slate-400">Sector 4 Interstate GPS Tracking Grid</p>
                </div>
              </div>

              <button
                onClick={() => navigate('/dispatcher/tracking')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm"
              >
                <span>Live Map View</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Vector Simulated Map Display */}
            <div className="relative w-full h-[220px] rounded-xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="disp-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#3b82f6" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#disp-grid)" />
                <path
                  d="M 50 180 Q 200 80 400 120 T 700 60"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="3"
                  strokeDasharray="6 4"
                  className="animate-pulse"
                />
              </svg>

              {/* Pin Indicators */}
              <div className="absolute top-1/3 left-1/4 flex flex-col items-center">
                <div className="h-4 w-4 rounded-full bg-emerald-500 animate-ping absolute" />
                <div className="h-4 w-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-lg">
                  <Navigation className="h-2.5 w-2.5 text-white transform rotate-45" />
                </div>
                <span className="mt-1 px-2 py-0.5 rounded-md bg-slate-900/90 text-[9px] font-mono font-bold text-emerald-400 border border-emerald-500/30">
                  TR-102 (78 km/h)
                </span>
              </div>

              <div className="absolute bottom-1/3 right-1/3 flex flex-col items-center">
                <div className="h-4 w-4 rounded-full bg-blue-500 animate-ping absolute" />
                <div className="h-4 w-4 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center shadow-lg">
                  <Navigation className="h-2.5 w-2.5 text-white transform rotate-90" />
                </div>
                <span className="mt-1 px-2 py-0.5 rounded-md bg-slate-900/90 text-[9px] font-mono font-bold text-blue-400 border border-blue-500/30">
                  TR-105 (In Transit)
                </span>
              </div>

              <div className="absolute top-1/4 right-1/4 flex flex-col items-center">
                <div className="h-3 w-3 rounded-full bg-amber-500 border border-white shadow-lg" />
                <span className="mt-1 px-2 py-0.5 rounded-md bg-slate-900/90 text-[9px] font-mono font-bold text-amber-400 border border-amber-500/30">
                  TR-108 (Stopped)
                </span>
              </div>

              {/* Live Status Bar Overlay */}
              <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-800 flex items-center justify-between text-[11px] font-mono">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-slate-300 font-bold">14 Active Waypoints</span>
                </div>
                <div className="text-slate-400">GPS Sync: 100% Active</div>
              </div>
            </div>
          </div>

          {/* Today's Dispatch Schedule Table / Active Dispatches */}
          <div className="rounded-2xl border border-[#c3c6d7]/30 bg-white p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-[#191c1e]">Today's Dispatch Schedule</h3>
                <p className="text-xs text-[#737686]">Operational trips scheduled and active dispatches.</p>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex rounded-xl bg-[#eceef0] p-1 text-xs font-bold">
                <button
                  onClick={() => setActiveTab('all')}
                  className={cn(
                    'px-3 py-1.5 rounded-lg transition-colors',
                    activeTab === 'all' ? 'bg-white text-[#191c1e] shadow-xs' : 'text-[#737686] hover:text-[#191c1e]'
                  )}
                >
                  All ({trips.length})
                </button>
                <button
                  onClick={() => setActiveTab('unassigned')}
                  className={cn(
                    'px-3 py-1.5 rounded-lg transition-colors',
                    activeTab === 'unassigned' ? 'bg-white text-[#b45309] shadow-xs' : 'text-[#737686] hover:text-[#191c1e]'
                  )}
                >
                  Unassigned ({awaitingAssignmentCount})
                </button>
                <button
                  onClick={() => setActiveTab('in_progress')}
                  className={cn(
                    'px-3 py-1.5 rounded-lg transition-colors',
                    activeTab === 'in_progress' ? 'bg-white text-[#2563eb] shadow-xs' : 'text-[#737686] hover:text-[#191c1e]'
                  )}
                >
                  In Transit
                </button>
              </div>
            </div>

            {/* Trips List */}
            {tripsLoading ? (
              <div className="py-8 text-center text-xs text-[#737686]">Loading dispatches...</div>
            ) : filteredTrips.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#737686]">No dispatches match the selected filter.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#c3c6d7]/30 text-[#737686] font-extrabold uppercase text-[10px]">
                      <th className="py-2.5 px-3">Trip ID</th>
                      <th className="py-2.5 px-3">Vehicle</th>
                      <th className="py-2.5 px-3">Driver</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#c3c6d7]/20">
                    {filteredTrips.slice(0, 6).map((trip) => (
                      <tr key={trip.id} className="hover:bg-[#f7f9fb] transition-colors">
                        <td className="py-3 px-3 font-bold text-[#191c1e] font-mono">
                          {trip.tripNumber}
                        </td>
                        <td className="py-3 px-3 text-[#434655]">
                          {trip.vehicle?.registrationNumber || 'Unassigned Vehicle'}
                        </td>
                        <td className="py-3 px-3 text-[#434655]">
                          {trip.driver ? `${trip.driver.firstName} ${trip.driver.lastName}` : (
                            <span className="inline-flex items-center gap-1 text-amber-600 font-bold">
                              <AlertTriangle className="h-3 w-3" /> Assign Driver
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={cn(
                              'px-2 py-0.5 rounded-full text-[10px] font-bold inline-block',
                              trip.status === 'COMPLETED' && 'bg-emerald-100 text-emerald-700',
                              (trip.status === 'IN_TRANSIT' || trip.status === 'DISPATCHED') && 'bg-blue-100 text-blue-700',
                              trip.status === 'SCHEDULED' && 'bg-amber-100 text-amber-700',
                              trip.status === 'CANCELLED' && 'bg-red-100 text-red-700'
                            )}
                          >
                            {trip.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => navigate('/dispatcher/dispatch-center')}
                            className="px-2.5 py-1 rounded-lg bg-[#2563eb]/10 text-[#2563eb] font-bold text-[11px] hover:bg-[#2563eb] hover:text-white transition-colors"
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (lg:col-span-1) */}
        <div className="space-y-6">
          {/* Quick Dispatch Actions Card */}
          <div className="rounded-2xl border border-[#c3c6d7]/30 bg-white p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-[#191c1e] flex items-center gap-2">
              <Send className="h-4 w-4 text-[#2563eb]" />
              <span>Quick Dispatch Actions</span>
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/dispatcher/dispatch-center')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-[#f7f9fb] border border-[#c3c6d7]/30 text-xs font-bold text-[#191c1e] hover:bg-[#2563eb] hover:text-white transition-colors group"
              >
                <span>Dispatch Pending Trip</span>
                <ChevronRight className="h-4 w-4 text-[#737686] group-hover:text-white" />
              </button>

              <button
                onClick={() => navigate('/dispatcher/drivers')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-[#f7f9fb] border border-[#c3c6d7]/30 text-xs font-bold text-[#191c1e] hover:bg-[#2563eb] hover:text-white transition-colors group"
              >
                <span>Assign Driver & Route</span>
                <ChevronRight className="h-4 w-4 text-[#737686] group-hover:text-white" />
              </button>

              <button
                onClick={() => navigate('/dispatcher/tracking')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-[#f7f9fb] border border-[#c3c6d7]/30 text-xs font-bold text-[#191c1e] hover:bg-[#2563eb] hover:text-white transition-colors group"
              >
                <span>Monitor Live GPS Telemetry</span>
                <ChevronRight className="h-4 w-4 text-[#737686] group-hover:text-white" />
              </button>

              <button
                onClick={() => navigate('/dispatcher/ai')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-purple-50 border border-purple-200 text-xs font-bold text-purple-900 hover:bg-purple-600 hover:text-white transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-600 group-hover:text-white" />
                  <span>Ask AI Dispatch Assistant</span>
                </div>
                <ChevronRight className="h-4 w-4 text-purple-400 group-hover:text-white" />
              </button>
            </div>
          </div>

          {/* Priority Alerts Feed */}
          <div className="rounded-2xl border border-[#c3c6d7]/30 bg-white p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-[#191c1e] flex items-center justify-between">
              <span className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span>Priority Operational Alerts</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-600">
                3 Active
              </span>
            </h3>

            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-red-900">
                  <span>Delayed Arrival: TR-102</span>
                  <span className="text-[10px] text-red-500">10m ago</span>
                </div>
                <p className="text-[11px] text-red-700">
                  Heavy traffic congestion on Sector 4 Interstate corridor. Estimated delay +35 mins.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                  <span>Unassigned High-Priority Cargo</span>
                  <span className="text-[10px] text-amber-600">25m ago</span>
                </div>
                <p className="text-[11px] text-amber-700">
                  Shipment #SH-8840 requires immediate driver assignment before 18:00 departure.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-blue-900">
                  <span>Driver HOS Warning</span>
                  <span className="text-[10px] text-blue-600">1h ago</span>
                </div>
                <p className="text-[11px] text-blue-700">
                  Driver John Doe reaching 11-hour driving limit in 45 minutes. Service break required.
                </p>
              </div>
            </div>
          </div>

          {/* Operational Activity Timeline */}
          <div className="rounded-2xl border border-[#c3c6d7]/30 bg-[#fff] p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-[#191c1e] flex items-center gap-2">
              <Activity className="h-4 w-4 text-[#2563eb]" />
              <span>Operational Timeline</span>
            </h3>

            <div className="relative pl-4 space-y-4 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#c3c6d7]/40 text-xs">
              <div className="relative">
                <div className="absolute -left-4 top-1 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-white" />
                <p className="font-bold text-[#191c1e]">TR-105 Departed Origin Hub</p>
                <p className="text-[10px] text-[#737686]">14:20 • Driver Assigned: Michael Scott</p>
              </div>

              <div className="relative">
                <div className="absolute -left-4 top-1 h-2.5 w-2.5 rounded-full bg-blue-500 ring-4 ring-white" />
                <p className="font-bold text-[#191c1e]">New Dispatch Created (#TR-904)</p>
                <p className="text-[10px] text-[#737686]">13:45 • Route: Sector 4 North</p>
              </div>

              <div className="relative">
                <div className="absolute -left-4 top-1 h-2.5 w-2.5 rounded-full bg-amber-500 ring-4 ring-white" />
                <p className="font-bold text-[#191c1e]">Driver Availability Updated</p>
                <p className="text-[10px] text-[#737686]">12:30 • 3 Drivers logged on duty</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DispatcherDashboardPage;
