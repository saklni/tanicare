import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

const rawConnectionString = process.env.DATABASE_URL ?? "";
let cleanedUrl = rawConnectionString;

try {
  if (rawConnectionString) {
    const parsed = new URL(rawConnectionString);
    parsed.searchParams.delete("sslmode");
    cleanedUrl = parsed.toString();
  }
} catch {
  cleanedUrl = rawConnectionString;
}

const pool =
  globalForPrisma.pool ??
  new Pool({
    connectionString: cleanedUrl,
    ssl: { rejectUnauthorized: false },
  });

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pool = pool;
}

export { Role, OrderStatus } from "@prisma/client";
export * from "@prisma/client";
