import React from 'react';
import { X, Mail, Phone, Calendar, Clock, KeyRound, Shield, Edit2 } from 'lucide-react';
import type { UserItem } from '@/types/user';
import { RoleBadge } from './RoleBadge';
import { StatusBadge } from './StatusBadge';
import { UserAvatar } from './UserAvatar';

interface UserDrawerProps {
  user: UserItem | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (user: UserItem) => void;
  onResetPassword: (user: UserItem) => void;
}

export const UserDrawer: React.FC<UserDrawerProps> = ({
  user,
  isOpen,
  onClose,
  onEdit,
  onResetPassword,
}) => {
  if (!isOpen || !user) return null;

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-[#c3c6d7] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-6 border-b border-[#e5eeff] flex justify-between items-center bg-[#f8f9ff]">
            <h2 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#0b1c30]">
              Employee Profile
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#737686] hover:bg-[#e5eeff] hover:text-[#0b1c30] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* User Core Hero Card */}
            <div className="text-center bg-[#f8f9ff] border border-[#c3c6d7] rounded-2xl p-6 shadow-xs">
              <UserAvatar
                firstName={user.firstName}
                lastName={user.lastName}
                size="lg"
                className="mx-auto mb-3"
              />
              <h3 className="font-['Plus_Jakarta_Sans'] text-xl font-extrabold text-[#0b1c30]">
                {user.firstName} {user.lastName}
              </h3>
              <p className="font-['Inter'] text-xs text-[#737686] mt-0.5">{user.email}</p>

              <div className="flex justify-center gap-2 mt-4">
                <RoleBadge roleName={user.roleName || user.role?.name || 'Staff'} />
                <StatusBadge status={user.status} />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(user)}
                className="flex-1 h-9 rounded-xl border border-[#c3c6d7] bg-white text-xs font-['Inter'] font-semibold text-[#0b1c30] hover:bg-[#e5eeff] hover:text-[#004ac6] transition-colors flex items-center justify-center gap-1.5"
              >
                <Edit2 className="h-3.5 w-3.5" /> Edit Profile
              </button>
              <button
                onClick={() => onResetPassword(user)}
                className="flex-1 h-9 rounded-xl border border-[#c3c6d7] bg-white text-xs font-['Inter'] font-semibold text-[#0b1c30] hover:bg-[#e5eeff] hover:text-[#004ac6] transition-colors flex items-center justify-center gap-1.5"
              >
                <KeyRound className="h-3.5 w-3.5" /> Reset Password
              </button>
            </div>

            {/* General Info List */}
            <div className="space-y-4 font-['Inter']">
              <h4 className="text-xs font-bold text-[#434655] uppercase tracking-wider">
                Contact & Details
              </h4>

              <div className="space-y-3 bg-white border border-[#e5eeff] rounded-xl p-4 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#737686] flex items-center gap-2">
                    <Mail className="h-4 w-4 text-[#004ac6]" /> Email Address
                  </span>
                  <span className="font-semibold text-[#0b1c30]">{user.email}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#737686] flex items-center gap-2">
                    <Phone className="h-4 w-4 text-[#004ac6]" /> Phone Number
                  </span>
                  <span className="font-semibold text-[#0b1c30]">{user.phone || 'Not set'}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#737686] flex items-center gap-2">
                    <Shield className="h-4 w-4 text-[#004ac6]" /> Organization Role
                  </span>
                  <span className="font-semibold text-[#0b1c30]">
                    {user.roleName || user.role?.name || 'Staff'}
                  </span>
                </div>
              </div>

              <h4 className="text-xs font-bold text-[#434655] uppercase tracking-wider pt-2">
                System Audit Timestamps
              </h4>

              <div className="space-y-3 bg-white border border-[#e5eeff] rounded-xl p-4 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#737686] flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[#737686]" /> Last Login
                  </span>
                  <span className="font-semibold text-[#0b1c30]">
                    {formatDate(user.lastLogin)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#737686] flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[#737686]" /> Registered Date
                  </span>
                  <span className="font-semibold text-[#0b1c30]">
                    {formatDate(user.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
