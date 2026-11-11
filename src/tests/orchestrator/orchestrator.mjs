import { prisma } from "../../infra/prisma.cjs";

async function clearDatabase() {
  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE
      "password_reset_tokens",
      "auth_sessions",
      "users"
    CASCADE;
  `);
}

const orchestrator = {
  clearDatabase,
};

export default orchestrator;
