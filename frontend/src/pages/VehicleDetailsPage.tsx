import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft, Edit2, Trash2, Truck, Fuel, Calendar, Scale,
  FileText, User, MapPin, Wrench, Route, CheckCircle2, Clock,
  AlertTriangle, Zap, Info
} from 'lucide-react';
import { vehicleService } from '@/services/vehicle.service';
import type { Vehicle } from '@/types/vehicle';
import { VehicleStatusBadge } from '@/components/vehicle/VehicleStatusBadge';
import { VehicleTypeBadge } from '@/components/vehicle/VehicleTypeBadge';
import { VehicleModal } from '@/components/vehicle/VehicleModal';
import { ConfirmDialog } from '@/components/ui';
import { Button } from '@/components/ui/button';

type DetailTab = 'overview' | 'specs' | 'maintenance' | 'fuel' | 'trips' | 'documents';

const TabBtn: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({
  active, onClick, children
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-3 text-xs font-bold border-b-2 -mb-px transition-colors whitespace-nowrap ${
      active
        ? 'border-primary text-primary'
        : 'border-transparent text-muted-foreground hover:text-foreground'
    }`}
  >
    {children}
  </button>
);

const InfoRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
    <span className="text-sm font-medium text-muted-foreground">{label}</span>
    <span className="text-sm font-semibold text-foreground text-right">{value}</span>
  </div>
);

const SpecCard: React.FC<{ icon: React.ElementType; label: string; value: string; sub?: string }> = ({
  icon: Icon, label, value, sub
}) => (
  <div className="rounded-xl border border-border bg-card p-4 space-y-3">
    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
      <Icon className="h-4.5 w-4.5" />
    </div>
    <div>
      <span className="block text-xs font-medium text-muted-foreground">{label}</span>
      <span className="block text-lg font-bold text-foreground mt-0.5">{value}</span>
      {sub && <span className="block text-[11px] text-muted-foreground mt-0.5">{sub}</span>}
    </div>
  </div>
);

const TimelineEvent: React.FC<{
  icon: React.ElementType;
  title: string;
  sub: string;
  time: string;
  color: string;
}> = ({ icon: Icon, title, sub, time, color }) => (
  <div className="flex gap-4">
    <div className="flex flex-col items-center">
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${color}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 w-px bg-border/60 mt-1" />
    </div>
    <div className="pb-5 pt-0.5 flex-1 min-w-0">
      <p className="text-sm font-semibold text-foreground leading-none">{title}</p>
      <p className="text-xs text-muted-foreground mt-1">{sub}</p>
      <p className="text-[11px] text-muted-foreground mt-1.5 flex items-center gap-1">
        <Clock className="h-3 w-3" />{time}
      </p>
    </div>
  </div>
);

export const VehicleDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<DetailTab>('overview');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['vehicle', id],
    queryFn: async () => {
      const res = await vehicleService.getVehicle(id!);
      return res.data;
    },
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: ({ payload }: { payload: Partial<Vehicle> }) =>
      vehicleService.updateVehicle(id!, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['vehicle', id] });
      void queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      setEditModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => vehicleService.deleteVehicle(id!),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      navigate('/vehicles');
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-40 rounded-lg bg-muted" />
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-muted" />
            <div className="space-y-2">
              <div className="h-6 w-40 rounded bg-muted" />
              <div className="h-4 w-24 rounded bg-muted" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-28 rounded-xl border border-border bg-card bg-muted/30" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="p-4 rounded-full bg-destructive/10 text-destructive mb-4">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h2 className="text-lg font-bold text-foreground">Vehicle not found</h2>
        <p className="text-sm text-muted-foreground mt-1.5">
          {error instanceof Error ? error.message : 'Could not load vehicle details.'}
        </p>
        <Button variant="outline" size="sm" onClick={() => navigate('/vehicles')} className="mt-6 gap-1.5">
          <ArrowLeft className="h-4 w-4" />
          Back to Fleet
        </Button>
      </div>
    );
  }

  const vehicle = data;

  const TABS: { key: DetailTab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'specs', label: 'Specifications' },
    { key: 'maintenance', label: 'Maintenance' },
    { key: 'fuel', label: 'Fuel History' },
    { key: 'trips', label: 'Trip History' },
    { key: 'documents', label: 'Documents' },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <button
          onClick={() => navigate('/vehicles')}
          className="flex items-center gap-1.5 hover:text-foreground transition-colors font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Fleet
        </button>
        <span>/</span>
        <span className="text-foreground font-semibold">Vehicles</span>
        <span>/</span>
        <span className="text-primary font-bold">{vehicle.registrationNumber}</span>
      </div>

      {/* Hero Card */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        {/* Color band */}
        <div className="h-1.5 w-full bg-gradient-to-r from-primary via-primary/70 to-transparent" />

        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            {/* Identity */}
            <div className="flex items-center gap-4">
              <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl font-bold text-xl ${
                vehicle.vehicleType === 'TRUCK' ? 'bg-orange-500/10 text-orange-600' :
                vehicle.vehicleType === 'VAN' ? 'bg-sky-500/10 text-sky-600' :
                'bg-primary/10 text-primary'
              }`}>
                {vehicle.make.charAt(0)}{vehicle.model.charAt(0)}
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground tracking-tight font-display">
                  {vehicle.make} {vehicle.model}
                </h1>
                <p className="text-sm font-mono font-semibold text-muted-foreground mt-0.5">
                  {vehicle.registrationNumber}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <VehicleStatusBadge status={vehicle.status} />
                  <VehicleTypeBadge type={vehicle.vehicleType} />
                </div>
              </div>
            </div>

            {/* Quick Info and Actions */}
            <div className="flex flex-col items-end gap-3">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditModalOpen(true)}
                  className="gap-1.5 text-xs"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  Edit Vehicle
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteDialogOpen(true)}
                  className="gap-1.5 text-xs text-destructive border-destructive/20 hover:bg-destructive/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </Button>
              </div>

              {/* Quick Stats Row */}
              <div className="flex items-center gap-4 text-right text-xs text-muted-foreground">
                <div>
                  <p className="font-mono font-bold text-foreground">{vehicle.manufacturingYear}</p>
                  <p>Year</p>
                </div>
                <div>
                  <p className="font-bold text-foreground uppercase">{vehicle.fuelType}</p>
                  <p>Fuel</p>
                </div>
                <div>
                  <p className="font-bold text-foreground">
                    {vehicle.capacity ? `${vehicle.capacity.toLocaleString()} kg` : 'N/A'}
                  </p>
                  <p>Payload</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-t border-border overflow-x-auto px-4">
          {TABS.map((tab) => (
            <TabBtn key={tab.key} active={activeTab === tab.key} onClick={() => setActiveTab(tab.key)}>
              {tab.label}
            </TabBtn>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              {/* Vehicle Identity */}
              <div className="rounded-xl border border-border bg-card p-5 space-y-0.5">
                <h2 className="text-sm font-bold text-foreground mb-3 pb-2 border-b border-border">
                  Vehicle Identity
                </h2>
                <InfoRow label="License Plate" value={<span className="font-mono">{vehicle.registrationNumber}</span>} />
                <InfoRow label="Make" value={vehicle.make} />
                <InfoRow label="Model" value={vehicle.model} />
                <InfoRow label="Year" value={vehicle.manufacturingYear} />
                <InfoRow label="VIN" value={<span className="font-mono text-xs select-all">{vehicle.vin}</span>} />
                <InfoRow label="Status" value={<VehicleStatusBadge status={vehicle.status} size="sm" />} />
                <InfoRow label="Company" value={vehicle.company?.name || 'FleetCore Global Logistics'} />
              </div>

              {/* Activity Timeline */}
              <div className="rounded-xl border border-border bg-card p-5">
                <h2 className="text-sm font-bold text-foreground mb-4 pb-2 border-b border-border">
                  Activity Timeline
                </h2>
                <div className="space-y-0">
                  <TimelineEvent
                    icon={CheckCircle2}
                    title="Vehicle Added to Fleet"
                    sub={`${vehicle.make} ${vehicle.model} registered in FleetCore system.`}
                    time={new Date(vehicle.createdAt).toLocaleString()}
                    color="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  />
                  <TimelineEvent
                    icon={Info}
                    title="Status Updated"
                    sub={`Status changed to ${vehicle.status.replace('_', ' ')}.`}
                    time={new Date(vehicle.updatedAt).toLocaleString()}
                    color="bg-blue-500/10 text-blue-600 dark:text-blue-400"
                  />
                  {vehicle.status === 'MAINTENANCE' && (
                    <TimelineEvent
                      icon={Wrench}
                      title="Maintenance Mode Active"
                      sub="Vehicle is currently undergoing scheduled service."
                      time="Now"
                      color="bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    />
                  )}
                </div>
              </div>
            </>
          )}

          {/* Specifications Tab */}
          {activeTab === 'specs' && (
            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              <h2 className="text-sm font-bold text-foreground pb-2 border-b border-border">
                Vehicle Specifications
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <SpecCard icon={Truck} label="Vehicle Type" value={vehicle.vehicleType} />
                <SpecCard icon={Fuel} label="Fuel Type" value={vehicle.fuelType} />
                <SpecCard icon={Calendar} label="Manufacture Year" value={String(vehicle.manufacturingYear)} />
                <SpecCard icon={Scale} label="Payload Capacity" value={vehicle.capacity ? `${vehicle.capacity.toLocaleString()} kg` : 'N/A'} />
                <SpecCard icon={FileText} label="VIN" value={vehicle.vin.slice(0, 8) + '...'} sub={vehicle.vin} />
                <SpecCard icon={Zap} label="Current Status" value={vehicle.status.replace(/_/g, ' ')} />
              </div>
            </div>
          )}

          {/* Maintenance Tab */}
          {activeTab === 'maintenance' && (
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="text-sm font-bold text-foreground pb-2 border-b border-border mb-4">
                Maintenance History
              </h2>
              {vehicle.status === 'MAINTENANCE' ? (
                <div className="space-y-3">
                  <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm mb-1">
                      <Wrench className="h-4 w-4" />
                      Currently In Service Bay
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Full synthetic oil change, filter replacement, and multi-point inspection.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center py-10 text-center">
                  <div className="p-3 rounded-full bg-muted text-muted-foreground mb-3">
                    <Wrench className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">No maintenance records</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Maintenance history will appear here once logged.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Fuel History Tab */}
          {activeTab === 'fuel' && (
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="text-sm font-bold text-foreground pb-2 border-b border-border mb-4">
                Fuel History
              </h2>
              <div className="flex flex-col items-center py-10 text-center">
                <div className="p-3 rounded-full bg-muted text-muted-foreground mb-3">
                  <Fuel className="h-6 w-6" />
                </div>
                <p className="text-sm font-semibold text-foreground">No fuel records</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Fuel logs will appear here once recorded in the system.
                </p>
              </div>
            </div>
          )}

          {/* Trips Tab */}
          {activeTab === 'trips' && (
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="text-sm font-bold text-foreground pb-2 border-b border-border mb-4">
                Trip History
              </h2>
              {vehicle.status === 'ON_TRIP' ? (
                <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm mb-1">
                    <Route className="h-4 w-4" />
                    Currently On Active Trip
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This vehicle is currently assigned to an active trip.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center py-10 text-center">
                  <div className="p-3 rounded-full bg-muted text-muted-foreground mb-3">
                    <Route className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">No trips recorded</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Trip history will display here once the vehicle has completed trips.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="text-sm font-bold text-foreground pb-2 border-b border-border mb-4">
                Documents & Files
              </h2>
              <div className="flex flex-col items-center py-10 text-center">
                <div className="p-3 rounded-full bg-muted text-muted-foreground mb-3">
                  <FileText className="h-6 w-6" />
                </div>
                <p className="text-sm font-semibold text-foreground">No documents uploaded</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Registration, insurance, and inspection documents will appear here.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Driver Assignment */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-sm font-bold text-foreground mb-3 pb-2 border-b border-border flex items-center gap-1.5">
              <User className="h-4 w-4 text-primary" />
              Assigned Driver
            </h3>
            {vehicle.status === 'ON_TRIP' ? (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-sm">
                  D
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Active Driver</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    On Duty
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                No driver currently assigned.
              </p>
            )}
          </div>

          {/* Live Location */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-sm font-bold text-foreground mb-3 pb-2 border-b border-border flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-primary" />
              Live Location
            </h3>
            {vehicle.status === 'ON_TRIP' ? (
              <div>
                <p className="text-sm font-semibold text-foreground">Active Route</p>
                <p className="text-xs text-muted-foreground mt-1">Updated 2m ago</p>
                <div className="mt-3 rounded-lg border border-border bg-muted/20 h-24 flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">Map view coming soon</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                Live location only available when vehicle is on a trip.
              </p>
            )}
          </div>

          {/* Service Status */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-sm font-bold text-foreground mb-3 pb-2 border-b border-border">
              Service Readiness
            </h3>
            <div className="space-y-2.5">
              {[
                { label: 'Insurance', ok: true, val: 'Valid' },
                { label: 'Registration', ok: true, val: 'Current' },
                { label: 'Safety Inspection', ok: vehicle.status !== 'OUT_OF_SERVICE', val: vehicle.status === 'OUT_OF_SERVICE' ? 'Expired' : 'Passed' },
                { label: 'Maintenance', ok: vehicle.status !== 'MAINTENANCE', val: vehicle.status === 'MAINTENANCE' ? 'In Progress' : 'On Schedule' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                  <span className={`text-xs font-bold flex items-center gap-1 ${item.ok ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                    {item.ok ? <CheckCircle2 className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                    {item.val}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <VehicleModal
        open={editModalOpen}
        vehicle={vehicle}
        onClose={() => setEditModalOpen(false)}
        onSubmit={(payload) => updateMutation.mutate({ payload })}
        loading={updateMutation.isPending}
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        open={deleteDialogOpen}
        destructive
        title="Remove Vehicle from Fleet?"
        description={`Are you sure you want to permanently delete '${vehicle.registrationNumber}' (${vehicle.make} ${vehicle.model}) from your fleet? This action cannot be undone.`}
        confirmLabel="Delete Asset"
        cancelLabel="Keep Asset"
        loading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate()}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
};

export default VehicleDetailsPage;
