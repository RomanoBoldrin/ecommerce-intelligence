import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function ResetPasswordForm() {
  const router = useRouter();
  const token = typeof router.query.token === "string" ? router.query.token : "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // If token is missing after router is ready
  if (router.isReady && !token) {
    return (
      <div className="space-y-5 text-center" role="alert">
        <div className="w-12 h-12 rounded-full bg-error-container text-error flex items-center justify-center mx-auto">
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
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <div>
          <h2 className="text-base font-semibold text-on-surface">
            Link de redefinição inválido ou ausente
          </h2>
          <p className="mt-2 text-sm text-on-surface-variant">
            O link de redefinição de senha não contém um token de verificação
            válido. Solicite um novo link para continuar.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/forgot-password"
            className="inline-flex items-center justify-center w-full rounded-lg bg-primary hover:bg-primary-container py-2.5 px-4 text-sm font-semibold text-white shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Solicitar novo link
          </Link>
        </div>
      </div>
    );
  }

  if (isSuccess) {
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
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <div>
          <h2 className="text-base font-semibold text-on-surface">
            Senha redefinida com sucesso!
          </h2>
          <p className="mt-2 text-sm text-on-surface-variant">
            Sua nova senha foi atualizada no sistema e todas as sessões anteriores
            foram encerradas por segurança.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/login"
            className="inline-flex items-center justify-center w-full rounded-lg bg-primary hover:bg-primary-container py-2.5 px-4 text-sm font-semibold text-white shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Ir para o Login
          </Link>
        </div>
      </div>
    );
  }

  const validate = () => {
    const nextErrors = {};

    if (!password) {
      nextErrors.password = "Informe uma nova senha.";
    } else if (password.length < 8) {
      nextErrors.password = "A senha deve conter no mínimo 8 caracteres.";
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = "Confirme a nova senha.";
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = "As senhas informadas não coincidem.";
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
      const response = await fetch("/api/v1/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Este link de redefinição é inválido ou já expirou. Solicite um novo link.",
        );
      }

      setIsSuccess(true);
    } catch (error) {
      setApiError(error.message);
    } finally {
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
            <p className="font-semibold">{apiError}</p>
            <Link
              href="/forgot-password"
              className="text-xs text-error font-medium underline mt-1 inline-block"
            >
              Solicitar novo link de redefinição
            </Link>
          </div>
        </div>
      )}

      {/* New Password */}
      <div>
        <label
          htmlFor="new-password"
          className="block text-sm font-medium text-on-surface mb-1.5"
        >
          Nova senha (mínimo 8 caracteres)
        </label>
        <div className="relative">
          <input
            id="new-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
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
            aria-describedby={errors.password ? "new-password-error" : undefined}
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
          <p
            id="new-password-error"
            className="mt-1.5 text-xs text-error font-medium"
          >
            {errors.password}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label
          htmlFor="confirm-password"
          className="block text-sm font-medium text-on-surface mb-1.5"
        >
          Confirme a nova senha
        </label>
        <div className="relative">
          <input
            id="confirm-password"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            disabled={isSubmitting}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword) {
                setErrors((prev) => ({ ...prev, confirmPassword: null }));
              }
            }}
            aria-invalid={Boolean(errors.confirmPassword)}
            aria-describedby={
              errors.confirmPassword ? "confirm-password-error" : undefined
            }
            placeholder="••••••••"
            className={`w-full rounded-lg pl-3.5 pr-10 py-2.5 text-sm bg-surface-container-low/50 text-on-surface border transition-colors focus:bg-surface-container-lowest focus:outline-none focus:ring-2 ${
              errors.confirmPassword
                ? "border-error focus:ring-error/20"
                : "border-outline-variant/60 focus:border-primary focus:ring-primary/20"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            aria-label={
              showConfirmPassword ? "Ocultar senha" : "Exibir confirmação de senha"
            }
            aria-pressed={showConfirmPassword}
            disabled={isSubmitting}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-on-surface-variant hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
          >
            {showConfirmPassword ? (
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
        {errors.confirmPassword && (
          <p
            id="confirm-password-error"
            className="mt-1.5 text-xs text-error font-medium"
          >
            {errors.confirmPassword}
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
            <span>Atualizando senha...</span>
          </>
        ) : (
          <span>Definir Nova Senha</span>
        )}
      </button>

      <div className="text-center pt-1">
        <Link
          href="/login"
          className="text-sm font-medium text-primary hover:text-primary-container transition-colors focus-visible:outline-none focus-visible:underline"
        >
          Voltar para o login
        </Link>
      </div>
    </form>
  );
}

