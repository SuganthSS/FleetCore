import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import type { Customer } from '@/types/customer';
import type { Shipment, CreateShipmentPayload } from '@/types/shipment';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';

interface ShipmentModalProps {
  open: boolean;
  shipment: Shipment | null;
  onClose: () => void;
  onSubmit: (data: CreateShipmentPayload) => void;
  customers: Customer[];
  loading?: boolean;
}

const shipmentValidationSchema = z.object({
  shipmentNumber: z
    .string()
    .trim()
    .min(1, 'Shipment number is required')
    .max(50, 'Shipment number must be 50 characters max'),
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters max'),
  description: z
    .string()
    .trim()
    .max(1000, 'Description must be 1000 characters max')
    .optional()
    .nullable(),
  cargoType: z
    .string()
    .trim()
    .max(100, 'Cargo type must be 100 characters max')
    .optional()
    .nullable(),
  weight: z.coerce
    .number()
    .positive('Weight must be positive')
    .optional()
    .nullable(),
  volume: z.coerce
    .number()
    .positive('Volume must be positive')
    .optional()
    .nullable(),
  quantity: z.coerce
    .number()
    .int('Quantity must be an integer')
    .positive('Quantity must be positive')
    .optional()
    .nullable(),
  pickupAddress: z
    .string()
    .trim()
    .min(1, 'Pickup address is required')
    .max(300, 'Pickup address must be 300 characters max'),
  pickupCity: z
    .string()
    .trim()
    .min(1, 'Pickup city is required')
    .max(100, 'Pickup city must be 100 characters max'),
  pickupState: z
    .string()
    .trim()
    .max(100, 'Pickup state must be 100 characters max')
    .optional()
    .nullable(),
  pickupCountry: z
    .string()
    .trim()
    .min(1, 'Pickup country is required')
    .max(100, 'Pickup country must be 100 characters max'),
  pickupPostalCode: z
    .string()
    .trim()
    .max(20, 'Pickup postal code must be 20 characters max')
    .optional()
    .nullable(),
  pickupDate: z
    .string()
    .optional()
    .nullable(),
  deliveryAddress: z
    .string()
    .trim()
    .min(1, 'Delivery address is required')
    .max(300, 'Delivery address must be 300 characters max'),
  deliveryCity: z
    .string()
    .trim()
    .min(1, 'Delivery city is required')
    .max(100, 'Delivery city must be 100 characters max'),
  deliveryState: z
    .string()
    .trim()
    .max(100, 'Delivery state must be 100 characters max')
    .optional()
    .nullable(),
  deliveryCountry: z
    .string()
    .trim()
    .min(1, 'Delivery country is required')
    .max(100, 'Delivery country must be 100 characters max'),
  deliveryPostalCode: z
    .string()
    .trim()
    .max(20, 'Delivery postal code must be 20 characters max')
    .optional()
    .nullable(),
  expectedDeliveryDate: z
    .string()
    .optional()
    .nullable(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  status: z.enum(['PENDING', 'DISPATCHED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED', 'FAILED']),
  customerId: z
    .string()
    .uuid('Please select a valid customer'),
});

type ShipmentFormValues = z.infer<typeof shipmentValidationSchema>;

const formatDateForInput = (dateString: string | null | undefined): string => {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '';
    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return '';
  }
};

