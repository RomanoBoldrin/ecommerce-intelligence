import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import AuthLayout from "@/components/auth/AuthLayout";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { useAuth } from "@/context/AuthContext";

export default function ResetPasswordPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, loading, router]);

  if (loading || isAuthenticated) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Definir Nova Senha | Merchant Pulse</title>
        <meta
          name="description"
          content="Crie uma nova senha para acessar sua conta Merchant Pulse."
        />
      </Head>
      <AuthLayout
        title="Defina sua nova senha"
        subtitle="Escolha uma senha forte para proteger seu acesso ao painel"
      >
        <ResetPasswordForm />
      </AuthLayout>
    </>
  );
}

