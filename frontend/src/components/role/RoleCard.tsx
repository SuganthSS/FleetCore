import React from 'react';
import { ShieldCheck, Users, Lock, CheckCircle2, ChevronRight } from 'lucide-react';
import type { RoleDetail, PermissionCategory } from '@/types/role';
import { RoleBadge } from '@/components/user/RoleBadge';

interface RoleCardProps {
  role: RoleDetail;
  onSelect: (role: RoleDetail) => void;
}

export const RoleCard: React.FC<RoleCardProps> = ({ role, onSelect }) => {
  // Extract categories that have at least one granted action.
  // role.permissions is guaranteed by the backend to be Record<string, string[]>
  // so every value is always a string[] — .length is always valid.
  const categoriesWithAccess = (Object.keys(role.permissions) as PermissionCategory[]).filter(
    (cat) => {
      const actions = role.permissions[cat];
      return actions !== undefined && actions.length > 0;
    }
  );

  return (
    <div className="bg-white border border-[#c3c6d7] rounded-2xl p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4 font-['Inter'] relative group">
      {/* Header Info */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <RoleBadge roleName={role.name} size="md" />
          <div className="flex items-center gap-2">
            {role.isSystem && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 text-[10px] font-semibold border border-purple-200">
                <Lock className="h-3 w-3" /> System Role
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#eff4ff] text-[#004ac6] text-[10px] font-semibold border border-[#b4c5ff]">
              <Users className="h-3 w-3" /> {role.assignedUsersCount || 0} users
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-[#434655] leading-relaxed line-clamp-2">
          {role.description || 'No description configured for this enterprise role.'}
        </p>
      </div>

      {/* Capabilities Summary */}
      <div className="space-y-2 pt-3 border-t border-[#e5eeff]">
        <span className="text-[11px] font-semibold text-[#737686] uppercase tracking-wider block">
          Key Capabilities ({categoriesWithAccess.length} Modules)
        </span>

        <div className="space-y-1.5 text-xs">
          {categoriesWithAccess.slice(0, 3).map((cat) => {
            const actions = role.permissions[cat];
            return (
              <div key={cat} className="flex items-center gap-2 text-[#0b1c30]">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span className="font-medium truncate">
                  {cat}: {actions!.join(', ')}
                </span>
              </div>
            );
          })}

          {categoriesWithAccess.length > 3 && (
            <p className="text-[11px] text-[#737686] font-medium pt-0.5">
              +{categoriesWithAccess.length - 3} more module capabilities...
            </p>
          )}
        </div>
      </div>

      {/* Action CTA */}
      <div className="pt-2">
        <button
          onClick={() => onSelect(role)}
          className="w-full h-9 px-4 rounded-xl border border-[#c3c6d7] bg-white text-[#004ac6] font-semibold text-xs hover:bg-[#eff4ff] hover:border-[#004ac6] transition-colors flex items-center justify-center gap-1.5"
        >
          <ShieldCheck className="h-4 w-4" /> Manage Permissions <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
