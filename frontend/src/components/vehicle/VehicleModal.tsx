import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import type { Vehicle, CreateVehiclePayload } from '@/types/vehicle';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';

interface VehicleModalProps {
  open: boolean;
  vehicle: Vehicle | null;
  onClose: () => void;
  onSubmit: (data: CreateVehiclePayload) => void;
  loading?: boolean;
}

const currentYear = new Date().getFullYear();

const vehicleValidationSchema = z.object({
  registrationNumber: z
    .string()
    .trim()
    .min(1, 'Registration number is required')
    .max(30, 'Registration number must be 30 characters max'),
  vin: z
    .string()
    .trim()
    .min(1, 'VIN is required')
    .max(17, 'VIN must be 17 characters max'),
  make: z
    .string()
    .trim()
    .min(1, 'Make / Manufacturer is required')
    .max(100, 'Make must be 100 characters max'),
  model: z
    .string()
    .trim()
    .min(1, 'Model is required')
    .max(100, 'Model must be 100 characters max'),
  manufacturingYear: z.coerce
    .number()
    .int()
    .min(1900, 'Year must be 1900 or later')
    .max(currentYear + 1, `Year cannot exceed ${currentYear + 1}`),
  vehicleType: z.enum(['TRUCK', 'VAN', 'TRAILER', 'BUS', 'CAR', 'SPECIALIZED']),
  fuelType: z.enum(['DIESEL', 'PETROL', 'ELECTRIC', 'HYBRID', 'CNG', 'LPG']),
  capacity: z.coerce
    .number()
    .positive('Capacity must be a positive number')
    .nullable()
    .optional(),
  status: z.enum(['AVAILABLE', 'ON_TRIP', 'MAINTENANCE', 'OUT_OF_SERVICE', 'DECOMMISSIONED']),
});

type VehicleFormValues = z.infer<typeof vehicleValidationSchema>;

export const VehicleModal: React.FC<VehicleModalProps> = ({
  open,
  vehicle,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const { user } = useAuth();
  const isEdit = !!vehicle;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleValidationSchema),
    defaultValues: {
      registrationNumber: '',
      vin: '',
      make: '',
      model: '',
      manufacturingYear: currentYear,
      vehicleType: 'TRUCK',
      fuelType: 'DIESEL',
      capacity: null,
      status: 'AVAILABLE',
    },
  });

  useEffect(() => {
    if (open) {
      if (vehicle) {
        reset({
          registrationNumber: vehicle.registrationNumber,
          vin: vehicle.vin,
          make: vehicle.make,
          model: vehicle.model,
          manufacturingYear: vehicle.manufacturingYear,
          vehicleType: vehicle.vehicleType,
          fuelType: vehicle.fuelType,
          capacity: vehicle.capacity,
          status: vehicle.status,
        });
      } else {
        reset({
          registrationNumber: '',
          vin: '',
          make: '',
          model: '',
          manufacturingYear: currentYear,
          vehicleType: 'TRUCK',
          fuelType: 'DIESEL',
          capacity: null,
          status: 'AVAILABLE',
        });
      }
    }
  }, [open, vehicle, reset]);

  if (!open) return null;

  const handleFormSubmit = (values: VehicleFormValues) => {
    onSubmit({
      ...values,
      companyId: vehicle?.companyId || user?.companyId || '',
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
      <div className="relative w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-xl z-10 animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4 mb-5">
          <h2 className="text-lg font-bold text-foreground">
            {isEdit ? 'Edit Vehicle' : 'Add Vehicle'}
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
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Registration Number */}
            <Input
              label="Registration Number"
              error={errors.registrationNumber?.message}
              {...register('registrationNumber')}
              placeholder="e.g. AB-123-CD"
            />

            {/* VIN */}
            <Input
              label="VIN"
              error={errors.vin?.message}
              {...register('vin')}
              placeholder="17-digit VIN"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Manufacturer / Make */}
            <Input
              label="Manufacturer / Make"
              error={errors.make?.message}
              {...register('make')}
              placeholder="e.g. Volvo, Ford"
            />

            {/* Model */}
            <Input
              label="Model"
              error={errors.model?.message}
              {...register('model')}
              placeholder="e.g. VNL 860"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Year */}
            <Input
              label="Manufacturing Year"
              type="number"
              error={errors.manufacturingYear?.message}
              {...register('manufacturingYear')}
              placeholder="e.g. 2024"
            />

            {/* Capacity */}
            <Input
              label="Capacity (kg)"
              type="number"
              error={errors.capacity?.message}
              {...register('capacity')}
              placeholder="e.g. 15000"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Vehicle Type */}
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Vehicle Type
              </label>
              <select
                {...register('vehicleType')}
                className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="TRUCK">Truck</option>
                <option value="VAN">Van</option>
                <option value="TRAILER">Trailer</option>
                <option value="BUS">Bus</option>
                <option value="CAR">Car</option>
                <option value="SPECIALIZED">Specialized</option>
              </select>
            </div>

            {/* Fuel Type */}
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Fuel Type
              </label>
              <select
                {...register('fuelType')}
                className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="DIESEL">Diesel</option>
                <option value="PETROL">Petrol</option>
                <option value="ELECTRIC">Electric</option>
                <option value="HYBRID">Hybrid</option>
                <option value="CNG">CNG</option>
                <option value="LPG">LPG</option>
              </select>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Vehicle Status / Availability
            </label>
            <select
              {...register('status')}
              className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="AVAILABLE">Available</option>
              <option value="ON_TRIP">On Trip</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="OUT_OF_SERVICE">Out Of Service</option>
              <option value="DECOMMISSIONED">Decommissioned</option>
            </select>
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
              {loading ? 'Submitting...' : isEdit ? 'Save Changes' : 'Add Vehicle'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default VehicleModal;
