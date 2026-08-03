import React from 'react';
import { Clock, ChevronRight } from 'lucide-react';

import type { AuditLogItem } from '@/types/audit';
import { SeverityBadge } from './SeverityBadge';
import { ModuleBadge } from './ModuleBadge';

interface AuditTableProps {
  logs: AuditLogItem[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (column: 'timestamp' | 'userName' | 'roleName' | 'module' | 'action' | 'severity') => void;
  onSelectLog: (log: AuditLogItem) => void;
}

export const AuditTable: React.FC<AuditTableProps> = ({
  logs,
  sortBy,
  sortOrder,
  onSortChange,
  onSelectLog,
}) => {
  const renderSortIndicator = (column: string) => {
    if (sortBy !== column) return null;
    return <span className="ml-1 text-[#004ac6]">{sortOrder === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div className="bg-white border border-[#c3c6d7] rounded-2xl shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] overflow-hidden font-['Inter']">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#eff4ff] border-b border-[#c3c6d7] text-[11px] font-semibold text-[#434655] uppercase tracking-wider select-none">
              <th
                onClick={() => onSortChange('timestamp')}
                className="py-3.5 px-4 cursor-pointer hover:bg-[#e5eeff]"
              >
                Timestamp {renderSortIndicator('timestamp')}
              </th>
              <th
                onClick={() => onSortChange('userName')}
                className="py-3.5 px-4 cursor-pointer hover:bg-[#e5eeff]"
              >
                User & Role {renderSortIndicator('userName')}
              </th>
              <th
                onClick={() => onSortChange('module')}
                className="py-3.5 px-4 cursor-pointer hover:bg-[#e5eeff]"
              >
                Module {renderSortIndicator('module')}
              </th>
              <th
                onClick={() => onSortChange('action')}
                className="py-3.5 px-4 cursor-pointer hover:bg-[#e5eeff]"
              >
                Action {renderSortIndicator('action')}
              </th>
              <th
                onClick={() => onSortChange('severity')}
                className="py-3.5 px-4 cursor-pointer hover:bg-[#e5eeff]"
              >
                Severity {renderSortIndicator('severity')}
              </th>
              <th className="py-3.5 px-4">Description</th>
              <th className="py-3.5 px-4 text-right">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5eeff] text-xs text-[#0b1c30]">
            {logs.map((log) => (
              <tr
                key={log.id}
                onClick={() => onSelectLog(log)}
                className="hover:bg-[#f8f9ff] transition-colors cursor-pointer"
              >
                <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px] text-[#434655]">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-[#737686]" />
                    {new Date(log.timestamp).toLocaleString()}
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-[#0b1c30]">{log.userName}</div>
                  <div className="text-[10px] text-[#737686]">{log.roleName}</div>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <ModuleBadge module={log.module} />
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap font-mono font-bold text-[#004ac6]">
                  {log.action}
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <SeverityBadge severity={log.severity} />
                </td>
                <td className="py-3.5 px-4 max-w-sm truncate text-[#434655]" title={log.description}>
                  {log.description}
                </td>
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <button className="px-2.5 py-1 rounded-lg border border-[#c3c6d7] bg-white text-[#004ac6] font-semibold text-[11px] hover:bg-[#eff4ff] transition-colors inline-flex items-center gap-1">
                    Details <ChevronRight className="h-3 w-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
