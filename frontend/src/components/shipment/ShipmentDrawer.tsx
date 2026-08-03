import React, { useState } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Shipment } from '@/types/shipment';
import { ShipmentStatusBadge } from './ShipmentStatusBadge';
import { ShipmentPriorityBadge } from './ShipmentPriorityBadge';

interface ShipmentDrawerProps {
  open: boolean;
  shipment: Shipment | null;
  onClose: () => void;
}

export const ShipmentDrawer: React.FC<ShipmentDrawerProps> = ({
  open,
  shipment,
  onClose,
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'cargo' | 'tracking'>('overview');

  if (!open || !shipment) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-background/80 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md border-l border-border bg-card shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-border space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-mono">
                {shipment.shipmentNumber}
              </span>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-bold text-foreground leading-snug">
                {shipment.title}
              </h2>
              <div className="flex items-center gap-2 pt-1">
                <ShipmentStatusBadge status={shipment.status} />
                <ShipmentPriorityBadge priority={shipment.priority} size="sm" />
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                navigate(`/shipments/${shipment.id}`);
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 font-semibold text-xs transition-colors"
            >
              Open Full Shipment Profile Page
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-border bg-muted/20 px-6">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'itinerary', label: 'Itinerary' },
              { id: 'cargo', label: 'Cargo Specs' },
              { id: 'tracking', label: 'Tracking' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="p-4 rounded-xl border border-border bg-muted/10 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-medium">Customer Account</span>
                    <span className="font-bold text-foreground truncate max-w-[180px]">
                      {shipment.customer?.companyName || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-border/60 pt-2">
                    <span className="text-muted-foreground font-medium">Cargo Category</span>
                    <span className="font-medium text-foreground">{shipment.cargoType || 'General Freight'}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-border/60 pt-2">
                    <span className="text-muted-foreground font-medium">Assigned Trips</span>
                    <span className="font-mono font-bold text-foreground">
                      {shipment.trips && shipment.trips.length > 0
                        ? shipment.trips.map((t) => t.tripNumber).join(', ')
                        : 'Unassigned'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'itinerary' && (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-xl border border-border bg-card space-y-3">
                  <span className="text-[10px] font-bold uppercase text-emerald-600">Origin / Pickup Location</span>
                  <p className="font-bold text-foreground">{shipment.pickupAddress}</p>
                  <p className="text-muted-foreground">{shipment.pickupCity}, {shipment.pickupCountry}</p>
                </div>
                <div className="p-4 rounded-xl border border-border bg-card space-y-3">
                  <span className="text-[10px] font-bold uppercase text-indigo-600">Destination / Delivery Location</span>
                  <p className="font-bold text-foreground">{shipment.deliveryAddress}</p>
                  <p className="text-muted-foreground">{shipment.deliveryCity}, {shipment.deliveryCountry}</p>
                </div>
              </div>
            )}

            {activeTab === 'cargo' && (
              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-xl border border-border bg-muted/10 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Weight:</span>
                    <span className="font-bold font-mono">{shipment.weight ? `${shipment.weight} kg` : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between border-t border-border/60 pt-2">
                    <span className="text-muted-foreground">Volume:</span>
                    <span className="font-bold font-mono">{shipment.volume ? `${shipment.volume} m³` : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between border-t border-border/60 pt-2">
                    <span className="text-muted-foreground">Quantity Units:</span>
                    <span className="font-bold font-mono">{shipment.quantity ?? 'N/A'}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tracking' && (
              <div className="space-y-4 text-xs">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Real-Time Dispatch Progress
                </h3>
                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                  <div className="relative">
                    <span className="absolute -left-6 top-0 h-4 w-4 rounded-full bg-emerald-500 ring-4 ring-card" />
                    <p className="font-bold text-foreground">Shipment Order Created</p>
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(shipment.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-6 top-0 h-4 w-4 rounded-full bg-blue-500 ring-4 ring-card" />
                    <p className="font-bold text-foreground">Dispatched & Scheduled</p>
                    <p className="text-[10px] text-muted-foreground">Route & Trip assigned</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentDrawer;
