import { Search, LayoutGrid, LayoutList, X } from 'lucide-react';

interface CustomerOption {
  id: string;
  companyName: string;
}

interface ShipmentToolbarProps {
  search: string;
  onSearchChange: (val: string) => void;
  status: string;
  onStatusChange: (val: string) => void;
  priority: string;
  onPriorityChange: (val: string) => void;
  customerId: string;
  onCustomerIdChange: (val: string) => void;
  customers?: CustomerOption[];
  sortBy: string;
  onSortByChange: (val: string) => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (val: 'asc' | 'desc') => void;
  viewMode: 'table' | 'cards';
  onViewModeChange: (mode: 'table' | 'cards') => void;
  onClearFilters: () => void;
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
  customers = [],
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  viewMode,
  onViewModeChange,
  onClearFilters,
}) => {
  const hasActiveFilters = Boolean(search || status || priority || customerId);

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-3 rounded-2xl bg-card border border-border shadow-2xs">
      {/* Search & Filter Dropdowns */}
      <div className="flex flex-wrap items-center gap-2 flex-1">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by shipment #, cargo, city..."
            className="w-full pl-9 pr-4 py-2 bg-background border border-input rounded-xl text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Status Select */}
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-3 py-2 bg-background border border-input rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending Dispatch</option>
          <option value="DISPATCHED">Dispatched</option>
          <option value="IN_TRANSIT">In Transit</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="FAILED">Failed Delivery</option>
        </select>

        {/* Priority Select */}
        <select
          value={priority}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="px-3 py-2 bg-background border border-input rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="">All Priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent Freight</option>
        </select>

        {/* Customer Select */}
        {customers.length > 0 && (
          <select
            value={customerId}
            onChange={(e) => onCustomerIdChange(e.target.value)}
            className="px-3 py-2 bg-background border border-input rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 max-w-[180px] truncate"
          >
            <option value="">All Customers</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.companyName}
              </option>
            ))}
          </select>
        )}

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-bold text-destructive hover:bg-destructive/10 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
            Reset
          </button>
        )}
      </div>

      {/* Sort & View Mode Controls */}
      <div className="flex items-center gap-2 self-end lg:self-auto">
        <div className="flex items-center gap-1.5 border-l border-border pl-2">
          <span className="text-[11px] font-bold text-muted-foreground">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="px-2.5 py-1.5 bg-background border border-input rounded-xl text-xs font-semibold"
          >
            <option value="createdAt">Date Created</option>
            <option value="shipmentNumber">Shipment #</option>
            <option value="expectedDeliveryDate">Delivery Date</option>
            <option value="priority">Priority</option>
          </select>
          <button
            onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-1.5 rounded-xl border border-input bg-background text-xs font-mono font-bold hover:bg-muted"
            title="Toggle sort direction"
          >
            {sortOrder.toUpperCase()}
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center p-1 rounded-xl bg-muted/60 border border-border">
          <button
            onClick={() => onViewModeChange('table')}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'table'
                ? 'bg-card text-foreground shadow-2xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title="Table View"
          >
            <LayoutList className="h-4 w-4" />
          </button>
          <button
            onClick={() => onViewModeChange('cards')}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'cards'
                ? 'bg-card text-foreground shadow-2xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title="Cards View"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShipmentToolbar;
