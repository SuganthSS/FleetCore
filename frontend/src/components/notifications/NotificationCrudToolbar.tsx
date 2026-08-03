import React from 'react';
import { Search, RefreshCw, X } from 'lucide-react';

interface NotificationCrudToolbarProps {
  search: string;
  onSearchChange: (val: string) => void;
  userId: string;
  onUserIdChange: (val: string) => void;
  type: string;
  onTypeChange: (val: string) => void;
  priority: string;
  onPriorityChange: (val: string) => void;
  isRead: string;
  onIsReadChange: (val: string) => void;
  onRefresh: () => void;
  onClearFilters: () => void;
  users: Array<{ id: string; firstName: string; lastName: string; email: string }>;
  isRefreshing: boolean;
}

export const NotificationCrudToolbar: React.FC<NotificationCrudToolbarProps> = ({
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
  isRefreshing,
}) => {
  const hasActiveFilters = !!(search || userId || type || priority || isRead !== '');

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
      {/* Top row: search + refresh */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by title or message..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex gap-2 shrink-0">
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2.5 text-xs font-semibold text-muted-foreground hover:bg-muted transition-colors"
            >
              <X className="h-4 w-4" /> Clear
            </button>
          )}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Recipient User */}
        <select
          value={userId}
          onChange={(e) => onUserIdChange(e.target.value)}
          className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">All Recipients</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.firstName} {u.lastName}
            </option>
          ))}
        </select>

        {/* Type */}
        <select
          value={type}
          onChange={(e) => onTypeChange(e.target.value)}
          className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">All Types</option>
          <option value="SYSTEM">System</option>
          <option value="VEHICLE">Vehicle</option>
          <option value="DRIVER">Driver</option>
          <option value="TRIP">Trip</option>
          <option value="FUEL">Fuel</option>
          <option value="MAINTENANCE">Maintenance</option>
          <option value="AI">AI Copilot</option>
          <option value="FLEET">Fleet Event</option>
        </select>

        {/* Priority */}
        <select
          value={priority}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">All Priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="CRITICAL">Critical</option>
        </select>

        {/* Read Status */}
        <select
          value={isRead}
          onChange={(e) => onIsReadChange(e.target.value)}
          className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">All Statuses</option>
          <option value="false">Unread</option>
          <option value="true">Read</option>
        </select>
      </div>
    </div>
  );
};

export default NotificationCrudToolbar;
