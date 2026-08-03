import React from 'react';
import { ShieldCheck, Users, Lock, Key } from 'lucide-react';
import type { RoleDetail } from '@/types/role';

interface RoleHeaderProps {
  roles: RoleDetail[];
}

export const RoleHeader: React.FC<RoleHeaderProps> = ({ roles }) => {
  const totalRoles = roles.length;
  const systemRoles = roles.filter((r) => r.isSystem).length;
  const totalAssignedUsers = roles.reduce((sum, r) => sum + (r.assignedUsersCount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#004ac6] text-white shadow-sm">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-['Plus_Jakarta_Sans'] text-2xl font-extrabold text-[#0b1c30] tracking-tight">
                Roles & Permissions
              </h1>
              <p className="font-['Inter'] text-xs text-[#737686] mt-0.5">
                Manage enterprise role-based access controls, capabilities, and system security privileges.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-['Inter']">
        <div className="bg-white border border-[#c3c6d7] rounded-2xl p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-[#eff4ff] text-[#004ac6]">
            <Key className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-[#737686] uppercase tracking-wider">
              Total Defined Roles
            </p>
            <h3 className="font-['Plus_Jakarta_Sans'] text-xl font-extrabold text-[#0b1c30]">
              {totalRoles}
            </h3>
          </div>
        </div>

        <div className="bg-white border border-[#c3c6d7] rounded-2xl p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-[#737686] uppercase tracking-wider">
              System Core Roles
            </p>
            <h3 className="font-['Plus_Jakarta_Sans'] text-xl font-extrabold text-[#0b1c30]">
              {systemRoles}
            </h3>
          </div>
        </div>

        <div className="bg-white border border-[#c3c6d7] rounded-2xl p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-[#737686] uppercase tracking-wider">
              Active User Assignments
            </p>
            <h3 className="font-['Plus_Jakarta_Sans'] text-xl font-extrabold text-[#0b1c30]">
              {totalAssignedUsers}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};
