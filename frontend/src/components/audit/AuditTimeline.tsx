import React from 'react';
import { Clock, Monitor, ChevronRight } from 'lucide-react';

import type { AuditLogItem } from '@/types/audit';
import { SeverityBadge } from './SeverityBadge';
import { ModuleBadge } from './ModuleBadge';

interface AuditTimelineProps {
  logs: AuditLogItem[];
  onSelectLog: (log: AuditLogItem) => void;
}

export const AuditTimeline: React.FC<AuditTimelineProps> = ({ logs, onSelectLog }) => {
  return (
    <div className="bg-white border border-[#c3c6d7] rounded-2xl p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] font-['Inter'] space-y-6">
      <div className="flex items-center gap-2 border-b border-[#e5eeff] pb-4">
        <Clock className="h-5 w-5 text-[#004ac6]" />
        <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#0b1c30]">
          Activity & Security Event Timeline
        </h3>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#c3c6d7]">
        {logs.map((log) => {
          const isWarning = log.status === 'WARNING' || log.status === 'FAILED';

          return (
            <div key={log.id} className="relative group">
              {/* Timeline Bullet Node */}
              <div
                className={`absolute -left-6 top-1.5 w-5 h-5 rounded-full border-2 bg-white flex items-center justify-center transition-all ${
                  log.severity === 'CRITICAL'
                    ? 'border-red-600 bg-red-100 text-red-600'
                    : isWarning
                      ? 'border-amber-500 bg-amber-100 text-amber-600'
                      : 'border-[#004ac6] bg-[#eff4ff] text-[#004ac6]'
                }`}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-current" />
              </div>

              {/* Timeline Event Card */}
              <div
                onClick={() => onSelectLog(log)}
                className="bg-[#f8f9ff] border border-[#c3c6d7] hover:border-[#004ac6] rounded-2xl p-4 transition-all duration-150 shadow-xs hover:shadow-md cursor-pointer space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ModuleBadge module={log.module} />
                    <SeverityBadge severity={log.severity} />
                    <span className="font-mono text-[11px] font-bold text-[#004ac6] bg-white px-2 py-0.5 rounded border border-[#c3c6d7]">
                      {log.action}
                    </span>
                  </div>

                  <span className="text-[11px] text-[#737686] flex items-center gap-1 font-mono">
                    <Clock className="h-3 w-3" />
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>

                <p className="text-xs text-[#0b1c30] font-medium leading-relaxed">
                  {log.description}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#737686] pt-2 border-t border-[#e5eeff]">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-[#0b1c30]">
                      {log.userName}{' '}
                      <span className="font-normal text-[#737686]">({log.roleName})</span>
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <Monitor className="h-3 w-3" /> {log.ipAddress}
                    </span>
                  </div>

                  <span className="text-[#004ac6] font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                    View Details <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
