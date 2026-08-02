import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import type { TrackingRecord, CreateTrackingPayload } from '@/types/tracking';
import type { Vehicle } from '@/types/vehicle';
import type { Driver } from '@/types/driver';
import type { Trip } from '@/types/trip';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';

interface TrackingModalProps {
  open: boolean;
  record: TrackingRecord | null;
  onClose: () => void;
  onSubmit: (data: CreateTrackingPayload) => void;
  loading?: boolean;
  vehicles: Vehicle[];
  drivers: Driver[];
  trips: Trip[];
}

const trackingValidationSchema = z.object({
  vehicleId: z.string().uuid('Please select a vehicle'),
  driverId: z.string().optional().nullable(),
  tripId: z.string().uuid('Please select a trip'),
  latitude: z.coerce
    .number()
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90'),
  longitude: z.coerce
    .number()
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180'),
  speed: z.coerce
    .number()
    .min(0, 'Speed must be non-negative')
    .optional()
    .nullable(),
  heading: z.coerce
    .number()
    .min(0, 'Heading must be between 0 and 360')
    .max(360, 'Heading must be between 0 and 360')
    .optional()
    .nullable(),
  altitude: z.coerce.number().optional().nullable(),
  accuracy: z.coerce
    .number()
    .min(0, 'Accuracy must be non-negative')
    .optional()
    .nullable(),
  recordedAt: z.string().min(1, 'Recorded time is required'),
  address: z
    .string()
    .trim()
    .max(255, 'Address must be 255 characters max')
    .optional()
    .nullable(),
  city: z
    .string()
    .trim()
    .max(100, 'City must be 100 characters max')
    .optional()
    .nullable(),
  state: z
    .string()
    .trim()
    .max(100, 'State must be 100 characters max')
    .optional()
    .nullable(),
  country: z
    .string()
    .trim()
    .max(100, 'Country must be 100 characters max')
    .optional()
    .nullable(),
  postalCode: z
    .string()
    .trim()
    .max(20, 'Postal code must be 20 characters max')
    .optional()
    .nullable(),
});

type TrackingFormValues = z.infer<typeof trackingValidationSchema>;

