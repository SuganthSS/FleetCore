import React, { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';

import { useAuth } from '@/hooks/useAuth';
import type { FuelRecord, CreateFuelRecordPayload } from '@/types/fuel';
import type { Vehicle } from '@/types/vehicle';
import type { Trip } from '@/types/trip';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';

interface FuelModalProps {
  open: boolean;
  record: FuelRecord | null;
  onClose: () => void;
  onSubmit: (data: CreateFuelRecordPayload) => void;
  loading?: boolean;
  vehicles: Vehicle[];
  trips: Trip[];
}

const fuelValidationSchema = z.object({
  vehicleId: z.string().uuid('Please select a vehicle'),
  tripId: z.string().optional().nullable(),
  fuelDate: z.string().min(1, 'Fuel refuel date is required'),
  fuelStation: z
    .string()
    .trim()
    .min(1, 'Fuel station is required')
    .max(150, 'Fuel station must be 150 characters max'),
  quantity: z.coerce
    .number()
    .positive('Quantity must be greater than 0'),
  pricePerUnit: z.coerce
    .number()
    .positive('Price per unit must be greater than 0'),
  totalCost: z.coerce
    .number()
    .positive('Total cost must be greater than 0'),
  odometerReading: z.coerce
    .number()
    .int('Odometer must be an integer')
    .positive('Odometer must be greater than 0'),
  receiptNumber: z
    .string()
    .trim()
    .max(100, 'Receipt number must be 100 characters max')
    .optional()
    .nullable(),
  notes: z
    .string()
    .trim()
    .max(500, 'Notes must be 500 characters max')
    .optional()
    .nullable(),
});

type FuelFormValues = z.infer<typeof fuelValidationSchema>;

export const FuelModal: React.FC<FuelModalProps> = ({
  open,
  record,
  onClose,
  onSubmit,
  loading = false,
  vehicles,
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
    control,
    formState: { errors },
  } = useForm<FuelFormValues>({
    resolver: zodResolver(fuelValidationSchema),
    defaultValues: {
      vehicleId: '',
      tripId: '',
      fuelDate: '',
      fuelStation: '',
      quantity: 0,
      pricePerUnit: 0,
      totalCost: 0,
      odometerReading: 0,
      receiptNumber: '',
      notes: '',
    },
  });

  // Auto-calculate Total Cost = Quantity * Price Per Unit
  const quantityWatch = useWatch({ control, name: 'quantity' });
  const priceWatch = useWatch({ control, name: 'pricePerUnit' });

  useEffect(() => {
    const qty = Number(quantityWatch) || 0;
    const price = Number(priceWatch) || 0;
    if (qty > 0 && price > 0) {
      setValue('totalCost', parseFloat((qty * price).toFixed(2)));
    }
  }, [quantityWatch, priceWatch, setValue]);

  useEffect(() => {
    if (open) {
      if (record) {
        reset({
          vehicleId: record.vehicleId,
          tripId: record.tripId || '',
          fuelDate: formatDatetimeForInput(record.refueledAt),
          fuelStation: record.stationName,
          quantity: record.quantity,
          pricePerUnit: record.pricePerUnit,
          totalCost: record.totalCost,
          odometerReading: record.odometerReading,
          receiptNumber: record.stationLocation || '',
          notes: record.notes || '',
        });
      } else {
        reset({
          vehicleId: vehicles[0]?.id || '',
          tripId: '',
          fuelDate: new Date().toISOString().slice(0, 16),
          fuelStation: '',
          quantity: 0,
          pricePerUnit: 0,
          totalCost: 0,
          odometerReading: 0,
          receiptNumber: '',
          notes: '',
        });
      }
    }
  }, [open, record, reset, vehicles]);

  if (!open) return null;

  const handleFormSubmit = (values: FuelFormValues) => {
    onSubmit({
      vehicleId: values.vehicleId,
      tripId: values.tripId || null,
      fuelDate: new Date(values.fuelDate).toISOString(),
      fuelStation: values.fuelStation,
      quantity: values.quantity,
      pricePerUnit: values.pricePerUnit,
      totalCost: values.totalCost,
      odometerReading: values.odometerReading,
      receiptNumber: values.receiptNumber || null,
      notes: values.notes || null,
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
      <div className="relative w-full max-w-xl rounded-xl border border-border bg-card p-6 shadow-xl z-10 animate-scale-up max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4 mb-5">
          <h2 className="text-lg font-bold text-foreground">
            {isEdit ? 'Edit Fuel Refueling Record' : 'Record Vehicle Refueling'}
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
              {/* Vehicle Selector */}
              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Refueled Vehicle Asset
                </label>
                <select
                  {...register('vehicleId')}
                  className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select vehicle...</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.registrationNumber} ({v.make} {v.model})
                    </option>
                  ))}
                </select>
                {errors.vehicleId && (
                  <p className="text-[10px] font-bold text-destructive mt-1">
                    {errors.vehicleId.message}
                  </p>
                )}
              </div>

              {/* Trip Selector */}
              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Associated Trip Dispatch (Optional)
                </label>
                <select
                  {...register('tripId')}
                  className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">None / Ad-hoc refueling</option>
                  {trips.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.tripNumber}
                    </option>
                  ))}
                </select>
                {errors.tripId && (
                  <p className="text-[10px] font-bold text-destructive mt-1">
                    {errors.tripId.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Fuel Date"
                type="datetime-local"
                error={errors.fuelDate?.message}
                {...register('fuelDate')}
              />
              <Input
                label="Fuel Station / Location"
                error={errors.fuelStation?.message}
                {...register('fuelStation')}
                placeholder="e.g. Chevron station #12"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Quantity (Liters)"
                type="number"
                step="0.01"
                error={errors.quantity?.message}
                {...register('quantity')}
                placeholder="0.00"
              />
              <Input
                label="Price Per Unit ($)"
                type="number"
                step="0.001"
                error={errors.pricePerUnit?.message}
                {...register('pricePerUnit')}
                placeholder="0.00"
              />
              <Input
                label="Total Cost ($)"
                type="number"
                step="0.01"
                error={errors.totalCost?.message}
                {...register('totalCost')}
                placeholder="0.00"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Odometer (miles)"
                type="number"
                error={errors.odometerReading?.message}
                {...register('odometerReading')}
                placeholder="Odometer reading"
              />
              <Input
                label="Receipt / Ticket Reference"
                error={errors.receiptNumber?.message}
                {...register('receiptNumber')}
                placeholder="e.g. RCP-8921"
              />
            </div>

            {/* Notes */}
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Remarks / Invoicing Notes
              </label>
              <textarea
                {...register('notes')}
                rows={3}
                placeholder="Enter additional remarks about refueling purchase..."
                className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              {errors.notes && (
                <p className="text-[10px] font-bold text-destructive mt-1">
                  {errors.notes.message}
                </p>
              )}
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
              {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Record Fuel'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default FuelModal;
