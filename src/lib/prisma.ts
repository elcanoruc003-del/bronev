/**
 * Prisma client singleton — safe for both development and production.
 * Run `npm install` + `npx prisma generate` to resolve the @prisma/client import.
 */

// @ts-ignore — @prisma/client is available after `npm install && npx prisma generate`
import { PrismaClient } from '@prisma/client';

// @ts-ignore
type PrismaClientT = InstanceType<typeof PrismaClient>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientT | undefined;
};

export const prisma: PrismaClientT =
  globalForPrisma.prisma ??
  // @ts-ignore
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? (['query', 'error', 'warn'] as const)
        : (['error'] as const),
    errorFormat: 'minimal',
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

export async function disconnectDatabase(): Promise<void> {
  try {
    await prisma.$disconnect();
  } catch (error) {
    console.error('Database disconnect error:', error);
  }
}
