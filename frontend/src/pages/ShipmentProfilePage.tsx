import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ChevronLeft,
  Package,
  Building2,
} from 'lucide-react';
import { shipmentService } from '@/services/shipment.service';
import { ShipmentStatusBadge } from '@/components/shipment/ShipmentStatusBadge';
import { ShipmentPriorityBadge } from '@/components/shipment/ShipmentPriorityBadge';

export const ShipmentProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'customer' | 'pickup' | 'delivery' | 'route' | 'trip' | 'timeline' | 'documents' | 'notes'
  >('overview');

  const { data: shipmentResponse, isLoading, error } = useQuery({
    queryKey: ['shipment', id],
    queryFn: () => shipmentService.getShipment(id!),
    enabled: !!id,
  });

  const shipment = shipmentResponse?.data;

  if (isLoading) {
    return (
      <div className="p-8 space-y-6 animate-pulse">
        <div className="h-6 w-32 bg-muted rounded" />
        <div className="h-32 bg-muted rounded-2xl" />
        <div className="h-64 bg-muted rounded-2xl" />
      </div>
    );
  }

  if (error || !shipment) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-lg font-bold text-foreground">Shipment Profile Not Found</h2>
        <p className="text-xs text-muted-foreground">The requested shipment operational record does not exist.</p>
        <button
          onClick={() => navigate('/shipments')}
          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold"
        >
          Return to Shipment Directory
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate('/shipments')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Shipment Directory
      </button>

      {/* Header Banner */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary font-black text-2xl shadow-inner">
            <Package className="h-10 w-10" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold text-foreground tracking-tight">{shipment.title}</h1>
              <ShipmentStatusBadge status={shipment.status} />
              <ShipmentPriorityBadge priority={shipment.priority} size="sm" />
            </div>
            <p className="text-xs font-mono text-muted-foreground">
              Waybill / Shipment #: <span className="font-bold text-foreground">{shipment.shipmentNumber}</span>
            </p>
            {shipment.customer && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5 text-primary" />
                Customer: <span className="font-semibold text-foreground">{shipment.customer.companyName}</span>
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-600 border border-indigo-500/20 text-center min-w-[140px]">
            <span className="block text-[10px] font-bold uppercase tracking-wider">Cargo Weight</span>
            <span className="text-xl font-black font-mono">{shipment.weight ? `${shipment.weight} kg` : 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-border gap-6 overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'customer', label: 'Customer Information' },
          { id: 'pickup', label: 'Pickup Details' },
          { id: 'delivery', label: 'Delivery Details' },
          { id: 'route', label: 'Assigned Route' },
          { id: 'trip', label: 'Assigned Trip' },
          { id: 'timeline', label: 'Delivery Timeline & Tracking' },
          { id: 'documents', label: 'Documents' },
          { id: 'notes', label: 'Notes & Activity Log' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Tab Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Shipment Specification Summary
                </h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground block">Shipment Number</span>
                    <span className="font-mono font-bold text-foreground">{shipment.shipmentNumber}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Cargo Category</span>
                    <span className="font-bold text-foreground">{shipment.cargoType || 'General Freight'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Origin City</span>
                    <span className="font-semibold text-foreground">{shipment.pickupCity}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Destination City</span>
                    <span className="font-semibold text-foreground">{shipment.deliveryCity}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'customer' && (
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Consignee / Customer Details
              </h3>
              <div className="space-y-2 text-xs">
                <p><span className="text-muted-foreground">Account Name:</span> {shipment.customer?.companyName || 'N/A'}</p>
                <p><span className="text-muted-foreground">Customer Code:</span> {shipment.customer?.customerCode || 'N/A'}</p>
                <p><span className="text-muted-foreground">Contact Email:</span> {shipment.customer?.email || 'N/A'}</p>
              </div>
            </div>
          )}

          {activeTab === 'pickup' && (
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Pickup Origin Address & Itinerary
              </h3>
              <div className="space-y-2 text-xs">
                <p><span className="text-muted-foreground">Address:</span> {shipment.pickupAddress}</p>
                <p><span className="text-muted-foreground">City/Country:</span> {shipment.pickupCity}, {shipment.pickupCountry}</p>
                <p><span className="text-muted-foreground">Scheduled Pickup:</span> {shipment.pickupDate ? new Date(shipment.pickupDate).toLocaleString() : 'Not Set'}</p>
              </div>
            </div>
          )}

          {activeTab === 'delivery' && (
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Delivery Destination Details
              </h3>
              <div className="space-y-2 text-xs">
                <p><span className="text-muted-foreground">Address:</span> {shipment.deliveryAddress}</p>
                <p><span className="text-muted-foreground">City/Country:</span> {shipment.deliveryCity}, {shipment.deliveryCountry}</p>
                <p><span className="text-muted-foreground">Expected Delivery:</span> {shipment.expectedDeliveryDate ? new Date(shipment.expectedDeliveryDate).toLocaleString() : 'Not Set'}</p>
              </div>
            </div>
          )}

          {activeTab === 'route' && (
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Assigned Logistics Route
              </h3>
              <p className="text-xs text-muted-foreground">Main Transit Route: {shipment.pickupCity} → {shipment.deliveryCity} Highway Link.</p>
            </div>
          )}

          {activeTab === 'trip' && (
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Assigned Dispatch Trip & Fleet
              </h3>
              {shipment.trips && shipment.trips.length > 0 ? (
                <div className="space-y-2 text-xs">
                  {shipment.trips.map((t) => (
                    <div key={t.id} className="p-3 rounded-xl border border-border bg-muted/20 flex justify-between">
                      <span className="font-mono font-bold">{t.tripNumber}</span>
                      <span className="text-muted-foreground uppercase font-bold">{t.status}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">No active trip dispatched for this shipment yet.</p>
              )}
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Real-Time Delivery Timeline
              </h3>
              <div className="space-y-4 text-xs">
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full bg-emerald-500" />
                  <div>
                    <p className="font-bold">Shipment Order Created</p>
                    <p className="text-[10px] text-muted-foreground">{new Date(shipment.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Bill of Lading & Waybills
              </h3>
              <p className="text-xs text-muted-foreground">Standard automated waybill document available upon dispatch confirmation.</p>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Dispatch Notes & Activity Log
              </h3>
              <p className="text-xs text-muted-foreground">No additional operational logs uploaded.</p>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-xs">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Record Audit Metadata
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created:</span>
                <span className="font-mono text-foreground">
                  {new Date(shipment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between border-t border-border/60 pt-2">
                <span className="text-muted-foreground">Last Updated:</span>
                <span className="font-mono text-foreground">
                  {new Date(shipment.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentProfilePage;
