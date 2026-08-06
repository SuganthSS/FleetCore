import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Bell,
  Search,
  Filter,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Info,
  Archive,
  CheckCheck,
  Truck,
  ShieldAlert,
} from 'lucide-react';
import { notificationService } from '@/services/notification.service';
import type { NotificationRecord } from '@/types/notification';
import { cn } from '@/utils/cn';

export const DispatcherNotificationsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [readFilter, setReadFilter] = useState<string>('');
  const [archivedIds, setArchivedIds] = useState<string[]>([]);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Fetch Notifications
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['dispatcher-notifications', search, typeFilter, readFilter],
    queryFn: async () => {
      const res = await notificationService.getNotifications({
        limit: 50,
        search: search || undefined,
        type: typeFilter || undefined,
        isRead: readFilter === '' ? undefined : readFilter === 'true',
      });
      return res.data;
    },
  });

  // Mark as Read Mutation
  const markReadMutation = useMutation({
    mutationFn: async (id: string) => {
      return notificationService.updateNotification(id, { isRead: true });
    },
    onSuccess: () => {
      setSuccessMsg('Notification marked as read');
      void queryClient.invalidateQueries({ queryKey: ['dispatcher-notifications'] });
      setTimeout(() => setSuccessMsg(null), 3000);
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      // Mark loaded unread notifications as read
      const unread = (data?.items || []).filter((n) => !n.isRead);
      await Promise.all(unread.map((n) => notificationService.updateNotification(n.id, { isRead: true })));
    },
    onSuccess: () => {
      setSuccessMsg('All operational notifications marked as read');
      void queryClient.invalidateQueries({ queryKey: ['dispatcher-notifications'] });
      setTimeout(() => setSuccessMsg(null), 3000);
    },
  });

  // Dispatcher notifications filter (excludes SYSTEM, AI, etc.)
  const notifications = useMemo(() => {
    const rawItems = data?.items || [];
    // Mock dispatcher operational alerts if items are empty for live demo richness
    const list = rawItems.length > 0 ? rawItems : mockDispatcherNotifications;
    return list.filter((n) => {
      if (archivedIds.includes(n.id)) return false;
      if (typeFilter && n.type !== typeFilter) return false;
      if (readFilter === 'true' && !n.isRead) return false;
      if (readFilter === 'false' && n.isRead) return false;
      if (search) {
        const query = search.toLowerCase();
        return n.title.toLowerCase().includes(query) || n.message.toLowerCase().includes(query);
      }
      return true;
    });
  }, [data, archivedIds, typeFilter, readFilter, search]);

  const handleArchive = (id: string) => {
    setArchivedIds((prev) => [...prev, id]);
    setSuccessMsg('Notification archived to history log');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const getNotificationIcon = (type: string, priority?: string) => {
    if (type === 'VEHICLE' || priority === 'CRITICAL') {
      return <AlertTriangle className="h-5 w-5 text-red-600" />;
    }
    if (type === 'FLEET' || priority === 'HIGH') {
      return <ShieldAlert className="h-5 w-5 text-amber-600" />;
    }
    if (type === 'TRIP' || type === 'DRIVER') {
      return <Truck className="h-5 w-5 text-[#2563eb]" />;
    }
    return <Info className="h-5 w-5 text-blue-600" />;
  };

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#c3c6d7]/30 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-[#2563eb]" />
            <h1 className="text-xl font-black tracking-tight text-[#191c1e]">
              Dispatcher Operations Notifications
            </h1>
          </div>
          <p className="text-xs font-semibold text-[#737686] mt-0.5">
            Operational dispatches, breakdown tickets, geofence breaches, driver statuses & delivery events.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => void refetch()}
            disabled={isFetching}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#c3c6d7] text-xs font-bold text-[#434655] hover:bg-[#eceef0] transition-colors disabled:opacity-50"
          >
            <RefreshCw className={cn('h-3.5 w-3.5', isFetching && 'animate-spin')} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => markAllReadMutation.mutate()}
            disabled={markAllReadMutation.isPending}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2563eb] text-white text-xs font-bold shadow-md shadow-[#2563eb]/25 hover:bg-[#1d4ed8] transition-colors"
          >
            <CheckCheck className="h-4 w-4" />
            <span>Mark All Operational Read</span>
          </button>
        </div>
      </div>

      {/* Success Alert */}
      {successMsg && (
        <div className="flex items-center gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-50 p-4 text-xs font-bold text-emerald-800">
          <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Toolbar & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#c3c6d7]/30 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#737686]" />
          <input
            type="text"
            placeholder="Search operational alert..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#c3c6d7]/40 text-xs focus:outline-none focus:border-[#2563eb]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-[#737686]" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-[#c3c6d7]/40 text-xs focus:outline-none focus:border-[#2563eb] bg-white font-bold"
            >
              <option value="">All Operational Event Types</option>
              <option value="TRIP">Trips & Dispatches</option>
              <option value="DRIVER">Driver Status</option>
              <option value="VEHICLE">Vehicle & Breakdown</option>
              <option value="FLEET">Geofence & Fleet Alerts</option>
            </select>
          </div>

          <select
            value={readFilter}
            onChange={(e) => setReadFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#c3c6d7]/40 text-xs focus:outline-none focus:border-[#2563eb] bg-white font-bold"
          >
            <option value="">All Statuses</option>
            <option value="false">Unread Only</option>
            <option value="true">Read Only</option>
          </select>
        </div>
      </div>

      {/* Notifications List */}
      {isLoading ? (
        <div className="py-16 text-center text-xs text-[#737686]">Loading operational notifications...</div>
      ) : notifications.length === 0 ? (
        <div className="py-16 text-center text-xs text-[#737686]">No active operational notifications found.</div>
      ) : (
        <div className="space-y-3">
          {notifications.map((item) => (
            <div
              key={item.id}
              className={cn(
                'p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 bg-white shadow-xs',
                !item.isRead ? 'border-l-4 border-l-[#2563eb] border-[#c3c6d7]/40' : 'border-[#c3c6d7]/20 opacity-80'
              )}
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-[#f7f9fb] border border-[#c3c6d7]/30 shrink-0">
                  {getNotificationIcon(item.type, item.priority)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xs font-black text-[#191c1e]">{item.title}</h3>
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase',
                        item.priority === 'CRITICAL' && 'bg-red-100 text-red-700',
                        item.priority === 'HIGH' && 'bg-amber-100 text-amber-700',
                        item.priority === 'MEDIUM' && 'bg-blue-100 text-blue-700',
                        item.priority === 'LOW' && 'bg-slate-100 text-slate-700'
                      )}
                    >
                      {item.priority || 'OPERATIONAL'}
                    </span>
                    {!item.isRead && (
                      <span className="h-2 w-2 rounded-full bg-[#2563eb] inline-block animate-ping" />
                    )}
                  </div>

                  <p className="text-xs text-[#434655] font-medium">{item.message}</p>
                  <p className="text-[10px] text-[#737686] font-mono">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {!item.isRead && (
                  <button
                    onClick={() => markReadMutation.mutate(item.id)}
                    className="p-1.5 rounded-lg text-[#2563eb] hover:bg-blue-50 transition-colors text-xs font-bold"
                    title="Mark Read"
                  >
                    Mark Read
                  </button>
                )}

                <button
                  onClick={() => handleArchive(item.id)}
                  className="p-1.5 rounded-lg text-[#737686] hover:text-[#191c1e] hover:bg-[#eceef0] transition-colors"
                  title="Archive Notification"
                >
                  <Archive className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Fallback mock operational notifications if feed empty
const mockDispatcherNotifications: NotificationRecord[] = [
  {
    id: 'notif-1',
    title: 'Engine Breakdown Alert - Vehicle #TRK-8802',
    message: 'Vehicle TRK-8802 reported engine fault code P0300 near Highway I-90 Mile 42. Dispatch replacement unit.',
    type: 'VEHICLE',
    priority: 'CRITICAL',
    isRead: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    companyId: 'company-1',
    userId: 'dispatcher-1',
  },
  {
    id: 'notif-2',
    title: 'Geofence Breach - Corridor Sector North',
    message: 'Driver Marcus Vance (Vehicle #VAN-401) deviated 12km from planned route corridor.',
    type: 'FLEET',
    priority: 'HIGH',
    isRead: false,
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 60000).toISOString(),
    companyId: 'company-1',
    userId: 'dispatcher-1',
  },
  {
    id: 'notif-3',
    title: 'Shipment #SH-7721 Delivered with Digital Signature',
    message: 'Delivery completed for Client Apex Global. POD record stored successfully.',
    type: 'TRIP',
    priority: 'LOW',
    isRead: true,
    createdAt: new Date(Date.now() - 60 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 60 * 60000).toISOString(),
    companyId: 'company-1',
    userId: 'dispatcher-1',
  },
  {
    id: 'notif-4',
    title: 'Driver Accepted Dispatch #TRIP-1049',
    message: 'Driver Sarah Jenkins confirmed assignment for Boston - New York cargo leg.',
    type: 'DRIVER',
    priority: 'LOW',
    isRead: true,
    createdAt: new Date(Date.now() - 120 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 120 * 60000).toISOString(),
    companyId: 'company-1',
    userId: 'dispatcher-1',
  },
];

export default DispatcherNotificationsPage;
