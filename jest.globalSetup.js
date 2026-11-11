import fs from "node:fs";
import path from "node:path";

function loadEnvFile(envPath) {
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const match = trimmed.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
  }
}

export default async function globalSetup() {
  loadEnvFile(path.resolve(process.cwd(), ".env.test"));

  const { default: orchestrator } = await import(
    "./src/tests/orchestrator/orchestrator.mjs"
  );
  const { prisma } = await import("./src/infra/prisma.cjs");

  await orchestrator.clearDatabase();

  await prisma.$disconnect();
  if (prisma.__pool) {
    await prisma.__pool.end();
  }
}
