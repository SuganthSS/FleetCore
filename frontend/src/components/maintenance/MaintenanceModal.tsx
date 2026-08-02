import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import type { MaintenanceRecord, CreateMaintenancePayload, MaintenanceType, MaintenanceStatus } from '@/types/maintenance';
import type { Vehicle } from '@/types/vehicle';
import type { Driver } from '@/types/driver';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';

interface MaintenanceModalProps {
  open: boolean;
  record: MaintenanceRecord | null;
  onClose: () => void;
  onSubmit: (data: CreateMaintenancePayload) => void;
  loading?: boolean;
  vehicles: Vehicle[];
  drivers: Driver[];
}

const maintenanceValidationSchema = z.object({
  vehicleId: z.string().uuid('Please select a vehicle'),
  driverId: z.string().optional().nullable(),
  maintenanceType: z.enum(['PREVENTIVE', 'CORRECTIVE', 'INSPECTION', 'EMERGENCY', 'OIL_CHANGE', 'BRAKE_SERVICE', 'TIRE_SERVICE', 'OTHER'], {
    required_error: 'Please select a maintenance type',
  }),
  status: z.enum(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'OVERDUE'], {
    required_error: 'Please select a status',
  }),
  title: z
    .string()
    .trim()
    .min(1, 'Title / Summary of work is required')
    .max(150, 'Title must be 150 characters max'),
  description: z
    .string()
    .trim()
    .max(500, 'Description must be 500 characters max')
    .optional()
    .nullable(),
  scheduledDate: z.string().min(1, 'Scheduled date is required'),
  completedDate: z.string().optional().nullable(),
  estimatedCost: z.coerce
    .number()
    .positive('Estimated cost must be positive')
    .optional()
    .nullable(),
  actualCost: z.coerce
    .number()
    .positive('Actual cost must be positive')
    .optional()
    .nullable(),
  serviceProvider: z
    .string()
    .trim()
    .max(150, 'Service provider must be 150 characters max')
    .optional()
    .nullable(),
  odometerReading: z.coerce
    .number()
    .int('Odometer must be an integer')
    .positive('Odometer must be positive')
    .optional()
    .nullable(),
  nextMaintenanceDate: z.string().optional().nullable(),
  notes: z
    .string()
    .trim()
    .max(500, 'Notes must be 500 characters max')
    .optional()
    .nullable(),
});

type MaintenanceFormValues = z.infer<typeof maintenanceValidationSchema>;