export const TrackingModal: React.FC<TrackingModalProps> = ({
  open,
  record,
  onClose,
  onSubmit,
  loading = false,
  vehicles,
  drivers,
  trips,
}) => {
  const { user } = useAuth();
  const isEdit = !!record;

  const formatDatetimeForInput = (isoString: string | null | undefined): string => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      const tzOffset = date.getTimezoneOffset() * 60000;
      return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
    } catch {
      return '';
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TrackingFormValues>({
    resolver: zodResolver(trackingValidationSchema),
    defaultValues: {
      vehicleId: '',
      driverId: '',
      tripId: '',
      latitude: 0,
      longitude: 0,
      speed: null,
      heading: null,
      altitude: null,
      accuracy: null,
      recordedAt: '',
      address: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
    },
  });

  const watchedTripId = watch('tripId');

  // Automatically scope/match vehicle and driver when a Trip is selected
  useEffect(() => {
    if (watchedTripId) {
      const selectedTrip = trips.find((t) => t.id === watchedTripId);
      if (selectedTrip) {
        setValue('vehicleId', selectedTrip.vehicleId);
        setValue('driverId', selectedTrip.driverId || '');
      }
    }
  }, [watchedTripId, trips, setValue]);

  useEffect(() => {
    if (open) {
      if (record) {
        reset({
          vehicleId: record.vehicleId,
          driverId: record.driverId || '',
          tripId: record.tripId,
          latitude: record.latitude,
          longitude: record.longitude,
          speed: record.speed,
          heading: record.heading,
          altitude: record.altitude,
          accuracy: record.accuracy,
          recordedAt: formatDatetimeForInput(record.recordedAt),
          address: record.address || '',
          city: record.city || '',
          state: record.state || '',
          country: record.country || '',
          postalCode: record.postalCode || '',
        });
      } else {
        reset({
          vehicleId: vehicles[0]?.id || '',
          driverId: drivers[0]?.id || '',
          tripId: trips[0]?.id || '',
          latitude: 37.7749, // Default to a demo lat/lon (e.g. San Francisco)
          longitude: -122.4194,
          speed: null,
          heading: null,
          altitude: null,
          accuracy: null,
          recordedAt: new Date().toISOString().slice(0, 16),
          address: '',
          city: '',
          state: '',
          country: '',
          postalCode: '',
        });
      }
    }
  }, [open, record, reset, vehicles, drivers, trips]);

  if (!open) return null;

  const handleFormSubmit = (values: TrackingFormValues) => {
    onSubmit({
      vehicleId: values.vehicleId,
      driverId: values.driverId || null,
      tripId: values.tripId,
      latitude: values.latitude,
      longitude: values.longitude,
      speed: values.speed || null,
      heading: values.heading || null,
      altitude: values.altitude || null,
      accuracy: values.accuracy || null,
      recordedAt: new Date(values.recordedAt).toISOString(),
      address: values.address || null,
      city: values.city || null,
      state: values.state || null,
      country: values.country || null,
      postalCode: values.postalCode || null,
      companyId: record?.companyId || user?.companyId || '',
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
      <div className="relative w-full max-w-2xl rounded-xl border border-border bg-card p-6 shadow-xl z-10 animate-scale-up max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4 mb-5">
          <h2 className="text-lg font-bold text-foreground">
            {isEdit ? 'Modify GPS Tracking Entry' : 'Add GPS Tracking Record'}
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
            <div className="grid grid-cols-3 gap-4">
              {/* Trip Selector */}
              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Trip Execution
                </label>
                <select
                  {...register('tripId')}
                  className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select Trip...</option>
                  {trips.map((t) => (
                    <option key={t.id} value={t.id}>
                      Trip {t.tripNumber} ({t.status})
                    </option>
                  ))}
                </select>
                {errors.tripId && (
                  <p className="text-[10px] font-bold text-destructive mt-1">
                    {errors.tripId.message}
                  </p>
                )}
              </div>

              {/* Vehicle Selector (Lock-aligned to Trip) */}
              <div className="space-y-1.5 text-left opacity-90">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Vehicle Asset (Auto-assigned)
                </label>
                <select
                  {...register('vehicleId')}
                  disabled={true}
                  className="flex h-11 w-full rounded-lg border border-input bg-muted px-3 py-2 text-sm text-muted-foreground cursor-not-allowed focus-visible:outline-none"
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

              {/* Driver Selector (Lock-aligned to Trip) */}
              <div className="space-y-1.5 text-left opacity-90">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Driver / Tech (Auto-assigned)
                </label>
                <select
                  {...register('driverId')}
                  disabled={true}
                  className="flex h-11 w-full rounded-lg border border-input bg-muted px-3 py-2 text-sm text-muted-foreground cursor-not-allowed focus-visible:outline-none"
                >
                  <option value="">Select Driver...</option>
                  {drivers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.user ? `${d.user.firstName} ${d.user.lastName}` : `Driver ${d.employeeId}`}
                    </option>
                  ))}
                </select>
                {errors.driverId && (
                  <p className="text-[10px] font-bold text-destructive mt-1">
                    {errors.driverId.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Latitude"
                type="number"
                step="0.000001"
                error={errors.latitude?.message}
                {...register('latitude')}
                placeholder="e.g. 37.7749"
              />
              <Input
                label="Longitude"
                type="number"
                step="0.000001"
                error={errors.longitude?.message}
                {...register('longitude')}
                placeholder="e.g. -122.4194"
              />
              <Input
                label="Recorded Time"
                type="datetime-local"
                error={errors.recordedAt?.message}
                {...register('recordedAt')}
              />
            </div>

            <div className="grid grid-cols-4 gap-4">
              <Input
                label="Speed (mph)"
                type="number"
                step="0.1"
                error={errors.speed?.message}
                {...register('speed')}
                placeholder="0.0"
              />
              <Input
                label="Heading (deg)"
                type="number"
                min="0"
                max="360"
                error={errors.heading?.message}
                {...register('heading')}
                placeholder="0-360"
              />
              <Input
                label="Altitude (m)"
                type="number"
                error={errors.altitude?.message}
                {...register('altitude')}
                placeholder="0"
              />
              <Input
                label="Accuracy (m)"
                type="number"
                error={errors.accuracy?.message}
                {...register('accuracy')}
                placeholder="0"
              />
            </div>

            {/* Address */}
            <Input
              label="Address location mapping"
              error={errors.address?.message}
              {...register('address')}
              placeholder="e.g. 100 Pine St, San Francisco, CA"
            />

            <div className="grid grid-cols-4 gap-4">
              <Input
                label="City"
                error={errors.city?.message}
                {...register('city')}
                placeholder="San Francisco"
              />
              <Input
                label="State"
                error={errors.state?.message}
                {...register('state')}
                placeholder="CA"
              />
              <Input
                label="Country"
                error={errors.country?.message}
                {...register('country')}
                placeholder="USA"
              />
              <Input
                label="Postal Code"
                error={errors.postalCode?.message}
                {...register('postalCode')}
                placeholder="94111"
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
              {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Record'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default TrackingModal;
