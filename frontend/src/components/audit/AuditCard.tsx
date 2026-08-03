import React from 'react';
import { Clock, Monitor, User } from 'lucide-react';

import type { AuditLogItem } from '@/types/audit';
import { SeverityBadge } from './SeverityBadge';
import { ModuleBadge } from './ModuleBadge';

interface AuditCardProps {
  log: AuditLogItem;
  onSelect: (log: AuditLogItem) => void;
}

export const AuditCard: React.FC<AuditCardProps> = ({ log, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(log)}
      className="bg-white border border-[#c3c6d7] hover:border-[#004ac6] rounded-2xl p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] hover:shadow-md transition-all duration-150 cursor-pointer font-['Inter'] flex flex-col justify-between space-y-4"
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <ModuleBadge module={log.module} />
          <SeverityBadge severity={log.severity} />
        </div>

        <div>
          <span className="font-mono text-xs font-bold text-[#004ac6] block">{log.action}</span>
          <p className="text-xs text-[#0b1c30] font-medium leading-relaxed mt-1 line-clamp-2">
            {log.description}
          </p>
        </div>
      </div>

      <div className="pt-3 border-t border-[#e5eeff] space-y-2 text-xs">
        <div className="flex items-center justify-between text-[#737686]">
          <span className="flex items-center gap-1 font-medium text-[#0b1c30]">
            <User className="h-3.5 w-3.5 text-[#004ac6]" /> {log.userName}
          </span>
          <span className="text-[10px] bg-[#f8f9ff] px-2 py-0.5 rounded border border-[#c3c6d7] font-semibold text-[#434655]">
            {log.roleName}
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px] text-[#737686]">
          <span className="flex items-center gap-1 font-mono">
            <Clock className="h-3 w-3" /> {new Date(log.timestamp).toLocaleTimeString()}
          </span>
          <span className="flex items-center gap-1 font-mono text-[10px]">
            <Monitor className="h-3 w-3" /> {log.ipAddress}
          </span>
        </div>
      </div>
    </div>
  );
};
