import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import type { Trip, CreateTripPayload } from '@/types/trip';
import type { Shipment } from '@/types/shipment';
import type { Vehicle } from '@/types/vehicle';
import type { Driver } from '@/types/driver';
import type { Route } from '@/types/route';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';

interface TripModalProps {
  open: boolean;
  trip: Trip | null;
  onClose: () => void;
  onSubmit: (data: CreateTripPayload) => void;
  loading?: boolean;
  shipments: Shipment[];
  vehicles: Vehicle[];
  drivers: Driver[];
  routes: Route[];
}

const tripValidationSchema = z.object({
  tripNumber: z
    .string()
    .trim()
    .min(1, 'Trip number is required')
    .max(50, 'Trip number must be 50 characters max'),
  shipmentId: z.string().uuid('Please select a shipment'),
  vehicleId: z.string().uuid('Please select a vehicle'),
  driverId: z.string().uuid('Please select a driver'),
  routeId: z.string().uuid('Please select a route'),
  plannedStartTime: z.string().min(1, 'Planned start time is required'),
  plannedEndTime: z.string().optional().nullable(),
  actualStartTime: z.string().optional().nullable(),
  actualEndTime: z.string().optional().nullable(),
  status: z.enum([
    'SCHEDULED',
    'DISPATCHED',
    'IN_TRANSIT',
    'PAUSED',
    'COMPLETED',
    'CANCELLED',
    'FAILED',
  ]),
});

type TripFormValues = z.infer<typeof tripValidationSchema>;

export const TripModal: React.FC<TripModalProps> = ({
  open,
  trip,
  onClose,
  onSubmit,
  loading = false,
  shipments,
  vehicles,
  drivers,
  routes,
}) => {
  const { user } = useAuth();
  const isEdit = !!trip;

  // Convert ISO string to 'YYYY-MM-DDTHH:MM' for datetime-local inputs
  const formatDatetimeForInput = (isoString: string | null | undefined): string => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      const tzOffset = date.getTimezoneOffset() * 60000; // offset in milliseconds
      const localISOTime = new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
      return localISOTime;
    } catch {
      return '';
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TripFormValues>({
    resolver: zodResolver(tripValidationSchema),
    defaultValues: {
      tripNumber: '',
      shipmentId: '',
      vehicleId: '',
      driverId: '',
      routeId: '',
      plannedStartTime: '',
      plannedEndTime: '',
      actualStartTime: '',
      actualEndTime: '',
      status: 'SCHEDULED',
    },
  });

  useEffect(() => {
    if (open) {
      if (trip) {
        reset({
          tripNumber: trip.tripNumber,
          shipmentId: trip.shipmentId,
          vehicleId: trip.vehicleId,
          driverId: trip.driverId,
          routeId: trip.routeId,
          plannedStartTime: formatDatetimeForInput(trip.scheduledStartTime),
          plannedEndTime: formatDatetimeForInput(trip.scheduledEndTime),
          actualStartTime: formatDatetimeForInput(trip.actualStartTime),
          actualEndTime: formatDatetimeForInput(trip.actualEndTime),
          status: trip.status,
        });
      } else {
        // Find default dropdown values from first records if available to prevent empty UUID submission
        reset({
          tripNumber: '',
          shipmentId: shipments[0]?.id || '',
          vehicleId: vehicles[0]?.id || '',
          driverId: drivers[0]?.id || '',
          routeId: routes[0]?.id || '',
          plannedStartTime: '',
          plannedEndTime: '',
          actualStartTime: '',
          actualEndTime: '',
          status: 'SCHEDULED',
        });
      }
    }
  }, [open, trip, reset, shipments, vehicles, drivers, routes]);

  if (!open) return null;

  const handleFormSubmit = (values: TripFormValues) => {
    // Helper to format local inputs back to clean ISO string
    const formatToISOString = (val: string | null | undefined): string | null => {
      if (!val) return null;
      return new Date(val).toISOString();
    };

    const plannedStartISO = formatToISOString(values.plannedStartTime);
    if (!plannedStartISO) return; // shouldn't happen due to validation

    onSubmit({
      tripNumber: values.tripNumber,
      shipmentId: values.shipmentId,
      vehicleId: values.vehicleId,
      driverId: values.driverId,
      routeId: values.routeId,
      plannedStartTime: plannedStartISO,
      plannedEndTime: formatToISOString(values.plannedEndTime),
      actualStartTime: formatToISOString(values.actualStartTime),
      actualEndTime: formatToISOString(values.actualEndTime),
      status: values.status,
      companyId: trip?.companyId || user?.companyId || '',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog Container */}
      <div className="relative w-full max-w-xl rounded-xl border border-border bg-card p-6 shadow-xl z-10 animate-scale-up max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4 mb-5">
          <h2 className="text-lg font-bold text-foreground">
            {isEdit ? 'Edit Trip Dispatch' : 'Record Trip Dispatch'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Trip Number"
                error={errors.tripNumber?.message}
                {...register('tripNumber')}
                placeholder="e.g. TR-2026-981"
              />

              {/* Status */}
              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Trip Status
                </label>
                <select
                  {...register('status')}
                  className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="DISPATCHED">Dispatched</option>
                  <option value="IN_TRANSIT">In Transit</option>
                  <option value="PAUSED">Paused</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="FAILED">Failed</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Shipment Selector */}
              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Shipment Request
                </label>
                <select
                  {...register('shipmentId')}
                  className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select shipment...</option>
                  {shipments.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.shipmentNumber} ({s.title})
                    </option>
                  ))}
                </select>
                {errors.shipmentId && (
                  <p className="text-[10px] font-bold text-destructive mt-1">
                    {errors.shipmentId.message}
                  </p>
                )}
              </div>

              {/* Vehicle Selector */}
              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Vehicle Asset
                </label>
                <select
                  {...register('vehicleId')}
                  className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select vehicle...</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.registrationNumber} ({v.make})
                    </option>
                  ))}
                </select>
                {errors.vehicleId && (
                  <p className="text-[10px] font-bold text-destructive mt-1">
                    {errors.vehicleId.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Driver Selector */}
              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Assigned Driver
                </label>
                <select
                  {...register('driverId')}
                  className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select driver...</option>
                  {drivers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.user?.firstName || ''} {d.user?.lastName || ''} ({d.employeeId})
                    </option>
                  ))}

                </select>
                {errors.driverId && (
                  <p className="text-[10px] font-bold text-destructive mt-1">
                    {errors.driverId.message}
                  </p>
                )}
              </div>

              {/* Route Selector */}
              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Planned Route
                </label>
                <select
                  {...register('routeId')}
                  className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select route...</option>
                  {routes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.routeCode} ({r.originCity} to {r.destinationCity})
                    </option>
                  ))}
                </select>
                {errors.routeId && (
                  <p className="text-[10px] font-bold text-destructive mt-1">
                    {errors.routeId.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Planned Start Time"
                type="datetime-local"
                error={errors.plannedStartTime?.message}
                {...register('plannedStartTime')}
              />
              <Input
                label="Planned End Time"
                type="datetime-local"
                error={errors.plannedEndTime?.message}
                {...register('plannedEndTime')}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Actual Start Time"
                type="datetime-local"
                error={errors.actualStartTime?.message}
                {...register('actualStartTime')}
              />
              <Input
                label="Actual End Time"
                type="datetime-local"
                error={errors.actualEndTime?.message}
                {...register('actualEndTime')}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Trip'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default TripModal;
