/**
 * @jest-environment jsdom
 */

import React, { act } from "react";
import ReactDOM from "react-dom/client";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const mockReplace = jest.fn();
let mockRouter = {
  asPath: "/dashboard/admin-only",
  replace: mockReplace,
};

jest.mock("next/router", () => ({
  useRouter: () => mockRouter,
}));

jest.mock("next/link", () => {
  return function MockLink({ href, children, ...rest }) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  };
});

let mockAuth = {
  user: { id: "user-1", name: "Ana Analista", role: "ANALYST" },
  isAuthenticated: true,
  loading: false,
  hasRole: jest.fn((roles) =>
    Array.isArray(roles) ? roles.includes("ANALYST") : roles === "ANALYST",
  ),
  can: jest.fn((cap) => cap === "view_analytics"),
};

jest.mock("@/context/AuthContext", () => ({
  useAuth: () => mockAuth,
}));

describe("ProtectedRoute component", () => {
  let container;
  let root;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = ReactDOM.createRoot(container);
    mockReplace.mockReset();
    mockRouter = {
      asPath: "/dashboard/admin-only",
      replace: mockReplace,
    };

    mockAuth = {
      user: { id: "user-1", name: "Ana Analista", role: "ANALYST" },
      isAuthenticated: true,
      loading: false,
      hasRole: jest.fn((roles) =>
        Array.isArray(roles) ? roles.includes("ANALYST") : roles === "ANALYST",
      ),
      can: jest.fn((cap) => cap === "view_analytics"),
    };
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
    container = null;
  });

  test("shows loading state when authentication check is in progress", async () => {
    mockAuth.loading = true;
    mockAuth.isAuthenticated = false;

    await act(async () => {
      root.render(
        <ProtectedRoute>
          <div id="content">Protected Content</div>
        </ProtectedRoute>,
      );
    });

    const loadingSpinner = container.querySelector('[role="status"]');
    expect(loadingSpinner).not.toBeNull();
    expect(container.textContent).toContain("Carregando painel");
    expect(container.querySelector("#content")).toBeNull();
  });

  test("redirects unauthenticated user to login with return path", async () => {
    mockAuth.loading = false;
    mockAuth.isAuthenticated = false;
    mockAuth.user = null;

    await act(async () => {
      root.render(
        <ProtectedRoute>
          <div id="content">Protected Content</div>
        </ProtectedRoute>,
      );
    });

    expect(mockReplace).toHaveBeenCalledWith(
      "/login?from=%2Fdashboard%2Fadmin-only",
    );
    expect(container.querySelector("#content")).toBeNull();
  });

  test("renders children when authenticated and authorized", async () => {
    await act(async () => {
      root.render(
        <ProtectedRoute>
          <div id="content">Protected Dashboard Content</div>
        </ProtectedRoute>,
      );
    });

    expect(container.querySelector("#content")).not.toBeNull();
    expect(container.textContent).toContain("Protected Dashboard Content");
  });

  test("blocks access and displays error when role is not allowed", async () => {
    mockAuth.hasRole.mockReturnValue(false);

    await act(async () => {
      root.render(
        <ProtectedRoute allowedRoles={["ADMIN"]}>
          <div id="content">Admin Only</div>
        </ProtectedRoute>,
      );
    });

    expect(container.querySelector("#content")).toBeNull();
    expect(container.textContent).toContain("Acesso Restrito");
    expect(container.textContent).toContain("ANALYST");
    const backBtn = container.querySelector('a[href="/dashboard"]');
    expect(backBtn).not.toBeNull();
  });

  test("blocks access when required capability is missing", async () => {
    mockAuth.can.mockReturnValue(false);

    await act(async () => {
      root.render(
        <ProtectedRoute requiredCapability="manage_users">
          <div id="content">User Management</div>
        </ProtectedRoute>,
      );
    });

    expect(container.querySelector("#content")).toBeNull();
    expect(container.textContent).toContain("Permissão Insuficiente");
    const backBtn = container.querySelector('a[href="/dashboard"]');
    expect(backBtn).not.toBeNull();
  });
});
