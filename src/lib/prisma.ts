import { PrismaClient } from '@prisma/client/edge';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'dev' ? ['query'] : [],
});
