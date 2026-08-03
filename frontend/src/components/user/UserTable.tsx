import React, { useState } from 'react';
import {
  MoreVertical,
  Eye,
  Edit2,
  KeyRound,
  Trash2,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

import type { UserItem } from '@/types/user';
import { RoleBadge } from './RoleBadge';
import { StatusBadge } from './StatusBadge';
import { UserAvatar } from './UserAvatar';

interface UserTableProps {
  users: UserItem[];
  selectedIds: string[];
  onSelectToggle: (id: string) => void;
  onSelectAllToggle: () => void;
  onViewUser: (user: UserItem) => void;
  onEditUser: (user: UserItem) => void;
  onToggleStatus: (user: UserItem) => void;
  onResetPassword: (user: UserItem) => void;
  onDeleteUser: (user: UserItem) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  selectedIds,
  onSelectToggle,
  onSelectAllToggle,
  onViewUser,
  onEditUser,
  onToggleStatus,
  onResetPassword,
  onDeleteUser,
}) => {
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  const allSelected = users.length > 0 && users.every((u) => selectedIds.includes(u.id));

  const formatLastLogin = (lastLogin?: string | null) => {
    if (!lastLogin) return 'Never';
    const date = new Date(lastLogin);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white border border-[#c3c6d7] rounded-2xl shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f8f9ff] border-b border-[#c3c6d7] text-[11px] font-['Inter'] font-bold text-[#434655] uppercase tracking-wider">
              <th className="py-3.5 px-4 w-10 text-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onSelectAllToggle}
                  className="rounded border-[#c3c6d7] text-[#004ac6] focus:ring-[#004ac6] h-4 w-4 cursor-pointer"
                />
              </th>
              <th className="py-3.5 px-4">Employee</th>
              <th className="py-3.5 px-4">Role</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Phone</th>
              <th className="py-3.5 px-4">Last Login</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#e5eeff] font-['Inter'] text-xs">
            {users.map((user) => {
              const isSelected = selectedIds.includes(user.id);
              const isDropdownOpen = activeDropdownId === user.id;

              return (
                <tr
                  key={user.id}
                  className={`hover:bg-[#f8f9ff]/80 transition-colors ${
                    isSelected ? 'bg-[#eff4ff]' : ''
                  }`}
                >
                  <td className="py-3.5 px-4 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onSelectToggle(user.id)}
                      className="rounded border-[#c3c6d7] text-[#004ac6] focus:ring-[#004ac6] h-4 w-4 cursor-pointer"
                    />
                  </td>

                  {/* Employee Avatar & Info */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <UserAvatar firstName={user.firstName} lastName={user.lastName} />
                      <div>
                        <button
                          onClick={() => onViewUser(user)}
                          className="font-['Plus_Jakarta_Sans'] font-bold text-[#0b1c30] hover:text-[#004ac6] transition-colors text-left text-sm"
                        >
                          {user.firstName} {user.lastName}
                        </button>
                        <p className="text-[11px] text-[#737686]">{user.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="py-3.5 px-4">
                    <RoleBadge roleName={user.roleName || user.role?.name || 'Staff'} />
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <StatusBadge status={user.status} />
                  </td>

                  {/* Phone */}
                  <td className="py-3.5 px-4 text-[#434655]">
                    {user.phone || '—'}
                  </td>

                  {/* Last Login */}
                  <td className="py-3.5 px-4 text-[#737686]">
                    {formatLastLogin(user.lastLogin)}
                  </td>

                  {/* Actions Dropdown */}
                  <td className="py-3.5 px-4 text-right relative">
                    <button
                      onClick={() => setActiveDropdownId(isDropdownOpen ? null : user.id)}
                      className="p-1.5 rounded-lg border border-transparent hover:border-[#c3c6d7] hover:bg-[#f8f9ff] text-[#737686] hover:text-[#0b1c30] transition-colors"
                      aria-label="Actions"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>

                    {isDropdownOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-20 cursor-default"
                          onClick={() => setActiveDropdownId(null)}
                        />
                        <div className="absolute right-4 mt-1 w-48 rounded-xl border border-[#c3c6d7] bg-white p-1.5 shadow-lg z-30 font-['Inter'] text-xs text-left animate-in fade-in slide-in-from-top-1 duration-150">
                          <button
                            onClick={() => {
                              setActiveDropdownId(null);
                              onViewUser(user);
                            }}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[#434655] hover:bg-[#e5eeff] hover:text-[#004ac6] transition-colors"
                          >
                            <Eye className="h-3.5 w-3.5" /> View Details
                          </button>
                          <button
                            onClick={() => {
                              setActiveDropdownId(null);
                              onEditUser(user);
                            }}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[#434655] hover:bg-[#e5eeff] hover:text-[#004ac6] transition-colors"
                          >
                            <Edit2 className="h-3.5 w-3.5" /> Edit Profile
                          </button>
                          <button
                            onClick={() => {
                              setActiveDropdownId(null);
                              onToggleStatus(user);
                            }}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[#434655] hover:bg-[#e5eeff] hover:text-[#004ac6] transition-colors"
                          >
                            {user.status === 'ACTIVE' ? (
                              <>
                                <XCircle className="h-3.5 w-3.5 text-amber-600" /> Deactivate Employee
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Reactivate Employee
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => {
                              setActiveDropdownId(null);
                              onResetPassword(user);
                            }}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[#434655] hover:bg-[#e5eeff] hover:text-[#004ac6] transition-colors"
                          >
                            <KeyRound className="h-3.5 w-3.5" /> Reset Password
                          </button>
                          <div className="h-px bg-[#e5eeff] my-1" />
                          <button
                            onClick={() => {
                              setActiveDropdownId(null);
                              onDeleteUser(user);
                            }}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[#ba1a1a] hover:bg-[#ffdad6]/50 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Soft Delete
                          </button>
                        </div>
                      </>
                    )}
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
