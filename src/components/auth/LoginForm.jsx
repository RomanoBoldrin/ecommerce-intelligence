import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const validate = () => {
    const nextErrors = {};

    if (!email.trim()) {
      nextErrors.email = "Informe seu endereço de e-mail.";
    } else if (!EMAIL_REGEX.test(email.trim().toLowerCase())) {
      nextErrors.email = "Informe um e-mail válido (ex: operador@merchantpulse.com).";
    }

    if (!password) {
      nextErrors.password = "Informe sua senha de acesso.";
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
      await login(email.trim(), password);
      const destination = router.query.from || "/dashboard";
      router.push(destination);
    } catch (error) {
      setApiError({
        message: error.message || "Credenciais inválidas. Verifique seu e-mail e senha.",
        action: error.action || "Tente novamente ou solicite redefinição de senha.",
      });
      setIsSubmitting(false);
    }
  };

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
          <div className="flex-1">
            <p className="font-semibold">{apiError.message}</p>
            {apiError.action && (
              <p className="text-xs mt-0.5 opacity-90">{apiError.action}</p>
            )}
          </div>
        </div>
      )}

      {/* Email Input */}
      <div>
        <label
          htmlFor="login-email"
          className="block text-sm font-medium text-on-surface mb-1.5"
        >
          E-mail
        </label>
        <div className="relative">
          <input
            id="login-email"
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
            aria-describedby={errors.email ? "email-error" : undefined}
            placeholder="operador@merchantpulse.com"
            className={`w-full rounded-lg px-3.5 py-2.5 text-sm bg-surface-container-low/50 text-on-surface border transition-colors focus:bg-surface-container-lowest focus:outline-none focus:ring-2 ${
              errors.email
                ? "border-error focus:ring-error/20"
                : "border-outline-variant/60 focus:border-primary focus:ring-primary/20"
            }`}
          />
        </div>
        {errors.email && (
          <p id="email-error" className="mt-1.5 text-xs text-error font-medium">
            {errors.email}
          </p>
        )}
      </div>

      {/* Password Input */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor="login-password"
            className="block text-sm font-medium text-on-surface"
          >
            Senha
          </label>
          <Link
            href="/forgot-password"
            className="text-xs font-semibold text-primary hover:text-primary-container transition-colors focus-visible:outline-none focus-visible:underline"
          >
            Esqueceu a senha?
          </Link>
        </div>
        <div className="relative">
          <input
            id="login-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            disabled={isSubmitting}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) {
                setErrors((prev) => ({ ...prev, password: null }));
              }
            }}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "password-error" : undefined}
            placeholder="••••••••"
            className={`w-full rounded-lg pl-3.5 pr-10 py-2.5 text-sm bg-surface-container-low/50 text-on-surface border transition-colors focus:bg-surface-container-lowest focus:outline-none focus:ring-2 ${
              errors.password
                ? "border-error focus:ring-error/20"
                : "border-outline-variant/60 focus:border-primary focus:ring-primary/20"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Ocultar senha" : "Exibir senha"}
            aria-pressed={showPassword}
            disabled={isSubmitting}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-on-surface-variant hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
          >
            {showPassword ? (
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
        </div>
        {errors.password && (
          <p id="password-error" className="mt-1.5 text-xs text-error font-medium">
            {errors.password}
          </p>
        )}
      </div>

      {/* Submit Button */}
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
            <span>Autenticando...</span>
          </>
        ) : (
          <span>Entrar no Painel</span>
        )}
      </button>
    </form>
  );
}

