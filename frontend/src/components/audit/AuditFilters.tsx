import React from 'react';
import { Calendar } from 'lucide-react';
import type { AuditMetaResponse } from '@/types/audit';

interface AuditFiltersProps {
  isOpen: boolean;
  meta: AuditMetaResponse | undefined;
  selectedModule: string;
  selectedSeverity: string;
  selectedRole: string;
  selectedStatus: string;
  selectedUser: string;
  startDate: string;
  endDate: string;
  onModuleChange: (val: string) => void;
  onSeverityChange: (val: string) => void;
  onRoleChange: (val: string) => void;
  onStatusChange: (val: string) => void;
  onUserChange: (val: string) => void;
  onStartDateChange: (val: string) => void;
  onEndDateChange: (val: string) => void;
}

export const AuditFilters: React.FC<AuditFiltersProps> = ({
  isOpen,
  meta,
  selectedModule,
  selectedSeverity,
  selectedRole,
  selectedStatus,
  selectedUser,
  startDate,
  endDate,
  onModuleChange,
  onSeverityChange,
  onRoleChange,
  onStatusChange,
  onUserChange,
  onStartDateChange,
  onEndDateChange,
}) => {
  if (!isOpen) return null;

  return (
    <div className="bg-[#f8f9ff] border border-[#c3c6d7] rounded-2xl p-4 space-y-4 font-['Inter'] shadow-xs animate-fadeIn">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[#0b1c30] uppercase tracking-wider">
          Advanced Audit Filters
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        {/* Module Filter */}
        <div className="space-y-1">
          <label className="text-[#737686] font-medium">Module Category</label>
          <select
            value={selectedModule}
            onChange={(e) => onModuleChange(e.target.value)}
            className="w-full h-9 rounded-xl border border-[#c3c6d7] bg-white px-3 text-[#0b1c30] focus:outline-none focus:border-[#004ac6]"
          >
            <option value="">All Modules</option>
            {meta?.modules.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Severity Filter */}
        <div className="space-y-1">
          <label className="text-[#737686] font-medium">Severity Level</label>
          <select
            value={selectedSeverity}
            onChange={(e) => onSeverityChange(e.target.value)}
            className="w-full h-9 rounded-xl border border-[#c3c6d7] bg-white px-3 text-[#0b1c30] focus:outline-none focus:border-[#004ac6]"
          >
            <option value="">All Severities</option>
            {meta?.severities.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Role Filter */}
        <div className="space-y-1">
          <label className="text-[#737686] font-medium">Role Filter</label>
          <select
            value={selectedRole}
            onChange={(e) => onRoleChange(e.target.value)}
            className="w-full h-9 rounded-xl border border-[#c3c6d7] bg-white px-3 text-[#0b1c30] focus:outline-none focus:border-[#004ac6]"
          >
            <option value="">All Roles</option>
            {meta?.roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="space-y-1">
          <label className="text-[#737686] font-medium">Execution Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full h-9 rounded-xl border border-[#c3c6d7] bg-white px-3 text-[#0b1c30] focus:outline-none focus:border-[#004ac6]"
          >
            <option value="">All Statuses</option>
            <option value="SUCCESS">SUCCESS</option>
            <option value="WARNING">WARNING</option>
            <option value="FAILED">FAILED</option>
          </select>
        </div>

        {/* User Filter */}
        <div className="space-y-1">
          <label className="text-[#737686] font-medium">User Account</label>
          <select
            value={selectedUser}
            onChange={(e) => onUserChange(e.target.value)}
            className="w-full h-9 rounded-xl border border-[#c3c6d7] bg-white px-3 text-[#0b1c30] focus:outline-none focus:border-[#004ac6]"
          >
            <option value="">All Users</option>
            {meta?.users.map((u) => (
              <option key={u} value={u.split(' (')[0]}>
                {u}
              </option>
            ))}
          </select>
        </div>

        {/* Start Date */}
        <div className="space-y-1">
          <label className="text-[#737686] font-medium flex items-center gap-1">
            <Calendar className="h-3 w-3" /> Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="w-full h-9 rounded-xl border border-[#c3c6d7] bg-white px-3 text-[#0b1c30] focus:outline-none focus:border-[#004ac6]"
          />
        </div>

        {/* End Date */}
        <div className="space-y-1">
          <label className="text-[#737686] font-medium flex items-center gap-1">
            <Calendar className="h-3 w-3" /> End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="w-full h-9 rounded-xl border border-[#c3c6d7] bg-white px-3 text-[#0b1c30] focus:outline-none focus:border-[#004ac6]"
          />
        </div>
      </div>
    </div>
  );
};
