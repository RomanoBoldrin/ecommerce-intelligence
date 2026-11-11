import crypto from "node:crypto";

import { ValidationError } from "./errors.js";
import password from "./password.js";
import { prisma as db } from "./prisma.js";

const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

function hashToken(rawToken) {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

async function requestPasswordReset(email) {
  if (!email || typeof email !== "string") {
    throw new ValidationError({
      message: "A valid email address is required.",
      action: "Provide a valid email address.",
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  const user = await db.user.findUnique({
    where: { email: normalizedEmail },
  });

  // Never reveal whether the email exists.
  // If user does not exist or is inactive, silently exit.
  if (!user || !user.isActive) {
    return {
      created: false,
    };
  }

  const rawToken = generateToken();
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);

  // Invalidate any existing unused reset tokens for this user
  await db.passwordResetToken.updateMany({
    where: {
      userId: user.id,
      usedAt: null,
      expiresAt: {
        gt: new Date(),
      },
    },
    data: {
      usedAt: new Date(),
    },
  });

  await db.passwordResetToken.create({
    data: {
      tokenHash,
      userId: user.id,
      expiresAt,
    },
  });

  return {
    created: true,
    rawToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  };
}

async function validateResetToken(rawToken) {
  if (!rawToken || typeof rawToken !== "string") {
    throw new ValidationError({
      message: "This password reset link is invalid or has expired.",
      action: "Request a new password reset link.",
    });
  }

  const tokenHash = hashToken(rawToken);

  const tokenRecord = await db.passwordResetToken.findUnique({
    where: { tokenHash },
    include: {
      user: true,
    },
  });

  const isExpired = tokenRecord && tokenRecord.expiresAt < new Date();
  const isUsed = tokenRecord && tokenRecord.usedAt !== null;
  const isUserInactive = tokenRecord && !tokenRecord.user?.isActive;

  if (!tokenRecord || isExpired || isUsed || isUserInactive) {
    throw new ValidationError({
      message: "This password reset link is invalid or has expired.",
      action: "Request a new password reset link.",
    });
  }

  return tokenRecord;
}

async function resetPassword({ token, password: newPassword }) {
  if (!token || typeof token !== "string") {
    throw new ValidationError({
      message: "Invalid reset token.",
      action: "Request a new password reset link.",
    });
  }

  if (
    !newPassword ||
    typeof newPassword !== "string" ||
    newPassword.length < 8
  ) {
    throw new ValidationError({
      message: "Password must be at least 8 characters long.",
      action: "Choose a stronger password with at least 8 characters.",
    });
  }

  const tokenRecord = await validateResetToken(token);
  const passwordHash = await password.hash(newPassword);

  await db.$transaction([
    db.user.update({
      where: { id: tokenRecord.userId },
      data: { passwordHash },
    }),
    db.passwordResetToken.update({
      where: { id: tokenRecord.id },
      data: { usedAt: new Date() },
    }),
    db.authSession.updateMany({
      where: {
        userId: tokenRecord.userId,
        expiresAt: {
          gt: new Date(),
        },
      },
      data: {
        expiresAt: new Date(),
      },
    }),
  ]);

  return {
    success: true,
    userId: tokenRecord.userId,
  };
}

const passwordReset = {
  requestPasswordReset,
  validateResetToken,
  resetPassword,
  generateToken,
  hashToken,
  TOKEN_TTL_MS,
};

export default passwordReset;

