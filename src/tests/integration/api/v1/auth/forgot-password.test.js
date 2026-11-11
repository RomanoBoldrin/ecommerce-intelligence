import forgotPasswordHandler from "@/pages/api/v1/auth/forgot-password/index.js";
import { prisma as db } from "@/infra/prisma.js";
import {
  clearDatabase,
  createMockRequest,
  createMockResponse,
  createTestUser,
} from "@/tests/testHelpers.js";

describe("API /api/v1/auth/forgot-password", () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  it("should accept registered email, generate a hashed token in DB, and return generic 200 message", async () => {
    const { user } = await createTestUser({
      email: "valid.user@merchantpulse.com",
      isActive: true,
    });

    const req = createMockRequest({
      method: "POST",
      body: {
        email: "valid.user@merchantpulse.com",
      },
    });
    const res = createMockResponse();

    await forgotPasswordHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      message:
        "If this email is registered, instructions to reset your password will be sent.",
    });
    expect(res.body).not.toHaveProperty("token");
    expect(res.body).not.toHaveProperty("resetToken");
    expect(res.body).not.toHaveProperty("resetLink");

    // Verify token was stored in database as a hash (not plaintext)
    const tokenRecords = await db.passwordResetToken.findMany({
      where: { userId: user.id },
    });
    expect(tokenRecords.length).toBe(1);
    expect(tokenRecords[0].usedAt).toBeNull();
    expect(tokenRecords[0].expiresAt.getTime()).toBeGreaterThan(Date.now());
    expect(typeof tokenRecords[0].tokenHash).toBe("string");
    expect(tokenRecords[0].tokenHash.length).toBe(64); // SHA-256 hex string
  });

  it("should return the exact same generic 200 response for non-existent email without creating tokens (anti-enumeration)", async () => {
    const req = createMockRequest({
      method: "POST",
      body: {
        email: "nonexistent@merchantpulse.com",
      },
    });
    const res = createMockResponse();

    await forgotPasswordHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      message:
        "If this email is registered, instructions to reset your password will be sent.",
    });

    // Verify no tokens were created in database
    const tokenCount = await db.passwordResetToken.count();
    expect(tokenCount).toBe(0);
  });

  it("should return generic 200 response for inactive user without generating reset tokens", async () => {
    const { user } = await createTestUser({
      email: "inactive@merchantpulse.com",
      isActive: false,
    });

    const req = createMockRequest({
      method: "POST",
      body: {
        email: "inactive@merchantpulse.com",
      },
    });
    const res = createMockResponse();

    await forgotPasswordHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      message:
        "If this email is registered, instructions to reset your password will be sent.",
    });

    const tokenCount = await db.passwordResetToken.count({
      where: { userId: user.id },
    });
    expect(tokenCount).toBe(0);
  });

  it("should invalidate previous unused reset tokens when requesting again", async () => {
    const { user } = await createTestUser({
      email: "repeat.request@merchantpulse.com",
      isActive: true,
    });

    // Request 1
    const req1 = createMockRequest({
      method: "POST",
      body: { email: "repeat.request@merchantpulse.com" },
    });
    const res1 = createMockResponse();
    await forgotPasswordHandler(req1, res1);

    // Request 2
    const req2 = createMockRequest({
      method: "POST",
      body: { email: "repeat.request@merchantpulse.com" },
    });
    const res2 = createMockResponse();
    await forgotPasswordHandler(req2, res2);

    const tokens = await db.passwordResetToken.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "asc" },
    });

    expect(tokens.length).toBe(2);
    // First token marked as used/invalidated
    expect(tokens[0].usedAt).not.toBeNull();
    // Second token is active and unused
    expect(tokens[1].usedAt).toBeNull();
  });

  it("should reject invalid email format with 400 ValidationError", async () => {
    const invalidEmails = ["notanemail", "user@", "@domain.com", "   ", ""];

    for (const email of invalidEmails) {
      const req = createMockRequest({
        method: "POST",
        body: { email },
      });
      const res = createMockResponse();

      await forgotPasswordHandler(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body.name).toBe("ValidationError");
    }
  });

  it("should reject missing email body with 400 ValidationError", async () => {
    const req = createMockRequest({
      method: "POST",
      body: {},
    });
    const res = createMockResponse();

    await forgotPasswordHandler(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.body.name).toBe("ValidationError");
  });

  it("should return 405 MethodNotAllowedError for non-POST methods", async () => {
    const req = createMockRequest({
      method: "GET",
    });
    const res = createMockResponse();

    await forgotPasswordHandler(req, res);

    expect(res.statusCode).toBe(405);
    expect(res.body.name).toBe("MethodNotAllowedError");
  });
});

