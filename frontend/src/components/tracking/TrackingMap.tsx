import React from 'react';
import { Navigation, Compass, Radio, Maximize2, Layers } from 'lucide-react';
import type { TrackingRecord } from '@/types/tracking';

interface TrackingMapProps {
  selectedRecord: TrackingRecord | null;
  records: TrackingRecord[];
  onSelectRecord?: (record: TrackingRecord) => void;
}

export const TrackingMap: React.FC<TrackingMapProps> = ({
  selectedRecord,
  records,
}) => {
  const activeRecord = selectedRecord || records[0] || null;

  return (
    <div className="relative w-full h-[420px] rounded-2xl border border-border bg-slate-950 overflow-hidden shadow-md group">
      {/* Map Graphic Background Simulation */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#2563eb" strokeWidth="0.5" strokeOpacity="0.2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          {/* Simulated Route Vector Lines */}
          <path
            d="M 150 300 Q 300 150 600 220 T 900 120"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            strokeDasharray="6 4"
            className="animate-pulse"
          />
        </svg>
      </div>

      {/* Map Control Top Overlay */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-background/90 backdrop-blur-md text-foreground text-xs font-bold border border-border shadow-md">
            <Radio className="h-3.5 w-3.5 text-emerald-500 animate-ping" />
            GPS Stream Live
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-background/90 backdrop-blur-md text-muted-foreground text-xs font-mono font-semibold border border-border shadow-md">
            {records.length} Nodes Rendered
          </span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            className="p-2 rounded-xl bg-background/90 backdrop-blur-md text-foreground hover:bg-muted transition-colors border border-border shadow-md"
            title="Layer View"
          >
            <Layers className="h-4 w-4" />
          </button>
          <button
            className="p-2 rounded-xl bg-background/90 backdrop-blur-md text-foreground hover:bg-muted transition-colors border border-border shadow-md"
            title="Fullscreen Spatial View"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Center Simulated Location Pin */}
      {activeRecord && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20 pointer-events-none">
          <div className="relative flex items-center justify-center">
            <div className="absolute h-16 w-16 rounded-full bg-primary/20 animate-ping" />
            <div className="p-3 rounded-full bg-primary text-white shadow-xl border-2 border-white">
              <Navigation
                className="h-6 w-6 transform transition-transform duration-500"
                style={{ transform: `rotate(${activeRecord.heading || 0}deg)` }}
              />
            </div>
          </div>
          <div className="mt-2 px-3 py-1.5 rounded-xl bg-background/95 backdrop-blur-md border border-border text-center shadow-lg pointer-events-auto">
            <p className="text-xs font-black text-foreground font-mono">
              {activeRecord.vehicle?.registrationNumber || 'UNIT-ACTIVE'}
            </p>
            <p className="text-[10px] text-muted-foreground font-semibold">
              {activeRecord.speed ? `${activeRecord.speed} km/h` : 'Stopped'} • {activeRecord.city || 'In Transit'}
            </p>
          </div>
        </div>
      )}

      {/* Floating Bottom Telemetry Bar */}
      {activeRecord && (
        <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-background/95 backdrop-blur-md border border-border shadow-xl z-10 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary font-mono font-bold">
              <Compass className="h-4 w-4" />
            </div>
            <div>
              <span className="text-muted-foreground text-[10px] block font-bold uppercase">Coordinates</span>
              <span className="font-mono font-bold text-foreground">
                {activeRecord.latitude.toFixed(4)}° N, {activeRecord.longitude.toFixed(4)}° W
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 border-l border-border pl-4">
            <div>
              <span className="text-muted-foreground text-[10px] block font-bold uppercase">Address Landmark</span>
              <span className="font-semibold text-foreground truncate max-w-[200px] block">
                {activeRecord.address || 'Highway Corridor'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 border-l border-border pl-4">
            <div>
              <span className="text-muted-foreground text-[10px] block font-bold uppercase">Last Telemetry Ping</span>
              <span className="font-mono font-bold text-foreground">
                {new Date(activeRecord.recordedAt).toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackingMap;
