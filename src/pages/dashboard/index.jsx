import React from 'react';
import Head from 'next/head';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import PerformanceBanner from '@/components/dashboard/PerformanceBanner';
import KpiGrid from '@/components/dashboard/KpiGrid';
import ConversionFunnel from '@/components/dashboard/ConversionFunnel';
import TemporalTrendChart from '@/components/dashboard/TemporalTrendChart';
import ProductTable from '@/components/dashboard/ProductTable';
import ActionableInsights from '@/components/dashboard/ActionableInsights';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Head>
        <title>Dashboard | Merchant Pulse</title>
        <meta
          name="description"
          content="Painel de métricas analíticas e suporte a decisões para e-commerce."
        />
      </Head>
      <Sidebar />
      <div className="pl-64">
        <Header />
        <main className="w-full pt-[7.5rem] bg-background min-h-screen px-gutter-desktop py-space-xl">
          <div className="flex flex-col w-full space-y-space-lg">
            <PerformanceBanner />
            <KpiGrid />
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg">
              <ConversionFunnel />
              <TemporalTrendChart />
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg">
              <ProductTable />
              <ActionableInsights />
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
