import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      const destination = router.query.from || "/dashboard";
      router.replace(destination);
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div
        className="min-h-screen bg-surface flex items-center justify-center"
        role="status"
        aria-label="Verificando autenticação"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <span className="text-sm font-medium text-on-surface-variant">
            Carregando Merchant Pulse...
          </span>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Entrar | Merchant Pulse</title>
        <meta
          name="description"
          content="Acesso restrito ao painel de inteligência de e-commerce Merchant Pulse."
        />
      </Head>
      <AuthLayout
        title="Acesse sua conta"
        subtitle="Informe suas credenciais para visualizar as métricas da loja"
      >
        <LoginForm />
      </AuthLayout>
    </>
  );
}

