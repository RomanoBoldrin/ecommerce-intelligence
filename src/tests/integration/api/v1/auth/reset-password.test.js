import resetPasswordHandler from "@/pages/api/v1/auth/reset-password/index.js";
import sessionsHandler from "@/pages/api/v1/auth/sessions/index.js";
import passwordUtils from "@/infra/password.js";
import { prisma as db } from "@/infra/prisma.js";
import {
  clearDatabase,
  createMockRequest,
  createMockResponse,
  createTestResetToken,
  createTestSession,
  createTestUser,
} from "@/tests/testHelpers.js";

describe("API /api/v1/auth/reset-password", () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  it("should successfully reset password, update hash, mark token used, and invalidate active sessions", async () => {
    const { user, rawPassword: oldPassword } = await createTestUser({
      email: "reset.target@merchantpulse.com",
      password: "OldPassword123!",
      isActive: true,
    });

    // Create an active session that should be revoked after password reset
    const { rawToken: sessionToken } = await createTestSession(user.id);

    // Create a valid reset token
    const { resetToken, rawToken: resetTokenString } =
      await createTestResetToken(user.id);

    const newPassword = "BrandNewSecurePassword456!";

    const req = createMockRequest({
      method: "POST",
      body: {
        token: resetTokenString,
        password: newPassword,
      },
    });
    const res = createMockResponse();

    await resetPasswordHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      message: "Password has been successfully reset.",
    });

    // 1. Verify token was marked as used
    const updatedToken = await db.passwordResetToken.findUnique({
      where: { id: resetToken.id },
    });
    expect(updatedToken.usedAt).not.toBeNull();

    // 2. Verify all user sessions were invalidated
    const activeSessions = await db.authSession.findMany({
      where: {
        userId: user.id,
        expiresAt: {
          gt: new Date(),
        },
      },
    });
    expect(activeSessions.length).toBe(0);

    // 3. Verify old session token can no longer authenticate
    const sessionReq = createMockRequest({
      method: "GET",
      cookies: { session_id: sessionToken },
    });
    const sessionRes = createMockResponse();
    await sessionsHandler(sessionReq, sessionRes);
    expect(sessionRes.statusCode).toBe(401);

    // 4. Verify user can log in with new password
    const newLoginReq = createMockRequest({
      method: "POST",
      body: {
        email: "reset.target@merchantpulse.com",
        password: newPassword,
      },
    });
    const newLoginRes = createMockResponse();
    await sessionsHandler(newLoginReq, newLoginRes);
    expect(newLoginRes.statusCode).toBe(201);

    // 5. Verify user cannot log in with old password
    const oldLoginReq = createMockRequest({
      method: "POST",
      body: {
        email: "reset.target@merchantpulse.com",
        password: oldPassword,
      },
    });
    const oldLoginRes = createMockResponse();
    await sessionsHandler(oldLoginReq, oldLoginRes);
    expect(oldLoginRes.statusCode).toBe(401);
  });

  it("should reject an already used reset token (single-use enforcement)", async () => {
    const { user } = await createTestUser();
    const { rawToken } = await createTestResetToken(user.id, { used: true });

    const req = createMockRequest({
      method: "POST",
      body: {
        token: rawToken,
        password: "NewPassword123!",
      },
    });
    const res = createMockResponse();

    await resetPasswordHandler(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.body.name).toBe("ValidationError");
    expect(res.body.message).toContain("invalid or has expired");
  });

  it("should reject an expired reset token", async () => {
    const { user } = await createTestUser();
    const { rawToken } = await createTestResetToken(user.id, { expired: true });

    const req = createMockRequest({
      method: "POST",
      body: {
        token: rawToken,
        password: "NewPassword123!",
      },
    });
    const res = createMockResponse();

    await resetPasswordHandler(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.body.name).toBe("ValidationError");
    expect(res.body.message).toContain("invalid or has expired");
  });

  it("should reject a non-existent or tampered reset token", async () => {
    const req = createMockRequest({
      method: "POST",
      body: {
        token: "non_existent_or_tampered_token",
        password: "NewPassword123!",
      },
    });
    const res = createMockResponse();

    await resetPasswordHandler(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.body.name).toBe("ValidationError");
  });

  it("should reject reset token belonging to an inactive user", async () => {
    const { user } = await createTestUser({ isActive: false });
    const { rawToken } = await createTestResetToken(user.id);

    const req = createMockRequest({
      method: "POST",
      body: {
        token: rawToken,
        password: "NewPassword123!",
      },
    });
    const res = createMockResponse();

    await resetPasswordHandler(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.body.name).toBe("ValidationError");
  });

  it("should reject passwords shorter than 8 characters", async () => {
    const { user } = await createTestUser();
    const { rawToken } = await createTestResetToken(user.id);

    const req = createMockRequest({
      method: "POST",
      body: {
        token: rawToken,
        password: "short",
      },
    });
    const res = createMockResponse();

    await resetPasswordHandler(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.body.name).toBe("ValidationError");
    expect(res.body.message).toContain("at least 8 characters");
  });

  it("should reject missing token with 400 ValidationError", async () => {
    const req = createMockRequest({
      method: "POST",
      body: {
        password: "ValidPassword123!",
      },
    });
    const res = createMockResponse();

    await resetPasswordHandler(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.body.name).toBe("ValidationError");
  });

  it("should return 405 MethodNotAllowedError for non-POST methods", async () => {
    const req = createMockRequest({
      method: "GET",
    });
    const res = createMockResponse();

    await resetPasswordHandler(req, res);

    expect(res.statusCode).toBe(405);
    expect(res.body.name).toBe("MethodNotAllowedError");
  });
});

