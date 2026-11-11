import React from 'react';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary-container text-white">
            ADMIN
          </span>
        );
      case 'MANAGER':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-secondary-container text-on-secondary-container">
            GESTOR
          </span>
        );
      case 'ANALYST':
      default:
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
            ANALISTA
          </span>
        );
    }
  };

  return (
    <header className="fixed top-0 left-64 right-0 z-40 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-16 px-gutter-desktop flex items-center justify-between">
        <div className="flex items-center gap-space-md flex-1 max-w-lg">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
              search
            </span>
            <input
              className="w-full pl-10 pr-space-md py-space-xs h-10 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm placeholder:text-on-surface-variant/70 focus:outline-none focus:bg-surface-container-lowest transition-all"
              placeholder="Buscar pedidos, produtos, métricas ou transações..."
              type="text"
            />
          </div>
        </div>
        <div className="flex items-center gap-space-md">
          <button
            className="flex items-center gap-space-xs px-space-md h-9 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors font-label-md text-label-md"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">help</span>
            <span>Ajuda & Docs</span>
          </button>
          <button
            aria-label="Notificações"
            className="relative p-space-xs w-9 h-9 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error"></span>
          </button>

          {/* User profile & Logout */}
          <div className="flex items-center gap-space-sm pl-space-sm border-l border-outline-variant/40">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : "MP"}
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="font-label-md text-label-md text-on-surface font-semibold leading-tight">
                  {user?.name || "Operador"}
                </span>
                {getRoleBadge(user?.role)}
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant leading-tight truncate max-w-[140px]">
                {user?.email || "painel@merchantpulse.com"}
              </span>
            </div>
            <button
              type="button"
              onClick={logout}
              aria-label="Encerrar sessão"
              title="Encerrar sessão"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-error hover:bg-error-container/40 transition-colors ml-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error"
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
              <span>Sair</span>
            </button>
          </div>
        </div>
      </div>
      <div className="h-14 px-gutter-desktop bg-surface-container-low/70 flex items-center justify-between gap-space-md overflow-x-auto">
        <div className="flex items-center gap-space-md shrink-0">
          <div className="flex items-center gap-space-xs bg-surface-container-lowest px-space-md py-space-xs rounded-lg shadow-[0_1px_3px_0_rgba(15,23,42,0.04)]">
            <span className="material-symbols-outlined text-primary text-[18px]">calendar_today</span>
            <span className="font-label-md text-label-md text-on-surface font-medium">Últimos 30 Dias</span>
            <span className="material-symbols-outlined text-on-surface-variant text-[16px]">expand_more</span>
          </div>
          <div className="flex items-center gap-space-xs bg-surface-container-lowest px-space-md py-space-xs rounded-lg shadow-[0_1px_3px_0_rgba(15,23,42,0.04)]">
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">category</span>
            <span className="font-label-md text-label-md text-on-surface font-medium">Todas as Categorias</span>
            <span className="material-symbols-outlined text-on-surface-variant text-[16px]">expand_more</span>
          </div>
        </div>
        <div className="flex items-center gap-space-sm shrink-0">
          <button
            className="flex items-center gap-space-xs px-space-md h-9 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            <span>Atualizar</span>
          </button>
          <button
            className="flex items-center gap-space-xs px-space-md h-9 rounded-lg bg-primary-container text-on-primary hover:bg-primary font-label-md text-label-md shadow-[0_1px_3px_0_rgba(15,23,42,0.08)] transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
            <span>Relatório PDF</span>
          </button>
        </div>
      </div>
    </header>
  );
}
