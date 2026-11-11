import crypto from "node:crypto";
import passwordUtils from "@/infra/password.js";
import { prisma as db } from "@/infra/prisma.js";

export function createMockRequest({
  method = "GET",
  url = "/",
  body = {},
  headers = {},
  cookies = {},
} = {}) {
  return {
    method,
    url,
    body,
    headers: { ...headers },
    cookies: { ...cookies },
  };
}

export function createMockResponse() {
  const res = {
    statusCode: 200,
    headers: {},
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    },
    setHeader(name, value) {
      this.headers[name.toLowerCase()] = value;
      return this;
    },
    getHeader(name) {
      return this.headers[name.toLowerCase()];
    },
    end() {
      return this;
    },
  };
  return res;
}

export async function createTestUser({
  name = "Test User",
  email,
  password = "Password123!",
  role = "ANALYST",
  isActive = true,
} = {}) {
  const userEmail =
    email || `user_${crypto.randomBytes(6).toString("hex")}@example.com`;
  const passwordHash = await passwordUtils.hash(password);

  const user = await db.user.create({
    data: {
      name,
      email: userEmail.toLowerCase(),
      passwordHash,
      role,
      isActive,
    },
  });

  return {
    user,
    rawPassword: password,
  };
}

export async function createTestSession(
  userId,
  { expired = false, expiresInMs = 1000 * 60 * 60 * 24 } = {},
) {
  const rawToken = crypto.randomBytes(48).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
  const expiresAt = expired
    ? new Date(Date.now() - 1000 * 60)
    : new Date(Date.now() + expiresInMs);

  const session = await db.authSession.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
    },
  });

  return {
    session,
    rawToken,
  };
}

export async function createTestResetToken(
  userId,
  { expired = false, used = false } = {},
) {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
  const expiresAt = expired
    ? new Date(Date.now() - 1000 * 60)
    : new Date(Date.now() + 1000 * 60 * 60);
  const usedAt = used ? new Date() : null;

  const resetToken = await db.passwordResetToken.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
      usedAt,
    },
  });

  return {
    resetToken,
    rawToken,
  };
}

export async function clearDatabase() {
  await db.$executeRawUnsafe(`
    TRUNCATE TABLE
      "password_reset_tokens",
      "auth_sessions",
      "users"
    CASCADE;
  `);
}

const testHelpers = {
  createMockRequest,
  createMockResponse,
  createTestUser,
  createTestSession,
  createTestResetToken,
  clearDatabase,
};

export default testHelpers;

