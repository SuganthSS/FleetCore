import React from 'react';
import { Clock, CheckCircle2, Calendar, Wrench } from 'lucide-react';
import type { MaintenanceRecord } from '@/types/maintenance';

interface MaintenanceTimelineProps {
  record: MaintenanceRecord;
}

export const MaintenanceTimeline: React.FC<MaintenanceTimelineProps> = ({ record }) => {
  const isCompleted = record.status === 'COMPLETED';
  const isInProgress = record.status === 'IN_PROGRESS';
  const isOverdue = record.status === 'OVERDUE';

  const events = [
    {
      id: 'scheduled',
      title: 'Service Scheduled',
      date: new Date(record.scheduledDate).toLocaleString(),
      status: 'done',
      icon: Calendar,
      description: `Work order created for ${record.serviceProvider || 'designated technician'}.`,
    },
    {
      id: 'in_progress',
      title: 'Service Bay Inspection & Repair',
      date: isInProgress || isCompleted ? new Date(record.updatedAt).toLocaleString() : 'Pending',
      status: isCompleted ? 'done' : isInProgress ? 'current' : isOverdue ? 'warning' : 'pending',
      icon: Wrench,
      description: record.description || 'Active mechanic diagnosis and component replacements.',
    },
    {
      id: 'completed',
      title: 'Work Order Sign-Off & Quality Audit',
      date: record.completedDate ? new Date(record.completedDate).toLocaleString() : 'Pending Completion',
      status: isCompleted ? 'done' : 'pending',
      icon: CheckCircle2,
      description: isCompleted
        ? 'Technician verified repair completion and returned vehicle to active fleet.'
        : 'Final safety validation and road test sign-off pending.',
    },
  ];

  return (
    <div className="space-y-4">
      <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
        <Clock className="h-3.5 w-3.5 text-primary" />
        Maintenance Activity Timeline
      </h4>
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
        {events.map((event) => {
          const Icon = event.icon;
          const isDone = event.status === 'done';
          const isCurrent = event.status === 'current';
          const isWarning = event.status === 'warning';

          const iconBg = isDone
            ? 'bg-emerald-500 text-white ring-4 ring-emerald-500/10'
            : isCurrent
            ? 'bg-amber-500 text-white ring-4 ring-amber-500/10'
            : isWarning
            ? 'bg-rose-500 text-white ring-4 ring-rose-500/10'
            : 'bg-muted text-muted-foreground border border-border';

          return (
            <div key={event.id} className="relative group">
              <div className={`absolute -left-6 top-0.5 h-5 w-5 rounded-full flex items-center justify-center text-[10px] ${iconBg}`}>
                <Icon className="h-3 w-3" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-foreground">{event.title}</h5>
                  <span className="text-[10px] font-mono text-muted-foreground">{event.date}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{event.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MaintenanceTimeline;
