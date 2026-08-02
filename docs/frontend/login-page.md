# FleetCore Login Page

**Module**: Authentication Interface (`frontend/src/pages/LoginPage.tsx`)  
**Phase**: Phase 6 — Frontend Development  
**SPEC**: SPEC-084  
**Status**: Implemented & Production-Ready  

---

## 📐 Layout & Visual Design

The login page utilizes a modern responsive split-screen layout designed around the premium logistics SaaS aesthetic:

- **Left Section (Desktop only)**:
  - Deep Navy background (`bg-navy-950`) with soft decorative gradient highlights (`blur-[120px]`).
  - Brand header containing the FleetCore logo icon and typography.
  - Bold product tagline: `SMART TRACKING, CLEAR PATHS` with Amber-Orange primary highlighting.
  - Structured stats grid demonstrating on-time flow (95%), active hubs (80+), and 24/7 security.
  - Floating mock visualization widgets showing system status, active shipment metrics, and daily efficiency gains with hover-lift micro-animations.
- **Right Section (Mobile, Tablet, Desktop)**:
  - Clean centered card form flow on a light background.
  - Fully responsive, collapsing into a single-column layout on mobile and tablet devices.
  - Standardized "Powered by FleetCore Platform" footer branding.

---

## 🧩 Components

- **`Input` (`components/ui/Input.tsx`)**:
  - Reusable form control wrapping standard text, email, and password types.
  - Features validation state rendering with custom red borders and error helper text.
  - Integrated password visibility toggling using a clean show/hide action button.
- **`Button` (`components/ui/button.tsx`)**:
  - Utilizes active state loading triggers showing the `LoadingSpinner` when submitting credentials.
- **`LoadingSpinner` (`components/ui/LoadingSpinner.tsx`)**:
  - Reusable SVG loader.

---

## 🔒 Form Validation & Authentication Flow

- **Form Management**: Handled via `react-hook-form` coupled with the `zodResolver`.
- **Validation Schema**:
  - `email`: Required, valid email pattern.
  - `password`: Required, minimum 8 characters.
  - `rememberMe`: Optional boolean flag.
- **API Integration**:
  - Delegates authentication request to `useAuth` provider hook which calls the backend endpoint `/auth/login`.
  - On Success: Stores user metadata and JWTs in `localStorage`, then navigates the user to their target route (defaults to `/dashboard`).
  - On Failure: Captures backend error messages and renders a descriptive error alert to prevent blind authentication failures.
  - During submission, form controls and actions are disabled to prevent duplicate submissions.

---

## ♿ Accessibility & Micro-Animations

- **Accessibility (a11y)**:
  - Standard form elements use explicit labels, placeholders, and autocomplete values (`email`, `current-password`).
  - Interactive elements feature clear hover, active, and outline focus indicators.
  - Password visibility button contains descriptive `aria-label` attributes.
- **Micro-Animations**:
  - Subtle slide-up transitions (`animate-slide-up`) for error notices.
  - Fade-in animation (`animate-fade-in`) for validation notices.
  - Smooth hover scaling and translations on floating stats cards to offer depth.
