import React from 'react';
import Link from 'next/link';
import { useAuth, ROLES } from '@/context/AuthContext';

export default function Sidebar() {
  const { user, logout, can } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-surface-container-lowest z-50 flex flex-col shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      {/* Brand Header */}
      <div className="h-24 px-space-lg flex flex-col justify-center border-b border-outline-variant/30">
        <div className="flex items-center gap-space-sm">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shrink-0">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.2"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>
          <span className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
            Merchant Pulse
          </span>
        </div>
        <p className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider mt-1">
          Painel de Apoio à Decisão
        </p>
      </div>

      {/* User / Store Status Pill */}
      <div className="px-space-md py-space-sm">
        <div className="bg-surface-container-low rounded-lg p-space-sm flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-primary text-[18px]">store</span>
            <div className="flex flex-col">
              <span className="font-label-sm text-[11px] text-on-surface-variant">
                Perfil Conectado
              </span>
              <span className="font-label-md text-xs text-on-surface font-semibold truncate max-w-[130px]">
                {user?.name || "Operador"} ({user?.role || "ANALYST"})
              </span>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500" title="Sessão ativa"></span>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-space-md py-space-sm space-y-1 overflow-y-auto">
        <Link
          href="/dashboard"
          className="flex items-center gap-space-md px-space-md py-space-sm rounded-lg font-label-md text-label-md bg-primary text-on-primary font-semibold shadow-[0_1px_3px_0_rgba(15,23,42,0.08)]"
        >
          <span className="material-symbols-outlined text-[20px]">dashboard</span>
          <span>Visão Geral</span>
        </Link>
        <Link
          href="#"
          className="flex items-center gap-space-md px-space-md py-space-sm rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">filter_alt</span>
          <span>Funil de Vendas</span>
        </Link>
        <Link
          href="#"
          className="flex items-center gap-space-md px-space-md py-space-sm rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">inventory_2</span>
          <span>Produtos & Estoque</span>
        </Link>
        <Link
          href="#"
          className="flex items-center gap-space-md px-space-md py-space-sm rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">group</span>
          <span>Jornada do Cliente</span>
        </Link>

        {/* Admin Restricted Settings */}
        {can("CHANGE_SETTINGS") ? (
          <Link
            href="#"
            className="flex items-center gap-space-md px-space-md py-space-sm rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">settings</span>
            <span>Configurações</span>
          </Link>
        ) : (
          <div
            title="Acesso restrito ao perfil ADMIN"
            className="flex items-center justify-between px-space-md py-space-sm rounded-lg font-label-md text-label-md text-on-surface-variant/50 cursor-not-allowed"
          >
            <div className="flex items-center gap-space-md">
              <span className="material-symbols-outlined text-[20px]">settings</span>
              <span>Configurações</span>
            </div>
            <span className="material-symbols-outlined text-[16px]">lock</span>
          </div>
        )}
      </nav>

      {/* Footer Info & Logout */}
      <div className="p-space-md border-t border-outline-variant/30 space-y-2">
        <div className="p-2.5 rounded-lg bg-surface-container-low text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-on-surface">
            <span className="material-symbols-outlined text-tertiary-container text-[16px]">verified</span>
            <span>Ambiente Sintético</span>
          </div>
          <p className="text-[11px] text-on-surface-variant mt-0.5">
            Demonstração acadêmica PI-IV.
          </p>
        </div>

        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-error hover:bg-error-container/40 transition-colors border border-error/20"
        >
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
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span>Encerrar Sessão</span>
        </button>
      </div>
    </aside>
  );
}
