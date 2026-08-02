# SPEC-099: Cloudinary File Storage Prompt Documentation

## Context
This document logs the development actions for Cloudinary file storage configuration and helpers.

## Goals & Objectives
- Configure the backend to support Cloudinary media storage.
- Provide helper upload/delete functions supporting both Buffer streams and local filepath uploads.
- Secure media URLs via HTTPS.
- Create virtual subfolder organization under `FleetCore/`.
- Ensure type-safe imports and zero warnings during compilation.

## Implementation Details
1. **Installed Dependencies**: `cloudinary` and `streamifier`.
2. **Config**: `backend/src/config/cloudinary.config.ts`.
3. **Constants**: `backend/src/constants/upload.constants.ts`.
4. **Service**: `backend/src/services/cloudinary.service.ts`.
