/**
 * @jest-environment jsdom
 */

import React, { act } from "react";
import { createRoot } from "react-dom/client";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

function setInputValue(input, value) {
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    "value",
  ).set;
  nativeInputValueSetter.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

describe("ForgotPasswordForm component", () => {
  let container;
  let root;
  const originalFetch = global.fetch;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
    global.fetch = originalFetch;
  });

  it("renders email input, submit button, and return-to-login link", () => {
    act(() => {
      root.render(<ForgotPasswordForm />);
    });

    const emailInput = container.querySelector("#forgot-email");
    const submitButton = container.querySelector('button[type="submit"]');
    const loginLink = container.querySelector('a[href="/login"]');

    expect(emailInput).not.toBeNull();
    expect(submitButton).not.toBeNull();
    expect(loginLink).not.toBeNull();
  });

  it("validates missing or invalid email client-side", async () => {
    act(() => {
      root.render(<ForgotPasswordForm />);
    });

    const form = container.querySelector("form");

    // Empty email
    await act(async () => {
      form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    });
    expect(container.textContent).toContain("Informe seu endereço de e-mail.");

    // Malformed email
    const emailInput = container.querySelector("#forgot-email");
    act(() => {
      setInputValue(emailInput, "not-an-email");
    });
    await act(async () => {
      form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    });
    expect(container.textContent).toContain("Informe um e-mail válido");
  });

  it("submits email and displays generic confirmation message without revealing account existence", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message: "If this email is registered, instructions to reset your password will be sent.",
      }),
    });

    act(() => {
      root.render(<ForgotPasswordForm />);
    });

    const emailInput = container.querySelector("#forgot-email");
    const form = container.querySelector("form");

    act(() => {
      setInputValue(emailInput, "operator@merchantpulse.com");
    });

    await act(async () => {
      form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/v1/auth/forgot-password",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ email: "operator@merchantpulse.com" }),
      }),
    );

    // Confirmation message displayed
    expect(container.textContent).toContain("Verifique sua caixa de entrada");
    expect(container.textContent).toContain("Se o e-mail informado estiver registrado");
    expect(container.textContent).toContain("existência de contas não é confirmada publicamente");
    expect(container.querySelector('a[href="/login"]')).not.toBeNull();
  });

  it("displays accessible error when API call fails", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({
        message: "Serviço temporariamente indisponível.",
      }),
    });

    act(() => {
      root.render(<ForgotPasswordForm />);
    });

    const emailInput = container.querySelector("#forgot-email");
    const form = container.querySelector("form");

    act(() => {
      setInputValue(emailInput, "user@merchantpulse.com");
    });

    await act(async () => {
      form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    });

    const alert = container.querySelector('[role="alert"]');
    expect(alert).not.toBeNull();
    expect(alert.textContent).toContain("Serviço temporariamente indisponível.");
  });
});

