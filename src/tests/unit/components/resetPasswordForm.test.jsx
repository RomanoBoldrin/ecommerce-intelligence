/**
 * @jest-environment jsdom
 */

import React, { act } from "react";
import ReactDOM from "react-dom/client";
import ResetPasswordForm from "../../../components/auth/ResetPasswordForm";

const mockPush = jest.fn();
let mockRouter = {
  isReady: true,
  query: { token: "sample-reset-token-xyz" },
  push: mockPush,
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

describe("ResetPasswordForm component", () => {
  let container;
  let root;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = ReactDOM.createRoot(container);
    mockPush.mockReset();
    mockRouter = {
      isReady: true,
      query: { token: "sample-reset-token-xyz" },
      push: mockPush,
    };
    global.fetch = jest.fn();
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
    container = null;
    jest.restoreAllMocks();
  });

  const setInputValue = (input, value) => {
    act(() => {
      const descriptor = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value",
      );
      descriptor.set.call(input, value);
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    });
  };

  test("displays invalid/missing token state when token is absent and router is ready", async () => {
    mockRouter = {
      isReady: true,
      query: {},
      push: mockPush,
    };

    await act(async () => {
      root.render(<ResetPasswordForm />);
    });

    const alertHeading = container.querySelector("h2");
    expect(alertHeading).not.toBeNull();
    expect(alertHeading.textContent).toContain("Link de redefinição inválido ou ausente");

    const requestLink = container.querySelector('a[href="/forgot-password"]');
    expect(requestLink).not.toBeNull();
    expect(requestLink.textContent).toContain("Solicitar novo link");
  });

  test("renders password inputs, toggles, and submit button when token is present", async () => {
    await act(async () => {
      root.render(<ResetPasswordForm />);
    });

    const passwordInput = container.querySelector("#new-password");
    const confirmPasswordInput = container.querySelector("#confirm-password");
    const submitBtn = container.querySelector('button[type="submit"]');

    expect(passwordInput).not.toBeNull();
    expect(confirmPasswordInput).not.toBeNull();
    expect(submitBtn).not.toBeNull();
    expect(submitBtn.textContent).toContain("Definir Nova Senha");
    expect(passwordInput.getAttribute("type")).toBe("password");
    expect(confirmPasswordInput.getAttribute("type")).toBe("password");
  });

  test("validates password length and confirmation match", async () => {
    await act(async () => {
      root.render(<ResetPasswordForm />);
    });

    const form = container.querySelector("form");
    const passwordInput = container.querySelector("#new-password");
    const confirmPasswordInput = container.querySelector("#confirm-password");

    // Submit empty
    await act(async () => {
      form.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true }),
      );
    });

    let passError = container.querySelector("#new-password-error");
    expect(passError).not.toBeNull();
    expect(passError.textContent).toContain("Informe uma nova senha.");

    // Submit short password
    setInputValue(passwordInput, "short");
    setInputValue(confirmPasswordInput, "short");

    await act(async () => {
      form.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true }),
      );
    });

    passError = container.querySelector("#new-password-error");
    expect(passError).not.toBeNull();
    expect(passError.textContent).toContain("mínimo 8 caracteres");

    // Submit mismatch
    setInputValue(passwordInput, "securepassword123");
    setInputValue(confirmPasswordInput, "differentpassword456");

    await act(async () => {
      form.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true }),
      );
    });

    const confirmError = container.querySelector("#confirm-password-error");
    expect(confirmError).not.toBeNull();
    expect(confirmError.textContent).toContain("não coincidem");
  });

  test("toggles password visibility", async () => {
    await act(async () => {
      root.render(<ResetPasswordForm />);
    });

    const passwordInput = container.querySelector("#new-password");
    const toggleButton = passwordInput.parentElement.querySelector("button");

    expect(passwordInput.getAttribute("type")).toBe("password");

    await act(async () => {
      toggleButton.click();
    });

    expect(passwordInput.getAttribute("type")).toBe("text");

    await act(async () => {
      toggleButton.click();
    });

    expect(passwordInput.getAttribute("type")).toBe("password");
  });

  test("submits valid reset payload and displays success screen", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        message: "Senha atualizada com sucesso. Você já pode fazer login.",
      }),
    });

    await act(async () => {
      root.render(<ResetPasswordForm />);
    });

    const form = container.querySelector("form");
    const passwordInput = container.querySelector("#new-password");
    const confirmPasswordInput = container.querySelector("#confirm-password");

    setInputValue(passwordInput, "newSecurePassword88");
    setInputValue(confirmPasswordInput, "newSecurePassword88");

    await act(async () => {
      form.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true }),
      );
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [url, options] = global.fetch.mock.calls[0];
    expect(url).toBe("/api/v1/auth/reset-password");
    expect(JSON.parse(options.body)).toEqual({
      token: "sample-reset-token-xyz",
      password: "newSecurePassword88",
    });

    const successHeading = container.querySelector("h2");
    expect(successHeading).not.toBeNull();
    expect(successHeading.textContent).toContain("Senha redefinida com sucesso!");

    const loginLink = container.querySelector('a[href="/login"]');
    expect(loginLink).not.toBeNull();
    expect(loginLink.textContent).toContain("Ir para o Login");
  });

  test("handles API error appropriately", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({
        error: "INVALID_TOKEN",
        message: "Token inválido ou expirado.",
      }),
    });

    await act(async () => {
      root.render(<ResetPasswordForm />);
    });

    const form = container.querySelector("form");
    const passwordInput = container.querySelector("#new-password");
    const confirmPasswordInput = container.querySelector("#confirm-password");

    setInputValue(passwordInput, "newSecurePassword88");
    setInputValue(confirmPasswordInput, "newSecurePassword88");

    await act(async () => {
      form.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true }),
      );
    });

    const alertBanner = container.querySelector('[role="alert"]');
    expect(alertBanner).not.toBeNull();
    expect(alertBanner.textContent).toContain("Token inválido ou expirado.");
  });
});
