import React from 'react';
import { Clock, Calendar, Mail, CheckCircle2, PauseCircle, Plus } from 'lucide-react';

export interface ScheduledReport {
  id: string;
  reportName: string;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  recipients: string[];
  nextRun: string;
  status: 'ACTIVE' | 'PAUSED';
  format: 'CSV' | 'PDF' | 'EXCEL';
}

interface ScheduledReportsCardProps {
  schedules: ScheduledReport[];
  onToggleStatus: (id: string) => void;
  onCreateSchedule: () => void;
}

export const ScheduledReportsCard: React.FC<ScheduledReportsCardProps> = ({
  schedules,
  onToggleStatus,
  onCreateSchedule,
}) => {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-2xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Scheduled Automated Reports</h3>
            <p className="text-xs text-muted-foreground">
              Automated recurring emails sent to fleet managers and executive stakeholders.
            </p>
          </div>
        </div>
        <button
          onClick={onCreateSchedule}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-input bg-card text-foreground font-bold text-xs hover:bg-muted transition-colors shadow-2xs"
        >
          <Plus className="h-3.5 w-3.5 text-primary" />
          Add Schedule
        </button>
      </div>

      <div className="space-y-2.5">
        {schedules.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-background/60 hover:bg-muted/30 transition-colors text-xs"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground">{item.reportName}</span>
                <span className="px-2 py-0.5 rounded-md bg-muted font-mono text-[10px] font-bold text-muted-foreground">
                  {item.frequency}
                </span>
                <span className="px-1.5 py-0.5 rounded-md bg-primary/10 text-primary font-mono text-[10px] font-bold">
                  {item.format}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-mono">
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3 text-primary" />
                  {item.recipients.length} Recipient(s)
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-emerald-500" />
                  Next Run: {item.nextRun}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleStatus(item.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                  item.status === 'ACTIVE'
                    ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20'
                }`}
              >
                {item.status === 'ACTIVE' ? (
                  <>
                    <CheckCircle2 className="h-3 w-3" /> Active
                  </>
                ) : (
                  <>
                    <PauseCircle className="h-3 w-3" /> Paused
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduledReportsCard;
