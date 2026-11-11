/**
 * Authentication API route.
 *
 * Handles user login, session validation, and logout by creating, verifying,
 * and invalidating server-side sessions.
 *
 * - POST: Validates credentials, checks account active status, creates an
 *         authenticated session in PostgreSQL, and issues an HTTP-only cookie.
 * - GET:  Validates the session cookie and returns authenticated user and
 *         session metadata.
 * - DELETE: Invalidates the current database session and clears the session cookie.
 */

import { createRouter } from "next-connect";

import authentication from "@/infra/authentication.js";
import controller from "@/infra/controller.js";
import cookie from "@/infra/cookie.js";
import {
  ForbiddenError,
  UnauthorizedError,
  ValidationError,
} from "@/infra/errors.js";
import session from "@/infra/session.js";

const router = createRouter();

router.post(postHandler);
router.get(getHandler);
router.delete(deleteHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(request, response) {
  const { email, password } = request.body || {};

  if (!email || !password) {
    throw new ValidationError({
      message: "Missing required fields.",
      action: "Send email and password.",
    });
  }

  const authenticatedUser = await authentication.getAuthenticatedUser({
    email,
    password,
  });

  if (!authenticatedUser.isActive) {
    throw new ForbiddenError({
      message: "User is not active.",
      action: "Contact an administrator to reactivate this user.",
    });
  }

  const { session: createdSession, sessionCookie } = await session.create(
    authenticatedUser.id,
  );

  response.setHeader("Set-Cookie", sessionCookie);

  return response.status(201).json({
    session_id: createdSession.sessionId,
    expires_at: createdSession.expiresAt.toISOString(),
    created_at: createdSession.createdAt.toISOString(),
    updated_at: createdSession.updatedAt.toISOString(),
    user: {
      id: authenticatedUser.id,
      name: authenticatedUser.name,
      email: authenticatedUser.email,
      role: authenticatedUser.role,
      is_active: authenticatedUser.isActive,
    },
  });
}

async function getHandler(request, response) {
  const { user, session: validSession } =
    await authentication.getAuthenticatedUserFromRequest(request);

  return response.status(200).json({
    session_id: validSession.sessionId,
    expires_at: validSession.expiresAt.toISOString(),
    created_at: validSession.createdAt.toISOString(),
    updated_at: validSession.updatedAt.toISOString(),
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      is_active: user.isActive,
    },
  });
}

async function deleteHandler(request, response) {
  let rawSessionToken = request?.cookies?.session_id;

  if (!rawSessionToken && request?.headers?.cookie) {
    const parsedCookies = cookie.parse(request.headers.cookie);
    rawSessionToken = parsedCookies?.session_id;
  }

  if (!rawSessionToken) {
    throw new UnauthorizedError({
      message: "Invalid or expired session.",
      action: "Login to continue.",
    });
  }

  const validSessionObject =
    await session.findValidSessionbyToken(rawSessionToken);

  if (!validSessionObject) {
    throw new UnauthorizedError({
      message: "Invalid or expired session.",
      action: "Login to continue.",
    });
  }

  const expiredSession = await session.expireById(validSessionObject.sessionId);

  controller.clearSessionCookie(response);

  return response.status(200).json({
    session_id: expiredSession.sessionId,
    user_id: expiredSession.userId,
    expires_at: expiredSession.expiresAt.toISOString(),
    created_at: expiredSession.createdAt.toISOString(),
    updated_at: expiredSession.updatedAt.toISOString(),
  });
}
