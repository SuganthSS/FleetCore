# Global Search — FleetCore Enterprise

## Overview

The **Global Search** module provides a command-palette-style search overlay that aggregates results from all FleetCore entity domains: vehicles, drivers, trips, shipments, customers, maintenance logs, fuel records, and users.

## Route

```
/search    →  GlobalSearchPage
```

The search overlay (`GlobalSearchOverlay`) is also keyboard-accessible from any page via `Ctrl+K` (planned — currently opened by the page header button).

---

## Component Architecture

```
GlobalSearchPage
└── GlobalSearchOverlay   — Full-screen modal with debounced search + result cards
    ├── Search input
    ├── Category filter tabs (result post-filter)
    ├── Result cards (per entity)
    ├── Recent searches shortcuts
    └── Quick navigation grid
```

---

## Services

| Service | File | Backend Endpoint |
|---|---|---|
| `globalSearchService` | `src/services/globalSearch.service.ts` | `GET /api/v1/search?q=&limit=&categories=` |

### Key interfaces

```ts
interface GlobalSearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Vehicles' | 'Drivers' | 'Trips' | 'Shipments' | 'Maintenance' | 'Fuel Logs' | 'Users' | 'Customers';
  url: string;
}
```

---

## Backend Search Controller

File: `backend/src/modules/search/controllers/search.controller.ts`

**Endpoint:** `GET /api/v1/search`

| Query Param | Type | Description |
|---|---|---|
| `q` | string | Search term (min 2 chars) |
| `limit` | number | Max results per category (default: 5) |
| `categories` | string[] | Filter to specific entity types |

**Searches across:** Vehicles, Drivers, Trips, Shipments, Customers, Users, Maintenance records, Fuel logs

All queries use Prisma `contains` with `mode: 'insensitive'` and are scoped to the authenticated tenant's `companyId`.

---

## Features

### Search Overlay
- Opens as a full-screen backdrop modal
- **`ESC` key** closes the overlay
- **300ms debounce** on input before triggering API call
- Shows a loading spinner while fetching
- Empty state with "No matching results" guidance

### Category Post-Filter Tabs
- After results load, filter by: ALL | Vehicles | Drivers | Trips | Shipments | Maintenance | Fuel Logs
- Applied client-side on the returned results array

### Result Cards
- Icon per category (Truck, User, Wrench, Fuel, FileText)
- Title + subtitle (e.g. registration number, driver name)
- Category badge
- Arrow icon on hover
- Click → `navigate(result.url)` and close overlay

### Recent Searches
- Static list of recently searched terms (e.g. `Volvo FH16`, `John Doe`)
- Click a recent search to populate the input immediately

### Quick Navigation
- **AI Fleet Copilot** → `/ai-insights`
- **Document Repository** → `/documents`

---

## Keyboard Shortcuts (Planned)

| Shortcut | Action |
|---|---|
| `Ctrl + K` | Open Global Search overlay from any page |
| `Escape` | Close overlay |
| `↑ / ↓` | Navigate results |
| `Enter` | Select highlighted result |

---

## Future Enhancements

- [ ] Full keyboard navigation (arrow keys + Enter)
- [ ] `Ctrl+K` global hotkey via `useEffect` in `DashboardLayout`
- [ ] Persisted recent searches in `localStorage`
- [ ] Search result highlighting (bold matched substring)
- [ ] Fuzzy matching / vector embedding for semantic search
