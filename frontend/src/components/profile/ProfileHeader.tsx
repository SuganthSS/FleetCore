import React from 'react';
import { User, ShieldCheck, Mail, Phone, Building } from 'lucide-react';
import { UserProfileData } from '@/services/profile.service';

interface ProfileHeaderProps {
  profile: UserProfileData;
  onOpenDrawer: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile, onOpenDrawer }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-indigo-600 to-purple-600 text-2xl font-black text-white shadow-lg shadow-primary/20">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.firstName} className="h-full w-full rounded-2xl object-cover" />
            ) : (
              `${profile.firstName[0]}${profile.lastName[0]}`
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
                {profile.firstName} {profile.lastName}
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary border border-primary/20">
                <ShieldCheck className="h-3 w-3" /> {profile.roleName}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5 text-primary" /> {profile.email}
              </span>
              {profile.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5 text-primary" /> {profile.phone}
                </span>
              )}
              {profile.department && (
                <span className="flex items-center gap-1">
                  <Building className="h-3.5 w-3.5 text-primary" /> {profile.department}
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={onOpenDrawer}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-primary/90 transition-all shrink-0"
        >
          <User className="h-4 w-4" /> Edit Profile & Preferences
        </button>
      </div>
    </div>
  );
};
