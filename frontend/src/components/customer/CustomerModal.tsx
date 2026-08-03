import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import type { Customer, CreateCustomerPayload } from '@/types/customer';

const customerSchema = z.object({
  customerCode: z.string().min(2, 'Customer code is required (min 2 chars)'),
  companyName: z.string().min(2, 'Company name is required'),
  contactPerson: z.string().optional(),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION'] as const),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

interface CustomerModalProps {
  open: boolean;
  customer: Customer | null;
  onClose: () => void;
  onSubmit: (payload: CreateCustomerPayload) => void;
  loading?: boolean;
}

export const CustomerModal: React.FC<CustomerModalProps> = ({
  open,
  customer,
  onClose,
  onSubmit,
  loading,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    values: customer
      ? {
          customerCode: customer.customerCode,
          companyName: customer.companyName,
          contactPerson: customer.contactPerson || '',
          email: customer.email,
          phone: customer.phone || '',
          address: customer.address || '',
          city: customer.city || '',
          state: customer.state || '',
          country: customer.country || '',
          postalCode: customer.postalCode || '',
          status: customer.status,
        }
      : {
          customerCode: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
          companyName: '',
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

  if (!open) return null;

  const handleFormSubmit = (values: CustomerFormValues) => {
    onSubmit({
      ...values,
      companyId: customer?.companyId || 'company-default-id',
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-background/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              {customer ? 'Edit Customer Profile' : 'Add New Customer Account'}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Enter organizational contact and billing profile specifications.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-foreground mb-1">Customer Code *</label>
              <input
                {...register('customerCode')}
                className="w-full px-3 py-2 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono text-xs"
                placeholder="e.g. CUST-104"
              />
              {errors.customerCode && (
                <span className="text-[10px] text-destructive mt-1 block">
                  {errors.customerCode.message}
                </span>
              )}
            </div>

            <div>
              <label className="block font-bold text-foreground mb-1">Account Status *</label>
              <select
                {...register('status')}
                className="w-full px-3 py-2 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary/20 text-xs"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="SUSPENDED">Suspended</option>
                <option value="PENDING_VERIFICATION">Pending Verification</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-foreground mb-1">Company / Organization Name *</label>
            <input
              {...register('companyName')}
              className="w-full px-3 py-2 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs"
              placeholder="Apex Freight Logistics Corp"
            />
            {errors.companyName && (
              <span className="text-[10px] text-destructive mt-1 block">
                {errors.companyName.message}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-foreground mb-1">Primary Contact Person</label>
              <input
                {...register('contactPerson')}
                className="w-full px-3 py-2 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary/20 text-xs"
                placeholder="Jane Doe"
              />
            </div>

            <div>
              <label className="block font-bold text-foreground mb-1">Email Address *</label>
              <input
                {...register('email')}
                type="email"
                className="w-full px-3 py-2 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary/20 text-xs"
                placeholder="billing@apexlogistics.com"
              />
              {errors.email && (
                <span className="text-[10px] text-destructive mt-1 block">
                  {errors.email.message}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-foreground mb-1">Phone Number</label>
              <input
                {...register('phone')}
                className="w-full px-3 py-2 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary/20 text-xs"
                placeholder="+1 (555) 019-2834"
              />
            </div>

            <div>
              <label className="block font-bold text-foreground mb-1">City</label>
              <input
                {...register('city')}
                className="w-full px-3 py-2 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary/20 text-xs"
                placeholder="Chicago"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-foreground mb-1">Country</label>
              <input
                {...register('country')}
                className="w-full px-3 py-2 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary/20 text-xs"
                placeholder="United States"
              />
            </div>
            <div>
              <label className="block font-bold text-foreground mb-1">Postal Code</label>
              <input
                {...register('postalCode')}
                className="w-full px-3 py-2 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary/20 text-xs"
                placeholder="60601"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-input bg-card text-foreground hover:bg-muted font-bold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 disabled:opacity-50 transition-colors shadow-md"
            >
              {loading ? 'Saving...' : customer ? 'Update Customer' : 'Create Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerModal;
