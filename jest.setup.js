const fs = require("node:fs");
const path = require("node:path");
const nodeCrypto = require("node:crypto");
const { TextEncoder, TextDecoder } = require("node:util");

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

loadEnvFile(path.resolve(process.cwd(), ".env.test"));

global.IS_REACT_ACT_ENVIRONMENT = true;

if (!global.TextEncoder) {
  global.TextEncoder = TextEncoder;
}

if (!global.TextDecoder) {
  global.TextDecoder = TextDecoder;
}

if (!global.crypto) {
  global.crypto = nodeCrypto.webcrypto || nodeCrypto;
}

if (!global.AbortController && typeof AbortController !== "undefined") {
  global.AbortController = AbortController;
}

if (!global.AbortSignal && typeof AbortSignal !== "undefined") {
  global.AbortSignal = AbortSignal;
}

const { prisma } = require("./src/infra/prisma.cjs");

afterAll(async () => {
  await prisma.$disconnect();
  if (prisma.__pool) {
    await prisma.__pool.end();
  }
});
