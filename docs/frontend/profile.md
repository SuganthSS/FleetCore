# My Profile — FleetCore Enterprise

## Overview

The **My Profile** module provides authenticated enterprise administrators with a full self-service account management panel. It surfaces personal details, role assignment, security controls (2FA, password), and real-time activity audit timeline.

## Route

```
/profile
```

Protected by `ProtectedRoute` — requires a valid JWT session.

---

## Component Architecture

```
MyProfilePage
├── ProfileHeader         — Avatar, name, role badge, Edit Profile CTA
├── PersonalInformationCard — Name, email, phone, department fields (read-only)
├── SecurityCard          — Password change form + 2FA toggle
├── ActivityTimeline      — Recent session/action history feed
└── ProfileDrawer         — Slide-in side drawer for editing personal info & avatar
```

## Services

| Service | File | Purpose |
|---|---|---|
| `profileService` | `src/services/profile.service.ts` | API calls for profile update, password change, avatar upload |

### Key interfaces

```ts
interface UserProfileData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department?: string;
  roleName: string;
  status: 'ACTIVE' | 'INACTIVE';
  twoFactorEnabled: boolean;
  createdAt: string;
  recentActivity: ActivityEntry[];
  preferences: UserPreferences;
}

interface UpdateProfileInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
  department?: string;
}
```

---

## Features

### Personal Information Card
- Displays: Full name, email, phone, department, role, account status
- Read-only view — all edits go through the **Profile Drawer**

### Security Card
- **Change Password**: Validates current password before allowing a new one
- **2FA Toggle**: Enables / disables TOTP-based two-factor authentication
- Sessions section showing device type and last active timestamp

### Activity Timeline
- Lists the most recent 5–10 audit events (login, entity updates, exports)
- Shows IP address and relative timestamp
- Purely client-side seeded; future backend integration via `GET /api/v1/users/me/activity`

### Profile Drawer
- Slide-in from the right (400px)
- Controlled by `drawerOpen` state in `MyProfilePage`
- Avatar upload via `<input type="file">` — calls `profileService.uploadAvatar(file)`
- On submit calls `onUpdateProfile(input)` which optimistically updates local state

---

## State Management

All state is local (`useState`) in `MyProfilePage`. Profile data is seeded from `useAuth()` on mount and updated optimistically on save. No global store writes.

---

## Future Enhancements

- [ ] Live backend sync via `PATCH /api/v1/users/me`
- [ ] WebSocket push for real-time activity feed
- [ ] Avatar CDN storage (Cloudinary / S3)
