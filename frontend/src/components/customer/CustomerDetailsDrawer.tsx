import React from 'react';
import { X, Mail, Phone, MapPin, ClipboardList, Landmark, User } from 'lucide-react';
import type { Customer } from '@/types/customer';
import { CustomerStatusBadge } from './CustomerStatusBadge';
import { CustomerTypeBadge } from './CustomerTypeBadge';
import { getCustomerType } from '@/utils/customer';

interface CustomerDetailsDrawerProps {
  customer: Customer | null;
  open: boolean;
  onClose: () => void;
}

export const CustomerDetailsDrawer: React.FC<CustomerDetailsDrawerProps> = ({
  customer,
  open,
  onClose,
}) => {
  if (!open || !customer) return null;

  const type = getCustomerType(customer.id);


  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
        {/* Drawer Panel */}
        <div className="pointer-events-auto w-screen max-w-md transform bg-card shadow-2xl transition-all duration-300 border-l border-border flex flex-col h-full animate-slide-in">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-6 py-5">
            <div>
              <h2 className="text-base font-bold text-foreground">
                Customer Record Details
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Customer Code: {customer.customerCode}
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Close details panel"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Details Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Visual Hero Panel */}
            <div className="rounded-xl border border-border bg-muted/20 p-5 flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3">
                {type === 'INDIVIDUAL' ? <User className="h-7 w-7" /> : <Landmark className="h-7 w-7" />}
              </div>
              <h3 className="text-lg font-bold text-foreground">
                {customer.companyName}
              </h3>
              <div className="flex items-center gap-2 mt-3">
                <CustomerTypeBadge type={type} />
                <CustomerStatusBadge status={customer.status} />
              </div>
            </div>

            {/* Shipment Statistics */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Logistics Summary
              </h4>
              <div className="rounded-xl border border-border p-4 bg-primary/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/15 text-primary">
                    <ClipboardList className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-muted-foreground">Total Shipments Ordered</span>
                    <span className="text-lg font-extrabold text-foreground mt-0.5">
                      {customer._count?.shipments ?? 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Primary Contact Person details */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Contact Information
              </h4>
              <div className="rounded-xl border border-border p-4 space-y-3">
                <div className="flex items-start gap-3 text-xs">
                  <User className="h-4 w-4 text-muted-foreground/75 mt-0.5" />
                  <div>
                    <span className="block text-muted-foreground font-semibold">Contact Person</span>
                    <span className="block text-foreground font-bold mt-0.5">{customer.contactPerson || 'Not Provided'}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-xs border-t border-border/50 pt-3">
                  <Mail className="h-4 w-4 text-muted-foreground/75 mt-0.5" />
                  <div>
                    <span className="block text-muted-foreground font-semibold">Email Address</span>
                    <span className="block text-foreground font-bold select-all mt-0.5">{customer.email}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-xs border-t border-border/50 pt-3">
                  <Phone className="h-4 w-4 text-muted-foreground/75 mt-0.5" />
                  <div>
                    <span className="block text-muted-foreground font-semibold">Phone Number</span>
                    <span className="block text-foreground font-bold select-all mt-0.5">{customer.phone || 'Not Provided'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Address details */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Physical Address
              </h4>
              <div className="rounded-xl border border-border p-4 space-y-3.5">
                <div className="flex gap-3 text-xs">
                  <MapPin className="h-4 w-4 text-muted-foreground/75 mt-0.5 shrink-0" />
                  <div className="space-y-1">
                    <span className="block text-muted-foreground font-semibold">Street Address</span>
                    <span className="block text-foreground font-bold leading-normal">
                      {customer.address || 'Not Provided'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-border/50 pt-3">
                  <div className="text-xs">
                    <span className="block text-muted-foreground font-semibold">City</span>
                    <span className="block text-foreground font-bold mt-0.5">{customer.city || '—'}</span>
                  </div>
                  <div className="text-xs">
                    <span className="block text-muted-foreground font-semibold">State / Province</span>
                    <span className="block text-foreground font-bold mt-0.5">{customer.state || '—'}</span>
                  </div>
                  <div className="text-xs">
                    <span className="block text-muted-foreground font-semibold">Country</span>
                    <span className="block text-foreground font-bold mt-0.5">{customer.country || '—'}</span>
                  </div>
                  <div className="text-xs">
                    <span className="block text-muted-foreground font-semibold">Postal / ZIP Code</span>
                    <span className="block text-foreground font-bold mt-0.5">{customer.postalCode || '—'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* System Info */}
            <div className="space-y-3 border-t border-border pt-5">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                System Info
              </h4>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">Tenant Organization</span>
                  <span className="font-semibold text-foreground">{customer.company?.name || 'FleetCore Client'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">Profile Created</span>
                  <span className="font-semibold text-foreground">
                    {new Date(customer.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">Last Updated</span>
                  <span className="font-semibold text-foreground">
                    {new Date(customer.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CustomerDetailsDrawer;
