const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");
const { Pool } = require("pg");

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

/** @type {import("@prisma/client").PrismaClient} */
const prisma =
  globalForPrisma.__prisma ||
  new PrismaClient({
    adapter: new PrismaPg(pool),
  });

prisma.__pool = pool;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.__prisma = prisma;
}

module.exports = { prisma };
