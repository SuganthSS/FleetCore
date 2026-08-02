# SPEC-098: Settings & Company Profile Prompt Documentation

## Context
This document logs the development actions for SPEC-098, introducing the Settings & Company Profile page.

## Goals & Objectives
- Build the Settings dashboard with multiple preference sections.
- Display Company Profile, General Settings, Appearance, Notifications, Security, Integrations, and AI Settings.
- Implement live switching and persistence for Visual theme preferences (Light, Dark, System).
- Gracefully show `EmptyState` fallbacks where backend APIs are currently under design.

## Implementation Details
1. **Frontend UI Components**: Built `SettingsHeader`, `SettingsSidebar`, `CompanyProfileCard`, `AppearanceSettings`, `GeneralSettings`, `NotificationSettings`, `SecuritySettings`, `IntegrationSettings`, `AISettings`.
2. **Page Routing**: Registered `/settings` inside `AppRouter.tsx` and updated sidebar in `DashboardLayout.tsx` using `Settings` icon.