export const MaintenanceModal: React.FC<MaintenanceModalProps> = ({
  open,
  record,
  onClose,
  onSubmit,
  loading = false,
  vehicles,
  drivers,
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
    formState: { errors },
  } = useForm<MaintenanceFormValues>({
    resolver: zodResolver(maintenanceValidationSchema),
    defaultValues: {
      vehicleId: '',
      driverId: '',
      maintenanceType: 'PREVENTIVE',
      status: 'SCHEDULED',
      title: '',
      description: '',
      scheduledDate: '',
      completedDate: '',
      estimatedCost: null,
      actualCost: null,
      serviceProvider: '',
      odometerReading: null,
      nextMaintenanceDate: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (open) {
      if (record) {
        reset({
          vehicleId: record.vehicleId,
          driverId: record.driverId || '',
          maintenanceType: record.maintenanceType,
          status: record.status,
          title: record.serviceProvider || '', // Title fallback
          description: record.description || '',
          scheduledDate: formatDatetimeForInput(record.scheduledDate),
          completedDate: formatDatetimeForInput(record.completedDate),
          estimatedCost: record.status !== 'COMPLETED' ? record.cost : null,
          actualCost: record.status === 'COMPLETED' ? record.cost : null,
          serviceProvider: record.serviceProvider || '',
          odometerReading: record.odometerReading || null,
          nextMaintenanceDate: formatDatetimeForInput(record.nextMaintenanceDate),
          notes: record.notes || '',
        });
      } else {
        reset({
          vehicleId: vehicles[0]?.id || '',
          driverId: drivers[0]?.id || '',
          maintenanceType: 'PREVENTIVE',
          status: 'SCHEDULED',
          title: '',
          description: '',
          scheduledDate: new Date().toISOString().slice(0, 16),
          completedDate: '',
          estimatedCost: null,
          actualCost: null,
          serviceProvider: '',
          odometerReading: null,
          nextMaintenanceDate: '',
          notes: '',
        });
      }
    }
  }, [open, record, reset, vehicles, drivers]);

  if (!open) return null;

  const handleFormSubmit = (values: MaintenanceFormValues) => {
    onSubmit({
      vehicleId: values.vehicleId,
      driverId: values.driverId || null,
      maintenanceType: values.maintenanceType as MaintenanceType,
      status: values.status as MaintenanceStatus,
      title: values.title,
      description: values.description || null,
      scheduledDate: new Date(values.scheduledDate).toISOString(),
      completedDate: values.completedDate ? new Date(values.completedDate).toISOString() : null,
      estimatedCost: values.estimatedCost || null,
      actualCost: values.actualCost || null,
      serviceProvider: values.serviceProvider || values.title || null,
      odometerReading: values.odometerReading || null,
      nextMaintenanceDate: values.nextMaintenanceDate ? new Date(values.nextMaintenanceDate).toISOString() : null,
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
      <div className="relative w-full max-w-2xl rounded-xl border border-border bg-card p-6 shadow-xl z-10 animate-scale-up max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4 mb-5">
          <h2 className="text-lg font-bold text-foreground">
            {isEdit ? 'Edit Maintenance Work Order' : 'Create Maintenance Record'}
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
                  Vehicle Asset
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

              {/* Driver Selector */}
              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Responsible Driver / Tech (Optional)
                </label>
                <select
                  {...register('driverId')}
                  className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select driver...</option>
                  {drivers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.user ? `${d.user.firstName} ${d.user.lastName}` : `Driver ${d.employeeId}`} ({d.licenseNumber})
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

            <div className="grid grid-cols-2 gap-4">
              {/* Maintenance Type Selector */}
              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Maintenance Type
                </label>
                <select
                  {...register('maintenanceType')}
                  className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="PREVENTIVE">Preventive</option>
                  <option value="CORRECTIVE">Corrective</option>
                  <option value="INSPECTION">Inspection</option>
                  <option value="EMERGENCY">Emergency</option>
                  <option value="OIL_CHANGE">Oil Change</option>
                  <option value="BRAKE_SERVICE">Brake Service</option>
                  <option value="TIRE_SERVICE">Tire Service</option>
                  <option value="OTHER">Other</option>
                </select>
                {errors.maintenanceType && (
                  <p className="text-[10px] font-bold text-destructive mt-1">
                    {errors.maintenanceType.message}
                  </p>
                )}
              </div>

              {/* Status Selector */}
              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Status
                </label>
                <select
                  {...register('status')}
                  className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="OVERDUE">Overdue</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
                {errors.status && (
                  <p className="text-[10px] font-bold text-destructive mt-1">
                    {errors.status.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Work Order Title / Summary"
                error={errors.title?.message}
                {...register('title')}
                placeholder="e.g. 50k mile tire rotation"
              />
              <Input
                label="Service Provider / Mechanic"
                error={errors.serviceProvider?.message}
                {...register('serviceProvider')}
                placeholder="e.g. Apex Auto Body Shop"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Work Order Description
              </label>
              <textarea
                {...register('description')}
                rows={2}
                placeholder="Provide detailed description of work required or diagnostics findings..."
                className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              {errors.description && (
                <p className="text-[10px] font-bold text-destructive mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Scheduled Date"
                type="datetime-local"
                error={errors.scheduledDate?.message}
                {...register('scheduledDate')}
              />
              <Input
                label="Completed Date"
                type="datetime-local"
                error={errors.completedDate?.message}
                {...register('completedDate')}
              />
              <Input
                label="Next Target Date"
                type="datetime-local"
                error={errors.nextMaintenanceDate?.message}
                {...register('nextMaintenanceDate')}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Est. Cost ($)"
                type="number"
                step="0.01"
                error={errors.estimatedCost?.message}
                {...register('estimatedCost')}
                placeholder="0.00"
              />
              <Input
                label="Actual Cost ($)"
                type="number"
                step="0.01"
                error={errors.actualCost?.message}
                {...register('actualCost')}
                placeholder="0.00"
              />
              <Input
                label="Odometer (miles)"
                type="number"
                error={errors.odometerReading?.message}
                {...register('odometerReading')}
                placeholder="Logged Odometer"
              />
            </div>

            {/* Notes */}
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Technical Notes / Remarks
              </label>
              <textarea
                {...register('notes')}
                rows={2}
                placeholder="Enter additional internal notes about work order..."
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
              {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Record'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default MaintenanceModal;
