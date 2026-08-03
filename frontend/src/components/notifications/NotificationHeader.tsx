import React from 'react';
import { Bell, CheckCheck, RefreshCw } from 'lucide-react';

interface NotificationHeaderProps {
  unreadCount: number;
  onMarkAllRead: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const NotificationHeader: React.FC<NotificationHeaderProps> = ({
  unreadCount,
  onMarkAllRead,
  onRefresh,
  isRefreshing,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-5">
      <div className="flex items-center gap-3">
        <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
          <Bell className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white ring-2 ring-background">
              {unreadCount}
            </span>
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Notification Center
            </h1>
            <span className="rounded-full bg-rose-500/10 px-2.5 py-0.5 text-xs font-bold text-rose-600 border border-rose-500/20">
              {unreadCount} Unread
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Real-time telemetry alerts, AI risk detection, maintenance schedules, and dispatch events.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh Feed
        </button>
        <button
          onClick={onMarkAllRead}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-primary/90 transition-all"
        >
          <CheckCheck className="h-4 w-4" /> Mark All as Read
        </button>
      </div>
    </div>
  );
};
