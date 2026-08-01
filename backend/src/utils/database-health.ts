import { prisma } from '../config/database';
import { logDatabaseEvent } from './logger';

export interface DatabaseHealthResult {
  isHealthy: boolean;
  timestamp: string;
  latencyMs?: number;
  error?: string;
}

export const checkDatabaseHealth = async (): Promise<DatabaseHealthResult> => {
  const startTime = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    const latencyMs = Date.now() - startTime;
    return {
      isHealthy: true,
      timestamp: new Date().toISOString(),
      latencyMs,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logDatabaseEvent('Failure', `Database health check failed: ${errorMessage}`);
    return {
      isHealthy: false,
      timestamp: new Date().toISOString(),
      error: errorMessage,
    };
  }
};
