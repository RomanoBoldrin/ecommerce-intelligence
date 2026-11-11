import authentication from "./authentication.js";
import { ForbiddenError, UnauthorizedError } from "./errors.js";

export const ROLES = Object.freeze({
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  ANALYST: "ANALYST",
});

export const CAPABILITIES = Object.freeze({
  VIEW_ANALYTICS: [ROLES.ADMIN, ROLES.MANAGER, ROLES.ANALYST],
  VIEW_IOT: [ROLES.ADMIN, ROLES.MANAGER, ROLES.ANALYST],
  VIEW_FORECASTS: [ROLES.ADMIN, ROLES.MANAGER, ROLES.ANALYST],
  EXPORT_REPORTS: [ROLES.ADMIN, ROLES.MANAGER, ROLES.ANALYST],
  MANAGE_DATA_SOURCES: [ROLES.ADMIN, ROLES.MANAGER],
  MANAGE_USERS: [ROLES.ADMIN],
  CHANGE_SETTINGS: [ROLES.ADMIN],
  CHANGE_TARGETS_THRESHOLDS: [ROLES.ADMIN, ROLES.MANAGER],
});

export function can(role, capability) {
  const allowed = CAPABILITIES[capability];
  if (!allowed) {
    return false;
  }
  return allowed.includes(role);
}

export function isRole(userRole, allowedRoles) {
  const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return rolesArray.includes(userRole);
}

export function ensureUserHasRole(user, allowedRoles) {
  if (!user || !user.role) {
    throw new UnauthorizedError({
      message: "User not authenticated.",
      action: "Login to continue.",
    });
  }

  if (!isRole(user.role, allowedRoles)) {
    throw new ForbiddenError({
      message: "Access denied. Insufficient role permissions.",
      action: "Contact an administrator if you require access to this resource.",
    });
  }
}

export function ensureUserCan(user, capability) {
  if (!user || !user.role) {
    throw new UnauthorizedError({
      message: "User not authenticated.",
      action: "Login to continue.",
    });
  }

  if (!can(user.role, capability)) {
    throw new ForbiddenError({
      message: "Access denied. Insufficient permissions.",
      action: "Contact an administrator if you require access to this resource.",
    });
  }
}

export async function requireAuthentication(request, response, next) {
  const { user, session } =
    await authentication.getAuthenticatedUserFromRequest(request);

  request.user = user;
  request.session = session;

  if (typeof next === "function") {
    return next();
  }
}

export function requireRoles(...allowedRoles) {
  return async function roleMiddleware(request, response, next) {
    if (!request.user) {
      await requireAuthentication(request, response);
    }

    ensureUserHasRole(request.user, allowedRoles.flat());

    if (typeof next === "function") {
      return next();
    }
  };
}

export function requireCapability(capability) {
  return async function capabilityMiddleware(request, response, next) {
    if (!request.user) {
      await requireAuthentication(request, response);
    }

    ensureUserCan(request.user, capability);

    if (typeof next === "function") {
      return next();
    }
  };
}

const authorization = {
  ROLES,
  CAPABILITIES,
  can,
  isRole,
  ensureUserHasRole,
  ensureUserCan,
  requireAuthentication,
  requireRoles,
  requireCapability,
};

export default authorization;

