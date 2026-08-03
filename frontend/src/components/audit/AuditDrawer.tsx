import React from 'react';
import { X, ShieldAlert, Monitor, User, FileText, Code2 } from 'lucide-react';

import type { AuditLogItem } from '@/types/audit';
import { SeverityBadge } from './SeverityBadge';
import { ModuleBadge } from './ModuleBadge';

interface AuditDrawerProps {
  log: AuditLogItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AuditDrawer: React.FC<AuditDrawerProps> = ({ log, isOpen, onClose }) => {
  if (!isOpen || !log) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-['Inter']">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-[#e5eeff] bg-[#f8f9ff] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#004ac6] text-white">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#0b1c30]">
                  Audit Event Inspection
                </h3>
                <span className="font-mono text-xs text-[#737686]">ID: {log.id}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#737686] hover:bg-[#eff4ff] hover:text-[#0b1c30] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
            {/* Top Badge Summary */}
            <div className="flex items-center justify-between p-4 bg-[#eff4ff] border border-[#b4c5ff] rounded-2xl">
              <div className="space-y-1">
                <span className="text-[10px] text-[#737686] uppercase font-bold tracking-wider block">
                  Category & Action
                </span>
                <div className="flex items-center gap-2">
                  <ModuleBadge module={log.module} />
                  <span className="font-mono font-bold text-[#004ac6]">{log.action}</span>
                </div>
              </div>
              <SeverityBadge severity={log.severity} />
            </div>

            {/* Event Description Box */}
            <div className="space-y-2">
              <h4 className="font-semibold text-[#0b1c30] flex items-center gap-1.5 text-xs">
                <FileText className="h-4 w-4 text-[#004ac6]" /> Event Description
              </h4>
              <div className="p-4 bg-[#f8f9ff] border border-[#c3c6d7] rounded-xl text-[#0b1c30] leading-relaxed font-medium">
                {log.description}
              </div>
            </div>

            {/* User & Actor Metadata */}
            <div className="space-y-3">
              <h4 className="font-semibold text-[#0b1c30] flex items-center gap-1.5 text-xs">
                <User className="h-4 w-4 text-[#004ac6]" /> Actor Details
              </h4>
              <div className="grid grid-cols-2 gap-3 p-4 border border-[#c3c6d7] rounded-xl bg-white">
                <div>
                  <span className="text-[10px] text-[#737686] block">User Name</span>
                  <span className="font-semibold text-[#0b1c30]">{log.userName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#737686] block">User Email</span>
                  <span className="font-mono text-[#0b1c30]">{log.userEmail || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#737686] block">Assigned Role</span>
                  <span className="font-semibold text-[#004ac6]">{log.roleName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#737686] block">Execution Status</span>
                  <span
                    className={`font-bold ${
                      log.status === 'SUCCESS'
                        ? 'text-emerald-700'
                        : log.status === 'WARNING'
                          ? 'text-amber-700'
                          : 'text-red-700'
                    }`}
                  >
                    {log.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Network & Device Info */}
            <div className="space-y-3">
              <h4 className="font-semibold text-[#0b1c30] flex items-center gap-1.5 text-xs">
                <Monitor className="h-4 w-4 text-[#004ac6]" /> Client Environment
              </h4>
              <div className="space-y-2 p-4 border border-[#c3c6d7] rounded-xl bg-white font-mono text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-[#737686]">IP Address:</span>
                  <span className="font-bold text-[#0b1c30]">{log.ipAddress}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#737686]">Recorded At:</span>
                  <span className="text-[#0b1c30]">{new Date(log.timestamp).toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-[#e5eeff]">
                  <span className="text-[#737686] block mb-1">User Agent / Device:</span>
                  <span className="text-[#0b1c30] break-all">{log.device}</span>
                </div>
              </div>
            </div>

            {/* JSON Payload Metadata */}
            {log.metadata && Object.keys(log.metadata).length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-[#0b1c30] flex items-center gap-1.5 text-xs">
                  <Code2 className="h-4 w-4 text-[#004ac6]" /> Context Metadata Payload
                </h4>
                <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-[11px] overflow-x-auto">
                  {JSON.stringify(log.metadata, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-[#e5eeff] bg-[#f8f9ff] flex justify-end">
            <button
              onClick={onClose}
              className="px-5 h-9 rounded-xl bg-[#004ac6] text-white text-xs font-semibold hover:bg-[#003ea8] transition-colors"
            >
              Close Inspection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
