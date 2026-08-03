import React from 'react';
import { Wrench, Fuel, Sparkles, Server, Truck, Check, Trash2 } from 'lucide-react';
import { NotificationRecord } from '@/types/notification';

interface NotificationCardsProps {
  notifications: NotificationRecord[];
  onToggleRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export const NotificationCards: React.FC<NotificationCardsProps> = ({
  notifications,
  onToggleRead,
  onDelete,
}) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'MAINTENANCE':
        return <Wrench className="h-5 w-5 text-amber-500" />;
      case 'FUEL':
        return <Fuel className="h-5 w-5 text-blue-500" />;
      case 'AI':
        return <Sparkles className="h-5 w-5 text-purple-500" />;
      case 'FLEET':
        return <Truck className="h-5 w-5 text-emerald-500" />;
      default:
        return <Server className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-3">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`group rounded-2xl border p-5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs ${
            n.isRead
              ? 'border-border bg-card opacity-80 hover:opacity-100'
              : 'border-primary/40 bg-card/90 ring-1 ring-primary/20 shadow-sm'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-background border border-border">
              {getIcon(n.type)}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground text-sm">{n.title}</span>
                {!n.isRead && (
                  <span className="h-2 w-2 rounded-full bg-rose-500 inline-block" />
                )}
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground uppercase border border-border">
                  {n.priority}
                </span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
              <span className="text-[11px] font-medium text-muted-foreground block pt-1">
                {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(n.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
            <button
              onClick={() => onToggleRead(n.id)}
              className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold transition-colors ${
                n.isRead
                  ? 'border border-border bg-background text-muted-foreground hover:bg-muted'
                  : 'bg-primary/10 text-primary hover:bg-primary/20'
              }`}
            >
              <Check className="h-3.5 w-3.5" />
              {n.isRead ? 'Mark Unread' : 'Mark Read'}
            </button>
            <button
              onClick={() => onDelete(n.id)}
              className="p-2 rounded-xl text-muted-foreground hover:bg-rose-500/10 hover:text-rose-600 transition-colors"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
