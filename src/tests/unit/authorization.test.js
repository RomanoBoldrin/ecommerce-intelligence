import authorization, {
  ROLES,
  CAPABILITIES,
  can,
  isRole,
  ensureUserHasRole,
  ensureUserCan,
  requireRoles,
  requireCapability,
} from "@/infra/authorization.js";
import { ForbiddenError, UnauthorizedError } from "@/infra/errors.js";
import {
  clearDatabase,
  createMockRequest,
  createMockResponse,
  createTestSession,
  createTestUser,
} from "@/tests/testHelpers.js";

describe("Authorization unit and middleware tests", () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  describe("Role matrix and capabilities", () => {
    it("should allow ADMIN to perform all operations", () => {
      expect(can(ROLES.ADMIN, "VIEW_ANALYTICS")).toBe(true);
      expect(can(ROLES.ADMIN, "VIEW_IOT")).toBe(true);
      expect(can(ROLES.ADMIN, "VIEW_FORECASTS")).toBe(true);
      expect(can(ROLES.ADMIN, "EXPORT_REPORTS")).toBe(true);
      expect(can(ROLES.ADMIN, "MANAGE_DATA_SOURCES")).toBe(true);
      expect(can(ROLES.ADMIN, "MANAGE_USERS")).toBe(true);
      expect(can(ROLES.ADMIN, "CHANGE_SETTINGS")).toBe(true);
      expect(can(ROLES.ADMIN, "CHANGE_TARGETS_THRESHOLDS")).toBe(true);
    });

    it("should allow MANAGER to manage data sources and thresholds, but restrict user management and settings", () => {
      expect(can(ROLES.MANAGER, "VIEW_ANALYTICS")).toBe(true);
      expect(can(ROLES.MANAGER, "VIEW_IOT")).toBe(true);
      expect(can(ROLES.MANAGER, "VIEW_FORECASTS")).toBe(true);
      expect(can(ROLES.MANAGER, "EXPORT_REPORTS")).toBe(true);
      expect(can(ROLES.MANAGER, "MANAGE_DATA_SOURCES")).toBe(true);
      expect(can(ROLES.MANAGER, "CHANGE_TARGETS_THRESHOLDS")).toBe(true);

      // Restricted to ADMIN
      expect(can(ROLES.MANAGER, "MANAGE_USERS")).toBe(false);
      expect(can(ROLES.MANAGER, "CHANGE_SETTINGS")).toBe(false);
    });

    it("should restrict ANALYST to viewing and exporting reports only", () => {
      expect(can(ROLES.ANALYST, "VIEW_ANALYTICS")).toBe(true);
      expect(can(ROLES.ANALYST, "VIEW_IOT")).toBe(true);
      expect(can(ROLES.ANALYST, "VIEW_FORECASTS")).toBe(true);
      expect(can(ROLES.ANALYST, "EXPORT_REPORTS")).toBe(true);

      expect(can(ROLES.ANALYST, "MANAGE_DATA_SOURCES")).toBe(false);
      expect(can(ROLES.ANALYST, "MANAGE_USERS")).toBe(false);
      expect(can(ROLES.ANALYST, "CHANGE_SETTINGS")).toBe(false);
      expect(can(ROLES.ANALYST, "CHANGE_TARGETS_THRESHOLDS")).toBe(false);
    });

    it("should return false for unknown capabilities or invalid roles", () => {
      expect(can(ROLES.ADMIN, "NON_EXISTENT_CAPABILITY")).toBe(false);
      expect(can("GUEST", "VIEW_ANALYTICS")).toBe(false);
    });
  });

  describe("ensureUserHasRole & ensureUserCan assertion functions", () => {
    it("should pass when user has one of the allowed roles", () => {
      const user = { role: ROLES.ADMIN };
      expect(() => ensureUserHasRole(user, [ROLES.ADMIN, ROLES.MANAGER])).not.toThrow();
      expect(() => ensureUserHasRole(user, ROLES.ADMIN)).not.toThrow();
    });

    it("should throw ForbiddenError when user does not have allowed role", () => {
      const user = { role: ROLES.ANALYST };
      expect(() => ensureUserHasRole(user, [ROLES.ADMIN, ROLES.MANAGER])).toThrow(
        ForbiddenError,
      );
    });

    it("should throw UnauthorizedError when user is missing or has no role", () => {
      expect(() => ensureUserHasRole(null, [ROLES.ADMIN])).toThrow(UnauthorizedError);
      expect(() => ensureUserHasRole({}, [ROLES.ADMIN])).toThrow(UnauthorizedError);
    });

    it("should pass when user can perform capability", () => {
      const admin = { role: ROLES.ADMIN };
      expect(() => ensureUserCan(admin, "MANAGE_USERS")).not.toThrow();
    });

    it("should throw ForbiddenError when user cannot perform capability", () => {
      const manager = { role: ROLES.MANAGER };
      expect(() => ensureUserCan(manager, "MANAGE_USERS")).toThrow(ForbiddenError);
    });
  });

  describe("requireRoles middleware", () => {
    it("should allow request when authenticated user matches permitted role", async () => {
      const { user } = await createTestUser({ role: ROLES.ADMIN });
      const { rawToken } = await createTestSession(user.id);

      const req = createMockRequest({
        method: "GET",
        cookies: { session_id: rawToken },
      });
      const res = createMockResponse();

      const middleware = requireRoles(ROLES.ADMIN);
      let nextCalled = false;
      await middleware(req, res, () => {
        nextCalled = true;
      });

      expect(nextCalled).toBe(true);
      expect(req.user.id).toBe(user.id);
    });

    it("should throw ForbiddenError when user role is not permitted", async () => {
      const { user } = await createTestUser({ role: ROLES.ANALYST });
      const { rawToken } = await createTestSession(user.id);

      const req = createMockRequest({
        method: "GET",
        cookies: { session_id: rawToken },
      });
      const res = createMockResponse();

      const middleware = requireRoles(ROLES.ADMIN, ROLES.MANAGER);
      await expect(
        middleware(req, res, () => {}),
      ).rejects.toThrow(ForbiddenError);
    });
  });

  describe("requireCapability middleware", () => {
    it("should allow request when user has role with required capability", async () => {
      const { user } = await createTestUser({ role: ROLES.MANAGER });
      const { rawToken } = await createTestSession(user.id);

      const req = createMockRequest({
        method: "GET",
        cookies: { session_id: rawToken },
      });
      const res = createMockResponse();

      const middleware = requireCapability("MANAGE_DATA_SOURCES");
      let nextCalled = false;
      await middleware(req, res, () => {
        nextCalled = true;
      });

      expect(nextCalled).toBe(true);
    });

    it("should reject request when user lacks capability", async () => {
      const { user } = await createTestUser({ role: ROLES.ANALYST });
      const { rawToken } = await createTestSession(user.id);

      const req = createMockRequest({
        method: "GET",
        cookies: { session_id: rawToken },
      });
      const res = createMockResponse();

      const middleware = requireCapability("MANAGE_DATA_SOURCES");
      await expect(
        middleware(req, res, () => {}),
      ).rejects.toThrow(ForbiddenError);
    });
  });
});

