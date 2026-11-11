/**
 * @jest-environment jsdom
 */

import React, { act } from "react";
import { createRoot } from "react-dom/client";
import LoginForm from "@/components/auth/LoginForm";

const mockPush = jest.fn();
jest.mock("next/router", () => ({
  useRouter: () => ({
    push: mockPush,
    query: {},
  }),
}));

const mockLogin = jest.fn();
jest.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

function setInputValue(input, value) {
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    "value",
  ).set;
  nativeInputValueSetter.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

describe("LoginForm component", () => {
  let container;
  let root;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    mockPush.mockClear();
    mockLogin.mockClear();
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  it("renders email, password inputs, visibility toggle, and submit button", () => {
    act(() => {
      root.render(<LoginForm />);
    });

    const emailInput = container.querySelector("#login-email");
    const passwordInput = container.querySelector("#login-password");
    const toggleButton = container.querySelector('button[aria-label="Exibir senha"]');
    const submitButton = container.querySelector('button[type="submit"]');

    expect(emailInput).not.toBeNull();
    expect(passwordInput).not.toBeNull();
    expect(toggleButton).not.toBeNull();
    expect(submitButton).not.toBeNull();
    expect(passwordInput.type).toBe("password");
  });

  it("toggles password visibility when clicking toggle button", () => {
    act(() => {
      root.render(<LoginForm />);
    });

    const passwordInput = container.querySelector("#login-password");
    const toggleButton = container.querySelector('button[aria-label="Exibir senha"]');

    expect(passwordInput.type).toBe("password");
    expect(toggleButton.getAttribute("aria-pressed")).toBe("false");

    act(() => {
      toggleButton.click();
    });

    expect(passwordInput.type).toBe("text");
    expect(toggleButton.getAttribute("aria-label")).toBe("Ocultar senha");
    expect(toggleButton.getAttribute("aria-pressed")).toBe("true");

    act(() => {
      toggleButton.click();
    });

    expect(passwordInput.type).toBe("password");
  });

  it("validates missing fields client-side without calling login", async () => {
    act(() => {
      root.render(<LoginForm />);
    });

    const form = container.querySelector("form");

    await act(async () => {
      form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    });

    expect(container.textContent).toContain("Informe seu endereço de e-mail.");
    expect(container.textContent).toContain("Informe sua senha de acesso.");
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("validates invalid email format client-side", async () => {
    act(() => {
      root.render(<LoginForm />);
    });

    const emailInput = container.querySelector("#login-email");
    const passwordInput = container.querySelector("#login-password");
    const form = container.querySelector("form");

    act(() => {
      setInputValue(emailInput, "invalid-email");
      setInputValue(passwordInput, "password123");
    });

    await act(async () => {
      form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    });

    expect(container.textContent).toContain("Informe um e-mail válido");
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("submits valid credentials, calls login and redirects to /dashboard", async () => {
    mockLogin.mockResolvedValueOnce({
      id: "user-1",
      name: "Admin User",
      email: "admin@merchantpulse.com",
    });

    act(() => {
      root.render(<LoginForm />);
    });

    const emailInput = container.querySelector("#login-email");
    const passwordInput = container.querySelector("#login-password");
    const form = container.querySelector("form");

    act(() => {
      setInputValue(emailInput, "admin@merchantpulse.com");
      setInputValue(passwordInput, "ValidPassword123!");
    });

    await act(async () => {
      form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    });

    expect(mockLogin).toHaveBeenCalledWith("admin@merchantpulse.com", "ValidPassword123!");
    expect(mockPush).toHaveBeenCalledWith("/dashboard");
  });

  it("displays accessible error alert when login fails", async () => {
    const error = new Error("Credenciais inválidas.");
    error.action = "Verifique seus dados de acesso.";
    mockLogin.mockRejectedValueOnce(error);

    act(() => {
      root.render(<LoginForm />);
    });

    const emailInput = container.querySelector("#login-email");
    const passwordInput = container.querySelector("#login-password");
    const form = container.querySelector("form");

    act(() => {
      setInputValue(emailInput, "user@merchantpulse.com");
      setInputValue(passwordInput, "WrongPassword!");
    });

    await act(async () => {
      form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    });

    const alert = container.querySelector('[role="alert"]');
    expect(alert).not.toBeNull();
    expect(alert.textContent).toContain("Credenciais inválidas.");
    expect(alert.textContent).toContain("Verifique seus dados de acesso.");
    expect(mockPush).not.toHaveBeenCalled();
  });
});
