import React from 'react';
import { User, Mail, Phone, Building, ShieldCheck } from 'lucide-react';
import { UserProfileData } from '@/services/profile.service';

export const PersonalInformationCard: React.FC<{ profile: UserProfileData }> = ({ profile }) => {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <User className="h-5 w-5" />
        </div>
        <h2 className="text-base font-bold text-foreground">Personal Information</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="rounded-xl border border-border bg-background p-3">
          <span className="text-muted-foreground block font-medium">First Name</span>
          <span className="text-foreground font-bold text-sm mt-0.5 block">{profile.firstName}</span>
        </div>
        <div className="rounded-xl border border-border bg-background p-3">
          <span className="text-muted-foreground block font-medium">Last Name</span>
          <span className="text-foreground font-bold text-sm mt-0.5 block">{profile.lastName}</span>
        </div>
        <div className="rounded-xl border border-border bg-background p-3">
          <span className="text-muted-foreground block font-medium flex items-center gap-1">
            <Mail className="h-3 w-3" /> Email Address
          </span>
          <span className="text-foreground font-bold text-sm mt-0.5 block">{profile.email}</span>
        </div>
        <div className="rounded-xl border border-border bg-background p-3">
          <span className="text-muted-foreground block font-medium flex items-center gap-1">
            <Phone className="h-3 w-3" /> Phone Number
          </span>
          <span className="text-foreground font-bold text-sm mt-0.5 block">{profile.phone || 'Not provided'}</span>
        </div>
        <div className="rounded-xl border border-border bg-background p-3">
          <span className="text-muted-foreground block font-medium flex items-center gap-1">
            <Building className="h-3 w-3" /> Department
          </span>
          <span className="text-foreground font-bold text-sm mt-0.5 block">{profile.department || 'Operations'}</span>
        </div>
        <div className="rounded-xl border border-border bg-background p-3">
          <span className="text-muted-foreground block font-medium flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" /> System Role
          </span>
          <span className="text-primary font-extrabold text-sm mt-0.5 block">{profile.roleName}</span>
        </div>
      </div>
    </div>
  );
};
