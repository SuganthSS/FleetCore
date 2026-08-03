import React, { useState } from 'react';
import {
  NotificationHeader,
  NotificationToolbar,
  NotificationCards,
} from '@/components/notifications';
import { NotificationRecord } from '@/types/notification';
import { CheckCircle2, BellOff } from 'lucide-react';

export const NotificationCenterPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [notifications, setNotifications] = useState<NotificationRecord[]>([
    {
      id: 'notif-101',
      title: 'Coolant Anomaly Alert',
      message: 'Engine Coolant Temperature Spike detected on Volvo FH16 (TR-102). Risk probability: 85%.',
      type: 'MAINTENANCE',
      priority: 'HIGH',
      isRead: false,
      companyId: 'comp-1',
      createdAt: '2026-02-03T11:20:00Z',
      updatedAt: '2026-02-03T11:20:00Z',
    },
    {
      id: 'notif-102',
      title: 'Fuel Economy Optimization',
      message: 'Top 3 drivers account for 42% of total idle fuel waste. Anti-idling training recommended.',
      type: 'AI',
      priority: 'MEDIUM',
      isRead: false,
      companyId: 'comp-1',
      createdAt: '2026-02-03T09:45:00Z',
      updatedAt: '2026-02-03T09:45:00Z',
    },
    {
      id: 'notif-103',
      title: 'Driver CDL Renewal Reminder',
      message: 'Driver John Doe (D-802) Commercial Driver License expires in 14 days.',
      type: 'FLEET',
      priority: 'MEDIUM',
      isRead: true,
      companyId: 'comp-1',
      createdAt: '2026-02-02T16:00:00Z',
      updatedAt: '2026-02-02T16:00:00Z',
    },
    {
      id: 'notif-104',
      title: 'System Security Audit Completed',
      message: 'Monthly OAuth2 & RBAC role permission verification finished with zero flags.',
      type: 'SYSTEM',
      priority: 'LOW',
      isRead: true,
      companyId: 'comp-1',
      createdAt: '2026-02-01T08:00:00Z',
      updatedAt: '2026-02-01T08:00:00Z',
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
      notifyToast('Notification feed refreshed.');
    }, 800);
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    notifyToast('All notifications marked as read.');
  };

  const handleToggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    notifyToast('Notification deleted.');
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
        <div className="flex items-center gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
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
          <h3 className="text-base font-bold text-foreground">No notifications</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            You're all caught up! There are no matching notifications for your current filters.
          </p>
        </div>
      )}
    </div>
  );
};

export default NotificationCenterPage;