export const ShipmentModal: React.FC<ShipmentModalProps> = ({
  open,
  shipment,
  onClose,
  onSubmit,
  customers,
  loading = false,
}) => {
  const { user } = useAuth();
  const isEdit = !!shipment;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ShipmentFormValues>({
    resolver: zodResolver(shipmentValidationSchema),
    defaultValues: {
      shipmentNumber: '',
      title: '',
      description: '',
      cargoType: '',
      weight: null,
      volume: null,
      quantity: null,
      pickupAddress: '',
      pickupCity: '',
      pickupState: '',
      pickupCountry: '',
      pickupPostalCode: '',
      pickupDate: '',
      deliveryAddress: '',
      deliveryCity: '',
      deliveryState: '',
      deliveryCountry: '',
      deliveryPostalCode: '',
      expectedDeliveryDate: '',
      priority: 'MEDIUM',
      status: 'PENDING',
      customerId: '',
    },
  });

  useEffect(() => {
    if (open) {
      if (shipment) {
        reset({
          shipmentNumber: shipment.shipmentNumber,
          title: shipment.title,
          description: shipment.description || '',
          cargoType: shipment.cargoType || '',
          weight: shipment.weight,
          volume: shipment.volume,
          quantity: shipment.quantity,
          pickupAddress: shipment.pickupAddress,
          pickupCity: shipment.pickupCity,
          pickupState: shipment.pickupState || '',
          pickupCountry: shipment.pickupCountry,
          pickupPostalCode: shipment.pickupPostalCode || '',
          pickupDate: formatDateForInput(shipment.pickupDate),
          deliveryAddress: shipment.deliveryAddress,
          deliveryCity: shipment.deliveryCity,
          deliveryState: shipment.deliveryState || '',
          deliveryCountry: shipment.deliveryCountry,
          deliveryPostalCode: shipment.deliveryPostalCode || '',
          expectedDeliveryDate: formatDateForInput(shipment.expectedDeliveryDate),
          priority: shipment.priority,
          status: shipment.status,
          customerId: shipment.customerId,
        });
      } else {
        reset({
          shipmentNumber: '',
          title: '',
          description: '',
          cargoType: '',
          weight: null,
          volume: null,
          quantity: null,
          pickupAddress: '',
          pickupCity: '',
          pickupState: '',
          pickupCountry: '',
          pickupPostalCode: '',
          pickupDate: '',
          deliveryAddress: '',
          deliveryCity: '',
          deliveryState: '',
          deliveryCountry: '',
          deliveryPostalCode: '',
          expectedDeliveryDate: '',
          priority: 'MEDIUM',
          status: 'PENDING',
          customerId: customers[0]?.id || '',
        });
      }
    }
  }, [open, shipment, reset, customers]);

  if (!open) return null;

  const handleFormSubmit = (values: ShipmentFormValues) => {
    onSubmit({
      ...values,
      description: values.description || null,
      cargoType: values.cargoType || null,
      weight: values.weight || null,
      volume: values.volume || null,
      quantity: values.quantity || null,
      pickupState: values.pickupState || null,
      pickupPostalCode: values.pickupPostalCode || null,
      pickupDate: values.pickupDate ? new Date(values.pickupDate).toISOString() : null,
      deliveryState: values.deliveryState || null,
      deliveryPostalCode: values.deliveryPostalCode || null,
      expectedDeliveryDate: values.expectedDeliveryDate ? new Date(values.expectedDeliveryDate).toISOString() : null,
      companyId: shipment?.companyId || user?.companyId || '',
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
            {isEdit ? 'Edit Shipment' : 'Create Shipment'}
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
          {/* General Section */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-primary uppercase tracking-wider border-b border-border/40 pb-1.5">
              General Info
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Shipment Number"
                error={errors.shipmentNumber?.message}
                {...register('shipmentNumber')}
                placeholder="e.g. SH-8921-A"
              />
              <Input
                label="Shipment Title"
                error={errors.title?.message}
                {...register('title')}
                placeholder="e.g. Industrial Gears Delivery"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* Customer Dropdown */}
              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Ordering Customer
                </label>
                <select
                  {...register('customerId')}
                  className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select Customer</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.companyName}
                    </option>
                  ))}
                </select>
                {errors.customerId && (
                  <p className="text-[10px] font-bold text-destructive mt-1">
                    {errors.customerId.message}
                  </p>
                )}
              </div>

              {/* Priority */}
              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Priority
                </label>
                <select
                  {...register('priority')}
                  className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>

              {/* Status */}
              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Status
                </label>
                <select
                  {...register('status')}
                  className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="PENDING">Pending</option>
                  <option value="DISPATCHED">Dispatched</option>
                  <option value="IN_TRANSIT">In Transit</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="FAILED">Failed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Cargo Specs */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold text-primary uppercase tracking-wider border-b border-border/40 pb-1.5">
              Cargo Dimensions
            </h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-2">
                <Input
                  label="Cargo Type"
                  error={errors.cargoType?.message}
                  {...register('cargoType')}
                  placeholder="e.g. Heavy Machinery, Electronics"
                />
              </div>
              <Input
                label="Weight (kg)"
                type="number"
                step="any"
                error={errors.weight?.message}
                {...register('weight')}
                placeholder="kg"
              />
              <Input
                label="Volume (m³)"
                type="number"
                step="any"
                error={errors.volume?.message}
                {...register('volume')}
                placeholder="m³"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Quantity (packages)"
                type="number"
                error={errors.quantity?.message}
                {...register('quantity')}
                placeholder="pcs"
              />
              <div className="col-span-2 space-y-1.5 text-left">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Special Instructions
                </label>
                <textarea
                  {...register('description')}
                  rows={2}
                  className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Additional delivery information..."
                />
              </div>
            </div>
          </div>

          {/* Origin Section */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold text-primary uppercase tracking-wider border-b border-border/40 pb-1.5">
              Pickup (Origin)
            </h3>
            <Input
              label="Pickup Address"
              error={errors.pickupAddress?.message}
              {...register('pickupAddress')}
              placeholder="Origin address"
            />
            <div className="grid grid-cols-3 gap-4">
              <Input
                label="City"
                error={errors.pickupCity?.message}
                {...register('pickupCity')}
                placeholder="City"
              />
              <Input
                label="State"
                error={errors.pickupState?.message}
                {...register('pickupState')}
                placeholder="State"
              />
              <Input
                label="Country"
                error={errors.pickupCountry?.message}
                {...register('pickupCountry')}
                placeholder="Country"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Postal Code"
                error={errors.pickupPostalCode?.message}
                {...register('pickupPostalCode')}
                placeholder="ZIP / Postal code"
              />
              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Pickup Date & Time
                </label>
                <input
                  type="datetime-local"
                  {...register('pickupDate')}
                  className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </div>
          </div>

          {/* Destination Section */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold text-primary uppercase tracking-wider border-b border-border/40 pb-1.5">
              Delivery (Destination)
            </h3>
            <Input
              label="Delivery Address"
              error={errors.deliveryAddress?.message}
              {...register('deliveryAddress')}
              placeholder="Destination address"
            />
            <div className="grid grid-cols-3 gap-4">
              <Input
                label="City"
                error={errors.deliveryCity?.message}
                {...register('deliveryCity')}
                placeholder="City"
              />
              <Input
                label="State"
                error={errors.deliveryState?.message}
                {...register('deliveryState')}
                placeholder="State"
              />
              <Input
                label="Country"
                error={errors.deliveryCountry?.message}
                {...register('deliveryCountry')}
                placeholder="Country"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Postal Code"
                error={errors.deliveryPostalCode?.message}
                {...register('deliveryPostalCode')}
                placeholder="ZIP / Postal code"
              />
              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Expected Delivery Date & Time
                </label>
                <input
                  type="datetime-local"
                  {...register('expectedDeliveryDate')}
                  className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
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
              {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Shipment'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default ShipmentModal;
