import { Request, Response, NextFunction } from 'express';
import { settingsService } from '../services/settings.service';
import {
  CompanyProfileSchema,
  GeneralSettingsSchema,
  SecuritySettingsSchema,
  NotificationSettingsSchema,
  AISettingsSchema,
} from '../validators/settings.validator';

export const SettingsController = {
  // GET /api/v1/settings
  async getAllSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const settings = await settingsService.getAllSettings();
      res.status(200).json({
        success: true,
        data: settings,
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/v1/settings/company
  async getCompanyProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const company = await settingsService.getCompanyProfile();
      res.status(200).json({
        success: true,
        data: company,
      });
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/v1/settings/company
  async updateCompanyProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = CompanyProfileSchema.parse(req.body);
      const updated = await settingsService.updateCompanyProfile(validatedData);
      res.status(200).json({
        success: true,
        message: 'Company profile updated successfully',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/v1/settings/company/logo
  async uploadCompanyLogo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let fileBuffer: Buffer | undefined;
      let filePath: string | undefined;

      if ((req as Request & { file?: { buffer?: Buffer; path?: string } }).file) {
        const file = (req as Request & { file: { buffer?: Buffer; path?: string } }).file;
        fileBuffer = file.buffer;
        filePath = file.path;
      }

      const result = await settingsService.uploadCompanyLogo(fileBuffer, filePath);
      res.status(200).json({
        success: true,
        message: 'Company logo uploaded successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/v1/settings/company/logo
  async deleteCompanyLogo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await settingsService.deleteCompanyLogo();
      res.status(200).json({
        success: true,
        message: 'Company logo deleted successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/v1/settings/general OR /preferences
  async getGeneralSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const general = await settingsService.getGeneralSettings();
      res.status(200).json({
        success: true,
        data: general,
      });
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/v1/settings/general OR /preferences
  async updateGeneralSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = GeneralSettingsSchema.parse(req.body);
      const updated = await settingsService.updateGeneralSettings(validatedData);
      res.status(200).json({
        success: true,
        message: 'General preferences updated successfully',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/v1/settings/security
  async getSecuritySettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const security = await settingsService.getSecuritySettings();
      res.status(200).json({
        success: true,
        data: security,
      });
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/v1/settings/security
  async updateSecuritySettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = SecuritySettingsSchema.parse(req.body);
      const updated = await settingsService.updateSecuritySettings(validatedData);
      res.status(200).json({
        success: true,
        message: 'Security settings updated successfully',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/v1/settings/notifications
  async getNotificationSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const notifications = await settingsService.getNotificationSettings();
      res.status(200).json({
        success: true,
        data: notifications,
      });
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/v1/settings/notifications
  async updateNotificationSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = NotificationSettingsSchema.parse(req.body);
      const updated = await settingsService.updateNotificationSettings(validatedData);
      res.status(200).json({
        success: true,
        message: 'Notification settings updated successfully',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/v1/settings/ai
  async getAISettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ai = await settingsService.getAISettings();
      res.status(200).json({
        success: true,
        data: ai,
      });
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/v1/settings/ai
  async updateAISettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = AISettingsSchema.parse(req.body);
      const updated = await settingsService.updateAISettings(validatedData);
      res.status(200).json({
        success: true,
        message: 'AI settings updated successfully',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/v1/settings/integrations
  async getIntegrationSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const integrations = await settingsService.getIntegrationSettings();
      res.status(200).json({
        success: true,
        data: integrations,
      });
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/v1/settings/integrations
  async updateIntegrationSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { integrationId, enabled } = req.body;
      const updated = await settingsService.updateIntegrationSettings(integrationId, Boolean(enabled));
      res.status(200).json({
        success: true,
        message: 'Integration status updated successfully',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  },
};
