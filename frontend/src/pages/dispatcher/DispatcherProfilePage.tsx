import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  User,
  Shield,
  Bell,
  Clock,
  Laptop,
  CheckCircle2,
  Camera,
  Save,
  Smartphone,
} from 'lucide-react';

export const DispatcherProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form states
  const [firstName, setFirstName] = useState(user?.firstName || 'Dispatcher');
  const [lastName, setLastName] = useState(user?.lastName || 'Lead');
  const [email, setEmail] = useState(user?.email || 'dispatcher@fleetcore.io');
  const [phone, setPhone] = useState('+1 (555) 880-9921');
  const [shiftHours, setShiftHours] = useState('Day Shift (07:00 - 17:00 EST)');

  // Password change modal / state
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Notification Preferences
  const [prefDispatchAlerts, setPrefDispatchAlerts] = useState(true);
  const [prefBreakdownAlerts, setPrefBreakdownAlerts] = useState(true);
  const [prefGeofenceBreach, setPrefGeofenceBreach] = useState(true);

  // Avatar state
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const notifySuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    notifySuccess('Dispatcher profile information saved successfully.');
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('New password and confirmation do not match.');
      return;
    }
    setPasswordModalOpen(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    notifySuccess('Password updated successfully.');
  };

  const handleAvatarUploadClick = () => {
    // Simulated image upload
    const mockAvatars = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    ];
    setAvatarUrl(mockAvatars[0]);
    notifySuccess('Profile avatar photo uploaded & updated.');
  };

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 p-6 text-white shadow-md">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="relative group">
            <div className="h-20 w-20 rounded-2xl bg-[#2563eb] text-white flex items-center justify-center font-black text-2xl border-2 border-white/20 shadow-md overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                `${firstName.charAt(0)}${lastName.charAt(0)}`
              )}
            </div>
            <button
              onClick={handleAvatarUploadClick}
              className="absolute -bottom-1 -right-1 p-1.5 rounded-lg bg-[#2563eb] text-white shadow-md hover:bg-blue-600 transition-colors"
              title="Upload Avatar"
            >
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-xl font-black">{firstName} {lastName}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-500/20 text-blue-300 border border-blue-400/30">
                DISPATCHER ROLE
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium">{email} • {shiftHours}</p>
            <p className="text-[11px] text-slate-400 font-mono">Terminal Station #DISPATCH-EAST-01</p>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="flex items-center gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-50 p-4 text-xs font-bold text-emerald-800">
          <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Grid of Profile Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Details Card */}
        <div className="p-5 rounded-2xl border border-[#c3c6d7]/30 bg-white shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-[#c3c6d7]/20 pb-3">
            <User className="h-4.5 w-4.5 text-[#2563eb]" />
            <h2 className="text-sm font-black text-[#191c1e]">Personal Operational Profile</h2>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#737686] font-extrabold uppercase text-[9px] mb-1">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#c3c6d7]/40 font-bold text-xs focus:outline-none focus:border-[#2563eb]"
                />
              </div>
              <div>
                <label className="block text-[#737686] font-extrabold uppercase text-[9px] mb-1">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#c3c6d7]/40 font-bold text-xs focus:outline-none focus:border-[#2563eb]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#737686] font-extrabold uppercase text-[9px] mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#c3c6d7]/40 font-bold text-xs focus:outline-none focus:border-[#2563eb]"
              />
            </div>

            <div>
              <label className="block text-[#737686] font-extrabold uppercase text-[9px] mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#c3c6d7]/40 font-bold text-xs focus:outline-none focus:border-[#2563eb]"
              />
            </div>

            <div>
              <label className="block text-[#737686] font-extrabold uppercase text-[9px] mb-1">Operational Shift</label>
              <input
                type="text"
                value={shiftHours}
                onChange={(e) => setShiftHours(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#c3c6d7]/40 font-bold text-xs focus:outline-none focus:border-[#2563eb]"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#2563eb] text-white text-xs font-bold flex items-center gap-1.5 shadow-md hover:bg-[#1d4ed8]"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save Profile</span>
              </button>
            </div>
          </form>
        </div>

        {/* Security & Password Card */}
        <div className="p-5 rounded-2xl border border-[#c3c6d7]/30 bg-white shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#c3c6d7]/20 pb-3">
            <div className="flex items-center gap-2">
              <Shield className="h-4.5 w-4.5 text-[#2563eb]" />
              <h2 className="text-sm font-black text-[#191c1e]">Security & Authentication</h2>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800">
              2FA Active
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-3.5 bg-[#f7f9fb] rounded-xl border border-[#c3c6d7]/30 flex items-center justify-between">
              <div>
                <p className="font-extrabold text-[#191c1e]">Account Password</p>
                <p className="text-[11px] text-[#737686]">Last modified 45 days ago</p>
              </div>
              <button
                onClick={() => setPasswordModalOpen(true)}
                className="px-3 py-1.5 rounded-xl border border-[#c3c6d7] font-bold text-[#434655] hover:bg-[#eceef0]"
              >
                Change Password
              </button>
            </div>

            {/* Notification Preferences Section */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-1.5 text-xs font-black text-[#191c1e]">
                <Bell className="h-4 w-4 text-[#2563eb]" />
                <span>Operational Notification Subscriptions</span>
              </div>

              <div className="space-y-2 pl-1">
                <label className="flex items-center justify-between cursor-pointer text-xs font-semibold text-[#434655]">
                  <span>Dispatch Trip Assignments & Acceptances</span>
                  <input
                    type="checkbox"
                    checked={prefDispatchAlerts}
                    onChange={(e) => setPrefDispatchAlerts(e.target.checked)}
                    className="h-4 w-4 rounded-md text-[#2563eb] accent-[#2563eb]"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer text-xs font-semibold text-[#434655]">
                  <span>Vehicle Breakdown & Emergency Alarms</span>
                  <input
                    type="checkbox"
                    checked={prefBreakdownAlerts}
                    onChange={(e) => setPrefBreakdownAlerts(e.target.checked)}
                    className="h-4 w-4 rounded-md text-[#2563eb] accent-[#2563eb]"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer text-xs font-semibold text-[#434655]">
                  <span>Geofence Route Deviation Alerts</span>
                  <input
                    type="checkbox"
                    checked={prefGeofenceBreach}
                    onChange={(e) => setPrefGeofenceBreach(e.target.checked)}
                    className="h-4 w-4 rounded-md text-[#2563eb] accent-[#2563eb]"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Log & Active Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity History */}
        <div className="p-5 rounded-2xl border border-[#c3c6d7]/30 bg-white shadow-xs space-y-3">
          <div className="flex items-center gap-2 border-b border-[#c3c6d7]/20 pb-3">
            <Clock className="h-4.5 w-4.5 text-[#2563eb]" />
            <h2 className="text-sm font-black text-[#191c1e]">Dispatcher Activity Audit History</h2>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f7f9fb]">
              <div>
                <p className="font-extrabold text-[#191c1e]">Dispatched Trip #TRIP-1049 to Sarah Jenkins</p>
                <p className="text-[10px] text-[#737686]">IP: 192.168.1.55 • Terminal 01</p>
              </div>
              <span className="text-[10px] font-mono text-[#737686]">12 mins ago</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f7f9fb]">
              <div>
                <p className="font-extrabold text-[#191c1e]">Updated Cargo Status for Shipment #SH-8821</p>
                <p className="text-[10px] text-[#737686]">IP: 192.168.1.55 • Dispatch Console</p>
              </div>
              <span className="text-[10px] font-mono text-[#737686]">1 hour ago</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f7f9fb]">
              <div>
                <p className="font-extrabold text-[#191c1e]">Uploaded Waybill document Waybill_WB-9941.pdf</p>
                <p className="text-[10px] text-[#737686]">IP: 192.168.1.55 • Document Library</p>
              </div>
              <span className="text-[10px] font-mono text-[#737686]">3 hours ago</span>
            </div>
          </div>
        </div>

        {/* Active Session History */}
        <div className="p-5 rounded-2xl border border-[#c3c6d7]/30 bg-white shadow-xs space-y-3">
          <div className="flex items-center gap-2 border-b border-[#c3c6d7]/20 pb-3">
            <Laptop className="h-4.5 w-4.5 text-[#2563eb]" />
            <h2 className="text-sm font-black text-[#191c1e]">Active Terminal Sessions</h2>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl border border-blue-200 bg-blue-50/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Laptop className="h-5 w-5 text-[#2563eb]" />
                <div>
                  <p className="font-black text-[#191c1e]">Chrome on Windows 11 (Current Session)</p>
                  <p className="text-[10px] text-[#737686]">IP 192.168.1.55 • Boston Dispatch Hub</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800">
                ACTIVE NOW
              </span>
            </div>

            <div className="p-3 rounded-xl border border-[#c3c6d7]/30 bg-[#f7f9fb] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-[#737686]" />
                <div>
                  <p className="font-extrabold text-[#191c1e]">FleetCore Dispatch Mobile (iOS)</p>
                  <p className="text-[10px] text-[#737686]">IP 172.56.21.90 • Last active yesterday</p>
                </div>
              </div>
              <button
                onClick={() => notifySuccess('Mobile session revoked.')}
                className="text-[11px] font-bold text-red-600 hover:underline"
              >
                Revoke Session
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {passwordModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#c3c6d7]/30 pb-3">
              <h3 className="text-sm font-black text-[#191c1e]">Change Account Password</h3>
              <button onClick={() => setPasswordModalOpen(false)} className="text-[#737686]">
                ✕
              </button>
            </div>

            <form onSubmit={handleChangePasswordSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#737686] font-bold mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#c3c6d7] font-medium focus:outline-none focus:border-[#2563eb]"
                />
              </div>

              <div>
                <label className="block text-[#737686] font-bold mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#c3c6d7] font-medium focus:outline-none focus:border-[#2563eb]"
                />
              </div>

              <div>
                <label className="block text-[#737686] font-bold mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#c3c6d7] font-medium focus:outline-none focus:border-[#2563eb]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPasswordModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl border border-[#c3c6d7] text-xs font-bold text-[#434655]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#2563eb] text-white text-xs font-bold hover:bg-[#1d4ed8]"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DispatcherProfilePage;
