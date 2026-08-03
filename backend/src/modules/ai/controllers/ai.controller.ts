import { Request, Response } from 'express';
import { z } from 'zod';
import { aiCopilotService } from '../services/ai.service';

const chatSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['system', 'user', 'assistant']),
      content: z.string().min(1, 'Message content cannot be empty'),
    })
  ).min(1, 'At least one message is required'),
});

export class AICopilotController {
  /**
   * Retrieves aggregated AI insights and predictive analytics.
   */
  async getInsights(req: Request, res: Response): Promise<void> {
    try {
      const user = req.authenticatedUser;
      const companyId = user?.roleName === 'Administrator' ? (req.query.companyId as string) : user?.companyId;

      const data = await aiCopilotService.getInsights(companyId);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to retrieve AI insights';
      res.status(500).json({
        success: false,
        message,
      });
    }
  }

  /**
   * Processes chat interactions with Groq AI Operations Copilot.
   */
  async chat(req: Request, res: Response): Promise<void> {
    const parseResult = chatSchema.safeParse(req.body);

    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: parseResult.error.issues.map((i) => i.message),
      });
      return;
    }

    try {
      const user = req.authenticatedUser;
      const companyId = user?.roleName === 'Administrator' ? undefined : user?.companyId;

      const result = await aiCopilotService.chat(parseResult.data.messages, companyId);

      if (!result.success) {
        res.status(500).json({
          success: false,
          message: result.message,
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          content: result.content,
          usage: result.usage,
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to process AI Copilot conversation';
      res.status(500).json({
        success: false,
        message,
      });
    }
  }
}

export const aiCopilotController = new AICopilotController();
