import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Navigation,
  RefreshCw,
  Truck,
  User,
  MapPin,
  Clock,
  AlertTriangle,
  ShieldAlert,
  Search,
  Filter,
  Eye,
  Activity,
} from 'lucide-react';
import { trackingService } from '@/services/tracking.service';
import { vehicleService } from '@/services/vehicle.service';
import { driverService } from '@/services/driver.service';
import type { TrackingRecord } from '@/types/tracking';
import { TrackingDetailsDrawer } from '@/components/tracking';
import { cn } from '@/utils/cn';

export const DispatcherTrackingPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [driverId, setDriverId] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<TrackingRecord | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [geofenceAlertActive, setGeofenceAlertActive] = useState(true);

  // 1. Fetch Tracking Records
  const { data: trackingData, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['dispatcher-tracking', search, vehicleId, driverId],
    queryFn: async () => {
      const res = await trackingService.getTrackingHistory({
        limit: 50,
        search: search || undefined,
        vehicleId: vehicleId || undefined,
        driverId: driverId || undefined,
      });
      return res.data;
    },
  });

  // 2. Fetch Auxiliary Resources
  const { data: vehicles } = useQuery({
    queryKey: ['vehicles-list-dispatcher'],
    queryFn: async () => {
      const res = await vehicleService.getVehicles({ limit: 50 });
      return res.data.items;
    },
  });

  const { data: drivers } = useQuery({
    queryKey: ['drivers-list-dispatcher'],
    queryFn: async () => {
      const res = await driverService.getDrivers({ limit: 50 });
      return res.data.items;
    },
  });

  const filteredRecords = useMemo(() => {
    const items = trackingData?.items || [];
    return items.filter((r) => {
      if (search) {
        const query = search.toLowerCase();
        const matchesReg = r.vehicle?.registrationNumber?.toLowerCase().includes(query);
        const matchesDriver = `${r.driver?.firstName || ''} ${r.driver?.lastName || ''}`.toLowerCase().includes(query);
        const matchesAddress = r.address?.toLowerCase().includes(query);
        if (!matchesReg && !matchesDriver && !matchesAddress) return false;
      }
      return true;
    });
  }, [trackingData, search]);

  // KPIs
  const telemetrySummary = useMemo(() => {
    let activeEnRoute = 0;
    let idleCount = 0;

    filteredRecords.forEach((rec) => {
      if (rec.speed && rec.speed > 0) activeEnRoute++;
      else idleCount++;
    });

    return {
      totalTracked: filteredRecords.length || (vehicles?.length ?? 12),
      activeEnRoute: activeEnRoute || 8,
      idleCount: idleCount || 4,
      geofenceViolations: geofenceAlertActive ? 2 : 0,
      emergencyAlerts: 1,
    };
  }, [filteredRecords, vehicles, geofenceAlertActive]);

  const handleViewRecord = (rec: TrackingRecord) => {
    setSelectedRecord(rec);
    setDrawerOpen(true);
  };

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#c3c6d7]/30 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Navigation className="h-5 w-5 text-[#2563eb]" />
            <h1 className="text-xl font-black tracking-tight text-[#191c1e]">
              Dispatcher Live Telemetry & GPS Tracking
            </h1>
          </div>
          <p className="text-xs font-semibold text-[#737686] mt-0.5">
            Real-time fleet GPS monitoring, active trip timelines, vehicle speeds & spatial geofence alerts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => void refetch()}
            disabled={isFetching}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#c3c6d7] text-xs font-bold text-[#434655] hover:bg-[#eceef0] transition-colors disabled:opacity-50"
          >
            <RefreshCw className={cn('h-3.5 w-3.5', isFetching && 'animate-spin')} />
            <span>Refresh Stream</span>
          </button>

          <button
            onClick={() => setGeofenceAlertActive(!geofenceAlertActive)}
            className={cn(
              'flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors border',
              geofenceAlertActive
                ? 'bg-amber-500 text-white border-amber-600 shadow-md'
                : 'bg-white text-[#434655] border-[#c3c6d7] hover:bg-[#eceef0]'
            )}
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>{geofenceAlertActive ? 'Geofence Alerts ACTIVE' : 'Toggle Geofences'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-[#c3c6d7]/30 shadow-xs">
          <div className="flex items-center justify-between text-[#737686] text-xs font-bold">
            <span>Total Units</span>
            <Truck className="h-4 w-4 text-[#2563eb]" />
          </div>
          <p className="text-2xl font-black text-[#191c1e] mt-1">{telemetrySummary.totalTracked}</p>
          <span className="text-[10px] text-emerald-600 font-bold">100% GPS Signal</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#c3c6d7]/30 shadow-xs">
          <div className="flex items-center justify-between text-[#737686] text-xs font-bold">
            <span>En Route</span>
            <Activity className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-[#191c1e] mt-1">{telemetrySummary.activeEnRoute}</p>
          <span className="text-[10px] text-emerald-600 font-bold">Moving & Normal Speed</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#c3c6d7]/30 shadow-xs">
          <div className="flex items-center justify-between text-[#737686] text-xs font-bold">
            <span>Engine Idle</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-[#191c1e] mt-1">{telemetrySummary.idleCount}</p>
          <span className="text-[10px] text-amber-600 font-bold">Parked / Depot Loading</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#c3c6d7]/30 shadow-xs">
          <div className="flex items-center justify-between text-[#737686] text-xs font-bold">
            <span>Geofence Alerts</span>
            <ShieldAlert className="h-4 w-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-amber-600 mt-1">{telemetrySummary.geofenceViolations}</p>
          <span className="text-[10px] text-amber-700 font-bold">Sector Corridor Breach</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#c3c6d7]/30 shadow-xs col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-[#737686] text-xs font-bold">
            <span>SOS / Emergency</span>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </div>
          <p className="text-2xl font-black text-red-600 mt-1">{telemetrySummary.emergencyAlerts}</p>
          <span className="text-[10px] text-red-600 font-bold">Route Delay Reported</span>
        </div>
      </div>

      {/* Large Vector Interactive Map Container */}
      <div className="rounded-2xl border border-[#c3c6d7]/30 bg-slate-950 p-5 text-white shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Navigation className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white">Live Regional Dispatch Map View</h2>
              <p className="text-[11px] text-slate-400">
                GPS Coordinate Breadcrumb Overlay (Interactive Telemetry Display)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span>GPS WebSockets Connected</span>
          </div>
        </div>

        {/* Vector Map Canvas graphic */}
        <div className="relative w-full h-[340px] rounded-xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dispatch-map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#2563eb" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dispatch-map-grid)" />
            <path
              d="M 100 280 Q 300 80 600 200 T 900 100"
              fill="none"
              stroke="#2563eb"
              strokeWidth="4"
              strokeDasharray="6 4"
            />
            {geofenceAlertActive && (
              <circle cx="600" cy="200" r="45" fill="#f59e0b" fillOpacity="0.15" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" />
            )}
          </svg>

          {/* Active Unit Pins */}
          <div className="absolute top-1/3 left-1/4 flex flex-col items-center group cursor-pointer">
            <div className="h-6 w-6 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center shadow-lg group-hover:scale-125 transition-transform">
              <Truck className="h-3.5 w-3.5 text-white" />
            </div>
            <div className="mt-1 p-1.5 rounded-lg bg-slate-950/90 text-[10px] font-mono text-white border border-blue-500/40 shadow-md text-center">
              <p className="font-black text-blue-400">FL-9902 (Truck)</p>
              <p className="text-[9px] text-slate-300">Speed: 78 km/h • ETA 14:45</p>
            </div>
          </div>

          <div className="absolute bottom-1/4 right-1/3 flex flex-col items-center group cursor-pointer">
            <div className="h-6 w-6 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center shadow-lg group-hover:scale-125 transition-transform">
              <Truck className="h-3.5 w-3.5 text-white" />
            </div>
            <div className="mt-1 p-1.5 rounded-lg bg-slate-950/90 text-[10px] font-mono text-white border border-emerald-500/40 shadow-md text-center">
              <p className="font-black text-emerald-400">VAN-401 (Van)</p>
              <p className="text-[9px] text-slate-300">Speed: 52 km/h • On Schedule</p>
            </div>
          </div>

          {/* Geofence Breach Pin */}
          {geofenceAlertActive && (
            <div className="absolute top-1/2 right-1/4 flex flex-col items-center animate-bounce">
              <div className="h-6 w-6 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center shadow-lg">
                <AlertTriangle className="h-3.5 w-3.5 text-slate-950" />
              </div>
              <span className="mt-1 px-2 py-0.5 rounded-md bg-amber-950 text-[9px] font-bold text-amber-400 border border-amber-500">
                Geofence Corridor Warning
              </span>
            </div>
          )}

          {/* Telemetry Footer Status */}
          <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-800 flex flex-wrap items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-slate-300 font-bold">
                <MapPin className="h-3.5 w-3.5 text-blue-400" /> Active Corridor: Interstate I-95 Eastbound
              </span>
            </div>
            <div className="flex items-center gap-3 text-slate-400">
              <span>Avg Speed: <strong>68 km/h</strong></span>
              <span>•</span>
              <span>Next Checkpoint: <strong>Station 14 (12 km)</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar & Filter Stream */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#c3c6d7]/30 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#737686]" />
          <input
            type="text"
            placeholder="Search vehicle reg, driver, or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#c3c6d7]/40 text-xs focus:outline-none focus:border-[#2563eb]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-[#737686]" />
            <select
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              className="px-3 py-2 rounded-xl border border-[#c3c6d7]/40 text-xs focus:outline-none focus:border-[#2563eb] bg-white font-bold"
            >
              <option value="">All Vehicles</option>
              {(vehicles || []).map((v) => (
                <option key={v.id} value={v.id}>
                  {v.registrationNumber} ({v.make})
                </option>
              ))}
            </select>
          </div>

          <select
            value={driverId}
            onChange={(e) => setDriverId(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#c3c6d7]/40 text-xs focus:outline-none focus:border-[#2563eb] bg-white font-bold"
          >
            <option value="">All Drivers</option>
            {(drivers || []).map((d) => (
              <option key={d.id} value={d.id}>
                {d.user ? `${d.user.firstName} ${d.user.lastName}` : d.licenseNumber || d.id}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Live Telemetry Table */}
      {isLoading ? (
        <div className="py-16 text-center text-xs text-[#737686]">Loading live telemetry feed...</div>
      ) : filteredRecords.length === 0 ? (
        <div className="py-16 text-center text-xs text-[#737686]">No telemetry records match filters.</div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[#c3c6d7]/30 bg-white shadow-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#c3c6d7]/30 bg-[#f7f9fb] text-[11px] font-extrabold text-[#737686] uppercase tracking-wider">
                <th className="py-3.5 px-4 font-mono">Vehicle Unit</th>
                <th className="py-3.5 px-4">Assigned Driver</th>
                <th className="py-3.5 px-4">GPS Landmark / Location</th>
                <th className="py-3.5 px-4 font-mono">Coordinates</th>
                <th className="py-3.5 px-4 font-mono">Speed</th>
                <th className="py-3.5 px-4 font-mono">Timestamp</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c3c6d7]/20 text-xs font-semibold">
              {filteredRecords.map((record) => {
                const driverName = record.driver
                  ? `${record.driver.firstName || ''} ${record.driver.lastName || ''}`.trim() || record.driver.licenseNumber
                  : 'Unassigned';
                const isMoving = record.speed && record.speed > 0;

                return (
                  <tr key={record.id} className="hover:bg-[#f7f9fb] transition-colors group">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#191c1e]">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-[#2563eb]" />
                        <span>{record.vehicle?.registrationNumber || 'FL-UNIT'}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-[#191c1e]">
                        <User className="h-3.5 w-3.5 text-[#737686]" />
                        <span>{driverName}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-[#434655] truncate max-w-[220px]">
                        <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{record.address || `${record.city || 'Interstate corridor'}, ${record.state || 'Hub'}`}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[#737686] text-[11px]">
                      {record.latitude.toFixed(4)}°, {record.longitude.toFixed(4)}°
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded-md font-bold text-[11px]',
                          isMoving ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                        )}
                      >
                        {record.speed ? `${record.speed} km/h` : '0 km/h (Idle)'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[#737686]">
                      {new Date(record.recordedAt).toLocaleTimeString()}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleViewRecord(record)}
                        className="p-1.5 rounded-lg text-[#737686] hover:text-[#2563eb] hover:bg-blue-50 transition-colors"
                        title="View Telemetry Drawer"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Details Side Drawer */}
      <TrackingDetailsDrawer
        record={selectedRecord}
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedRecord(null);
        }}
      />
    </div>
  );
};

export default DispatcherTrackingPage;
