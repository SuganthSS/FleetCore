import { v2 as cloudinary } from 'cloudinary';
import { logger } from '../utils/logger';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;
const folderName = process.env.CLOUDINARY_FOLDER || 'FleetCore';

let isCloudinaryConfigured = false;

if (!cloudName || !apiKey || !apiSecret) {
  logger.warn(
    '⚠️ Cloudinary file storage env variables are missing. File uploads will be disabled or fall back gracefully.'
  );
} else {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
  isCloudinaryConfigured = true;
  logger.info('🚀 Cloudinary successfully configured for secure media storage.');
}

export const cloudinaryConfig = {
  isConfigured: isCloudinaryConfigured,
  folder: folderName,
  cloudinary,
};
