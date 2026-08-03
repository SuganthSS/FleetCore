import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Navigation } from 'lucide-react';
import type { Route, CreateRoutePayload, RouteType, RouteStatus } from '@/types/route';

const routeSchema = z.object({
  routeCode: z.string().min(2, 'Route code is required'),
  name: z.string().min(2, 'Route name is required'),
  origin: z.string().min(2, 'Origin city/address is required'),
  destination: z.string().min(2, 'Destination city/address is required'),
  distance: z.number().min(1, 'Distance must be at least 1 mile'),
  estimatedDuration: z.number().min(0.5, 'Duration must be at least 0.5 hours'),
  routeType: z.enum(['HIGHWAY', 'URBAN', 'INTERSTATE', 'CROSS_BORDER', 'REGIONAL', 'LAST_MILE']),
  status: z.enum(['PLANNED', 'ACTIVE', 'OPTIMIZED', 'COMPLETED', 'CANCELLED']),
});

type RouteFormData = z.infer<typeof routeSchema>;

interface RouteModalProps {
  open: boolean;
  route: Route | null;
  onClose: () => void;
  onSubmit: (payload: CreateRoutePayload) => void;
  loading?: boolean;
}

export const RouteModal: React.FC<RouteModalProps> = ({
  open,
  route,
  onClose,
  onSubmit,
  loading,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RouteFormData>({
    resolver: zodResolver(routeSchema),
    defaultValues: {
      routeCode: '',
      name: '',
      origin: '',
      destination: '',
      distance: 250,
      estimatedDuration: 4.5,
      routeType: 'INTERSTATE',
      status: 'PLANNED',
    },
  });

  useEffect(() => {
    if (route) {
      reset({
        routeCode: route.routeCode,
        name: route.name || route.routeCode,
        origin: route.originCity || route.originAddress,
        destination: route.destinationCity || route.destinationAddress,
        distance: route.plannedDistance || 250,
        estimatedDuration: route.estimatedDuration || 4.5,
        routeType: route.routeType,
        status: route.status,
      });
    } else {
      reset({
        routeCode: `RT-${Math.floor(1000 + Math.random() * 9000)}`,
        name: 'Express Freight Route',
        origin: 'Chicago, IL',
        destination: 'Detroit, MI',
        distance: 280,
        estimatedDuration: 4.5,
        routeType: 'INTERSTATE',
        status: 'PLANNED',
      });
    }
  }, [route, open, reset]);

  if (!open) return null;

  const handleFormSubmit = (data: RouteFormData) => {
    const payload: CreateRoutePayload = {
      routeCode: data.routeCode,
      name: data.name,
      origin: data.origin,
      destination: data.destination,
      distance: Number(data.distance),
      estimatedDuration: Number(data.estimatedDuration),
      routeType: data.routeType as RouteType,
      status: data.status as RouteStatus,
      companyId: '4044680601076201931',
    };
    onSubmit(payload);
  };

  const labelClass = "block text-xs font-bold text-foreground mb-1";
  const inputClass = "w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="w-full max-w-xl rounded-2xl border border-border bg-card shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Navigation className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                {route ? 'Edit Route Corridor' : 'Add New Route Corridor'}
              </h2>
              <p className="text-xs text-muted-foreground">
                Specify origin, destination, distance, and route operational type.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Route Code *</label>
              <input {...register('routeCode')} className={inputClass} placeholder="e.g. RT-8820" />
              {errors.routeCode && <p className="text-[10px] text-destructive mt-0.5">{errors.routeCode.message}</p>}
            </div>

            <div>
              <label className={labelClass}>Route Name *</label>
              <input {...register('name')} className={inputClass} placeholder="e.g. Midwest Freight Mainline" />
              {errors.name && <p className="text-[10px] text-destructive mt-0.5">{errors.name.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Origin City / Terminal *</label>
              <input {...register('origin')} className={inputClass} placeholder="e.g. Chicago, IL" />
              {errors.origin && <p className="text-[10px] text-destructive mt-0.5">{errors.origin.message}</p>}
            </div>
            <div>
              <label className={labelClass}>Destination City / Terminal *</label>
              <input {...register('destination')} className={inputClass} placeholder="e.g. Dallas, TX" />
              {errors.destination && <p className="text-[10px] text-destructive mt-0.5">{errors.destination.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Distance (miles) *</label>
              <input {...register('distance', { valueAsNumber: true })} type="number" className={inputClass} />
              {errors.distance && <p className="text-[10px] text-destructive mt-0.5">{errors.distance.message}</p>}
            </div>
            <div>
              <label className={labelClass}>Est. Duration (hours) *</label>
              <input {...register('estimatedDuration', { valueAsNumber: true })} type="number" step="0.5" className={inputClass} />
              {errors.estimatedDuration && <p className="text-[10px] text-destructive mt-0.5">{errors.estimatedDuration.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Route Type</label>
              <select {...register('routeType')} className={inputClass}>
                <option value="HIGHWAY">Highway Corridor</option>
                <option value="URBAN">Urban Transit</option>
                <option value="INTERSTATE">Interstate Logistics</option>
                <option value="CROSS_BORDER">Cross-Border Freight</option>
                <option value="REGIONAL">Regional Loop</option>
                <option value="LAST_MILE">Last Mile Delivery</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Operational Status</label>
              <select {...register('status')} className={inputClass}>
                <option value="PLANNED">Planned</option>
                <option value="ACTIVE">Active</option>
                <option value="OPTIMIZED">Optimized</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Actions Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-sm hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Saving Route...' : route ? 'Save Changes' : 'Create Route Corridor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RouteModal;
