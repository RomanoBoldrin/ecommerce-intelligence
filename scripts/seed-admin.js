import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

// 1. Load environment variables.
// Priority:
// - Existing process.env variables (CLI flags / shell environment)
// - .env.local (if present, for developer overrides)
// - .env.development (local development defaults)
const cwd = process.cwd();
const envLocalPath = path.resolve(cwd, ".env.local");
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
}

const envDevPath = path.resolve(cwd, ".env.development");
if (fs.existsSync(envDevPath)) {
  dotenv.config({ path: envDevPath });
}

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is not defined. Ensure .env.development exists or set DATABASE_URL.",
  );
}

// Safety check: Explicitly refuse to seed remote/production databases
if (
  process.env.NODE_ENV === "production" ||
  process.env.NEON_BRANCH === "production" ||
  databaseUrl.includes("neon.tech")
) {
  throw new Error(
    "Safety check failed: Refusing to run seed against production or remote Neon database. Seeding is only permitted on the local development database.",
  );
}

// Dynamic imports after environment is established
const { prisma } = await import("../src/infra/prisma.js");
const { default: password } = await import("../src/infra/password.js");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WEAK_PASSWORDS = new Set([
  "password",
  "admin",
  "admin123",
  "admin1234",
  "administrator",
  "12345678",
  "123456789",
  "root1234",
  "qwerty123",
  "merchantpulse",
  "merchantpulse123",
]);

/**
 * Validates administrator configuration inputs.
 * Never logs or exposes password contents or hashes.
 */
function validateConfig({ name, email, password: adminPassword }) {
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    throw new Error(
      "Invalid configuration: ADMIN_NAME is required and must not be empty.",
    );
  }

  if (name.trim().length < 2) {
    throw new Error(
      "Invalid configuration: ADMIN_NAME must be at least 2 characters long.",
    );
  }

  if (!email || typeof email !== "string" || email.trim().length === 0) {
    throw new Error(
      "Invalid configuration: ADMIN_EMAIL is required and must not be empty.",
    );
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (!EMAIL_REGEX.test(normalizedEmail)) {
    throw new Error(
      `Invalid configuration: ADMIN_EMAIL "${email}" is not a valid email address.`,
    );
  }

  if (!adminPassword || typeof adminPassword !== "string") {
    throw new Error(
      "Invalid configuration: ADMIN_PASSWORD is required and must be a string.",
    );
  }

  if (adminPassword.length < 8) {
    throw new Error(
      "Invalid configuration: ADMIN_PASSWORD must be at least 8 characters long.",
    );
  }

  const lowerPassword = adminPassword.toLowerCase();
  if (WEAK_PASSWORDS.has(lowerPassword)) {
    throw new Error(
      "Invalid configuration: ADMIN_PASSWORD is too weak (common password pattern). Please choose a stronger password.",
    );
  }

  const emailUserPart = normalizedEmail.split("@")[0];
  if (
    lowerPassword === emailUserPart ||
    lowerPassword === name.trim().toLowerCase()
  ) {
    throw new Error(
      "Invalid configuration: ADMIN_PASSWORD cannot match the user name or email address.",
    );
  }

  // Require letters and at least one digit or special character
  const hasLetter = /[a-zA-Z]/.test(adminPassword);
  const hasNumberOrSymbol = /[\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(
    adminPassword,
  );

  if (!hasLetter || !hasNumberOrSymbol) {
    throw new Error(
      "Invalid configuration: ADMIN_PASSWORD must contain both letters and at least one number or special character.",
    );
  }

  return {
    name: name.trim(),
    email: normalizedEmail,
    password: adminPassword,
  };
}

/**
 * Idempotently creates the administrator account in the local development database.
 * If an account with the specified email already exists, no changes are made.
 *
 * @param {Object} [overrideConfig]
 * @returns {Promise<{ action: 'created' | 'skipped', user: { id: string, name: string, email: string, role: string, isActive: boolean } }>}
 */
export async function seedAdmin(overrideConfig = {}) {
  const rawConfig = {
    name: overrideConfig.name ?? process.env.ADMIN_NAME,
    email: overrideConfig.email ?? process.env.ADMIN_EMAIL,
    password: overrideConfig.password ?? process.env.ADMIN_PASSWORD,
  };

  const validConfig = validateConfig(rawConfig);

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: validConfig.email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (existingUser) {
      console.log(
        `[seed-admin] Administrator account already exists for "${validConfig.email}". Skipping creation (no data was modified).`,
      );
      return {
        action: "skipped",
        user: existingUser,
      };
    }

    const passwordHash = await password.hash(validConfig.password);

    const createdUser = await prisma.user.create({
      data: {
        name: validConfig.name,
        email: validConfig.email,
        passwordHash,
        role: "ADMIN",
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    console.log(
      `[seed-admin] Successfully created administrator "${createdUser.name}" <${createdUser.email}> (Role: ${createdUser.role}, Active: ${createdUser.isActive}).`,
    );

    return {
      action: "created",
      user: createdUser,
    };
  } finally {
    // Only disconnect if running directly as a standalone script
    if (isDirectExecution()) {
      await prisma.$disconnect();
    }
  }
}

function isDirectExecution() {
  if (!process.argv[1]) return false;
  return fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
}

if (isDirectExecution()) {
  seedAdmin()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error(`[seed-admin] ${error.message}`);
      process.exit(1);
    });
}
