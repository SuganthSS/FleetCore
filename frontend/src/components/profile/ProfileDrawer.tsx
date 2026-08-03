import React, { useState } from 'react';
import { X, Save, Upload, User } from 'lucide-react';
import { UserProfileData, UpdateProfileInput } from '@/services/profile.service';

interface ProfileDrawerProps {
  open: boolean;
  onClose: () => void;
  profile: UserProfileData;
  onUpdateProfile: (input: UpdateProfileInput) => void;
  onUploadAvatar: (file: File) => void;
}

export const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  open,
  onClose,
  profile,
  onUpdateProfile,
  onUploadAvatar,
}) => {
  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);
  const [phone, setPhone] = useState(profile.phone || '');
  const [department, setDepartment] = useState(profile.department || '');

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({ firstName, lastName, phone, department });
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUploadAvatar(e.target.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-card h-full flex flex-col shadow-2xl border-l border-border animate-in slide-in-from-right duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/40">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <User className="h-5 w-5" />
            </div>
            <h2 className="text-base font-bold text-foreground">Edit Account Profile</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-muted-foreground hover:bg-muted">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {/* Avatar Upload */}
          <div className="flex items-center gap-4 rounded-xl border border-border bg-background p-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary text-white text-lg font-bold">
              {profile.firstName[0]}{profile.lastName[0]}
            </div>
            <div>
              <span className="font-bold text-foreground block mb-1">Profile Photo</span>
              <label className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-bold text-foreground cursor-pointer hover:bg-muted transition-colors">
                <Upload className="h-3.5 w-3.5" /> Upload Photo
                <input type="file" onChange={handleFileChange} accept="image/*" className="hidden" />
              </label>
            </div>
          </div>

          <div>
            <label className="font-bold text-muted-foreground block mb-1">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>

          <div>
            <label className="font-bold text-muted-foreground block mb-1">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>

          <div>
            <label className="font-bold text-muted-foreground block mb-1">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="font-bold text-muted-foreground block mb-1">Department</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="pt-4 border-t border-border flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-bold text-foreground hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-primary/90"
            >
              <Save className="h-4 w-4" /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
