import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import AuthLayout from "@/components/auth/AuthLayout";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import { useAuth } from "@/context/AuthContext";

export default function ForgotPasswordPage() {
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
        <title>Recuperar Senha | Merchant Pulse</title>
        <meta
          name="description"
          content="Recupere o acesso à sua conta Merchant Pulse."
        />
      </Head>
      <AuthLayout
        title="Recuperação de Acesso"
        subtitle="Informe o e-mail associado à sua conta para receber o link de redefinição"
      >
        <ForgotPasswordForm />
      </AuthLayout>
    </>
  );
}

