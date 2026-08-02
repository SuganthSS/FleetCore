# Cloudinary File Storage Documentation (SPEC-099)

This document provides a reference for the Cloudinary file storage backend infrastructure implemented in the FleetCore platform.

---

## ⚙️ Environment Variables

The storage layer relies on the following key environment variables configured in `backend/.env`:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=FleetCore
```

If these environment variables are missing, the configuration module logs a warning and disables uploads gracefully without crashing the application boot cycle.

---

## 🏗️ Reusable Folder Constants

All uploads use virtual folder directories dynamically created on Cloudinary. The following folder constants are exposed from `src/constants/upload.constants.ts`:

- `UPLOAD_FOLDER.COMPANY`: For company logos and profiles (`companies/`)
- `UPLOAD_FOLDER.USER`: For user avatars (`users/`)
- `UPLOAD_FOLDER.DRIVER`: For driver licensing documents (`drivers/`)
- `UPLOAD_FOLDER.VEHICLE`: For vehicle imagery (`vehicles/`)
- `UPLOAD_FOLDER.CUSTOMER`: For customer documentation (`customers/`)
- `UPLOAD_FOLDER.SHIPMENT`: For shipment waybills and bills of lading (`shipments/`)
- `UPLOAD_FOLDER.MAINTENANCE`: For work order receipts (`maintenance/`)
- `UPLOAD_FOLDER.FUEL`: For fuel purchase logs and receipts (`fuel/`)
- `UPLOAD_FOLDER.DOCUMENT`: For general corporate documents (`documents/`)
- `UPLOAD_FOLDER.AI`: For machine learning outputs and logs (`ai/`)
- `UPLOAD_FOLDER.MISC`: For miscellaneous assets (`misc/`)

---

## 🔌 Reusable Upload Service

The service `src/services/cloudinary.service.ts` exports the following asynchronous helpers:

### 1. `uploadImage(fileInput, subfolder, fileName)`
- **Parameters**: 
  - `fileInput`: `Buffer` or `string` (local file path)
  - `subfolder`: `UploadFolderType` (one of the constants above)
  - `fileName`: Optional custom file name
- **Features**: Automatically deletes/unlinks local files from the filesystem after completing or failing the upload. Force secure HTTPS URLs by default.

### 2. `uploadDocument(fileInput, subfolder, fileName)`
- **Parameters**: 
  - Same as `uploadImage`
- **Features**: Uses `resource_type: 'raw'` to allow PDF, CSV, Excel, and JSON document uploads. Automatic local file cleanup.

### 3. `deleteFile(publicId, resourceType)`
- **Parameters**:
  - `publicId`: Cloudinary file public reference identifier
  - `resourceType`: `'image'` or `'raw'` (default `'image'`)
- **Features**: Destroys the asset reference on the Cloudinary cloud storage instance.
