import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";

const AuthContext = createContext(null);

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

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkSession = useCallback(async () => {
    try {
      const response = await fetch("/api/v1/auth/sessions", {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setSession({
          sessionId: data.session_id,
          expiresAt: data.expires_at,
        });
      } else {
        setUser(null);
        setSession(null);
      }
    } catch {
      setUser(null);
      setSession(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const login = async (email, password) => {
    const response = await fetch("/api/v1/auth/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || "Erro ao realizar login.");
      error.statusCode = response.status;
      error.action = data.action;
      throw error;
    }

    setUser(data.user);
    setSession({
      sessionId: data.session_id,
      expiresAt: data.expires_at,
    });

    return data.user;
  };

  const logout = async () => {
    try {
      await fetch("/api/v1/auth/sessions", {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
        },
      });
    } catch {
      // Proceed with client cleanup even if network fails
    } finally {
      setUser(null);
      setSession(null);
      router.push("/login");
    }
  };

  const hasRole = useCallback(
    (roleOrRoles) => {
      if (!user || !user.role) return false;
      const roles = Array.isArray(roleOrRoles) ? roleOrRoles : [roleOrRoles];
      return roles.includes(user.role);
    },
    [user],
  );

  const can = useCallback(
    (capability) => {
      if (!user || !user.role) return false;
      const allowedRoles = CAPABILITIES[capability];
      if (!allowedRoles) return false;
      return allowedRoles.includes(user.role);
    },
    [user],
  );

  const value = {
    user,
    session,
    loading,
    login,
    logout,
    checkSession,
    hasRole,
    can,
    isAuthenticated: Boolean(user),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;

