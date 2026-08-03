import React from 'react';
import { ShieldAlert, Activity, FileCheck, Lock } from 'lucide-react';
import type { AuditLogItem } from '@/types/audit';

interface AuditHeaderProps {
  totalCount: number;
  logs: AuditLogItem[];
  onExport: () => void;
}

export const AuditHeader: React.FC<AuditHeaderProps> = ({ totalCount, logs, onExport }) => {
  const criticalCount = logs.filter((l) => l.severity === 'CRITICAL' || l.severity === 'HIGH').length;
  const warningCount = logs.filter((l) => l.status === 'WARNING' || l.status === 'FAILED').length;

  return (
    <div className="space-y-4 font-['Inter']">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#0b1c30]">
              Enterprise Audit Logs
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-xs font-bold border border-purple-300 flex items-center gap-1">
              <Lock className="h-3 w-3" /> Administrator Portal
            </span>
          </div>
          <p className="text-xs text-[#737686] mt-1">
            System activity, role modifications, security events, and audit history.
          </p>
        </div>

        <button
          onClick={onExport}
          className="px-4 h-10 rounded-xl bg-[#004ac6] text-white text-xs font-semibold hover:bg-[#003ea8] transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
        >
          <FileCheck className="h-4 w-4" /> Export CSV Ledger
        </button>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#c3c6d7] rounded-2xl p-4 flex items-center justify-between shadow-[0_1px_3px_0_rgba(0,0,0,0.05)]">
          <div>
            <span className="text-[11px] text-[#737686] font-medium block">Total Logged Events</span>
            <span className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-[#0b1c30]">
              {totalCount}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-[#eff4ff] text-[#004ac6]">
            <Activity className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white border border-[#c3c6d7] rounded-2xl p-4 flex items-center justify-between shadow-[0_1px_3px_0_rgba(0,0,0,0.05)]">
          <div>
            <span className="text-[11px] text-[#737686] font-medium block">High / Critical Alerts</span>
            <span className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-red-600">
              {criticalCount}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-red-50 text-red-600">
            <ShieldAlert className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white border border-[#c3c6d7] rounded-2xl p-4 flex items-center justify-between shadow-[0_1px_3px_0_rgba(0,0,0,0.05)]">
          <div>
            <span className="text-[11px] text-[#737686] font-medium block">Failed / Warning Events</span>
            <span className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-amber-600">
              {warningCount}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
            <Lock className="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  );
};
