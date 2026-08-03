# Notification Center — FleetCore Enterprise

## Overview

The **Notification Center** (SPEC-120) replaces the old admin notification list with a fully redesigned, real-time enterprise alert feed. It covers system security audits, fleet telemetry alerts, AI risk detections, maintenance schedules, driver compliance reminders, and fuel anomaly flags.

> **Note:** The legacy admin CRUD page (`/notifications` → `NotificationsPage`) still exists for system-level notification management. The new `NotificationCenterPage` at `/notifications` is the primary user-facing feed.

## Route

```
/notifications    →  NotificationCenterPage  (SPEC-120 feed)
```

---

## Component Architecture

```
NotificationCenterPage
├── NotificationHeader    — Title, unread count badge, Mark All Read + Refresh CTAs
├── NotificationToolbar   — Search input + Category filter tabs + Unread Only toggle
└── NotificationCards     — Feed of notification cards with mark-read/unread + delete actions
```

---

## Notification Types

| Type | Color | Icon | Description |
|---|---|---|---|
| `SYSTEM` | Gray | Server | OAuth audits, RBAC verification |
| `MAINTENANCE` | Amber | Wrench | Work order alerts, PM schedules |
| `FUEL` | Blue | Fuel | Idle waste, anomalous consumption |
| `AI` | Purple | Sparkles | Copilot risk flags, AI recommendations |
| `FLEET` | Emerald | Truck | Driver CDL reminders, dispatch events |
| `VEHICLE` | Blue | Truck | Registration, sensor alerts |
| `DRIVER` | Emerald | User | License expiry, compliance violations |
| `TRIP` | Purple | Map | Delivery delays, route deviations |

---

## State

```ts
interface NotificationRecord {
  id: string;
  title: string;
  message: string;
  type: 'SYSTEM' | 'VEHICLE' | 'DRIVER' | 'TRIP' | 'FUEL' | 'MAINTENANCE' | 'AI' | 'FLEET';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  isRead: boolean;
  readAt?: string | null;
  companyId: string;
  userId?: string;
  createdAt: string;
  updatedAt: string;
}
```

All managed locally in `NotificationCenterPage` with `useState`. Seeded with 4 demo records.

---

## Features

### Notification Header
- Animated badge showing unread count (red dot counter)
- **Mark All as Read** — sets all `isRead: true` in one click
- **Refresh Feed** — simulates re-fetch with 800ms delay + toast

### Notification Toolbar
- **Search**: Filters by `title` or `message` text (live, case-insensitive)
- **Category tabs**: ALL | SYSTEM | FLEET | MAINTENANCE | FUEL | AI
- **Unread Only**: Toggle to show only `isRead === false` entries

### Notification Cards
- Unread cards: highlighted border `ring-1 ring-primary/20`, bold text
- Read cards: subdued `opacity-80`
- **Mark Read / Unread** toggle button per card
- **Delete** button removes from local feed
- Priority badge (LOW | MEDIUM | HIGH | CRITICAL)

---

## Backend Integration

Service: `src/services/notification.service.ts`

| Method | Endpoint | Description |
|---|---|---|
| `getNotifications(filters)` | `GET /api/v1/notifications` | Paginated, filterable |
| `markAsRead(id)` | `PATCH /api/v1/notifications/:id` | Mark read |
| `deleteNotification(id)` | `DELETE /api/v1/notifications/:id` | Remove |

---

## Future Enhancements

- [ ] WebSocket / SSE real-time push (live unread badge in sidebar)
- [ ] Notification grouping by time (Today, Yesterday, This Week)
- [ ] Notification preferences page (per-type email/SMS opt-out)
- [ ] Priority-based sound/visual alerts for `CRITICAL` notifications
