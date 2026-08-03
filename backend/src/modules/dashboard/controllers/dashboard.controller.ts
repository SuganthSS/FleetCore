import { Request, Response } from 'express';
import { z } from 'zod';
import { dashboardService } from '../services/dashboard.service';

const dashboardQuerySchema = z.object({
  companyId: z
    .string()
    .uuid({ message: 'Invalid Company ID UUID format' })
    .optional(),
});

export class DashboardController {
  /**
   * Handles retrieving aggregated dashboard KPIs.
   * Validates optional query companyId, determines tenant scope based on user role,
   * delegates to `dashboardService.getDashboardOverview()`, and returns standardized API response.
   */
  async getDashboardOverview(req: Request, res: Response): Promise<void> {
    const queryResult = dashboardQuerySchema.safeParse(req.query);

    if (!queryResult.success) {
      const formattedErrors = queryResult.error.issues.map(
        (issue) => issue.message
      );
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: formattedErrors,
      });
      return;
    }

    try {
      const user = req.authenticatedUser;
      let targetCompanyId: string | undefined;

      if (user?.roleName === 'Administrator') {
        targetCompanyId = queryResult.data.companyId;
      } else {
        targetCompanyId = user?.companyId;
      }

      const overviewData = await dashboardService.getDashboardOverview(
        targetCompanyId
      );

      res.status(200).json({
        success: true,
        data: overviewData,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to retrieve dashboard overview';
      let statusCode = 500;

      if (
        message.includes('not found') ||
        message.includes('does not exist')
      ) {
        statusCode = 404;
      }

      res.status(statusCode).json({
        success: false,
        message,
      });
    }
  }
}

export const dashboardController = new DashboardController();
