import { Request, Response } from 'express';
import { auditService } from '../services/audit.service';
import { auditQuerySchema } from '../validators/audit.validator';

export const AuditController = {
  async getAuditLogs(req: Request, res: Response): Promise<void> {
    try {
      const parsedQuery = auditQuerySchema.parse(req.query);
      const result = await auditService.getAuditLogs(parsedQuery);

      res.status(200).json({
        success: true,
        data: result.logs,
        meta: result.meta,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Failed to retrieve audit logs',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },

  async getAuditLogById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const log = await auditService.getAuditLogById(id);

      res.status(200).json({
        success: true,
        data: log,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: 'Audit log not found',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },

  async getAuditMeta(_req: Request, res: Response): Promise<void> {
    try {
      const meta = await auditService.getAuditMeta();

      res.status(200).json({
        success: true,
        data: meta,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve audit metadata',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },
};
