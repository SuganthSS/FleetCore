import React, { useState } from 'react';
import { X, KeyRound, Loader2, CheckCircle2 } from 'lucide-react';
import type { UserItem } from '@/types/user';

interface ResetPasswordModalProps {
  user: UserItem | null;
  isOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (password: string) => Promise<void>;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  user,
  isOpen,
  isSubmitting,
  onClose,
  onSubmit,
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError(null);
    await onSubmit(password);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-md bg-white rounded-2xl border border-[#c3c6d7] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-10 font-['Inter']">
        <div className="p-5 border-b border-[#e5eeff] flex justify-between items-center bg-[#f8f9ff]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#eff4ff] text-[#004ac6]">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#0b1c30]">
                Reset User Password
              </h3>
              <p className="text-xs text-[#737686]">
                {user.firstName} {user.lastName} ({user.email})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#737686] hover:bg-[#e5eeff] hover:text-[#0b1c30] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-[#ffdad6]/40 border border-[#ffdad6] text-[#ba1a1a] font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block font-semibold text-[#0b1c30] mb-1">New Password *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new strong password"
              className="w-full h-9 px-3 rounded-xl border border-[#c3c6d7] text-xs text-[#0b1c30] focus:ring-2 focus:ring-[#004ac6] focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-[#0b1c30] mb-1">
              Confirm New Password *
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              className="w-full h-9 px-3 rounded-xl border border-[#c3c6d7] text-xs text-[#0b1c30] focus:ring-2 focus:ring-[#004ac6] focus:outline-none"
              required
            />
          </div>

          <div className="pt-3 border-t border-[#e5eeff] flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-4 rounded-xl border border-[#c3c6d7] font-semibold text-[#434655] hover:bg-[#f8f9ff] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-9 px-5 rounded-xl bg-[#004ac6] text-white font-semibold hover:bg-[#003ea8] disabled:opacity-50 transition-colors flex items-center gap-1.5 shadow-xs"
            >
              {isSubmitting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="h-3.5 w-3.5" />
              )}
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
