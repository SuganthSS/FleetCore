import React from 'react';
import { ShieldCheck, Users, Lock, ChevronRight } from 'lucide-react';
import type { RoleDetail, PermissionCategory } from '@/types/role';
import { RoleBadge } from '@/components/user/RoleBadge';

interface RoleTableProps {
  roles: RoleDetail[];
  onSelectRole: (role: RoleDetail) => void;
}

export const RoleTable: React.FC<RoleTableProps> = ({ roles, onSelectRole }) => {
  return (
    <div className="bg-white border border-[#c3c6d7] rounded-2xl shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] overflow-hidden font-['Inter']">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#eff4ff] border-b border-[#c3c6d7] text-[11px] font-semibold text-[#434655] uppercase tracking-wider">
              <th className="py-3.5 px-4">Role Name</th>
              <th className="py-3.5 px-4">Type</th>
              <th className="py-3.5 px-4">Description</th>
              <th className="py-3.5 px-4">Assigned Users</th>
              <th className="py-3.5 px-4">Module Access</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5eeff] text-xs text-[#0b1c30]">
            {roles.map((role) => {
              const moduleCount = (Object.keys(role.permissions) as PermissionCategory[]).filter(
                (k) => {
                  const actions = role.permissions[k];
                  return actions !== undefined && actions.length > 0;
                }
              ).length;

              return (
                <tr key={role.id} className="hover:bg-[#f8f9ff] transition-colors">
                  <td className="py-3.5 px-4 font-semibold">
                    <RoleBadge roleName={role.name} size="sm" />
                  </td>
                  <td className="py-3.5 px-4">
                    {role.isSystem ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10px] font-semibold border border-purple-200">
                        <Lock className="h-3 w-3" /> System
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200">
                        Custom
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-[#434655] max-w-xs truncate">
                    {role.description || 'N/A'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 font-semibold text-[#004ac6]">
                      <Users className="h-3.5 w-3.5 text-[#004ac6]" /> {role.assignedUsersCount || 0}{' '}
                      users
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-1 rounded bg-[#eff4ff] text-[#004ac6] font-semibold text-[11px]">
                      {moduleCount} Modules
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onSelectRole(role)}
                      className="px-3 py-1.5 rounded-xl border border-[#c3c6d7] bg-white text-[#004ac6] font-semibold text-xs hover:bg-[#eff4ff] hover:border-[#004ac6] transition-colors inline-flex items-center gap-1"
                    >
                      <ShieldCheck className="h-3.5 w-3.5" /> Details <ChevronRight className="h-3 w-3" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
