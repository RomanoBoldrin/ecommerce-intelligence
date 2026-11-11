import sessionsHandler from "@/pages/api/v1/auth/sessions/index.js";
import { prisma as db } from "@/infra/prisma.js";
import {
  clearDatabase,
  createMockRequest,
  createMockResponse,
  createTestSession,
  createTestUser,
} from "@/tests/testHelpers.js";

describe("API /api/v1/auth/sessions", () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  describe("POST /api/v1/auth/sessions (Login)", () => {
    it("should authenticate active user with valid credentials, create session, and set session cookie", async () => {
      const { user, rawPassword } = await createTestUser({
        email: "analyst@merchantpulse.com",
        password: "ValidPassword123!",
        role: "ANALYST",
        isActive: true,
      });

      const req = createMockRequest({
        method: "POST",
        body: {
          email: "analyst@merchantpulse.com",
          password: rawPassword,
        },
      });
      const res = createMockResponse();

      await sessionsHandler(req, res);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("session_id");
      expect(res.body).toHaveProperty("expires_at");
      expect(res.body.user).toEqual({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        is_active: true,
      });
      expect(res.body).not.toHaveProperty("password");
      expect(res.body).not.toHaveProperty("passwordHash");
      expect(res.body).not.toHaveProperty("token");

      // Verify session cookie was set
      const setCookie = res.getHeader("Set-Cookie");
      expect(setCookie).toBeDefined();
      expect(setCookie).toContain("session_id=");
      expect(setCookie).toContain("HttpOnly");
      expect(setCookie).toContain("SameSite=Lax");
      expect(setCookie).toContain("Path=/");

      // Verify session was persisted in database
      const dbSession = await db.authSession.findUnique({
        where: { sessionId: res.body.session_id },
      });
      expect(dbSession).toBeDefined();
      expect(dbSession.userId).toBe(user.id);
      expect(dbSession.expiresAt.getTime()).toBeGreaterThan(Date.now());
    });

    it("should accept email in different case and with whitespace", async () => {
      const { rawPassword } = await createTestUser({
        email: "case.insensitive@merchantpulse.com",
        password: "ValidPassword123!",
      });

      const req = createMockRequest({
        method: "POST",
        body: {
          email: "  CASE.INSENSITIVE@merchantpulse.com  ",
          password: rawPassword,
        },
      });
      const res = createMockResponse();

      await sessionsHandler(req, res);

      expect(res.statusCode).toBe(201);
      expect(res.body.user.email).toBe("case.insensitive@merchantpulse.com");
    });

    it("should reject invalid password with 401 UnauthorizedError", async () => {
      await createTestUser({
        email: "user@merchantpulse.com",
        password: "CorrectPassword123!",
      });

      const req = createMockRequest({
        method: "POST",
        body: {
          email: "user@merchantpulse.com",
          password: "WrongPassword999!",
        },
      });
      const res = createMockResponse();

      await sessionsHandler(req, res);

      expect(res.statusCode).toBe(401);
      expect(res.body.name).toBe("UnauthorizedError");
      expect(res.body.message).toBe("Invalid email or password.");
      expect(res.getHeader("Set-Cookie")).toContain("Max-Age=-1");
    });

    it("should reject non-existent email with generic 401 UnauthorizedError", async () => {
      const req = createMockRequest({
        method: "POST",
        body: {
          email: "nonexistent@merchantpulse.com",
          password: "AnyPassword123!",
        },
      });
      const res = createMockResponse();

      await sessionsHandler(req, res);

      expect(res.statusCode).toBe(401);
      expect(res.body.name).toBe("UnauthorizedError");
      expect(res.body.message).toBe("Invalid email or password.");
      expect(res.getHeader("Set-Cookie")).toContain("Max-Age=-1");
    });

    it("should reject inactive user with 403 ForbiddenError", async () => {
      const { rawPassword } = await createTestUser({
        email: "inactive@merchantpulse.com",
        password: "ValidPassword123!",
        isActive: false,
      });

      const req = createMockRequest({
        method: "POST",
        body: {
          email: "inactive@merchantpulse.com",
          password: rawPassword,
        },
      });
      const res = createMockResponse();

      await sessionsHandler(req, res);

      expect(res.statusCode).toBe(403);
      expect(res.body.name).toBe("ForbiddenError");
    });

    it("should reject missing email or password with 400 ValidationError", async () => {
      const req1 = createMockRequest({
        method: "POST",
        body: { password: "Password123!" },
      });
      const res1 = createMockResponse();
      await sessionsHandler(req1, res1);
      expect(res1.statusCode).toBe(400);
      expect(res1.body.name).toBe("ValidationError");

      const req2 = createMockRequest({
        method: "POST",
        body: { email: "user@example.com" },
      });
      const res2 = createMockResponse();
      await sessionsHandler(req2, res2);
      expect(res2.statusCode).toBe(400);
      expect(res2.body.name).toBe("ValidationError");
    });
  });

  describe("GET /api/v1/auth/sessions (Session Validation)", () => {
    it("should return authenticated user and session metadata when valid session cookie is provided", async () => {
      const { user } = await createTestUser({
        email: "manager@merchantpulse.com",
        role: "MANAGER",
        isActive: true,
      });

      const { session: activeSession, rawToken } = await createTestSession(
        user.id,
      );

      const req = createMockRequest({
        method: "GET",
        cookies: { session_id: rawToken },
      });
      const res = createMockResponse();

      await sessionsHandler(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.session_id).toBe(activeSession.sessionId);
      expect(res.body.user).toEqual({
        id: user.id,
        name: user.name,
        email: user.email,
        role: "MANAGER",
        is_active: true,
      });
    });

    it("should support reading session from raw Cookie header", async () => {
      const { user } = await createTestUser();
      const { rawToken } = await createTestSession(user.id);

      const req = createMockRequest({
        method: "GET",
        headers: { cookie: `session_id=${rawToken}` },
      });
      const res = createMockResponse();

      await sessionsHandler(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.user.id).toBe(user.id);
    });

    it("should return 401 when no session cookie is provided", async () => {
      const req = createMockRequest({
        method: "GET",
        cookies: {},
      });
      const res = createMockResponse();

      await sessionsHandler(req, res);

      expect(res.statusCode).toBe(401);
      expect(res.body.name).toBe("UnauthorizedError");
    });

    it("should return 401 and clear cookie when token is invalid or tampered", async () => {
      const req = createMockRequest({
        method: "GET",
        cookies: { session_id: "tampered_non_existent_token" },
      });
      const res = createMockResponse();

      await sessionsHandler(req, res);

      expect(res.statusCode).toBe(401);
      expect(res.body.name).toBe("UnauthorizedError");
      expect(res.getHeader("Set-Cookie")).toContain("Max-Age=-1");
    });

    it("should return 401 and clear cookie when session has expired", async () => {
      const { user } = await createTestUser();
      const { rawToken } = await createTestSession(user.id, { expired: true });

      const req = createMockRequest({
        method: "GET",
        cookies: { session_id: rawToken },
      });
      const res = createMockResponse();

      await sessionsHandler(req, res);

      expect(res.statusCode).toBe(401);
      expect(res.body.name).toBe("UnauthorizedError");
      expect(res.getHeader("Set-Cookie")).toContain("Max-Age=-1");
    });

    it("should return 403 when user is deactivated after session creation", async () => {
      const { user } = await createTestUser({ isActive: false });
      const { rawToken } = await createTestSession(user.id);

      const req = createMockRequest({
        method: "GET",
        cookies: { session_id: rawToken },
      });
      const res = createMockResponse();

      await sessionsHandler(req, res);

      expect(res.statusCode).toBe(403);
      expect(res.body.name).toBe("ForbiddenError");
    });
  });

  describe("DELETE /api/v1/auth/sessions (Logout)", () => {
    it("should expire the database session and clear the session cookie", async () => {
      const { user } = await createTestUser();
      const { session: activeSession, rawToken } = await createTestSession(
        user.id,
      );

      const req = createMockRequest({
        method: "DELETE",
        cookies: { session_id: rawToken },
      });
      const res = createMockResponse();

      await sessionsHandler(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.session_id).toBe(activeSession.sessionId);

      // Verify cookie clear header
      const setCookie = res.getHeader("Set-Cookie");
      expect(setCookie).toBeDefined();
      expect(setCookie).toContain("Max-Age=-1");
      expect(setCookie).toContain("session_id=invalid");

      // Verify session in database is now expired
      const dbSession = await db.authSession.findUnique({
        where: { sessionId: activeSession.sessionId },
      });
      expect(dbSession.expiresAt.getTime()).toBeLessThanOrEqual(Date.now());

      // Subsequent session validation with that same token should fail with 401
      const validateReq = createMockRequest({
        method: "GET",
        cookies: { session_id: rawToken },
      });
      const validateRes = createMockResponse();
      await sessionsHandler(validateReq, validateRes);
      expect(validateRes.statusCode).toBe(401);
    });

    it("should return 401 when attempting logout without an active session", async () => {
      const req = createMockRequest({
        method: "DELETE",
        cookies: {},
      });
      const res = createMockResponse();

      await sessionsHandler(req, res);

      expect(res.statusCode).toBe(401);
      expect(res.body.name).toBe("UnauthorizedError");
    });
  });

  describe("Unsupported HTTP methods", () => {
    it("should return 405 MethodNotAllowedError for PUT, PATCH", async () => {
      const req = createMockRequest({
        method: "PUT",
      });
      const res = createMockResponse();

      await sessionsHandler(req, res);

      expect(res.statusCode).toBe(405);
      expect(res.body.name).toBe("MethodNotAllowedError");
    });
  });
});

