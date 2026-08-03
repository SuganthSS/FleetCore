import React, { useState } from 'react';
import { Lock, Shield, KeyRound, CheckCircle2 } from 'lucide-react';
import { UserProfileData } from '@/services/profile.service';

interface SecurityCardProps {
  profile: UserProfileData;
  onChangePassword: (current: string, newPass: string) => void;
  onToggle2FA: (enabled: boolean) => void;
}

export const SecurityCard: React.FC<SecurityCardProps> = ({
  profile,
  onChangePassword,
  onToggle2FA,
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;
    onChangePassword(currentPassword, newPassword);
    setCurrentPassword('');
    setNewPassword('');
    setShowPasswordForm(false);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
          <Lock className="h-5 w-5" />
        </div>
        <h2 className="text-base font-bold text-foreground">Security & Authentication</h2>
      </div>

      <div className="space-y-3 text-xs">
        {/* Two-Factor Status */}
        <div className="flex items-center justify-between rounded-xl border border-border bg-background p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <span className="font-bold text-foreground block">Two-Factor Authentication (2FA)</span>
              <span className="text-muted-foreground text-[11px]">
                {profile.twoFactorEnabled ? 'Enabled & protected via Authenticator App' : 'Disabled'}
              </span>
            </div>
          </div>
          <button
            onClick={() => onToggle2FA(!profile.twoFactorEnabled)}
            className={`rounded-lg px-3 py-1.5 font-bold transition-colors ${
              profile.twoFactorEnabled
                ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20 hover:bg-rose-500/20'
                : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 hover:bg-emerald-500/20'
            }`}
          >
            {profile.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
          </button>
        </div>

        {/* Change Password Trigger / Form */}
        <div className="rounded-xl border border-border bg-background p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <KeyRound className="h-4 w-4" />
              </div>
              <div>
                <span className="font-bold text-foreground block">Account Password</span>
                <span className="text-muted-foreground text-[11px]">Last changed 30 days ago</span>
              </div>
            </div>
            <button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="rounded-lg border border-border bg-card px-3 py-1.5 font-bold text-foreground hover:bg-muted transition-colors"
            >
              {showPasswordForm ? 'Cancel' : 'Change Password'}
            </button>
          </div>

          {showPasswordForm && (
            <form onSubmit={handleSubmit} className="pt-3 border-t border-border space-y-3">
              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary py-2 text-xs font-bold text-white shadow-sm hover:bg-primary/90 transition-colors"
              >
                <CheckCircle2 className="h-3.5 w-3.5" /> Update Password
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
