import winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

export const logDatabaseEvent = (
  event: 'Connected' | 'Disconnected' | 'Retry' | 'Failure',
  message: string,
  meta?: Record<string, unknown>
) => {
  const logMessage = `[Database ${event}] ${message}`;
  if (event === 'Failure') {
    logger.error(logMessage, meta);
  } else if (event === 'Retry') {
    logger.warn(logMessage, meta);
  } else {
    logger.info(logMessage, meta);
  }
};
