import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({
  children,
  allowedRoles,
  requiredCapability,
}) {
  const { user, isAuthenticated, loading, hasRole, can } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace(`/login?from=${encodeURIComponent(router.asPath)}`);
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div
        className="min-h-screen bg-surface flex items-center justify-center"
        role="status"
        aria-label="Verificando sessão"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-3 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-on-surface-variant">
            Carregando painel Merchant Pulse...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (allowedRoles && !hasRole(allowedRoles)) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/40 shadow-sm text-center">
          <div className="w-12 h-12 rounded-full bg-error-container text-error flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-lg font-bold text-on-surface">Acesso Restrito</h1>
          <p className="mt-2 text-sm text-on-surface-variant">
            Seu perfil ({user?.role}) não possui permissão para acessar esta
            área administrativa.
          </p>
          <div className="mt-6">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary-container rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Voltar ao Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (requiredCapability && !can(requiredCapability)) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/40 shadow-sm text-center">
          <div className="w-12 h-12 rounded-full bg-error-container text-error flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6"
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
          </div>
          <h1 className="text-lg font-bold text-on-surface">Permissão Insuficiente</h1>
          <p className="mt-2 text-sm text-on-surface-variant">
            Esta funcionalidade requer privilégios adicionais não disponíveis
            para seu perfil ({user?.role}).
          </p>
          <div className="mt-6">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary-container rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Voltar ao Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
}

