import React from 'react';
import { Eye, Edit2, Trash2, ArrowUpRight, Mail, Phone, MapPin, Package } from 'lucide-react';
import type { Customer } from '@/types/customer';
import { CustomerStatusBadge } from './CustomerStatusBadge';

interface CustomerTableProps {
  customers: Customer[];
  onView: (customer: Customer) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSort: (field: string) => void;
}

export const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  onView,
  onEdit,
  onDelete,
  sortBy,
  sortOrder,
  onSort,
}) => {
  const getSortIcon = (field: string) => {
    if (sortBy !== field) return null;
    return <ArrowUpRight className={`h-3 w-3 inline-block ml-1 transition-transform ${sortOrder === 'desc' ? 'rotate-90' : ''}`} />;
  };

  return (
    <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-muted-foreground font-bold uppercase tracking-wider">
              <th
                onClick={() => onSort('companyName')}
                className="py-3.5 px-4 cursor-pointer hover:text-foreground transition-colors"
              >
                Customer / Organization {getSortIcon('companyName')}
              </th>
              <th className="py-3.5 px-4">Contact Person</th>
              <th className="py-3.5 px-4">Email & Phone</th>
              <th className="py-3.5 px-4">Location</th>
              <th className="py-3.5 px-4">Shipments</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {customers.map((customer) => (
              <tr
                key={customer.id}
                onClick={() => onView(customer)}
                className="group hover:bg-muted/20 transition-colors cursor-pointer"
              >
                {/* Company Name & Code */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-xs">
                      {customer.companyName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-foreground group-hover:text-primary transition-colors">
                        {customer.companyName}
                      </div>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {customer.customerCode}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Contact Person */}
                <td className="py-3.5 px-4 font-semibold text-foreground">
                  {customer.contactPerson || 'N/A'}
                </td>

                {/* Email & Phone */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5 text-foreground font-medium">
                    <Mail className="h-3 w-3 text-muted-foreground shrink-0" />
                    <span>{customer.email}</span>
                  </div>
                  {customer.phone && (
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-0.5">
                      <Phone className="h-3 w-3 shrink-0" />
                      <span>{customer.phone}</span>
                    </div>
                  )}
                </td>

                {/* Location */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5 text-foreground font-medium">
                    <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>{customer.city || 'N/A'}{customer.country ? `, ${customer.country}` : ''}</span>
                  </div>
                </td>

                {/* Shipments count */}
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-muted/50 font-mono font-bold text-foreground">
                    <Package className="h-3 w-3 text-primary" />
                    {customer._count?.shipments ?? 0}
                  </span>
                </td>

                {/* Status */}
                <td className="py-3.5 px-4">
                  <CustomerStatusBadge status={customer.status} size="sm" />
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onView(customer)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onEdit(customer)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      title="Edit Customer"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(customer.id)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      title="Delete Customer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerTable;
