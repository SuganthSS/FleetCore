import React from 'react';
import { ShieldCheck } from 'lucide-react';
import type { RoleDetail } from '@/types/role';


interface PermissionMatrixProps {
  roles: RoleDetail[];
  categories: string[];
  actions: string[];
  onTogglePermission?: (roleId: string, category: string, action: string) => void;
  isEditable?: boolean;
}

export const PermissionMatrix: React.FC<PermissionMatrixProps> = ({
  roles,
  categories,
  actions,
  onTogglePermission,
  isEditable = false,
}) => {
  return (
    <div className="bg-white border border-[#c3c6d7] rounded-2xl shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] overflow-hidden font-['Inter']">
      <div className="p-5 border-b border-[#e5eeff] bg-[#f8f9ff] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-[#004ac6]" />
          <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#0b1c30]">
            Enterprise Access Control Matrix
          </h3>
        </div>
        <span className="text-xs text-[#737686]">
          Showing {roles.length} roles across {categories.length} module categories
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-[#eff4ff] border-b border-[#c3c6d7] text-[11px] font-semibold text-[#434655] uppercase tracking-wider">
              <th className="py-3 px-4 w-48 sticky left-0 bg-[#eff4ff] z-10 border-r border-[#c3c6d7]">
                Module Category
              </th>
              {roles.map((r) => (
                <th key={r.id} className="py-3 px-4 text-center border-r border-[#c3c6d7] min-w-[120px]">
                  <span className="font-bold text-[#0b1c30] block">{r.name}</span>
                  <span className="text-[10px] text-[#737686] normal-case font-normal">
                    ({r.assignedUsersCount} users)
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5eeff] text-xs text-[#0b1c30]">
            {categories.map((category) => (
              <tr key={category} className="hover:bg-[#f8f9ff] transition-colors">
                <td className="py-3 px-4 font-semibold text-[#0b1c30] sticky left-0 bg-white hover:bg-[#f8f9ff] z-10 border-r border-[#c3c6d7] shadow-xs">
                  {category}
                </td>

                {roles.map((role) => {
                  const grantedActions: string[] = role.permissions[category] || [];


                  return (
                    <td
                      key={`${role.id}-${category}`}
                      className="py-2.5 px-3 text-center border-r border-[#e5eeff] align-top"
                    >
                      <div className="flex flex-wrap items-center justify-center gap-1">
                        {actions.map((act) => {
                          const isGranted = grantedActions.includes(act);
                          const isFull = grantedActions.includes('Manage');
                          const active = isGranted || isFull;

                          return (
                            <button
                              key={act}
                              disabled={!isEditable || role.name === 'Administrator'}
                              onClick={() => onTogglePermission?.(role.id, category, act)}
                              title={`${role.name} - ${category}: ${act} (${active ? 'Allowed' : 'Denied'})`}
                              className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-all ${
                                active
                                  ? 'bg-emerald-100 text-emerald-800 font-bold border border-emerald-300'
                                  : 'bg-slate-100 text-slate-400 border border-slate-200'
                              } ${isEditable && role.name !== 'Administrator' ? 'cursor-pointer hover:scale-105' : 'cursor-default'}`}
                            >
                              {act.slice(0, 3)}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
