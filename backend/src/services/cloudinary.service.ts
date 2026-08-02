import { UploadApiResponse, UploadApiOptions } from 'cloudinary';
import { cloudinaryConfig } from '../config/cloudinary.config';
import { logger } from '../utils/logger';
import { UploadFolderType } from '../constants/upload.constants';
import streamifier from 'streamifier';
import fs from 'fs';

/**
 * Helper to upload a buffer stream to Cloudinary.
 */
const uploadFromBuffer = (
  buffer: Buffer,
  options: UploadApiOptions
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    if (!cloudinaryConfig.isConfigured) {
      return reject(new Error('Cloudinary is not configured on this server instance.'));
    }
    const uploadStream = cloudinaryConfig.cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) {
          logger.error('Cloudinary stream upload error:', error);
          return reject(error);
        }
        if (!result) {
          return reject(new Error('Cloudinary upload returned no result metadata.'));
        }
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

/**
 * Service providing reusable Cloudinary file uploading and deleting functions.
 */
export const cloudinaryService = {
  /**
   * Upload an image to Cloudinary (from Buffer or Local File Path).
   */
  async uploadImage(
    fileInput: Buffer | string,
    subfolder: UploadFolderType,
    fileName?: string
  ): Promise<UploadApiResponse> {
    if (!cloudinaryConfig.isConfigured) {
      throw new Error('Cloudinary is not configured. Upload failed.');
    }

    const folderPath = `${cloudinaryConfig.folder}/${subfolder}`;
    const options: UploadApiOptions = {
      folder: folderPath,
      resource_type: 'image',
      public_id: fileName,
      overwrite: true,
    };

    try {
      if (Buffer.isBuffer(fileInput)) {
        return await uploadFromBuffer(fileInput, options);
      } else {
        // String representing local file path
        const result = await cloudinaryConfig.cloudinary.uploader.upload(
          fileInput,
          options
        );
        return result;
      }
    } catch (error) {
      logger.error(`Error uploading image to Cloudinary folder ${folderPath}:`, error);
      throw error;
    } finally {
      // Automatic resource cleanup for local files
      if (typeof fileInput === 'string') {
        try {
          if (fs.existsSync(fileInput)) {
            await fs.promises.unlink(fileInput);
            logger.info(`Cleaned up temporary local file: ${fileInput}`);
          }
        } catch (cleanupError) {
          logger.error(`Failed to clean up local file ${fileInput}:`, cleanupError);
        }
      }
    }
  },

  /**
   * Upload a raw document/file to Cloudinary (from Buffer or Local File Path).
   */
  async uploadDocument(
    fileInput: Buffer | string,
    subfolder: UploadFolderType,
    fileName?: string
  ): Promise<UploadApiResponse> {
    if (!cloudinaryConfig.isConfigured) {
      throw new Error('Cloudinary is not configured. Upload failed.');
    }

    const folderPath = `${cloudinaryConfig.folder}/${subfolder}`;
    const options: UploadApiOptions = {
      folder: folderPath,
      resource_type: 'raw',
      public_id: fileName,
      overwrite: true,
    };

    try {
      if (Buffer.isBuffer(fileInput)) {
        return await uploadFromBuffer(fileInput, options);
      } else {
        // String representing local file path
        const result = await cloudinaryConfig.cloudinary.uploader.upload(
          fileInput,
          options
        );
        return result;
      }
    } catch (error) {
      logger.error(`Error uploading document to Cloudinary folder ${folderPath}:`, error);
      throw error;
    } finally {
      // Automatic resource cleanup for local files
      if (typeof fileInput === 'string') {
        try {
          if (fs.existsSync(fileInput)) {
            await fs.promises.unlink(fileInput);
            logger.info(`Cleaned up temporary local file: ${fileInput}`);
          }
        } catch (cleanupError) {
          logger.error(`Failed to clean up local file ${fileInput}:`, cleanupError);
        }
      }
    }
  },

  /**
   * Delete a file from Cloudinary given its publicId.
   */
  async deleteFile(
    publicId: string,
    resourceType: 'image' | 'raw' = 'image'
  ): Promise<{ result: string }> {
    if (!cloudinaryConfig.isConfigured) {
      throw new Error('Cloudinary is not configured. Delete failed.');
    }

    try {
      const response = await cloudinaryConfig.cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
      });
      logger.info(`Cloudinary deletion completed for publicId: ${publicId}`, response);
      return response;
    } catch (error) {
      logger.error(`Error deleting file with publicId ${publicId} from Cloudinary:`, error);
      throw error;
    }
  },
};
export default cloudinaryService;
