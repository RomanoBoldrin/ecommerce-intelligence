import React, { useState } from "react";
import Link from "next/link";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    const nextErrors = {};

    if (!email.trim()) {
      nextErrors.email = "Informe seu endereço de e-mail.";
    } else if (!EMAIL_REGEX.test(email.trim().toLowerCase())) {
      nextErrors.email = "Informe um e-mail válido (ex: operador@merchantpulse.com).";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setApiError(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/v1/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao solicitar recuperação de senha.");
      }

      setIsSubmitted(true);
    } catch (error) {
      setApiError(error.message || "Ocorreu um erro ao processar sua solicitação.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="space-y-5 text-center" role="status" aria-live="polite">
        <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.2"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>

        <div>
          <h2 className="text-base font-semibold text-on-surface">
            Verifique sua caixa de entrada
          </h2>
          <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">
            Se o e-mail informado estiver registrado no sistema, as instruções e
            o link seguro para redefinição de senha foram enviados.
          </p>
          <p className="mt-2 text-xs text-on-surface-variant/70">
            Por motivos de segurança e privacidade, a existência de contas não é
            confirmada publicamente.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/login"
            className="inline-flex items-center justify-center w-full rounded-lg bg-surface-container-low hover:bg-surface-container py-2.5 px-4 text-sm font-semibold text-on-surface border border-outline-variant/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Voltar para o Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {apiError && (
        <div
          role="alert"
          aria-live="assertive"
          className="rounded-lg bg-error-container/60 border border-error/30 p-3.5 text-on-error-container text-sm flex items-start gap-2.5"
        >
          <svg
            className="w-5 h-5 text-error shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p className="font-semibold flex-1">{apiError}</p>
        </div>
      )}

      <div>
        <label
          htmlFor="forgot-email"
          className="block text-sm font-medium text-on-surface mb-1.5"
        >
          E-mail cadastrado
        </label>
        <input
          id="forgot-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          disabled={isSubmitting}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) {
              setErrors((prev) => ({ ...prev, email: null }));
            }
          }}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "forgot-email-error" : undefined}
          placeholder="operador@merchantpulse.com"
          className={`w-full rounded-lg px-3.5 py-2.5 text-sm bg-surface-container-low/50 text-on-surface border transition-colors focus:bg-surface-container-lowest focus:outline-none focus:ring-2 ${
            errors.email
              ? "border-error focus:ring-error/20"
              : "border-outline-variant/60 focus:border-primary focus:ring-primary/20"
          }`}
        />
        {errors.email && (
          <p
            id="forgot-email-error"
            className="mt-1.5 text-xs text-error font-medium"
          >
            {errors.email}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
        className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary py-2.5 px-4 text-sm font-semibold text-white shadow-sm hover:bg-primary-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
      >
        {isSubmitting ? (
          <>
            <svg
              className="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            <span>Enviando...</span>
          </>
        ) : (
          <span>Enviar instruções de recuperação</span>
        )}
      </button>

      <div className="text-center pt-1">
        <Link
          href="/login"
          className="text-sm font-medium text-primary hover:text-primary-container transition-colors focus-visible:outline-none focus-visible:underline"
        >
          Lembrou da senha? Voltar para o login
        </Link>
      </div>
    </form>
  );
}

