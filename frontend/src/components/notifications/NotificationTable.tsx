import React from 'react';
import { Eye, Edit2, Trash2, ArrowUpDown, Calendar, Bell, MailOpen, Mail } from 'lucide-react';
import type { NotificationRecord } from '@/types/notification';
import { NotificationPriorityBadge } from './NotificationPriorityBadge';
import { NotificationTypeBadge } from './NotificationTypeBadge';

interface NotificationTableProps {
  records: NotificationRecord[];
  onView: (record: NotificationRecord) => void;
  onEdit: (record: NotificationRecord) => void;
  onDelete: (id: string) => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSort: (field: string) => void;
}

export const NotificationTable: React.FC<NotificationTableProps> = ({
  records,
  onView,
  onEdit,
  onDelete,
  sortBy,
  sortOrder,
  onSort,
}) => {
  const renderSortIndicator = (field: string) => {
    if (sortBy !== field) return <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-40" />;
    return (
      <ArrowUpDown className={`ml-1.5 h-3.5 w-3.5 text-primary ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
    );
  };

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30 sticky top-0 z-10">
              <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                Title
              </th>
              <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                Recipient User
              </th>
              <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                Type
              </th>
              <th
                onClick={() => onSort('priority')}
                className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px] cursor-pointer hover:text-foreground select-none"
              >
                <div className="flex items-center">
                  Priority
                  {renderSortIndicator('priority')}
                </div>
              </th>
              <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                Read Status
              </th>
              <th
                onClick={() => onSort('createdAt')}
                className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px] cursor-pointer hover:text-foreground select-none"
              >
                <div className="flex items-center">
                  Created
                  {renderSortIndicator('createdAt')}
                </div>
              </th>
              <th
                onClick={() => onSort('readAt')}
                className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px] cursor-pointer hover:text-foreground select-none"
              >
                <div className="flex items-center">
                  Read At
                  {renderSortIndicator('readAt')}
                </div>
              </th>
              <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px] text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {records.map((record) => {
              const isUnread = !record.isRead;
              return (
                <tr
                  key={record.id}
                  className={`transition-colors group ${
                    isUnread
                      ? 'bg-primary/5 hover:bg-primary/10 font-medium'
                      : 'text-muted-foreground hover:bg-muted/30'
                  }`}
                >
                  {/* Title & icon */}
                  <td className="p-4 text-xs font-bold text-foreground">
                    <span className="flex items-center gap-2">
                      {isUnread ? (
                        <Bell className="h-4 w-4 text-primary shrink-0 animate-bounce" />
                      ) : (
                        <Bell className="h-4 w-4 text-muted-foreground shrink-0" />
                      )}
                      <div className="truncate max-w-[200px]" title={record.title}>
                        {record.title}
                      </div>
                    </span>
                  </td>

                  {/* Recipient User */}
                  <td className="p-4 text-xs font-semibold whitespace-nowrap">
                    {record.user ? (
                      <span className="text-foreground">
                        {record.user.firstName} {record.user.lastName}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>

                  {/* Type */}
                  <td className="p-4 whitespace-nowrap">
                    <NotificationTypeBadge type={record.type} />
                  </td>

                  {/* Priority */}
                  <td className="p-4 whitespace-nowrap">
                    <NotificationPriorityBadge priority={record.priority} />
                  </td>

                  {/* Status (Read / Unread) */}
                  <td className="p-4 whitespace-nowrap">
                    {isUnread ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/15 text-primary border border-primary/25">
                        <Mail className="h-3 w-3" />
                        Unread
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-muted text-muted-foreground border border-border">
                        <MailOpen className="h-3 w-3" />
                        Read
                      </span>
                    )}
                  </td>

                  {/* Created */}
                  <td className="p-4 text-xs whitespace-nowrap">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      {formatDate(record.createdAt)}
                    </span>
                  </td>

                  {/* Read At */}
                  <td className="p-4 text-xs whitespace-nowrap">
                    {formatDate(record.readAt)}
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onView(record)}
                        className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        title="View Details"
                        aria-label="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEdit(record)}
                        className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        title="Edit Notification"
                        aria-label="Edit Notification"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(record.id)}
                        className="rounded-lg p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        title="Delete Notification"
                        aria-label="Delete Notification"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default NotificationTable;
