import React, { useState } from 'react';
import {
  NotificationHeader,
  NotificationToolbar,
  NotificationCards,
} from '@/components/notifications';
import { NotificationRecord } from '@/types/notification';
import { CheckCircle2, BellOff } from 'lucide-react';

export const FleetManagerNotificationsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Operational notification feed for Fleet Manager
  const [notifications, setNotifications] = useState<NotificationRecord[]>([
    {
      id: 'notif-201',
      title: 'Coolant Anomaly Alert',
      message: 'Engine Coolant Temperature Spike detected on Volvo FH16 (TR-102). Risk probability: 85%. Urgent maintenance required.',
      type: 'MAINTENANCE',
      priority: 'HIGH',
      isRead: false,
      companyId: 'comp-1',
      createdAt: '2026-08-05T11:20:00Z',
      updatedAt: '2026-08-05T11:20:00Z',
    },
    {
      id: 'notif-202',
      title: 'Fuel Economy & Anti-Idling Alert',
      message: 'Top 3 vehicles account for 42% of total idle fuel waste. Route optimization recommended.',
      type: 'AI',
      priority: 'MEDIUM',
      isRead: false,
      companyId: 'comp-1',
      createdAt: '2026-08-05T09:45:00Z',
      updatedAt: '2026-08-05T09:45:00Z',
    },
    {
      id: 'notif-203',
      title: 'Driver CDL Renewal Reminder',
      message: 'Driver John Doe (D-802) Commercial Driver License expires in 14 days.',
      type: 'FLEET',
      priority: 'MEDIUM',
      isRead: true,
      companyId: 'comp-1',
      createdAt: '2026-08-04T16:00:00Z',
      updatedAt: '2026-08-04T16:00:00Z',
    },
    {
      id: 'notif-204',
      title: 'Trip Dispatch Waypoint Delay',
      message: 'Trip TRP-9042 delayed by 35 mins at Checkpoint 3 due to adverse weather conditions.',
      type: 'FLEET',
      priority: 'HIGH',
      isRead: false,
      companyId: 'comp-1',
      createdAt: '2026-08-04T14:15:00Z',
      updatedAt: '2026-08-04T14:15:00Z',
    },
  ]);

  const notifyToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      notifyToast('Operational notification feed refreshed.');
    }, 800);
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    notifyToast('All operational alerts marked as read.');
  };

  const handleToggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    notifyToast('Notification alert removed.');
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = notifications.filter((n) => {
    const matchesCategory = activeCategory === 'ALL' || n.type === activeCategory;
    const matchesUnread = !showUnreadOnly || !n.isRead;
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesUnread && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <NotificationHeader
        unreadCount={unreadCount}
        onMarkAllRead={handleMarkAllRead}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {toastMessage && (
        <div className="flex items-center gap-2.5 rounded-xl border border-[#10b981]/20 bg-[#10b981]/10 p-4 text-xs font-bold text-[#10b981]">
          <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <NotificationToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        showUnreadOnly={showUnreadOnly}
        onToggleUnreadOnly={() => setShowUnreadOnly(!showUnreadOnly)}
      />

      {filteredNotifications.length > 0 ? (
        <NotificationCards
          notifications={filteredNotifications}
          onToggleRead={handleToggleRead}
          onDelete={handleDelete}
        />
      ) : (
        <div className="rounded-2xl border border-border bg-card p-12 text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <BellOff className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-foreground">No operational alerts</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            You're all caught up! There are no matching alerts for your current filter criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default FleetManagerNotificationsPage;
