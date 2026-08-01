import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  logger.error(err.message, { stack: err.stack });
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};
