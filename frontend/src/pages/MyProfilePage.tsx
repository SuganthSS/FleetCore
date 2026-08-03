import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { CheckCircle2 } from 'lucide-react';
import {
  ProfileHeader,
  PersonalInformationCard,
  SecurityCard,
  ActivityTimeline,
  ProfileDrawer,
} from '@/components/profile';
import { UserProfileData, UpdateProfileInput } from '@/services/profile.service';

export const MyProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Profile local state seeded from AuthContext
  const [profile, setProfile] = useState<UserProfileData>({
    id: user?.id || 'user-101',
    firstName: user?.firstName || 'Admin',
    lastName: user?.lastName || 'User',
    email: user?.email || 'admin@fleetcore.io',
    phone: '+1 (555) 234-5678',
    department: 'Fleet Operations',
    roleName: user?.roleName || 'Administrator',
    status: 'ACTIVE',
    twoFactorEnabled: true,
    createdAt: '2025-01-15T08:30:00Z',
    recentActivity: [
      { id: 'act-1', action: 'User Authenticated via OAuth2', ipAddress: '192.168.1.45', timestamp: '10 mins ago' },
      { id: 'act-2', action: 'Updated Vehicle Registration TR-102', ipAddress: '192.168.1.45', timestamp: '2 hours ago' },
      { id: 'act-3', action: 'Exported Monthly Fuel Telemetry CSV', ipAddress: '192.168.1.45', timestamp: 'Yesterday' },
    ],
    preferences: {
      theme: 'system',
      emailNotifications: true,
      smsNotifications: false,
      weeklyDigest: true,
    },
  });

  const notifySuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleUpdateProfile = (input: UpdateProfileInput) => {
    setProfile((prev) => ({ ...prev, ...input }));
    notifySuccess('Personal profile details updated successfully.');
  };

  const handleChangePassword = () => {
    notifySuccess('Password updated successfully.');
  };

  const handleToggle2FA = (enabled: boolean) => {
    setProfile((prev) => ({ ...prev, twoFactorEnabled: enabled }));
    notifySuccess(`Two-factor authentication ${enabled ? 'enabled' : 'disabled'}.`);
  };

  const handleUploadAvatar = () => {
    notifySuccess('Avatar updated successfully.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <ProfileHeader profile={profile} onOpenDrawer={() => setDrawerOpen(true)} />

      {/* Notification Toast */}
      {successMessage && (
        <div className="flex items-center gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PersonalInformationCard profile={profile} />
        <SecurityCard
          profile={profile}
          onChangePassword={handleChangePassword}
          onToggle2FA={handleToggle2FA}
        />
      </div>

      {/* Activity Timeline */}
      <ActivityTimeline profile={profile} />

      {/* Edit Profile Drawer */}
      <ProfileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        profile={profile}
        onUpdateProfile={handleUpdateProfile}
        onUploadAvatar={handleUploadAvatar}
      />
    </div>
  );
};

export default MyProfilePage;
