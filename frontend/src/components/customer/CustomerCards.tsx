import React from 'react';
import { Eye, Edit2, Trash2, Mail, Phone, MapPin, Package, Building2 } from 'lucide-react';
import type { Customer } from '@/types/customer';
import { CustomerStatusBadge } from './CustomerStatusBadge';

interface CustomerCardsProps {
  customers: Customer[];
  onView: (customer: Customer) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
}

export const CustomerCards: React.FC<CustomerCardsProps> = ({
  customers,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {customers.map((customer) => (
        <div
          key={customer.id}
          onClick={() => onView(customer)}
          className="group rounded-2xl border border-border bg-card p-5 space-y-4 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer relative flex flex-col justify-between"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-black text-sm">
                {customer.companyName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                  {customer.companyName}
                </h3>
                <span className="text-[10px] text-muted-foreground font-mono">
                  {customer.customerCode}
                </span>
              </div>
            </div>
            <CustomerStatusBadge status={customer.status} size="sm" />
          </div>

          {/* Details */}
          <div className="rounded-xl bg-muted/20 border border-border/60 p-3 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Building2 className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="font-semibold text-foreground truncate">
                Contact: {customer.contactPerson || 'N/A'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{customer.email}</span>
            </div>
            {customer.phone && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-3.5 w-3.5 shrink-0" />
                <span>{customer.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{customer.city || 'N/A'}{customer.country ? `, ${customer.country}` : ''}</span>
            </div>
          </div>

          {/* Footer Metrics & Actions */}
          <div className="flex items-center justify-between text-xs pt-1 border-t border-border/60">
            <div className="flex items-center gap-1.5 font-bold text-foreground">
              <Package className="h-3.5 w-3.5 text-primary" />
              <span>{customer._count?.shipments ?? 0} Shipments</span>
            </div>

            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => onView(customer)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                title="View Profile"
              >
                <Eye className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => onEdit(customer)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                title="Edit Customer"
              >
                <Edit2 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => onDelete(customer.id)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                title="Delete Customer"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomerCards;
