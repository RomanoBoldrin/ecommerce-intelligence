import crypto from "node:crypto";

import cookie from "./cookie.js";
import { prisma as db } from "./prisma.js";

const SESSION_DURATION_IN_MILLISECONDS = 60 * 60 * 24 * 30 * 1000; // 30 days
const SESSION_DURATION_IN_SECONDS = SESSION_DURATION_IN_MILLISECONDS / 1000;
const SESSION_COOKIE_NAME = "session_id";

async function create(userId) {
  const rawSessionToken = generateSessionToken();
  const sessionTokenHash = hashSessionToken(rawSessionToken);
  const expiresAt = new Date(Date.now() + SESSION_DURATION_IN_MILLISECONDS);

  const createdSession = await db.authSession.create({
    data: {
      tokenHash: sessionTokenHash,
      userId,
      expiresAt,
    },
    select: {
      sessionId: true,
      userId: true,
      expiresAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const sessionCookie = createSessionCookie(rawSessionToken);

  return {
    session: createdSession,
    sessionCookie,
  };
}

async function findValidSessionByToken(rawSessionToken) {
  if (!rawSessionToken || typeof rawSessionToken !== "string") {
    return null;
  }

  const sessionTokenHash = hashSessionToken(rawSessionToken);

  return await db.authSession.findFirst({
    where: {
      tokenHash: sessionTokenHash,
      expiresAt: {
        gt: new Date(),
      },
    },
    select: {
      sessionId: true,
      userId: true,
      expiresAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

// Retain camelCase alias for backward compatibility
const findValidSessionbyToken = findValidSessionByToken;

async function renew(sessionId, rawSessionToken) {
  const expiresAt = new Date(Date.now() + SESSION_DURATION_IN_MILLISECONDS);

  const renewedSession = await db.authSession.update({
    where: {
      sessionId,
    },
    data: {
      expiresAt,
    },
    select: {
      sessionId: true,
      userId: true,
      expiresAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const sessionCookie = createSessionCookie(rawSessionToken);

  return {
    session: renewedSession,
    sessionCookie,
  };
}

async function expireById(sessionId) {
  return await db.authSession.update({
    where: {
      sessionId,
    },
    data: {
      expiresAt: new Date(),
    },
    select: {
      sessionId: true,
      userId: true,
      expiresAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

async function expireAllByUserId(userId) {
  return await db.authSession.updateMany({
    where: {
      userId,
      expiresAt: {
        gt: new Date(),
      },
    },
    data: {
      expiresAt: new Date(),
    },
  });
}

function generateSessionToken() {
  return crypto.randomBytes(48).toString("hex");
}

function hashSessionToken(sessionToken) {
  return crypto.createHash("sha256").update(sessionToken).digest("hex");
}

function createSessionCookie(sessionToken) {
  return cookie.serialize(SESSION_COOKIE_NAME, sessionToken, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: SESSION_DURATION_IN_SECONDS,
    secure: process.env.NODE_ENV === "production",
  });
}

function clearSessionCookie() {
  return cookie.serialize(SESSION_COOKIE_NAME, "invalid", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: -1,
    secure: process.env.NODE_ENV === "production",
  });
}

const session = {
  create,
  findValidSessionByToken,
  findValidSessionbyToken,
  renew,
  expireById,
  expireAllByUserId,
  hashSessionToken,
  createSessionCookie,
  clearSessionCookie,
  SESSION_COOKIE_NAME,
  SESSION_DURATION_IN_MILLISECONDS,
  SESSION_DURATION_IN_SECONDS,
};

export default session;
