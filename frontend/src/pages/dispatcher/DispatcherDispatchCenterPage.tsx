import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Send,
  Truck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  MapPin,
  Calendar,
  X,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  Fuel,
  Package,
  Award,
  Layers,
} from 'lucide-react';
import { tripService } from '@/services/trip.service';
import { driverService } from '@/services/driver.service';
import { vehicleService } from '@/services/vehicle.service';
import type { Trip, CreateTripPayload } from '@/types/trip';
import type { Driver } from '@/types/driver';
import type { Vehicle } from '@/types/vehicle';
import { cn } from '@/utils/cn';

export const DispatcherDispatchCenterPage: React.FC = () => {
  const queryClient = useQueryClient();

  // Selected entities for dispatch building
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // Drawer / Modal confirmation states
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Success / Error alerts
  const [alertSuccess, setAlertSuccess] = useState<string | null>(null);
  const [alertError, setAlertError] = useState<string | null>(null);

  // 1. Fetch Trips (Focusing on Unassigned & Scheduled Trips)
  const { data: rawTripsData, isLoading: loadingTrips, refetch: refetchTrips } = useQuery({
    queryKey: ['dispatch-center-trips'],
    queryFn: async () => {
      const res = await tripService.getTrips({ limit: 50 });
      return res.data.items;
    },
  });

  // 2. Fetch Drivers
  const { data: rawDriversData, isLoading: loadingDrivers, refetch: refetchDrivers } = useQuery({
    queryKey: ['dispatch-center-drivers'],
    queryFn: async () => {
      const res = await driverService.getDrivers({ limit: 50 });
      return res.data.items;
    },
  });

  // 3. Fetch Vehicles
  const { data: rawVehiclesData, isLoading: loadingVehicles, refetch: refetchVehicles } = useQuery({
    queryKey: ['dispatch-center-vehicles'],
    queryFn: async () => {
      const res = await vehicleService.getVehicles({ limit: 50 });
      return res.data.items;
    },
  });

  // Filter Unassigned & Scheduled Trips for Left Column
  const unassignedTrips = useMemo(() => {
    let trips = rawTripsData || [];
    // Prioritize unassigned or scheduled trips
    trips = trips.filter((t) => t.status === 'SCHEDULED' || !t.driverId || !t.vehicleId || t.status === 'PAUSED');
    if (searchQuery) {
      trips = trips.filter(
        (t) =>
          t.tripNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.route?.originCity.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.route?.destinationCity.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return trips;
  }, [rawTripsData, searchQuery]);

  // Drivers List for Center Column
  const availableDrivers = useMemo(() => {
    return rawDriversData || [];
  }, [rawDriversData]);

  // Vehicles List for Right Column
  const availableVehicles = useMemo(() => {
    return rawVehiclesData || [];
  }, [rawVehiclesData]);

  // Dispatch / Update Trip Mutation
  const dispatchMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<CreateTripPayload> }) => {
      return tripService.updateTrip(id, payload);
    },
    onSuccess: (res) => {
      setAlertSuccess(`Trip #${res.data.tripNumber} successfully assigned and dispatched!`);
      setAlertError(null);
      void queryClient.invalidateQueries({ queryKey: ['dispatch-center-trips'] });
      void queryClient.invalidateQueries({ queryKey: ['dispatch-center-drivers'] });
      void queryClient.invalidateQueries({ queryKey: ['dispatch-center-vehicles'] });
      setDrawerOpen(false);
      setSelectedTrip(null);
      setSelectedDriver(null);
      setSelectedVehicle(null);
      setTimeout(() => setAlertSuccess(null), 5000);
    },
    onError: (err: any) => {
      setAlertError(err.message || 'Failed to dispatch trip.');
      setAlertSuccess(null);
    },
  });

  // Conflict Detection Algorithm
  const conflicts = useMemo(() => {
    const list: { type: 'danger' | 'warning'; message: string }[] = [];
    if (!selectedTrip) return list;

    if (selectedDriver) {
      if (selectedDriver.availability !== 'AVAILABLE') {
        list.push({
          type: 'danger',
          message: `Driver ${selectedDriver.employeeId} is currently ${selectedDriver.availability} (Not Available).`,
        });
      }
      // Check license expiration
      const expiry = new Date(selectedDriver.licenseExpiry);
      const today = new Date();
      const daysLeft = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 3600 * 24));
      if (daysLeft <= 0) {
        list.push({
          type: 'danger',
          message: `Driver ${selectedDriver.employeeId}'s driver license has EXPIRED on ${selectedDriver.licenseExpiry}.`,
        });
      } else if (daysLeft < 30) {
        list.push({
          type: 'warning',
          message: `Driver ${selectedDriver.employeeId}'s license expires in ${daysLeft} days. Renewal required soon.`,
        });
      }
    }

    if (selectedVehicle) {
      if (selectedVehicle.status === 'MAINTENANCE' || selectedVehicle.status === 'OUT_OF_SERVICE') {
        list.push({
          type: 'danger',
          message: `Vehicle ${selectedVehicle.registrationNumber} is marked ${selectedVehicle.status} for maintenance!`,
        });
      }
      const vehicleFuel = (selectedVehicle as any).fuelLevel;
      if (vehicleFuel !== undefined && vehicleFuel < 20) {
        list.push({
          type: 'warning',
          message: `Vehicle ${selectedVehicle.registrationNumber} fuel level is LOW (${vehicleFuel}%). Refueling recommended before dispatch.`,
        });
      }
    }

    return list;
  }, [selectedTrip, selectedDriver, selectedVehicle]);

  const hasCriticalConflict = conflicts.some((c) => c.type === 'danger');

  const handleSelectTrip = (trip: Trip) => {
    setSelectedTrip(trip);
    // Auto populate existing vehicle/driver if available
    if (trip.driver) {
      const matchD = availableDrivers.find((d) => d.id === trip.driverId);
      if (matchD) setSelectedDriver(matchD);
    }
    if (trip.vehicle) {
      const matchV = availableVehicles.find((v) => v.id === trip.vehicleId);
      if (matchV) setSelectedVehicle(matchV);
    }
    setDrawerOpen(true);
  };

  const handleAssignDriver = (driver: Driver) => {
    setSelectedDriver(driver);
    if (selectedTrip) setDrawerOpen(true);
  };

  const handleAssignVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    if (selectedTrip) setDrawerOpen(true);
  };

  const handleConfirmDispatch = () => {
    if (!selectedTrip) return;
    if (!selectedDriver) {
      setAlertError('Please select an available driver to proceed with dispatch.');
      return;
    }
    if (!selectedVehicle) {
      setAlertError('Please select a vehicle to proceed with dispatch.');
      return;
    }

    dispatchMutation.mutate({
      id: selectedTrip.id,
      payload: {
        driverId: selectedDriver.id,
        vehicleId: selectedVehicle.id,
        status: 'DISPATCHED',
        actualStartTime: new Date().toISOString(),
      },
    });
  };

  const handleRefreshAll = async () => {
    await Promise.all([refetchTrips(), refetchDrivers(), refetchVehicles()]);
  };

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Bar Header & Dispatch Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#c3c6d7]/30 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Send className="h-5 w-5 text-[#2563eb]" />
            <h1 className="text-xl font-black tracking-tight text-[#191c1e]">
              Operational Dispatch Center
            </h1>
          </div>
          <p className="text-xs font-semibold text-[#737686] mt-0.5">
            Three-column active dispatch board for trip planning, driver matching & vehicle assignment.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefreshAll}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#c3c6d7] text-xs font-bold text-[#434655] hover:bg-[#eceef0] transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Refresh Board</span>
          </button>

          {selectedTrip && (
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2563eb] text-white text-xs font-bold shadow-md shadow-[#2563eb]/25 hover:bg-[#1d4ed8] transition-colors animate-bounce"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Review Selected Dispatch (#{selectedTrip.tripNumber})</span>
            </button>
          )}
        </div>
      </div>

      {/* Notifications */}
      {alertSuccess && (
        <div className="flex items-center gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-50 p-4 text-xs font-bold text-emerald-800 shadow-xs">
          <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-emerald-600" />
          <span>{alertSuccess}</span>
        </div>
      )}

      {alertError && (
        <div className="flex items-center justify-between rounded-xl border border-red-500/20 bg-red-50 p-4 text-xs font-bold text-red-800 shadow-xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="h-4.5 w-4.5 shrink-0 text-red-600" />
            <span>{alertError}</span>
          </div>
          <button onClick={() => setAlertError(null)} className="text-red-500 hover:text-red-700">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* THREE-COLUMN OPERATIONAL DISPATCH BOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* COLUMN 1: UNASSIGNED TRIPS (LEFT) */}
        <div className="rounded-2xl border border-[#c3c6d7]/30 bg-white p-4 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#c3c6d7]/30 pb-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-amber-500" />
              <h2 className="text-sm font-black text-[#191c1e]">Unassigned Trips</h2>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-700">
              {unassignedTrips.length} Pending
            </span>
          </div>

          {/* Search filter for trips */}
          <input
            type="text"
            placeholder="Filter trip # or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-[#c3c6d7]/40 text-xs focus:outline-none focus:border-[#2563eb] bg-[#f7f9fb]"
          />

          {loadingTrips ? (
            <div className="py-12 text-center text-xs text-[#737686]">Loading trip queue...</div>
          ) : unassignedTrips.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#737686]">No unassigned trips found. All clear!</div>
          ) : (
            <div className="space-y-3 max-h-[680px] overflow-y-auto pr-1">
              {unassignedTrips.map((trip, idx) => {
                const isSelected = selectedTrip?.id === trip.id;
                const isHighPriority = idx % 2 === 0;

                return (
                  <div
                    key={trip.id}
                    onClick={() => handleSelectTrip(trip)}
                    className={cn(
                      'p-4 rounded-xl border transition-all cursor-pointer space-y-3 relative group',
                      isSelected
                        ? 'border-[#2563eb] bg-blue-50/50 shadow-sm ring-2 ring-[#2563eb]/20'
                        : 'border-[#c3c6d7]/30 bg-white hover:border-[#2563eb]/50 hover:bg-[#f7f9fb]'
                    )}
                  >
                    {/* Header: Priority & Trip # */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-black text-[#191c1e] text-sm">#{trip.tripNumber}</span>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={cn(
                            'px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase',
                            isHighPriority ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                          )}
                        >
                          {isHighPriority ? 'High Priority' : 'Normal'}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800">
                          {trip.status}
                        </span>
                      </div>
                    </div>

                    {/* Route Corridor */}
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#434655] bg-[#eceef0]/60 p-2.5 rounded-lg">
                      <MapPin className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                      <span className="truncate">{trip.route?.originCity || 'Origin Hub'}</span>
                      <ArrowRight className="h-3 w-3 text-[#737686] shrink-0" />
                      <span className="truncate">{trip.route?.destinationCity || 'Destination Hub'}</span>
                    </div>

                    {/* Cargo & Customer */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-[#737686]">
                      <div className="flex items-center gap-1">
                        <Package className="h-3 w-3 text-[#2563eb]" />
                        <span className="truncate">{trip.shipment?.title || 'General Freight'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-[#737686]" />
                        <span>{trip.scheduledStartTime ? new Date(trip.scheduledStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '14:00 Today'}</span>
                      </div>
                    </div>

                    {/* Footer Badges for Driver / Vehicle state */}
                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#c3c6d7]/20">
                      <span className={cn('font-bold', trip.driverId ? 'text-emerald-600' : 'text-amber-600')}>
                        {trip.driver ? `Driver: ${trip.driver.firstName}` : '⚠️ Driver Missing'}
                      </span>
                      <span className={cn('font-bold', trip.vehicleId ? 'text-emerald-600' : 'text-amber-600')}>
                        {trip.vehicle ? `Vehicle: ${trip.vehicle.registrationNumber}` : '⚠️ Vehicle Missing'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* COLUMN 2: AVAILABLE DRIVERS (CENTER) */}
        <div className="rounded-2xl border border-[#c3c6d7]/30 bg-white p-4 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#c3c6d7]/30 pb-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-emerald-500" />
              <h2 className="text-sm font-black text-[#191c1e]">Available Drivers</h2>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700">
              {availableDrivers.filter((d) => d.availability === 'AVAILABLE').length} Ready
            </span>
          </div>

          {loadingDrivers ? (
            <div className="py-12 text-center text-xs text-[#737686]">Loading driver roster...</div>
          ) : (
            <div className="space-y-3 max-h-[730px] overflow-y-auto pr-1">
              {availableDrivers.map((driver) => {
                const isSelected = selectedDriver?.id === driver.id;
                const isAvailable = driver.availability === 'AVAILABLE';

                return (
                  <div
                    key={driver.id}
                    className={cn(
                      'p-3.5 rounded-xl border transition-all space-y-2.5',
                      isSelected
                        ? 'border-[#10b981] bg-emerald-50/40 shadow-xs ring-2 ring-[#10b981]/20'
                        : 'border-[#c3c6d7]/30 bg-white hover:border-[#10b981]/50'
                    )}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                          {driver.user ? `${driver.user.firstName[0]}${driver.user.lastName[0]}` : driver.employeeId.slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-bold text-[#191c1e]">
                            {driver.user ? `${driver.user.firstName} ${driver.user.lastName}` : driver.employeeId}
                          </p>
                          <p className="text-[10px] text-[#737686] font-mono">ID: {driver.employeeId}</p>
                        </div>
                      </div>

                      <span
                        className={cn(
                          'px-2 py-0.5 rounded-full text-[10px] font-bold',
                          isAvailable ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'
                        )}
                      >
                        {driver.availability}
                      </span>
                    </div>

                    {/* Telemetry info */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-[#434655] bg-[#f7f9fb] p-2 rounded-lg">
                      <div className="flex items-center gap-1">
                        <Award className="h-3 w-3 text-amber-500" />
                        <span>{driver.experienceLevel} Level</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-blue-500" />
                        <span>HOS: 7.5 / 11h</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-[#737686]">License: {driver.licenseNumber}</span>
                      <button
                        onClick={() => handleAssignDriver(driver)}
                        className={cn(
                          'px-3 py-1 rounded-lg text-xs font-bold transition-colors',
                          isSelected
                            ? 'bg-emerald-600 text-white'
                            : 'bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white'
                        )}
                      >
                        {isSelected ? 'Selected Driver' : 'Quick Assign'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* COLUMN 3: AVAILABLE VEHICLES (RIGHT) */}
        <div className="rounded-2xl border border-[#c3c6d7]/30 bg-white p-4 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#c3c6d7]/30 pb-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500" />
              <h2 className="text-sm font-black text-[#191c1e]">Available Fleet</h2>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-700">
              {availableVehicles.filter((v) => v.status === 'AVAILABLE').length} Ready
            </span>
          </div>

          {loadingVehicles ? (
            <div className="py-12 text-center text-xs text-[#737686]">Loading vehicle fleet...</div>
          ) : (
            <div className="space-y-3 max-h-[730px] overflow-y-auto pr-1">
              {availableVehicles.map((vehicle) => {
                const isSelected = selectedVehicle?.id === vehicle.id;
                const isAvailable = vehicle.status === 'AVAILABLE';
                const fuelLevel = (vehicle as any).fuelLevel ?? 85;

                return (
                  <div
                    key={vehicle.id}
                    className={cn(
                      'p-3.5 rounded-xl border transition-all space-y-2.5',
                      isSelected
                        ? 'border-[#2563eb] bg-blue-50/40 shadow-xs ring-2 ring-[#2563eb]/20'
                        : 'border-[#c3c6d7]/30 bg-white hover:border-[#2563eb]/50'
                    )}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                          <Truck className="h-4 w-4 text-[#2563eb]" />
                        </div>
                        <div>
                          <p className="font-mono font-bold text-[#191c1e] text-xs">{vehicle.registrationNumber}</p>
                          <p className="text-[10px] text-[#737686]">
                            {vehicle.make} {vehicle.model}
                          </p>
                        </div>
                      </div>

                      <span
                        className={cn(
                          'px-2.5 py-0.5 rounded-full text-[10px] font-bold',
                          isAvailable ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        )}
                      >
                        {vehicle.status}
                      </span>
                    </div>

                    {/* Fuel & Payload Telemetry */}
                    <div className="space-y-1.5 bg-[#f7f9fb] p-2.5 rounded-lg text-[11px]">
                      <div className="flex items-center justify-between font-bold text-[#434655]">
                        <span className="flex items-center gap-1">
                          <Fuel className="h-3 w-3 text-amber-500" /> Fuel Level
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

                      <div className="flex items-center justify-between text-[10px] text-[#737686] pt-1">
                        <span className="flex items-center gap-1">
                          <Layers className="h-3 w-3" /> Max Capacity: {vehicle.capacity || 15000} kg
                        </span>
                        <span>Year: {vehicle.manufacturingYear || 2023}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-[#737686]">Type: {vehicle.vehicleType || 'HEAVY_TRUCK'}</span>
                      <button
                        onClick={() => handleAssignVehicle(vehicle)}
                        className={cn(
                          'px-3 py-1 rounded-lg text-xs font-bold transition-colors',
                          isSelected
                            ? 'bg-[#2563eb] text-white'
                            : 'bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white'
                        )}
                      >
                        {isSelected ? 'Selected Fleet' : 'Quick Assign'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* DISPATCH ASSIGNMENT DRAWER / MODAL CONFIRMATION */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end animate-fadeIn">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto">
            {/* Drawer Header */}
            <div className="p-5 border-b border-[#c3c6d7]/30 bg-slate-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                  <Send className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-black">Dispatch Assignment & Review</h2>
                  <p className="text-xs text-slate-400">
                    Review trip details, verify driver & vehicle pairings, and authorize dispatch.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="p-6 space-y-6 flex-1 overflow-y-auto font-sans">
              {/* Selected Trip Details */}
              {selectedTrip ? (
                <div className="p-4 rounded-2xl border border-[#2563eb]/30 bg-blue-50/40 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold uppercase text-[#2563eb] tracking-wider text-[10px]">
                      Selected Operational Trip
                    </span>
                    <span className="font-mono font-black text-slate-900">#{selectedTrip.tripNumber}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <span>{selectedTrip.route?.originCity || 'Origin Hub'}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                    <span>{selectedTrip.route?.destinationCity || 'Destination Hub'}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs text-slate-600 pt-2 border-t border-blue-200/60">
                    <div>
                      <span className="block text-[10px] text-slate-400 font-bold uppercase">Shipment Cargo</span>
                      <span className="font-bold text-slate-800">{selectedTrip.shipment?.title || 'Heavy Freight'}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 font-bold uppercase">Scheduled Time</span>
                      <span className="font-bold text-slate-800">
                        {selectedTrip.scheduledStartTime
                          ? new Date(selectedTrip.scheduledStartTime).toLocaleString()
                          : 'Immediate Dispatch'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl border border-amber-300 bg-amber-50 text-xs font-bold text-amber-900 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <span>No trip selected. Please select a trip from the left column first.</span>
                </div>
              )}

              {/* Assignment Slots */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Driver Slot */}
                <div
                  className={cn(
                    'p-4 rounded-2xl border text-xs space-y-2',
                    selectedDriver ? 'border-emerald-300 bg-emerald-50/50' : 'border-amber-300 bg-amber-50/50'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold uppercase tracking-wider text-[10px] text-slate-500">
                      Assigned Driver
                    </span>
                    {selectedDriver && (
                      <button
                        onClick={() => setSelectedDriver(null)}
                        className="text-[10px] text-red-600 font-bold hover:underline"
                      >
                        Change
                      </button>
                    )}
                  </div>

                  {selectedDriver ? (
                    <div>
                      <p className="font-black text-slate-900 text-sm">
                        {selectedDriver.user
                          ? `${selectedDriver.user.firstName} ${selectedDriver.user.lastName}`
                          : selectedDriver.employeeId}
                      </p>
                      <p className="text-[11px] text-emerald-700 font-bold">Status: {selectedDriver.availability}</p>
                      <p className="text-[10px] text-slate-500">License: {selectedDriver.licenseNumber}</p>
                    </div>
                  ) : (
                    <div className="text-amber-800 py-2">
                      <p className="font-bold">No Driver Assigned</p>
                      <p className="text-[10px]">Select a driver from the Center column.</p>
                    </div>
                  )}
                </div>

                {/* Vehicle Slot */}
                <div
                  className={cn(
                    'p-4 rounded-2xl border text-xs space-y-2',
                    selectedVehicle ? 'border-blue-300 bg-blue-50/50' : 'border-amber-300 bg-amber-50/50'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold uppercase tracking-wider text-[10px] text-slate-500">
                      Assigned Vehicle
                    </span>
                    {selectedVehicle && (
                      <button
                        onClick={() => setSelectedVehicle(null)}
                        className="text-[10px] text-red-600 font-bold hover:underline"
                      >
                        Change
                      </button>
                    )}
                  </div>

                  {selectedVehicle ? (
                    <div>
                      <p className="font-black font-mono text-slate-900 text-sm">
                        {selectedVehicle.registrationNumber}
                      </p>
                      <p className="text-[11px] text-blue-700 font-bold">
                        {selectedVehicle.make} {selectedVehicle.model}
                      </p>
                      <p className="text-[10px] text-slate-500">Fuel: {(selectedVehicle as any).fuelLevel ?? 85}%</p>
                    </div>
                  ) : (
                    <div className="text-amber-800 py-2">
                      <p className="font-bold">No Vehicle Assigned</p>
                      <p className="text-[10px]">Select a vehicle from the Right column.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* CONFLICT DETECTION & SAFETY WARNINGS */}
              {conflicts.length > 0 && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-black text-red-900">
                    <ShieldAlert className="h-4 w-4 text-red-600" />
                    <span>Operational Conflicts Detected ({conflicts.length})</span>
                  </div>

                  <div className="space-y-1.5">
                    {conflicts.map((conf, i) => (
                      <div key={i} className="flex items-start gap-2 text-[11px] text-red-800">
                        <AlertTriangle className="h-3.5 w-3.5 text-red-600 shrink-0 mt-0.5" />
                        <span>{conf.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer & Quick Actions */}
            <div className="p-5 border-t border-[#c3c6d7]/30 bg-slate-50 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  setSelectedTrip(null);
                  setSelectedDriver(null);
                  setSelectedVehicle(null);
                  setDrawerOpen(false);
                }}
                className="px-4 py-2.5 rounded-xl border border-[#c3c6d7] text-xs font-bold text-slate-700 hover:bg-[#eceef0] transition-colors"
              >
                Cancel Assignment
              </button>

              <button
                onClick={handleConfirmDispatch}
                disabled={dispatchMutation.isPending || !selectedTrip || hasCriticalConflict}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563eb] text-white text-xs font-bold shadow-md shadow-[#2563eb]/25 hover:bg-[#1d4ed8] transition-colors disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                <span>{dispatchMutation.isPending ? 'Authorizing...' : 'Authorize & Dispatch Trip'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DispatcherDispatchCenterPage;
