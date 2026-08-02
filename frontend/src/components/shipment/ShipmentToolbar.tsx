import React from 'react';
import { Search, RefreshCw, X } from 'lucide-react';
import type { Customer } from '@/types/customer';

interface ShipmentToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  priority: string;
  onPriorityChange: (value: string) => void;
  customerId: string;
  onCustomerIdChange: (value: string) => void;
  customers: Customer[];
  onRefresh: () => void;
  onClearFilters: () => void;
  isRefreshing?: boolean;
}

export const ShipmentToolbar: React.FC<ShipmentToolbarProps> = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  customerId,
  onCustomerIdChange,
  customers,
  onRefresh,
  onClearFilters,
  isRefreshing = false,
}) => {
  const hasActiveFilters = search || status || priority || customerId;

  return (
    <div className="flex flex-col gap-4 p-4 bg-card border border-border rounded-xl shadow-sm">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search shipment number, title, cargo type, city or customer..."
            className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-4 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Filter */}
          <div className="flex flex-col">
            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              className="h-10 rounded-lg border border-input bg-background px-3 text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Filter by Status"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="DISPATCHED">Dispatched</option>
              <option value="IN_TRANSIT">In Transit</option>
              <option value="DELIVERED">Delivered</option>
              <option value="FAILED">Failed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex flex-col">
            <select
              value={priority}
              onChange={(e) => onPriorityChange(e.target.value)}
              className="h-10 rounded-lg border border-input bg-background px-3 text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Filter by Priority"
            >
              <option value="">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>

          {/* Customer Filter */}
          <div className="flex flex-col">
            <select
              value={customerId}
              onChange={(e) => onCustomerIdChange(e.target.value)}
              className="h-10 max-w-[200px] rounded-lg border border-input bg-background px-3 text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Filter by Customer"
            >
              <option value="">All Customers</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.companyName}
                </option>
              ))}
            </select>
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            title="Refresh list"
            aria-label="Refresh list"
          >
            <RefreshCw className={`h-4.5 w-4.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="flex h-10 items-center gap-1.5 rounded-lg border border-dashed border-border px-3 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
              title="Clear filters"
            >
              <X className="h-3.5 w-3.5" />
              Reset Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default ShipmentToolbar;
