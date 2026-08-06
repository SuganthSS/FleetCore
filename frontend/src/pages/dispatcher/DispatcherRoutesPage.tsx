import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  MapPin,
  Clock,
  Sparkles,
  RefreshCw,
  Send,
  AlertTriangle,
  ArrowRight,
  Zap,
  Layers,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { routeService } from '@/services/route.service';
import type { Route } from '@/types/route';
import { cn } from '@/utils/cn';

export const DispatcherRoutesPage: React.FC = () => {
  const navigate = useNavigate();

  const [trafficPreviewActive, setTrafficPreviewActive] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [optimizeModalOpen, setOptimizeModalOpen] = useState(false);

  // Fetch Routes using routeService
  const { data: routeData, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['dispatcher-routes'],
    queryFn: async () => {
      const res = await routeService.getRoutes({ limit: 50 });
      return res.data;
    },
  });

  const routes = routeData?.items || [];

  const handleOptimizeClick = (route: Route) => {
    setSelectedRoute(route);
    setOptimizeModalOpen(true);
  };

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#c3c6d7]/30 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-[#2563eb]" />
            <h1 className="text-xl font-black tracking-tight text-[#191c1e]">
              Route Management & Corridor Optimization
            </h1>
          </div>
          <p className="text-xs font-semibold text-[#737686] mt-0.5">
            View active transit corridors, optimize route distances, evaluate traffic ETAs & assign routes to dispatches.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setTrafficPreviewActive(!trafficPreviewActive)}
            className={cn(
              'flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors border',
              trafficPreviewActive
                ? 'bg-amber-500 text-white border-amber-600 shadow-md'
                : 'bg-white text-[#434655] border-[#c3c6d7] hover:bg-[#eceef0]'
            )}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>{trafficPreviewActive ? 'Traffic Simulation ACTIVE' : 'Traffic Delay Preview'}</span>
          </button>

          <button
            onClick={() => void refetch()}
            disabled={isFetching}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#c3c6d7] text-xs font-bold text-[#434655] hover:bg-[#eceef0] transition-colors disabled:opacity-50"
          >
            <RefreshCw className={cn('h-3.5 w-3.5', isFetching && 'animate-spin')} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Traffic Alert Banner when toggle is enabled */}
      {trafficPreviewActive && (
        <div className="p-4 rounded-2xl border border-amber-300 bg-amber-50 flex items-center justify-between text-xs text-amber-900 font-bold shadow-xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="h-4.5 w-4.5 text-amber-600 shrink-0" />
            <span>
              Live Traffic Overlay Engaged: Sector 4 Interstate corridor experiences +22 min delay due to road construction.
            </span>
          </div>
          <span className="text-[10px] bg-amber-200 px-2 py-0.5 rounded-md text-amber-900 font-mono">
            UPDATED 2m ago
          </span>
        </div>
      )}

      {/* Corridor Map Placeholder Graphic */}
      <div className="rounded-2xl border border-[#c3c6d7]/30 bg-slate-950 p-5 text-white shadow-md relative overflow-hidden">
        <div className="flex items-center justify-between mb-4 z-10 relative">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Compass className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Active Corridor Mapping & Traffic Telemetry</h3>
              <p className="text-[11px] text-slate-400">Interstate GPS Waypoint Layer (Interactive Display)</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/dispatcher/dispatch-center')}
            className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Dispatch on Selected Route</span>
          </button>
        </div>

        {/* Vector Simulated Map Display */}
        <div className="relative w-full h-[220px] rounded-xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full opacity-25 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="route-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#3b82f6" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#route-grid)" />
            <path
              d="M 50 160 Q 250 40 500 130 T 750 70"
              fill="none"
              stroke="#2563eb"
              strokeWidth="4"
              strokeDasharray="6 4"
              className="animate-pulse"
            />
            {trafficPreviewActive && (
              <path
                d="M 280 80 Q 380 150 480 120"
                fill="none"
                stroke="#ef4444"
                strokeWidth="4"
                strokeDasharray="4 2"
              />
            )}
          </svg>

          {/* Route Pins */}
          <div className="absolute top-1/4 left-1/5 flex flex-col items-center">
            <div className="h-4 w-4 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center shadow-lg">
              <MapPin className="h-2.5 w-2.5 text-white" />
            </div>
            <span className="mt-1 px-2 py-0.5 rounded-md bg-slate-900/90 text-[9px] font-mono font-bold text-blue-400 border border-blue-500/30">
              Origin Hub (NYC)
            </span>
          </div>

          <div className="absolute bottom-1/3 right-1/4 flex flex-col items-center">
            <div className="h-4 w-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-lg">
              <MapPin className="h-2.5 w-2.5 text-white" />
            </div>
            <span className="mt-1 px-2 py-0.5 rounded-md bg-slate-900/90 text-[9px] font-mono font-bold text-emerald-400 border border-emerald-500/30">
              Destination Depot (BOS)
            </span>
          </div>

          {/* Status Overlay */}
          <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-800 flex items-center justify-between text-[11px] font-mono">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-slate-300 font-bold">Standard Route: 340 km (3h 45m)</span>
            </div>
            <div className="text-slate-400">
              {trafficPreviewActive ? 'Traffic Delay: +22m (Bypass Recommended)' : 'Clear Traffic Conditions'}
            </div>
          </div>
        </div>
      </div>

      {/* Routes List Grid */}
      {isLoading ? (
        <div className="py-16 text-center text-xs text-[#737686]">Loading routes...</div>
      ) : routes.length === 0 ? (
        <div className="py-16 text-center text-xs text-[#737686]">No route corridors configured.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {routes.map((route) => {
            const originalEta = `${route.estimatedDuration || 4}h 30m`;
            const trafficEta = trafficPreviewActive
              ? `${(route.estimatedDuration || 4) + 1}h 10m (+40m traffic)`
              : originalEta;

            return (
              <div
                key={route.id}
                className="p-5 rounded-2xl border border-[#c3c6d7]/30 bg-white shadow-xs hover:border-[#2563eb]/40 transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-sm text-[#191c1e]">{route.routeCode}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                      ACTIVE ROUTE
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-black text-[#191c1e] bg-[#f7f9fb] p-3 rounded-xl">
                    <MapPin className="h-4 w-4 text-blue-600 shrink-0" />
                    <span className="truncate">{route.originCity}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-[#737686] shrink-0" />
                    <span className="truncate">{route.destinationCity}</span>
                  </div>

                  {/* Route Telemetry Specs */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-[#434655]">
                    <div className="flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5 text-[#2563eb]" />
                      <span>Distance: <strong>{(route as any).distance ? `${(route as any).distance} km` : '320 km'}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-purple-600" />
                      <span>ETA: <strong>{trafficEta}</strong></span>
                    </div>
                  </div>

                  {/* Alternative Route Suggestion */}
                  <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-[11px] text-purple-900 space-y-1">
                    <div className="flex items-center gap-1 font-bold">
                      <Zap className="h-3.5 w-3.5 text-purple-600" />
                      <span>AI Alternative Bypass</span>
                    </div>
                    <p className="text-[10px] text-purple-700">
                      Bypass Hwy 4 via Sector 9 South (-18 mins, -12 km).
                    </p>
                  </div>
                </div>

                {/* Dispatcher Actions */}
                <div className="pt-3 border-t border-[#c3c6d7]/20 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleOptimizeClick(route)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-100 text-purple-800 font-bold text-xs hover:bg-purple-600 hover:text-white transition-colors"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Optimize</span>
                  </button>

                  <button
                    onClick={() => navigate('/dispatcher/dispatch-center')}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#2563eb] text-white font-bold text-xs hover:bg-[#1d4ed8] transition-colors"
                  >
                    <span>Assign Route</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* AI Route Optimization Modal */}
      {optimizeModalOpen && selectedRoute && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl font-sans">
            <div className="flex items-center gap-2 text-purple-700 border-b border-[#c3c6d7]/30 pb-3">
              <Sparkles className="h-5 w-5" />
              <h3 className="text-sm font-black text-[#191c1e]">AI Route Optimization Preview</h3>
            </div>

            <div className="space-y-3 text-xs text-[#434655]">
              <p>
                AI analysis completed for corridor <strong>{selectedRoute.routeCode}</strong> ({selectedRoute.originCity} → {selectedRoute.destinationCity}):
              </p>

              <div className="p-3.5 bg-purple-50 rounded-xl border border-purple-200 space-y-2 text-purple-900">
                <div className="flex justify-between font-bold">
                  <span>Distance Reduction:</span>
                  <span className="text-emerald-700">-24.5 km (-7.2%)</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Transit Time Saved:</span>
                  <span className="text-emerald-700">-32 minutes</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Estimated Fuel Saving:</span>
                  <span className="text-emerald-700">-8.4 Liters</span>
                </div>
              </div>

              <div className="space-y-1 text-[11px] text-[#737686]">
                <p className="font-bold text-[#191c1e]">Recommended Adjustments:</p>
                <p>• Avoid Toll Expressway Gate 4 between 16:00 - 18:00</p>
                <p>• Reroute heavy vehicles through Interstate Bypass 88</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setOptimizeModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-[#c3c6d7] text-xs font-bold text-[#434655]"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setOptimizeModalOpen(false);
                  navigate('/dispatcher/dispatch-center');
                }}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 flex items-center gap-1"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Apply Optimized Route</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DispatcherRoutesPage;
