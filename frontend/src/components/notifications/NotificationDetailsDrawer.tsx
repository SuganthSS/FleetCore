import React from 'react';
import { X, Bell, Mail, MailOpen, Terminal } from 'lucide-react';

import type { NotificationRecord } from '@/types/notification';
import { NotificationPriorityBadge } from './NotificationPriorityBadge';
import { NotificationTypeBadge } from './NotificationTypeBadge';

interface NotificationDetailsDrawerProps {
  record: NotificationRecord | null;
  open: boolean;
  onClose: () => void;
}

export const NotificationDetailsDrawer: React.FC<NotificationDetailsDrawerProps> = ({
  record,
  open,
  onClose,
}) => {
  if (!open || !record) return null;

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  // Safe prettification of JSON metadata
  const renderMetadata = (meta: any) => {
    if (!meta) return null;
    try {
      const parsedObj = typeof meta === 'string' ? JSON.parse(meta) : meta;
      if (Object.keys(parsedObj).length === 0) return null;
      return JSON.stringify(parsedObj, null, 2);
    } catch {
      return null;
    }
  };

  const prettifiedMetadata = renderMetadata(record.metadata);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
        {/* Drawer Panel */}
        <div className="pointer-events-auto w-screen max-w-md transform bg-card shadow-2xl transition-all duration-300 border-l border-border flex flex-col h-full animate-slide-in">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-6 py-5">
            <div>
              <h2 className="text-base font-bold text-foreground">
                Notification Log Details
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                ID: {record.id}
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Close details panel"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Details Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Core Message Block */}
            <div className="rounded-xl border border-border p-4 bg-muted/20 space-y-3">
              <div className="flex items-start gap-2.5">
                <Bell className={`h-5 w-5 shrink-0 mt-0.5 ${record.isRead ? 'text-muted-foreground' : 'text-primary'}`} />
                <div>
                  <h3 className="text-sm font-bold text-foreground leading-snug">
                    {record.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 whitespace-pre-wrap leading-relaxed">
                    {record.message}
                  </p>
                </div>
              </div>
            </div>

            {/* Categorization & Priority */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border p-3 bg-card text-center">
                <span className="block text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Type Domain
                </span>
                <NotificationTypeBadge type={record.type} />
              </div>
              <div className="rounded-xl border border-border p-3 bg-card text-center">
                <span className="block text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Priority level
                </span>
                <NotificationPriorityBadge priority={record.priority} />
              </div>
            </div>

            {/* Recipient User Profile */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Recipient Details
              </h4>
              <div className="rounded-xl border border-border p-4 bg-card text-xs space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-semibold">User Fullname</span>
                  <span className="font-bold text-foreground">
                    {record.user ? `${record.user.firstName} ${record.user.lastName}` : '—'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-semibold">User Email</span>
                  <span className="font-semibold text-foreground">
                    {record.user?.email || '—'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-semibold">Department</span>
                  <span className="font-semibold text-foreground">
                    {record.user?.department || 'Operations'}
                  </span>
                </div>
                <div className="flex justify-between border-t border-border/60 pt-2">
                  <span className="text-muted-foreground font-semibold">Organization</span>
                  <span className="font-bold text-primary">
                    {record.company?.name || 'FleetCore Client'}
                  </span>
                </div>
              </div>
            </div>

            {/* Read status & dates */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Auditing Timestamps
              </h4>
              <div className="rounded-xl border border-border p-4 bg-card text-xs space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-semibold">Read Status</span>
                  {record.isRead ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-muted text-muted-foreground border border-border">
                      <MailOpen className="h-3 w-3" /> Read
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/15 text-primary border border-primary/25">
                      <Mail className="h-3 w-3" /> Unread
                    </span>
                  )}
                </div>
                {record.isRead && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-semibold">Read DateTime</span>
                    <span className="font-bold text-foreground">{formatDate(record.readAt)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-semibold">Logged Date</span>
                  <span className="font-bold text-foreground">{formatDate(record.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-semibold">Last Modified</span>
                  <span className="font-semibold text-foreground">{formatDate(record.updatedAt)}</span>
                </div>
              </div>
            </div>

            {/* Pretty JSON Metadata */}
            {prettifiedMetadata && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="h-4 w-4 text-primary" />
                  Additional JSON Metadata
                </h4>
                <div className="rounded-xl border border-border p-3.5 bg-slate-900 text-slate-100 font-mono text-[10.5px] overflow-x-auto shadow-inner leading-relaxed">
                  <pre className="whitespace-pre">{prettifiedMetadata}</pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default NotificationDetailsDrawer;
