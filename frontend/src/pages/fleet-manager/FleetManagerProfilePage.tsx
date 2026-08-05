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

export const FleetManagerProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Profile local state seeded from AuthContext for Fleet Manager
  const [profile, setProfile] = useState<UserProfileData>({
    id: user?.id || 'fm-user-101',
    firstName: user?.firstName || 'Fleet',
    lastName: user?.lastName || 'Manager',
    email: user?.email || 'fleetmanager@fleetcore.io',
    phone: '+1 (555) 890-1234',
    department: 'Fleet Operations & Dispatch',
    roleName: user?.roleName || 'Fleet Manager',
    status: 'ACTIVE',
    twoFactorEnabled: true,
    createdAt: '2025-03-10T08:30:00Z',
    recentActivity: [
      { id: 'act-1', action: 'Dispatched Trip TRP-9042 to Driver John Doe', ipAddress: '192.168.1.102', timestamp: '15 mins ago' },
      { id: 'act-2', action: 'Updated Maintenance Work Order WO-804 Sign-Off', ipAddress: '192.168.1.102', timestamp: '3 hours ago' },
      { id: 'act-3', action: 'Logged Vehicle Refueling Entry for Volvo TR-102', ipAddress: '192.168.1.102', timestamp: 'Yesterday' },
    ],
    preferences: {
      theme: 'system',
      emailNotifications: true,
      smsNotifications: true,
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
        <div className="flex items-center gap-2.5 rounded-xl border border-[#10b981]/20 bg-[#10b981]/10 p-4 text-xs font-bold text-[#10b981]">
          <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
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

export default FleetManagerProfilePage;
