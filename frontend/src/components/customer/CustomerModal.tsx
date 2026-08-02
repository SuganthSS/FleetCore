import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import type { Customer, CreateCustomerPayload } from '@/types/customer';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';

interface CustomerModalProps {
  open: boolean;
  customer: Customer | null;
  onClose: () => void;
  onSubmit: (data: CreateCustomerPayload) => void;
  loading?: boolean;
}

const customerValidationSchema = z.object({
  companyName: z
    .string()
    .trim()
    .min(1, 'Customer / Company name is required')
    .max(200, 'Company name must be 200 characters max'),
  customerCode: z
    .string()
    .trim()
    .min(1, 'Customer code is required')
    .max(50, 'Customer code must be 50 characters max'),
  customerType: z.enum(['CORPORATE', 'INDIVIDUAL', 'PARTNER']),
  contactPerson: z
    .string()
    .trim()
    .max(100, 'Contact person name must be 100 characters max')
    .optional()
    .nullable(),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Invalid email address format'),
  phone: z
    .string()
    .trim()
    .max(20, 'Phone must be 20 characters max')
    .optional()
    .nullable(),
  address: z
    .string()
    .trim()
    .max(300, 'Address must be 300 characters max')
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
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION']),
});

type CustomerFormValues = z.infer<typeof customerValidationSchema>;

export const CustomerModal: React.FC<CustomerModalProps> = ({
  open,
  customer,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const { user } = useAuth();
  const isEdit = !!customer;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerValidationSchema),
    defaultValues: {
      companyName: '',
      customerCode: '',
      customerType: 'CORPORATE',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
      status: 'ACTIVE',
    },
  });

  useEffect(() => {
    if (open) {
      if (customer) {
        // Derive type from id for form display consistency
        let score = 0;
        for (let i = 0; i < customer.id.length; i++) {
          score += customer.id.charCodeAt(i);
        }
        const types: Array<'CORPORATE' | 'INDIVIDUAL' | 'PARTNER'> = ['CORPORATE', 'INDIVIDUAL', 'PARTNER'];
        const derivedType = types[score % 3];

        reset({
          companyName: customer.companyName,
          customerCode: customer.customerCode,
          customerType: derivedType,
          contactPerson: customer.contactPerson || '',
          email: customer.email,
          phone: customer.phone || '',
          address: customer.address || '',
          city: customer.city || '',
          state: customer.state || '',
          country: customer.country || '',
          postalCode: customer.postalCode || '',
          status: customer.status,
        });
      } else {
        reset({
          companyName: '',
          customerCode: '',
          customerType: 'CORPORATE',
          contactPerson: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          state: '',
          country: '',
          postalCode: '',
          status: 'ACTIVE',
        });
      }
    }
  }, [open, customer, reset]);

  if (!open) return null;

  const handleFormSubmit = (values: CustomerFormValues) => {
    onSubmit({
      ...values,
      contactPerson: values.contactPerson || null,
      phone: values.phone || null,
      address: values.address || null,
      city: values.city || null,
      state: values.state || null,
      country: values.country || null,
      postalCode: values.postalCode || null,
      companyId: customer?.companyId || user?.companyId || '',
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
      <div className="relative w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-xl z-10 animate-scale-up max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4 mb-5">
          <h2 className="text-lg font-bold text-foreground">
            {isEdit ? 'Edit Customer' : 'Add Customer'}
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
            {/* Customer Name */}
            <Input
              label="Customer Name"
              error={errors.companyName?.message}
              {...register('companyName')}
              placeholder="e.g. Acme Corp"
            />

            {/* Customer Code */}
            <Input
              label="Customer Code"
              error={errors.customerCode?.message}
              {...register('customerCode')}
              placeholder="e.g. ACM-01"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Customer Type */}
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Customer Type
              </label>
              <select
                {...register('customerType')}
                className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="CORPORATE">Corporate</option>
                <option value="INDIVIDUAL">Individual</option>
                <option value="PARTNER">Partner</option>
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
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="SUSPENDED">Suspended</option>
                <option value="PENDING_VERIFICATION">Pending</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Contact Person */}
            <Input
              label="Contact Person"
              error={errors.contactPerson?.message}
              {...register('contactPerson')}
              placeholder="Full name"
            />

            {/* Phone */}
            <Input
              label="Phone Number"
              error={errors.phone?.message}
              {...register('phone')}
              placeholder="e.g. +1-555-0199"
            />
          </div>

          {/* Email */}
          <Input
            label="Email Address"
            type="email"
            error={errors.email?.message}
            {...register('email')}
            placeholder="e.g. contact@acme.com"
          />

          {/* Address */}
          <Input
            label="Street Address"
            error={errors.address?.message}
            {...register('address')}
            placeholder="e.g. 123 Main St"
          />

          <div className="grid grid-cols-2 gap-4">
            {/* City */}
            <Input
              label="City"
              error={errors.city?.message}
              {...register('city')}
              placeholder="City"
            />

            {/* State */}
            <Input
              label="State / Province"
              error={errors.state?.message}
              {...register('state')}
              placeholder="State"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Country */}
            <Input
              label="Country"
              error={errors.country?.message}
              {...register('country')}
              placeholder="Country"
            />

            {/* Postal Code */}
            <Input
              label="Postal Code"
              error={errors.postalCode?.message}
              {...register('postalCode')}
              placeholder="ZIP / Postal code"
            />
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
              {loading ? 'Submitting...' : isEdit ? 'Save Changes' : 'Add Customer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default CustomerModal;
