# SPEC-095: Notifications Management Page Prompt Documentation

## Context
This document logs the development actions for SPEC-095, introducing the Notifications Management page.

## Goals & Objectives
- Build a fully integrated Notifications Management module.
- Manage CRUD calls with the backend: `/api/v1/notifications`.
- Support responsive table rows, quick search, and filtering by user, type, priority, and read status.
- Highlight unread notifications with active animations and bold text styles, and show read notifications in muted styling.
- Display a pretty-printed JSON metadata code block inside the detail drawer if available.

## Implementation Details
1. **Frontend Service**: Created `notification.service.ts` managing CRUD endpoints.
2. **Recipient Auto-Scoping**: Combined current user profile and nested driver users to build a complete company user pool.
3. **UX Assets**: Added `NotificationSkeleton` loading bars, priority badges, type badges, and side drawer logs.
