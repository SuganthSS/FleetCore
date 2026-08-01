import { PrismaClient } from '@prisma/client';
import { logDatabaseEvent } from '../utils/logger';

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

const prismaClientSingleton = (): PrismaClient => {
  const client = new PrismaClient({
    log: [
      { emit: 'event', level: 'query' },
      { emit: 'event', level: 'error' },
      { emit: 'event', level: 'info' },
      { emit: 'event', level: 'warn' },
    ],
  });

  return client;
};

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}

export const connectDatabase = async (): Promise<void> => {
  try {
    await prisma.$connect();
    logDatabaseEvent('Connected', 'Successfully connected to Neon PostgreSQL database.');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logDatabaseEvent('Failure', `Failed to connect to database: ${errorMessage}`, { error });
    process.exit(1);
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await prisma.$disconnect();
    logDatabaseEvent('Disconnected', 'Disconnected from PostgreSQL database.');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logDatabaseEvent('Failure', `Error disconnecting from database: ${errorMessage}`, { error });
  }
};

const handleGracefulShutdown = async (signal: string): Promise<void> => {
  logDatabaseEvent('Disconnected', `Received ${signal}. Shutting down database client...`);
  await disconnectDatabase();
  process.exit(0);
};

process.on('SIGINT', () => void handleGracefulShutdown('SIGINT'));
process.on('SIGTERM', () => void handleGracefulShutdown('SIGTERM'));
