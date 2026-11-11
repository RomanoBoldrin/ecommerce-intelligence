/**
 * Prisma Client Singleton
 * -----------------------
 * This file is responsible for creating and exporting a single shared instance
 * of PrismaClient across the entire application.
 */

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

const globalForPrisma = globalThis;

let pool = globalForPrisma.__prisma_pool;
if (!pool) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  globalForPrisma.__prisma_pool = pool;
}

/** @type {import('@prisma/client').PrismaClient} */
export const prisma =
  globalForPrisma.__prisma ||
  new PrismaClient({
    adapter: new PrismaPg(pool),
  });

prisma.__pool = pool;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.__prisma = prisma;
}
