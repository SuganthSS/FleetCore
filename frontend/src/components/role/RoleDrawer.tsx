import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Save, Lock, AlertCircle } from 'lucide-react';

import type { RoleDetail } from '@/types/role';
import { RoleBadge } from '@/components/user/RoleBadge';
import { PermissionGroup } from './PermissionGroup';

interface RoleDrawerProps {
  role: RoleDetail | null;
  isOpen: boolean;
  categories: string[];
  actions: string[];
  onClose: () => void;
  onSavePermissions: (roleId: string, permissions: Record<string, string[]>) => Promise<void>;
}

export const RoleDrawer: React.FC<RoleDrawerProps> = ({
  role,
  isOpen,
  categories,
  actions,
  onClose,
  onSavePermissions,
}) => {
  const [permissionsState, setPermissionsState] = useState<Record<string, string[]>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (role) {
      setPermissionsState(role.permissions || {});
    }
  }, [role]);

  if (!isOpen || !role) return null;

  const handleToggleAction = (category: string, action: string) => {
    if (role.name === 'Administrator') return; // Administrator role privileges are immutable

    setPermissionsState((prev) => {
      const current = prev[category] || [];
      let updated: string[];

      if (current.includes(action)) {
        updated = current.filter((a) => a !== action);
      } else {
        updated = [...current, action];
      }

      return {
        ...prev,
        [category]: updated,
      };
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await onSavePermissions(role.id, permissionsState);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-['Inter']">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-[#e5eeff] bg-[#f8f9ff] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#004ac6] text-white">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <RoleBadge roleName={role.name} size="md" />
                  {role.isSystem && (
                    <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10px] font-semibold border border-purple-200 flex items-center gap-1">
                      <Lock className="h-3 w-3" /> Immutable Core
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#737686] mt-0.5">
                  Assigned Users: <span className="font-semibold text-[#0b1c30]">{role.assignedUsersCount || 0}</span>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#737686] hover:bg-[#eff4ff] hover:text-[#0b1c30] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body content */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {/* Role Info Box */}
            <div className="bg-[#eff4ff] border border-[#b4c5ff] rounded-2xl p-4 space-y-2">
              <span className="text-[11px] font-semibold text-[#004ac6] uppercase tracking-wider block">
                Role Description
              </span>
              <p className="text-xs text-[#0b1c30] leading-relaxed">
                {role.description || 'No detailed description provided for this role.'}
              </p>
            </div>

            {role.name === 'Administrator' && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3 text-xs text-amber-900">
                <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <p>
                  The <strong>Administrator</strong> role possesses full global capabilities across all enterprise modules. Privileges cannot be revoked.
                </p>
              </div>
            )}

            {/* Permission Group Selectors */}
            <div className="space-y-4">
              <h4 className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#0b1c30]">
                Module Privileges & Capabilities
              </h4>

              <div className="space-y-3">
                {categories.map((cat) => (
                  <PermissionGroup
                    key={cat}
                    category={cat}
                    availableActions={actions}
                    selectedActions={permissionsState[cat] || []}
                    onToggleAction={(action) => handleToggleAction(cat, action)}
                    disabled={role.name === 'Administrator'}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="p-6 border-t border-[#e5eeff] bg-[#f8f9ff] flex items-center justify-between">
            {saveSuccess ? (
              <span className="text-xs font-semibold text-emerald-600">
                ✓ Permissions updated successfully!
              </span>
            ) : (
              <span className="text-xs text-[#737686]">
                Changes affect all users assigned to this role.
              </span>
            )}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 h-9 rounded-xl border border-[#c3c6d7] text-xs font-semibold text-[#434655] hover:bg-white transition-colors"
              >
                Close
              </button>
              {role.name !== 'Administrator' && (
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-5 h-9 rounded-xl bg-[#004ac6] text-white text-xs font-semibold hover:bg-[#003ea8] transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  <Save className="h-4 w-4" /> {isSaving ? 'Saving...' : 'Save Permissions'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
