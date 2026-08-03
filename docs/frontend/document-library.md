# Document Library — FleetCore Enterprise

## Overview

The **Document Library** is a centralized enterprise file repository for vehicle registration certificates, driver CDL permits, delivery manifests, maintenance invoices, shipment waybills, and safety/compliance audit reports.

## Route

```
/documents
```

---

## Component Architecture

```
DocumentLibraryPage
├── DocumentsHeader       — Page title, total count, Refresh & Upload Document CTAs
├── DocumentToolbar       — Search input + Category filter tabs + Grid/Table view toggle
├── DocumentCards         — Responsive grid of document cards with preview/download/delete
└── DocumentUploader      — Modal dialog for uploading a new file with category & tags
```

---

## Services

| Service | File | Endpoint |
|---|---|---|
| `documentService` | `src/services/document.service.ts` | `/api/v1/documents` |

### Key interfaces

```ts
interface DocumentItem {
  id: string;
  name: string;
  category: 'VEHICLE' | 'DRIVER' | 'TRIP' | 'SHIPMENT' | 'MAINTENANCE' | 'COMPLIANCE';
  fileType: 'PDF' | 'DOCX' | 'XLSX' | 'PNG' | 'JPG';
  sizeBytes: number;
  url: string;
  uploadedBy: string;
  tags: string[];
  createdAt: string;
}
```

---

## Features

### Document Cards Grid
- Each card shows: file type badge, category tag, name, file size, upload date, tags, uploader name
- **Actions per card**: Eye (Preview), Download (anchor `href`), Delete (removes from state)
- Hover state lifts border to primary color

### Document Toolbar
- **Search**: Filters by `doc.name` or any `doc.tags` entry (case-insensitive)
- **Category tabs**: ALL | VEHICLE | DRIVER | TRIP | SHIPMENT | MAINTENANCE | COMPLIANCE
- **View toggle**: Grid / Table (table view reserved for future implementation)

### Document Uploader (Modal)
- Drag-and-drop zone + Browse Local Files button
- Category dropdown (6 options)
- Comma-separated tags input
- On upload: adds document to local state, shows success toast

### DocumentsHeader
- Shows total document count badge
- **Refresh** simulates re-fetch (800ms delay + toast)
- **Upload Document** opens `DocumentUploader` modal

---

## State

All managed in `DocumentLibraryPage` with `useState`. Documents list is seeded with demo data; backend integration uses `documentService`.

---

## Future Enhancements

- [ ] Paginated server-side list via `GET /api/v1/documents?page=&limit=&category=&search=`
- [ ] S3/GCS presigned URL generation on upload
- [ ] Table view with sortable columns
- [ ] Bulk delete + download ZIP
- [ ] Document versioning / revision history
