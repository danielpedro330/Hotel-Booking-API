
import { execSync } from "child_process";
import { PrismaClient } from "@prisma/client";
import { afterAll, beforeEach } from "vitest";

const prisma = new PrismaClient();

// Limpamos todas as tabelas antes de cada teste
beforeEach(async () => {
  const tablenames = await prisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  for (const { tablename } of tablenames) {
    if (tablename !== "_prisma_migrations") {
      try {
        await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${tablename}" RESTART IDENTITY CASCADE;`);
      } catch (e) {
        console.log(e);
      }
    }
  }
});

// Fecha conexão no final
afterAll(async () => {
  await prisma.$disconnect();
});
