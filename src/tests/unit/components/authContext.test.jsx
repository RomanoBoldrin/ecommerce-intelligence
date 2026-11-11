/**
 * @jest-environment jsdom
 */

import React, { act } from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider, useAuth, ROLES, CAPABILITIES } from "@/context/AuthContext";

const mockPush = jest.fn();
let mockRouter = {
  push: mockPush,
};

jest.mock("next/router", () => ({
  useRouter: () => mockRouter,
}));

function ConsumerComponent({ onState }) {
  const auth = useAuth();
  React.useEffect(() => {
    onState(auth);
  });
  return (
    <div>
      <span id="auth-status">{auth.isAuthenticated ? "authenticated" : "guest"}</span>
      <span id="auth-user">{auth.user ? auth.user.email : "none"}</span>
      <button
        id="btn-login"
        onClick={() => auth.login("admin@merchantpulse.com", "validPass123")}
      >
        Login
      </button>
      <button id="btn-logout" onClick={() => auth.logout()}>
        Logout
      </button>
    </div>
  );
}

describe("AuthContext and AuthProvider", () => {
  let container;
  let root;
  let latestAuth;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = ReactDOM.createRoot(container);
    mockPush.mockReset();
    global.fetch = jest.fn();
    latestAuth = null;
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
    container = null;
    jest.restoreAllMocks();
  });

  test("initializes session from GET /api/v1/auth/sessions when active", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        user: { id: "u-1", email: "admin@merchantpulse.com", role: "ADMIN", name: "Admin" },
        session_id: "sess-abc",
        expires_at: "2026-11-12T00:00:00.000Z",
      }),
    });

    await act(async () => {
      root.render(
        <AuthProvider>
          <ConsumerComponent onState={(auth) => (latestAuth = auth)} />
        </AuthProvider>,
      );
    });

    expect(latestAuth.loading).toBe(false);
    expect(latestAuth.isAuthenticated).toBe(true);
    expect(latestAuth.user.email).toBe("admin@merchantpulse.com");
    expect(latestAuth.user.role).toBe("ADMIN");
    expect(container.querySelector("#auth-status").textContent).toBe("authenticated");
    expect(container.querySelector("#auth-user").textContent).toBe("admin@merchantpulse.com");
  });

  test("handles unauthenticated state when GET /api/v1/auth/sessions returns 401", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({
        error: "UNAUTHENTICATED",
        message: "Nenhuma sessão ativa encontrada.",
      }),
    });

    await act(async () => {
      root.render(
        <AuthProvider>
          <ConsumerComponent onState={(auth) => (latestAuth = auth)} />
        </AuthProvider>,
      );
    });

    expect(latestAuth.loading).toBe(false);
    expect(latestAuth.isAuthenticated).toBe(false);
    expect(latestAuth.user).toBeNull();
    expect(container.querySelector("#auth-status").textContent).toBe("guest");
  });

  test("successful login updates user and session state", async () => {
    // Initial session check: 401 unauthenticated
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ error: "UNAUTHENTICATED" }),
    });

    await act(async () => {
      root.render(
        <AuthProvider>
          <ConsumerComponent onState={(auth) => (latestAuth = auth)} />
        </AuthProvider>,
      );
    });

    expect(latestAuth.isAuthenticated).toBe(false);

    // Mock POST /api/v1/auth/sessions response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        user: { id: "u-2", email: "manager@merchantpulse.com", role: "MANAGER", name: "Manager" },
        session_id: "sess-xyz",
        expires_at: "2026-11-12T00:00:00.000Z",
      }),
    });

    await act(async () => {
      await latestAuth.login("manager@merchantpulse.com", "managerPass123");
    });

    expect(latestAuth.isAuthenticated).toBe(true);
    expect(latestAuth.user.role).toBe("MANAGER");
    expect(latestAuth.session.sessionId).toBe("sess-xyz");
  });

  test("failed login throws structured error and does not authenticate", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ error: "UNAUTHENTICATED" }),
    });

    await act(async () => {
      root.render(
        <AuthProvider>
          <ConsumerComponent onState={(auth) => (latestAuth = auth)} />
        </AuthProvider>,
      );
    });

    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({
        error: "INVALID_CREDENTIALS",
        message: "E-mail ou senha incorretos.",
      }),
    });

    let thrownError = null;
    await act(async () => {
      try {
        await latestAuth.login("bad@email.com", "wrongpass");
      } catch (err) {
        thrownError = err;
      }
    });

    expect(thrownError).not.toBeNull();
    expect(thrownError.message).toBe("E-mail ou senha incorretos.");
    expect(thrownError.statusCode).toBe(401);
    expect(latestAuth.isAuthenticated).toBe(false);
  });

  test("logout calls DELETE /api/v1/auth/sessions, clears state and redirects to login", async () => {
    // Session starts authenticated
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        user: { id: "u-1", email: "admin@merchantpulse.com", role: "ADMIN" },
        session_id: "sess-abc",
      }),
    });

    await act(async () => {
      root.render(
        <AuthProvider>
          <ConsumerComponent onState={(auth) => (latestAuth = auth)} />
        </AuthProvider>,
      );
    });

    expect(latestAuth.isAuthenticated).toBe(true);

    // Logout call
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ message: "Logout efetuado com sucesso." }),
    });

    await act(async () => {
      await latestAuth.logout();
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/v1/auth/sessions",
      expect.objectContaining({ method: "DELETE" }),
    );
    expect(latestAuth.user).toBeNull();
    expect(latestAuth.isAuthenticated).toBe(false);
    expect(mockPush).toHaveBeenCalledWith("/login");
  });

  test("evaluates hasRole and can capabilities correctly", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        user: { id: "u-3", email: "analyst@merchantpulse.com", role: "ANALYST" },
        session_id: "sess-analyst",
      }),
    });

    await act(async () => {
      root.render(
        <AuthProvider>
          <ConsumerComponent onState={(auth) => (latestAuth = auth)} />
        </AuthProvider>,
      );
    });

    // Check hasRole
    expect(latestAuth.hasRole("ANALYST")).toBe(true);
    expect(latestAuth.hasRole(["ADMIN", "ANALYST"])).toBe(true);
    expect(latestAuth.hasRole("ADMIN")).toBe(false);
    expect(latestAuth.hasRole(["ADMIN", "MANAGER"])).toBe(false);

    // Check capabilities
    expect(latestAuth.can("VIEW_ANALYTICS")).toBe(true);
    expect(latestAuth.can("VIEW_IOT")).toBe(true);
    expect(latestAuth.can("MANAGE_USERS")).toBe(false);
    expect(latestAuth.can("CHANGE_SETTINGS")).toBe(false);
  });
});

