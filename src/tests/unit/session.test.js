import cookie from "@/infra/cookie.js";
import { prisma as db } from "@/infra/prisma.js";
import session from "@/infra/session.js";
import { clearDatabase, createTestUser } from "@/tests/testHelpers.js";

describe("Session service unit tests", () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  it("should create a session storing only tokenHash and issuing an HTTP-only cookie", async () => {
    const { user } = await createTestUser();

    const { session: createdSession, sessionCookie } =
      await session.create(user.id);

    expect(createdSession.sessionId).toBeDefined();
    expect(createdSession.userId).toBe(user.id);
    expect(createdSession.expiresAt.getTime()).toBeGreaterThan(Date.now());

    // Verify raw cookie has httpOnly, sameSite, path
    expect(sessionCookie).toContain("session_id=");
    expect(sessionCookie).toContain("HttpOnly");
    expect(sessionCookie).toContain("SameSite=Lax");
    expect(sessionCookie).toContain("Path=/");

    // Extract raw token from cookie and verify token in DB is a hash, NOT plaintext
    const parsedCookie = cookie.parse(sessionCookie);
    const rawToken = parsedCookie.session_id;
    expect(rawToken).toBeDefined();

    const dbRecord = await db.authSession.findUnique({
      where: { sessionId: createdSession.sessionId },
    });
    expect(dbRecord.tokenHash).not.toBe(rawToken);
    expect(dbRecord.tokenHash).toBe(session.hashSessionToken(rawToken));
  });

  it("should find valid session by raw token", async () => {
    const { user } = await createTestUser();
    const { sessionCookie } = await session.create(user.id);
    const rawToken = cookie.parse(sessionCookie).session_id;

    const found = await session.findValidSessionByToken(rawToken);
    expect(found).not.toBeNull();
    expect(found.userId).toBe(user.id);
  });

  it("should return null when searching with invalid token or expired session", async () => {
    const { user } = await createTestUser();
    const { session: createdSession, sessionCookie } =
      await session.create(user.id);
    const rawToken = cookie.parse(sessionCookie).session_id;

    // 1. Invalid token
    expect(await session.findValidSessionByToken("completely_wrong_token")).toBeNull();
    expect(await session.findValidSessionByToken("")).toBeNull();
    expect(await session.findValidSessionByToken(null)).toBeNull();

    // 2. Expire session
    await session.expireById(createdSession.sessionId);
    expect(await session.findValidSessionByToken(rawToken)).toBeNull();
  });

  it("should expire all sessions for a user", async () => {
    const { user } = await createTestUser();
    const session1 = await session.create(user.id);
    const session2 = await session.create(user.id);

    const token1 = cookie.parse(session1.sessionCookie).session_id;
    const token2 = cookie.parse(session2.sessionCookie).session_id;

    expect(await session.findValidSessionByToken(token1)).not.toBeNull();
    expect(await session.findValidSessionByToken(token2)).not.toBeNull();

    await session.expireAllByUserId(user.id);

    expect(await session.findValidSessionByToken(token1)).toBeNull();
    expect(await session.findValidSessionByToken(token2)).toBeNull();
  });

  it("should generate proper clear-cookie header", () => {
    const clearCookie = session.clearSessionCookie();
    expect(clearCookie).toContain("session_id=invalid");
    expect(clearCookie).toContain("Max-Age=-1");
    expect(clearCookie).toContain("HttpOnly");
  });
});

