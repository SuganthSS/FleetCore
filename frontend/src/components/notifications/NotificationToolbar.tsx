import React from 'react';
import { Search, RefreshCw, X } from 'lucide-react';


interface SimpleUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface NotificationToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  userId: string;
  onUserIdChange: (value: string) => void;
  type: string;
  onTypeChange: (value: string) => void;
  priority: string;
  onPriorityChange: (value: string) => void;
  isRead: string;
  onIsReadChange: (value: string) => void;
  onRefresh: () => void;
  onClearFilters: () => void;
  users: SimpleUser[];
  isRefreshing?: boolean;
}

export const NotificationToolbar: React.FC<NotificationToolbarProps> = ({
  search,
  onSearchChange,
  userId,
  onUserIdChange,
  type,
  onTypeChange,
  priority,
  onPriorityChange,
  isRead,
  onIsReadChange,
  onRefresh,
  onClearFilters,
  users,
  isRefreshing = false,
}) => {
  const hasActiveFilters = search || userId || type || priority || isRead !== '';

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
            placeholder="Search notifications by title or message..."
            className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-4 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* User Filter */}
          <div className="flex flex-col">
            <select
              value={userId}
              onChange={(e) => onUserIdChange(e.target.value)}
              className="h-10 rounded-lg border border-input bg-background px-3 text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring max-w-[150px] truncate"
              aria-label="Filter by User"
            >
              <option value="">All Users</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.firstName} {u.lastName}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div className="flex flex-col">
            <select
              value={type}
              onChange={(e) => onTypeChange(e.target.value)}
              className="h-10 rounded-lg border border-input bg-background px-3 text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Filter by Type"
            >
              <option value="">All Types</option>
              <option value="SYSTEM">System</option>
              <option value="VEHICLE">Vehicle</option>
              <option value="DRIVER">Driver</option>
              <option value="TRIP">Trip</option>
              <option value="FUEL">Fuel</option>
              <option value="MAINTENANCE">Maintenance</option>
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
              <option value="CRITICAL">Critical</option>
            </select>
          </div>

          {/* Read Status Filter */}
          <div className="flex flex-col">
            <select
              value={isRead}
              onChange={(e) => onIsReadChange(e.target.value)}
              className="h-10 rounded-lg border border-input bg-background px-3 text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Filter by Read Status"
            >
              <option value="">All Statuses</option>
              <option value="false">Unread</option>
              <option value="true">Read</option>
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
export default NotificationToolbar;
