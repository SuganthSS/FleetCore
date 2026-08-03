import React from 'react';
import { MaintenanceStatus } from '@/types/maintenance';
import { Clock, CheckCircle2, AlertTriangle, Calendar, XCircle } from 'lucide-react';

interface MaintenanceStatusBadgeProps {
  status: MaintenanceStatus;
}

export const MaintenanceStatusBadge: React.FC<MaintenanceStatusBadgeProps> = ({ status }) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'SCHEDULED':
        return {
          label: 'Scheduled',
          icon: Calendar,
          className: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
        };
      case 'IN_PROGRESS':
        return {
          label: 'In Progress',
          icon: Clock,
          className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
        };
      case 'COMPLETED':
        return {
          label: 'Completed',
          icon: CheckCircle2,
          className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        };
      case 'OVERDUE':
        return {
          label: 'Overdue',
          icon: AlertTriangle,
          className: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
        };
      case 'CANCELLED':
        return {
          label: 'Cancelled',
          icon: XCircle,
          className: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
        };
      default:
        return {
          label: status,
          icon: Clock,
          className: 'bg-muted text-muted-foreground border-border',
        };
    }
  };

  const style = getBadgeStyle();
  const Icon = style.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${style.className}`}
    >
      <Icon className="h-3 w-3" />
      {style.label}
    </span>
  );
};

export const MaintenancePriorityBadge: React.FC<{ type: string }> = ({ type }) => {
  const isEmergency = type === 'EMERGENCY';
  const isCorrective = type === 'CORRECTIVE';

  const badgeClass = isEmergency
    ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30'
    : isCorrective
    ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
    : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';

  const priorityLabel = isEmergency ? 'CRITICAL' : isCorrective ? 'HIGH' : 'NORMAL';

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black border font-mono tracking-wider ${badgeClass}`}>
      {priorityLabel}
    </span>
  );
};

export default MaintenanceStatusBadge;
