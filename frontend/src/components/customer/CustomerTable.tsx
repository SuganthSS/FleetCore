import React from 'react';
import { Eye, Edit2, Trash2, ArrowUpDown, Phone, User, Landmark } from 'lucide-react';
import type { Customer, CustomerType } from '@/types/customer';
import { CustomerStatusBadge } from './CustomerStatusBadge';
import { CustomerTypeBadge } from './CustomerTypeBadge';

import { getCustomerType } from '@/utils/customer';

interface CustomerTableProps {
  customers: Customer[];
  onView: (customer: Customer) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSort: (field: string) => void;
}


const getLogoBg = (type: CustomerType) => {
  switch (type) {
    case 'CORPORATE':
      return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
    case 'INDIVIDUAL':
      return 'bg-teal-500/10 text-teal-500 border border-teal-500/20';
    case 'PARTNER':
      return 'bg-purple-500/10 text-purple-500 border border-purple-500/20';
    default:
      return 'bg-zinc-500/10 text-zinc-500 border border-zinc-500/20';
  }
};

export const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  onView,
  onEdit,
  onDelete,
  sortBy,
  sortOrder,
  onSort,
}) => {
  const renderSortIndicator = (field: string) => {
    if (sortBy !== field) return <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-40" />;
    return (
      <ArrowUpDown className={`ml-1.5 h-3.5 w-3.5 text-primary ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
    );
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30 sticky top-0 z-10">
              <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px] w-12">
                Logo
              </th>
              <th
                onClick={() => onSort('companyName')}
                className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px] cursor-pointer hover:text-foreground select-none"
              >
                <div className="flex items-center">
                  Customer Name
                  {renderSortIndicator('companyName')}
                </div>
              </th>
              <th
                onClick={() => onSort('customerCode')}
                className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px] cursor-pointer hover:text-foreground select-none"
              >
                <div className="flex items-center">
                  Customer Code
                  {renderSortIndicator('customerCode')}
                </div>
              </th>
              <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                Contact Person
              </th>
              <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                Email
              </th>
              <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                Phone
              </th>
              <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                Customer Type
              </th>
              <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                Status
              </th>
              <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                Shipments
              </th>
              <th
                onClick={() => onSort('createdAt')}
                className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px] cursor-pointer hover:text-foreground select-none"
              >
                <div className="flex items-center">
                  Created Date
                  {renderSortIndicator('createdAt')}
                </div>
              </th>
              <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px] text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {customers.map((customer) => {
              const type = getCustomerType(customer.id);
              const initials = customer.companyName.substring(0, 2).toUpperCase();

              return (
                <tr
                  key={customer.id}
                  className="hover:bg-muted/30 transition-colors group"
                >
                  {/* Company Logo Placeholder */}
                  <td className="p-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg font-bold text-xs uppercase ${getLogoBg(type)}`}>
                      {type === 'INDIVIDUAL' ? <User className="h-4 w-4" /> : <Landmark className="h-4 w-4" />}
                      <span className="sr-only">{initials}</span>
                    </div>
                  </td>

                  {/* Customer Name */}
                  <td className="p-4 font-semibold text-foreground">
                    {customer.companyName}
                  </td>

                  {/* Customer Code */}
                  <td className="p-4 text-xs font-semibold text-muted-foreground select-all">
                    {customer.customerCode}
                  </td>

                  {/* Contact Person */}
                  <td className="p-4 text-xs font-medium text-foreground">
                    {customer.contactPerson || '—'}
                  </td>

                  {/* Email */}
                  <td className="p-4 text-xs text-muted-foreground select-all">
                    {customer.email}
                  </td>

                  {/* Phone */}
                  <td className="p-4 text-xs font-medium text-muted-foreground">
                    {customer.phone ? (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3 text-muted-foreground/60" />
                        {customer.phone}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>

                  {/* Customer Type */}
                  <td className="p-4">
                    <CustomerTypeBadge type={type} />
                  </td>

                  {/* Status */}
                  <td className="p-4">
                    <CustomerStatusBadge status={customer.status} />
                  </td>

                  {/* Total Shipments */}
                  <td className="p-4 text-xs font-bold text-foreground pl-7">
                    {customer._count?.shipments ?? 0}
                  </td>

                  {/* Created Date */}
                  <td className="p-4 text-xs text-muted-foreground">
                    {new Date(customer.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onView(customer)}
                        className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        title="View Details"
                        aria-label="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEdit(customer)}
                        className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        title="Edit Customer"
                        aria-label="Edit Customer"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(customer.id)}
                        className="rounded-lg p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        title="Delete Customer"
                        aria-label="Delete Customer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default CustomerTable;
