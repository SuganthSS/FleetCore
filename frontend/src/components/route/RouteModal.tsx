import React, { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import type { Route, CreateRoutePayload } from '@/types/route';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';

interface RouteModalProps {
  open: boolean;
  route: Route | null;
  onClose: () => void;
  onSubmit: (data: CreateRoutePayload) => void;
  loading?: boolean;
}

const routeValidationSchema = z.object({
  routeCode: z
    .string()
    .trim()
    .min(1, 'Route code is required')
    .max(50, 'Route code must be 50 characters max'),
  name: z
    .string()
    .trim()
    .min(1, 'Route name is required')
    .max(150, 'Route name must be 150 characters max'),
  description: z
    .string()
    .trim()
    .max(500, 'Description must be 500 characters max')
    .optional()
    .nullable(),
  origin: z
    .string()
    .trim()
    .min(1, 'Origin point is required')
    .max(200, 'Origin point must be 200 characters max'),
  destination: z
    .string()
    .trim()
    .min(1, 'Destination point is required')
    .max(200, 'Destination point must be 200 characters max'),
  distance: z.coerce
    .number()
    .positive('Distance must be positive'),
  estimatedDuration: z.coerce
    .number()
    .int('Duration must be an integer')
    .positive('Duration must be positive'),
  routeType: z.enum(['HIGHWAY', 'URBAN', 'INTERSTATE', 'CROSS_BORDER', 'REGIONAL', 'LAST_MILE']),
  status: z.enum(['PLANNED', 'ACTIVE', 'OPTIMIZED', 'COMPLETED', 'CANCELLED']),
});

type RouteFormValues = z.infer<typeof routeValidationSchema>;

export const RouteModal: React.FC<RouteModalProps> = ({
  open,
  route,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const { user } = useAuth();
  const isEdit = !!route;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<RouteFormValues>({
    resolver: zodResolver(routeValidationSchema),
    defaultValues: {
      routeCode: '',
      name: '',
      description: '',
      origin: '',
      destination: '',
      distance: 0,
      estimatedDuration: 0,
      routeType: 'HIGHWAY',
      status: 'PLANNED',
    },
  });

  const originVal = useWatch({ control, name: 'origin' });
  const destinationVal = useWatch({ control, name: 'destination' });
  const nameVal = useWatch({ control, name: 'name' });

  // Auto-generate name on origin/destination changes if not manually modified
  useEffect(() => {
    if (originVal || destinationVal) {
      const generated = `${originVal || ''} to ${destinationVal || ''}`.trim();
      // Only set if name is empty, or is equal to previous generated
      if (!nameVal || nameVal.includes(' to ') || nameVal === '') {
        setValue('name', generated);
      }
    }
  }, [originVal, destinationVal, setValue, nameVal]);


  useEffect(() => {
    if (open) {
      if (route) {
        reset({
          routeCode: route.routeCode,
          name: route.name,
          description: route.description || '',
          origin: route.originAddress,
          destination: route.destinationAddress,
          distance: route.plannedDistance || 0,
          estimatedDuration: route.estimatedDuration || 0,
          routeType: route.routeType,
          status: route.status,
        });
      } else {
        reset({
          routeCode: '',
          name: '',
          description: '',
          origin: '',
          destination: '',
          distance: 0,
          estimatedDuration: 0,
          routeType: 'HIGHWAY',
          status: 'PLANNED',
        });
      }
    }
  }, [open, route, reset]);

  if (!open) return null;

  const handleFormSubmit = (values: RouteFormValues) => {
    onSubmit({
      ...values,
      description: values.description || null,
      companyId: route?.companyId || user?.companyId || '',
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
            {isEdit ? 'Edit Route Corridor' : 'Create Route Corridor'}
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
                label="Route Code"
                error={errors.routeCode?.message}
                {...register('routeCode')}
                placeholder="e.g. RT-EAST-01"
              />
              <Input
                label="Route Name"
                error={errors.name?.message}
                {...register('name')}
                placeholder="e.g. Austin to Houston Express"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Origin Point / City"
                error={errors.origin?.message}
                {...register('origin')}
                placeholder="Origin city or full address"
              />
              <Input
                label="Destination Point / City"
                error={errors.destination?.message}
                {...register('destination')}
                placeholder="Destination city or full address"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Planned Distance (km)"
                type="number"
                step="any"
                error={errors.distance?.message}
                {...register('distance')}
                placeholder="e.g. 260"
              />
              <Input
                label="Est. Duration (minutes)"
                type="number"
                error={errors.estimatedDuration?.message}
                {...register('estimatedDuration')}
                placeholder="e.g. 180"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Route Type */}
              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Route Classification Type
                </label>
                <select
                  {...register('routeType')}
                  className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="URBAN">Urban / Local</option>
                  <option value="LAST_MILE">Last Mile</option>
                  <option value="REGIONAL">Regional</option>
                  <option value="HIGHWAY">Highway</option>
                  <option value="INTERSTATE">Interstate</option>
                  <option value="CROSS_BORDER">Cross Border / International</option>
                </select>
              </div>

              {/* Status */}
              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Route Status
                </label>
                <select
                  {...register('status')}
                  className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="PLANNED">Planned</option>
                  <option value="ACTIVE">Active</option>
                  <option value="OPTIMIZED">Optimized</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Route Description
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Brief description of routing guidelines, tolls or road hazards..."
              />
              {errors.description && (
                <p className="text-[10px] font-bold text-destructive mt-1">
                  {errors.description.message}
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
              {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Route'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default RouteModal;
