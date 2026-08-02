# FleetCore Frontend Foundation

**Module**: Frontend Application (`frontend/src`)  
**Phase**: Phase 6 — Frontend Development  
**SPEC**: SPEC-083  
**Status**: Foundation Layer Implemented  

---

## 📐 Architecture Overview

```text
frontend/src/
├── app/            — (reserved for future app-wide config)
├── assets/         — Static assets (icons, images)
├── components/
│   └── ui/         — Reusable primitive UI components
├── features/       — Feature-scoped modules (future)
├── hooks/          — Custom React hooks
├── layouts/        — Page layout shells
├── lib/            — (reserved for third-party lib wrappers)
├── pages/          — Route-level page components
├── providers/      — React context providers
├── routes/         — Router + route guards
├── services/       — Axios API clients
├── store/          — Redux Toolkit store
├── styles/         — Global CSS and design tokens
├── types/          — Shared TypeScript types
└── utils/          — Pure utility functions
```

---

## 🎨 Design System

### Color Palette
- **Primary** — Amber-Orange (`hsl(25, 95%, 53%)` / `#F97316`)
- **Secondary** — Deep Navy (`hsl(213, 57%, 24%)` / `#1E3A5F`)
- **Background** — Off-white / Dark Navy (light/dark modes)
- **Muted** — Subtle gray tones for secondary text

### Typography
- Font: **Inter** (Google Fonts — 300/400/500/600/700/800 weights)
- Feature settings: `rlig`, `calt` (ligatures enabled)
- Antialiasing: enabled

### Spacing & Borders
- Border radius: `--radius: 0.625rem` (10px base)
- Shadows: `card`, `card-hover`, `soft` variants
- Animations: `fade-in`, `slide-up`

---

## ⚙️ Providers

| Provider | Purpose |
| :--- | :--- |
| `ThemeProvider` | Manages light/dark/system theme. Persists to `localStorage`. Applies class to `<html>`. |
| `AuthProvider` | Manages user/token state, login/logout/refresh. Hydrates from `localStorage` on mount. |
| `QueryClientProvider` | TanStack Query client (retry=1, staleTime=30s, no refetchOnWindowFocus). |
| `AppProviders` | Composes all three providers in correct order. Used in `main.tsx`. |

---

## 🛣️ Routing

```text
/                 → Redirect to /dashboard
/login            → LoginPage (PublicRoute + AuthLayout)
/dashboard        → DashboardPage (ProtectedRoute + DashboardLayout)
*                 → NotFoundPage (404)
```

### Route Guards
- **`ProtectedRoute`** — Redirects unauthenticated users to `/login`. Shows `PageLoader` during auth state loading.
- **`PublicRoute`** — Redirects authenticated users to `/dashboard`. Shows `PageLoader` during auth state loading.

---

## 🔐 Authentication Flow

1. App boots → `AuthProvider` reads `authUser` + `accessToken` from `localStorage`.
2. If both present → `user` state hydrated → `isAuthenticated = true`.
3. On login → `authService.login()` called → tokens + user stored in `localStorage` + state.
4. On logout → `authService.logout()` called → `localStorage` cleared → state reset.
5. Token injected into every request via Axios request interceptor.
6. On 401 response → tokens cleared → user redirected to `/login`.

---

## 🌐 API Layer (`services/api.ts`)

- Base URL: `VITE_API_URL` env var (fallback: `http://localhost:5000/api/v1`)
- Timeout: 15,000ms
- **Request interceptor**: Injects `Authorization: Bearer <token>` header.
- **Response interceptor**: Normalizes errors into `Error` instances; handles 401 redirects.

---

## 🧩 Global UI Components

| Component | Purpose |
| :--- | :--- |
| `LoadingSpinner` | Animated spinner with sm/md/lg sizes |
| `PageLoader` | Full-screen loading overlay with backdrop blur |
| `PageHeader` | Page title + description + optional action slot |
| `EmptyState` | Dashed border empty panel with icon, title, description |
| `ErrorState` | Destructive-styled error panel with retry button |
| `ConfirmDialog` | Modal confirmation dialog with backdrop, destructive variant |

---

## 🗂️ Layouts

| Layout | Purpose |
| :--- | :--- |
| `PublicLayout` | Bare wrapper for unrestricted public pages |
| `AuthLayout` | Centered card layout for login/register pages |
| `DashboardLayout` | 2-column sidebar + topbar shell for authenticated pages |

---

## 🏗️ State Management

- **TanStack Query**: Server state — API caching, background refetch, loading/error states.
- **Redux Toolkit**: Client-only global state (configured empty in SPEC-083, expanded in future SPECs).
- **React Context**: Auth state, Theme state.
