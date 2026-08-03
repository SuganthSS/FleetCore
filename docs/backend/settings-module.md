# Backend Settings Module (`/api/v1/settings`)

The Settings module handles single-organization Enterprise configuration, Company Profile details, System Preferences, Security Rules, Notifications & Alerts, AI Assistant Configuration, and Infrastructure Integrations.

---

## Access & Authorization
All routes are protected by:
- `authenticate` Middleware
- `authorizeAdministrator` Guard (Restricted exclusively to `Administrator` role)

---

## API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/settings` | Retrieve complete unified organization settings payload |
| `GET` | `/api/v1/settings/company` | Retrieve Company Profile |
| `PUT` | `/api/v1/settings/company` | Update Company Profile |
| `POST` | `/api/v1/settings/company/logo` | Upload/Replace Company Logo via Cloudinary |
| `DELETE` | `/api/v1/settings/company/logo` | Remove Company Logo |
| `GET` | `/api/v1/settings/general` | Retrieve General/Appearance preferences |
| `PUT` | `/api/v1/settings/general` | Update General/Appearance preferences |
| `GET` | `/api/v1/settings/security` | Retrieve Security Policies & API Key taxonomy |
| `PUT` | `/api/v1/settings/security` | Update Security Policies |
| `GET` | `/api/v1/settings/notifications` | Retrieve Notification & Alert Toggles |
| `PUT` | `/api/v1/settings/notifications` | Update Notification Toggles |
| `GET` | `/api/v1/settings/ai` | Retrieve Groq LPU & AI Assistant Settings |
| `PUT` | `/api/v1/settings/ai` | Update Groq LPU & AI Settings |
| `GET` | `/api/v1/settings/integrations` | Retrieve Cloudinary, Neon DB, and Groq Status |
| `PUT` | `/api/v1/settings/integrations` | Enable/Disable specific integrations |
